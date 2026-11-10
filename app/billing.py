"""Billing provider abstraction and webhook event handling.

Ships with a `FakeProvider` so the whole lifecycle works locally with no account.
To go live, implement `BillingProvider` for Stripe/Paddle/etc. and map their webhook
event types onto the ones handled in `handle_event`.
"""

import json
import secrets
from typing import Protocol

from sqlalchemy.orm import Session

from app.config import get_settings
from app.db import utcnow
from app.models import CheckoutSession, Subscription, User, WebhookEvent
from app.plans import Plan, get_plan
from app import subscriptions as subs
from app.security import sign_payload


class BillingProvider(Protocol):
    def create_checkout(self, db: Session, user: User, plan: Plan, interval: str, with_trial: bool) -> tuple[str, str]:
        """Return (session_id, checkout_url)."""


class FakeProvider:
    def create_checkout(self, db, user, plan, interval, with_trial):
        session_id = "cs_" + secrets.token_hex(12)
        db.add(CheckoutSession(
            id=session_id, user_id=user.id, plan_code=plan.code, interval=interval, with_trial=with_trial,
        ))
        db.flush()
        return session_id, f"{get_settings().base_url}/billing/fake/checkout/{session_id}"


def get_provider() -> BillingProvider:
    name = get_settings().billing_provider
    if name == "fake":
        return FakeProvider()
    raise RuntimeError(f"Billing provider '{name}' is not implemented")


def build_event(event_type: str, data: dict) -> tuple[bytes, str]:
    """Build a signed webhook body, as a provider would send it."""
    body = json.dumps({"id": "evt_" + secrets.token_hex(12), "type": event_type, "data": data}).encode()
    return body, sign_payload(body)


class EventError(Exception):
    pass


def _sub_by_provider_id(db: Session, provider_sub_id: str) -> Subscription:
    sub = db.query(Subscription).filter_by(provider_subscription_id=provider_sub_id).one_or_none()
    if sub is None:
        raise EventError(f"Unknown subscription {provider_sub_id}")
    return sub


def handle_event(db: Session, event: dict) -> str:
    """Apply a provider event. Idempotent on event id. Returns a status string."""
    event_id, event_type, data = event.get("id"), event.get("type"), event.get("data") or {}
    if not event_id or not event_type:
        raise EventError("Event must have id and type")
    if db.get(WebhookEvent, event_id):
        return "duplicate"

    now = utcnow()
    if event_type == "checkout.completed":
        session = db.get(CheckoutSession, data.get("session_id"))
        if session is None:
            raise EventError("Unknown checkout session")
        if session.status != "completed":
            user = db.get(User, session.user_id)
            sub = subs.ensure_subscription(db, user)
            plan = get_plan(session.plan_code)
            if session.with_trial and not user.has_used_trial:
                subs.start_trial(sub, user, plan, session.interval, now)
            else:
                subs.start_paid_period(db, sub, plan, session.interval, now)
            sub.cancel_at_period_end = False
            sub.pending_plan_code = None
            sub.provider_subscription_id = "sub_" + secrets.token_hex(12)
            session.status = "completed"
    elif event_type == "invoice.paid":
        subs.renew(db, _sub_by_provider_id(db, data.get("subscription_id", "")), now)
    elif event_type == "invoice.payment_failed":
        subs.mark_payment_failed(db, _sub_by_provider_id(db, data.get("subscription_id", "")), now)
    elif event_type == "subscription.deleted":
        subs.reset_to_free(_sub_by_provider_id(db, data.get("subscription_id", "")))
    else:
        return "ignored"

    db.add(WebhookEvent(id=event_id, type=event_type))
    return "processed"
