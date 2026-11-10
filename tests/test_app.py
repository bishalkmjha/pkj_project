from datetime import timedelta

from app.billing import build_event
from app.db import utcnow
from app.models import Subscription, User
from tests.conftest import send_event, signup, subscribe


def sub_of(db, email="a@example.com") -> Subscription:
    db.expire_all()
    return db.query(User).filter_by(email=email).one().subscription


def me(client, h):
    return client.get("/me", headers=h).json()


# --- auth -----------------------------------------------------------------

def test_signup_login_and_free_plan(client):
    h = signup(client)
    assert client.post("/auth/signup", json={"email": "a@example.com", "password": "password123"}).status_code == 409
    r = client.post("/auth/token", data={"username": "a@example.com", "password": "password123"})
    assert r.status_code == 200
    assert client.post("/auth/token", data={"username": "a@example.com", "password": "nope-nope"}).status_code == 401
    m = me(client, h)
    assert m["subscription"]["plan"] == "free" and m["usage"]["link_limit"] == 5


def test_requires_auth(client):
    assert client.get("/me").status_code == 401
    assert client.get("/me", headers={"Authorization": "Bearer junk"}).status_code == 401


# --- quotas & feature gating ----------------------------------------------

def test_free_link_quota_and_gated_features(client, user):
    for i in range(5):
        assert client.post("/links", json={"url": f"https://example.com/{i}"}, headers=user).status_code == 201
    r = client.post("/links", json={"url": "https://example.com/6"}, headers=user)
    assert r.status_code == 402
    link_id = client.get("/links", headers=user).json()[0]["id"]
    assert client.get(f"/links/{link_id}/stats", headers=user).status_code == 402
    r = client.post("/links", json={"url": "https://example.com/x", "slug": "mine"}, headers=user)
    assert r.status_code == 402


def test_redirect_and_analytics_on_pro(client, user):
    subscribe(client, user, "pro")
    link = client.post("/links", json={"url": "https://example.com/a"}, headers=user).json()
    r = client.get(f"/r/{link['slug']}", headers={"referer": "https://news.example"}, follow_redirects=False)
    assert r.status_code == 307 and r.headers["location"] == "https://example.com/a"
    stats = client.get(f"/links/{link['id']}/stats", headers=user).json()
    assert stats["total_clicks"] == 1 and stats["top_referrers"] == {"https://news.example": 1}


def test_cannot_touch_other_users_links(client, user):
    link = client.post("/links", json={"url": "https://example.com/a"}, headers=user).json()
    other = signup(client, "b@example.com")
    assert client.delete(f"/links/{link['id']}", headers=other).status_code == 404


def test_business_custom_slug(client, user):
    subscribe(client, user, "business")
    r = client.post("/links", json={"url": "https://example.com/a", "slug": "launch"}, headers=user)
    assert r.status_code == 201 and r.json()["slug"] == "launch"
    assert client.post("/links", json={"url": "https://example.com/b", "slug": "launch"}, headers=user).status_code == 409


# --- checkout, trial, renewal ---------------------------------------------

def test_pro_trial_then_renewal(client, db, user):
    c = subscribe(client, user, "pro")
    assert c["trial_days"] == 14
    s = me(client, user)["subscription"]
    assert s["status"] == "trialing" and s["effective_plan"] == "pro"
    assert client.get("/invoices", headers=user).json() == []  # trial is free

    provider_id = sub_of(db).provider_subscription_id
    assert send_event(client, "invoice.paid", {"subscription_id": provider_id}).status_code == 200
    s = me(client, user)["subscription"]
    assert s["status"] == "active"
    inv = client.get("/invoices", headers=user).json()
    assert len(inv) == 1 and inv[0]["amount_cents"] == 900


def test_trial_only_once(client, db, user):
    subscribe(client, user, "pro")
    client.post("/subscription/cancel", headers=user)
    sub = sub_of(db)
    sub.current_period_end = utcnow() - timedelta(seconds=1)
    db.commit()
    assert me(client, user)["subscription"]["plan"] == "free"
    c = subscribe(client, user, "pro")
    assert c["trial_days"] == 0
    assert me(client, user)["subscription"]["status"] == "active"


def test_business_has_no_trial_and_bills_immediately(client, user):
    subscribe(client, user, "business", "year")
    s = me(client, user)["subscription"]
    assert s["status"] == "active" and s["interval"] == "year"
    assert client.get("/invoices", headers=user).json()[0]["amount_cents"] == 29000


def test_checkout_rejections(client, user):
    assert client.post("/subscription/checkout", json={"plan": "free"}, headers=user).status_code == 400
    assert client.post("/subscription/checkout", json={"plan": "gold"}, headers=user).status_code == 404
    subscribe(client, user, "pro")
    assert client.post("/subscription/checkout", json={"plan": "business"}, headers=user).status_code == 409


# --- plan changes ---------------------------------------------------------

def test_upgrade_during_trial_is_immediate_and_free(client, user):
    subscribe(client, user, "pro")  # trialing
    r = client.post("/subscription/change", json={"plan": "business"}, headers=user)
    assert r.status_code == 200
    s = r.json()["subscription"]
    assert s["plan"] == "business" and s["status"] == "trialing"
    assert client.get("/invoices", headers=user).json() == []  # nothing charged mid-trial


