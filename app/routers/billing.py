import json

from fastapi import APIRouter, Depends, Header, HTTPException, Request, status
from fastapi.responses import HTMLResponse, RedirectResponse
from sqlalchemy.orm import Session

from app import billing
from app import subscriptions as subs
from app.config import get_settings
from app.db import get_db
from app.deps import get_current_user
from app.models import CheckoutSession, Invoice, User
from app.plans import PLANS, get_plan
from app.routers.serializers import subscription_out
from app.schemas import (
    ChangePlanIn, CheckoutIn, CheckoutOut, InvoiceOut, MessageOut, PlanOut, SubscriptionOut,
)
from app.security import verify_signature

router = APIRouter()


def _fail(e: subs.SubscriptionError):
    raise HTTPException(e.status_code, e.message)


@router.get("/plans", response_model=list[PlanOut], tags=["billing"])
def list_plans():
    return [
        PlanOut(code=p.code, name=p.name, monthly_price_cents=p.monthly_price_cents,
                yearly_price_cents=p.yearly_price_cents, link_limit=p.link_limit,
                features=sorted(p.features), trial_days=p.trial_days)
        for p in PLANS.values()
    ]


@router.get("/subscription", response_model=SubscriptionOut, tags=["billing"])
def get_subscription(user: User = Depends(get_current_user)):
    return subscription_out(user.subscription)


@router.post("/subscription/checkout", response_model=CheckoutOut, tags=["billing"])
def checkout(body: CheckoutIn, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    plan = PLANS.get(body.plan)
    if plan is None:
        raise HTTPException(404, f"Unknown plan '{body.plan}'")
    if not plan.is_paid:
        raise HTTPException(400, "Free plan does not need checkout")
    sub = user.subscription
    if sub.plan_code != "free" and sub.status in subs.ENTITLED_STATUSES:
        raise HTTPException(409, "You already have a paid subscription; use POST /subscription/change")
    with_trial = plan.trial_days > 0 and not user.has_used_trial
    session_id, url = billing.get_provider().create_checkout(db, user, plan, body.interval, with_trial)
    db.commit()
    return CheckoutOut(session_id=session_id, checkout_url=url, trial_days=plan.trial_days if with_trial else 0)


@router.post("/subscription/change", response_model=MessageOut, tags=["billing"])
def change(body: ChangePlanIn, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    try:
        msg = subs.change_plan(db, user.subscription, body.plan)
    except subs.SubscriptionError as e:
        _fail(e)
    db.commit()
    return MessageOut(message=msg, subscription=subscription_out(user.subscription))


@router.post("/subscription/cancel", response_model=MessageOut, tags=["billing"])
def cancel(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    try:
        msg = subs.cancel(user.subscription)
    except subs.SubscriptionError as e:
        _fail(e)
    db.commit()
    return MessageOut(message=msg, subscription=subscription_out(user.subscription))


@router.post("/subscription/resume", response_model=MessageOut, tags=["billing"])
def resume(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    try:
        msg = subs.resume(user.subscription)
    except subs.SubscriptionError as e:
        _fail(e)
    db.commit()
    return MessageOut(message=msg, subscription=subscription_out(user.subscription))


@router.get("/invoices", response_model=list[InvoiceOut], tags=["billing"])
def invoices(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    rows = db.query(Invoice).filter_by(user_id=user.id).order_by(Invoice.id.desc()).all()
    return [InvoiceOut.model_validate(r, from_attributes=True) for r in rows]


@router.post("/webhooks/billing", tags=["webhooks"])
async def webhook(request: Request, x_signature: str | None = Header(default=None),
                  db: Session = Depends(get_db)):
    body = await request.body()
    if not verify_signature(body, x_signature):
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Invalid signature")
    try:
        result = billing.handle_event(db, json.loads(body))
    except (billing.EventError, json.JSONDecodeError) as e:
        db.rollback()
        raise HTTPException(400, str(e))
    db.commit()
    return {"status": result}


# ---------------------------------------------------------------------------
# Fake hosted checkout (dev only): stands in for Stripe Checkout etc.
# ---------------------------------------------------------------------------

def _require_fake():
    if get_settings().billing_provider != "fake":
        raise HTTPException(404)


@router.get("/billing/fake/checkout/{session_id}", response_class=HTMLResponse, include_in_schema=False)
def fake_checkout_page(session_id: str, db: Session = Depends(get_db), _=Depends(_require_fake)):
    session = db.get(CheckoutSession, session_id)
    if session is None:
        raise HTTPException(404, "Unknown checkout session")
    plan = get_plan(session.plan_code)
    price = plan.price_cents(session.interval) / 100
    trial = f"<p>Includes a {plan.trial_days}-day free trial.</p>" if session.with_trial else ""
    state = "<p><strong>Already paid.</strong></p>" if session.status == "completed" else (
        f'<form method="post" action="/billing/fake/checkout/{session_id}/pay">'
        '<button type="submit">Pay (test mode)</button></form>'
    )
    return f"""<!doctype html><html><head><meta charset="utf-8"><title>Checkout</title>
<style>body{{font-family:system-ui;max-width:420px;margin:4rem auto;padding:0 1rem}}
button{{padding:.6rem 1.2rem;font-size:1rem}}</style></head><body>
<h1>{plan.name} plan</h1><p>${price:.2f} / {session.interval}</p>{trial}{state}
<p><small>Test-mode checkout. No real payment is taken.</small></p></body></html>"""


@router.post("/billing/fake/checkout/{session_id}/pay", include_in_schema=False)
def fake_checkout_pay(session_id: str, db: Session = Depends(get_db), _=Depends(_require_fake)):
    body, _sig = billing.build_event("checkout.completed", {"session_id": session_id})
    try:
        billing.handle_event(db, json.loads(body))
    except billing.EventError as e:
        raise HTTPException(404, str(e))
    db.commit()
    return RedirectResponse("/", status_code=303)


@router.post("/billing/fake/simulate/{event_type}", tags=["dev"])
def fake_simulate(event_type: str, user: User = Depends(get_current_user),
                  db: Session = Depends(get_db), _=Depends(_require_fake)):
    """Simulate a provider event for your own subscription: invoice.paid, invoice.payment_failed,
    subscription.deleted."""
    if event_type not in {"invoice.paid", "invoice.payment_failed", "subscription.deleted"}:
        raise HTTPException(400, "Unsupported event type")
    sub = user.subscription
    if not sub.provider_subscription_id:
        raise HTTPException(409, "No provider subscription to act on")
    body, _sig = billing.build_event(event_type, {"subscription_id": sub.provider_subscription_id})
    billing.handle_event(db, json.loads(body))
    db.commit()
    return subscription_out(sub)
