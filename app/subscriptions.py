"""Subscription lifecycle: the business rules live here, not in the routers."""

from datetime import datetime, timedelta

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.db import utcnow
from app.models import Invoice, Link, Subscription, User
from app.plans import PLAN_RANK, PLANS, Plan, get_plan

ENTITLED_STATUSES = {"active", "trialing"}


class SubscriptionError(Exception):
    def __init__(self, message: str, status_code: int = 400):
        super().__init__(message)
        self.message = message
        self.status_code = status_code


def interval_delta(interval: str) -> timedelta:
    return timedelta(days=365) if interval == "year" else timedelta(days=30)


def ensure_subscription(db: Session, user: User) -> Subscription:
    if user.subscription is None:
        user.subscription = Subscription(user_id=user.id, plan_code="free", status="active")
        db.add(user.subscription)
        db.flush()
    return user.subscription


def reset_to_free(sub: Subscription) -> None:
    sub.plan_code = "free"
    sub.interval = "month"
    sub.status = "active"
    sub.current_period_start = None
    sub.current_period_end = None
    sub.cancel_at_period_end = False
    sub.pending_plan_code = None
    sub.provider_subscription_id = None


def sync(db: Session, sub: Subscription, now: datetime | None = None) -> Subscription:
    """Apply time-based transitions that don't need the billing provider.

    - A subscription set to cancel at period end drops to Free once the period is over.
    - A paid subscription whose period lapsed without a renewal payment becomes past_due
      (the provider's `invoice.paid` webhook is what normally renews it).
    """
    now = now or utcnow()
    if sub.plan_code == "free" or sub.current_period_end is None or now < sub.current_period_end:
        return sub
    if sub.cancel_at_period_end or sub.status == "canceled":
        reset_to_free(sub)
    elif sub.status in ENTITLED_STATUSES:
        sub.status = "past_due"
    db.flush()
    return sub


def effective_plan(sub: Subscription) -> Plan:
    if sub.status in ENTITLED_STATUSES:
        return get_plan(sub.plan_code)
    return PLANS["free"]


def link_count(db: Session, user_id: int) -> int:
    return db.scalar(select(func.count(Link.id)).where(Link.owner_id == user_id)) or 0


def start_paid_period(db: Session, sub: Subscription, plan: Plan, interval: str, start: datetime) -> Invoice:
    end = start + interval_delta(interval)
    sub.plan_code = plan.code
    sub.interval = interval
    sub.status = "active"
    sub.current_period_start = start
    sub.current_period_end = end
    invoice = Invoice(
        user_id=sub.user_id, plan_code=plan.code, amount_cents=plan.price_cents(interval),
        status="paid", period_start=start, period_end=end,
    )
    db.add(invoice)
    return invoice


def start_trial(sub: Subscription, user: User, plan: Plan, interval: str, now: datetime) -> None:
    sub.plan_code = plan.code
    sub.interval = interval
    sub.status = "trialing"
    sub.current_period_start = now
    sub.current_period_end = now + timedelta(days=plan.trial_days)
    user.has_used_trial = True


def change_plan(db: Session, sub: Subscription, new_code: str, now: datetime | None = None) -> str:
    """Change plan for an existing subscriber. Returns a human-readable outcome."""
    now = now or utcnow()
    if new_code not in PLANS:
        raise SubscriptionError(f"Unknown plan '{new_code}'", 404)
    current = sub.plan_code
    if new_code == current and not sub.pending_plan_code and not sub.cancel_at_period_end:
        raise SubscriptionError("You are already on this plan")
    if current == "free" or sub.status not in ENTITLED_STATUSES:
        raise SubscriptionError("Start a paid plan via POST /subscription/checkout", 409)

    if new_code == current:  # undo a scheduled downgrade/cancellation
        sub.pending_plan_code = None
        sub.cancel_at_period_end = False
        return f"Staying on {get_plan(current).name}"

    if new_code == "free":
        sub.cancel_at_period_end = True
        sub.pending_plan_code = None
        return f"Downgrade to Free scheduled for {sub.current_period_end:%Y-%m-%d}"

    if PLAN_RANK[new_code] > PLAN_RANK[current]:
        old, new = get_plan(current), get_plan(new_code)
        sub.plan_code = new_code
        sub.pending_plan_code = None
        sub.cancel_at_period_end = False
        if sub.status == "active" and sub.current_period_end and sub.current_period_start:
            # Charge the prorated difference for the rest of the current period.
            total = (sub.current_period_end - sub.current_period_start).total_seconds()
            left = max((sub.current_period_end - now).total_seconds(), 0)
            diff = new.price_cents(sub.interval) - old.price_cents(sub.interval)
            amount = round(diff * left / total) if total else 0
            if amount > 0:
                db.add(Invoice(
                    user_id=sub.user_id, plan_code=new_code, amount_cents=amount, status="paid",
                    period_start=now, period_end=sub.current_period_end,
                ))
        return f"Upgraded to {new.name}"

    sub.pending_plan_code = new_code
    sub.cancel_at_period_end = False
    return f"Downgrade to {get_plan(new_code).name} scheduled for {sub.current_period_end:%Y-%m-%d}"


def cancel(sub: Subscription) -> str:
    if sub.plan_code == "free":
        raise SubscriptionError("Free plan has nothing to cancel")
    sub.cancel_at_period_end = True
    sub.pending_plan_code = None
    return f"Subscription will end on {sub.current_period_end:%Y-%m-%d}"


def resume(sub: Subscription) -> str:
    if not sub.cancel_at_period_end:
        raise SubscriptionError("Subscription is not scheduled to cancel")
    if sub.status not in ENTITLED_STATUSES:
        raise SubscriptionError("Subscription is no longer active; start a new checkout", 409)
    sub.cancel_at_period_end = False
    return "Subscription resumed"


def renew(db: Session, sub: Subscription, now: datetime | None = None) -> Invoice | None:
    """Called when the provider reports a successful renewal payment."""
    now = now or utcnow()
    if sub.plan_code == "free":
        return None
    if sub.cancel_at_period_end:
        reset_to_free(sub)
        return None
    plan = get_plan(sub.pending_plan_code or sub.plan_code)
    sub.pending_plan_code = None
    # Continue from the end of the current period (or trial); restart from now if it lapsed.
    start = sub.current_period_end if sub.current_period_end and sub.current_period_end > now else now
    return start_paid_period(db, sub, plan, sub.interval, start)


def mark_payment_failed(db: Session, sub: Subscription, now: datetime | None = None) -> None:
    now = now or utcnow()
    if sub.plan_code == "free":
        return
    sub.status = "past_due"
    plan = get_plan(sub.pending_plan_code or sub.plan_code)
    db.add(Invoice(
        user_id=sub.user_id, plan_code=plan.code, amount_cents=plan.price_cents(sub.interval),
        status="failed", period_start=now, period_end=now + interval_delta(sub.interval),
    ))