def test_upgrade_prorates_active_subscription(client, db, user):
    subscribe(client, user, "business")
    sub = sub_of(db)
    # Pretend they were on pro, half way through a 30 day period.
    sub.plan_code = "pro"
    sub.current_period_start = utcnow() - timedelta(days=15)
    sub.current_period_end = utcnow() + timedelta(days=15)
    db.commit()
    r = client.post("/subscription/change", json={"plan": "business"}, headers=user)
    assert r.status_code == 200
    amounts = [i["amount_cents"] for i in client.get("/invoices", headers=user).json()]
    assert amounts[0] == 1000  # half of (2900 - 900)


def test_downgrade_applies_at_renewal(client, db, user):
    subscribe(client, user, "business")
    r = client.post("/subscription/change", json={"plan": "pro"}, headers=user)
    assert "scheduled" in r.json()["message"]
    s = me(client, user)["subscription"]
    assert s["plan"] == "business" and s["pending_plan"] == "pro"
    send_event(client, "invoice.paid", {"subscription_id": sub_of(db).provider_subscription_id})
    s = me(client, user)["subscription"]
    assert s["plan"] == "pro" and s["pending_plan"] is None
    assert client.get("/invoices", headers=user).json()[0]["amount_cents"] == 900


def test_change_requires_paid_subscription(client, user):
    assert client.post("/subscription/change", json={"plan": "pro"}, headers=user).status_code == 409


# --- cancel / resume / lapses --------------------------------------------

def test_cancel_keeps_access_until_period_end(client, db, user):
    subscribe(client, user, "business")
    assert client.post("/subscription/cancel", headers=user).status_code == 200
    s = me(client, user)["subscription"]
    assert s["cancel_at_period_end"] and s["effective_plan"] == "business"
    assert client.post("/subscription/resume", headers=user).status_code == 200
    client.post("/subscription/cancel", headers=user)
    sub = sub_of(db)
    sub.current_period_end = utcnow() - timedelta(seconds=1)
    db.commit()
    s = me(client, user)["subscription"]
    assert s["plan"] == "free" and s["status"] == "active"


def test_payment_failure_downgrades_entitlements(client, db, user):
    subscribe(client, user, "business")
    for i in range(7):
        client.post("/links", json={"url": f"https://example.com/{i}"}, headers=user)
    send_event(client, "invoice.payment_failed", {"subscription_id": sub_of(db).provider_subscription_id})
    m = me(client, user)
    assert m["subscription"]["status"] == "past_due" and m["usage"]["plan"] == "free"
    assert client.post("/links", json={"url": "https://example.com/z"}, headers=user).status_code == 402
    assert len(client.get("/links", headers=user).json()) == 7  # existing links are kept
    # Paying fixes it.
    send_event(client, "invoice.paid", {"subscription_id": sub_of(db).provider_subscription_id})
    assert me(client, user)["subscription"]["status"] == "active"


def test_lapsed_period_without_payment_is_past_due(client, db, user):
    subscribe(client, user, "business")
    sub = sub_of(db)
    sub.current_period_end = utcnow() - timedelta(seconds=1)
    db.commit()
    assert me(client, user)["subscription"]["status"] == "past_due"


def test_subscription_deleted_event(client, db, user):
    subscribe(client, user, "pro")
    send_event(client, "subscription.deleted", {"subscription_id": sub_of(db).provider_subscription_id})
    assert me(client, user)["subscription"]["plan"] == "free"


# --- webhooks -------------------------------------------------------------

def test_webhook_signature_and_idempotency(client, db, user):
    r = client.post("/subscription/checkout", json={"plan": "business"}, headers=user)
    body, sig = build_event("checkout.completed", {"session_id": r.json()["session_id"]})
    assert client.post("/webhooks/billing", content=body, headers={"X-Signature": "bad"}).status_code == 400
    assert client.post("/webhooks/billing", content=body, headers={"X-Signature": sig}).json()["status"] == "processed"
    assert client.post("/webhooks/billing", content=body, headers={"X-Signature": sig}).json()["status"] == "duplicate"
    assert len(client.get("/invoices", headers=user).json()) == 1


def test_webhook_unknown_subscription(client):
    assert send_event(client, "invoice.paid", {"subscription_id": "sub_nope"}).status_code == 400
    assert send_event(client, "something.else", {}).json()["status"] == "ignored"


# --- fake checkout + admin -----------------------------------------------

def test_fake_hosted_checkout_flow(client, user):
    c = client.post("/subscription/checkout", json={"plan": "business"}, headers=user).json()
    path = c["checkout_url"].split("8000", 1)[1]
    assert "Business plan" in client.get(path).text
    r = client.post(path + "/pay", follow_redirects=False)
    assert r.status_code == 303
    assert me(client, user)["subscription"]["plan"] == "business"
    assert client.post("/billing/fake/simulate/invoice.paid", headers=user).json()["status"] == "active"


def test_admin_metrics(client, db, user):
    assert client.get("/admin/metrics", headers=user).status_code == 403
    subscribe(client, user, "business", "year")
    b = signup(client, "b@example.com")
    subscribe(client, b, "pro")  # trialing: not in MRR
    admin = db.query(User).filter_by(email="a@example.com").one()
    admin.is_admin = True
    db.commit()
    m = client.get("/admin/metrics", headers=user).json()
    assert m["users"] == 2 and m["mrr_cents"] == 29000 // 12 and m["revenue_cents"] == 29000
    assert m["subscribers_by_status"] == {"active": 1, "trialing": 1}


def test_plans_and_index(client):
    codes = [p["code"] for p in client.get("/plans").json()]
    assert codes == ["free", "pro", "business"]
    assert "LinkPulse" in client.get("/").text
