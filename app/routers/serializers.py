from sqlalchemy.orm import Session

from app import subscriptions as subs
from app.config import get_settings
from app.models import Link, Subscription, User
from app.schemas import LinkOut, SubscriptionOut, UsageOut


def subscription_out(sub: Subscription) -> SubscriptionOut:
    return SubscriptionOut(
        plan=sub.plan_code,
        effective_plan=subs.effective_plan(sub).code,
        interval=sub.interval,
        status=sub.status,
        current_period_end=sub.current_period_end,
        cancel_at_period_end=sub.cancel_at_period_end,
        pending_plan=sub.pending_plan_code,
    )


def usage_out(db: Session, user: User) -> UsageOut:
    plan = subs.effective_plan(user.subscription)
    return UsageOut(
        plan=plan.code,
        links_used=subs.link_count(db, user.id),
        link_limit=plan.link_limit,
        features=sorted(plan.features),
    )


def link_out(link: Link) -> LinkOut:
    return LinkOut(
        id=link.id, slug=link.slug, target_url=link.target_url,
        short_url=f"{get_settings().base_url}/r/{link.slug}", created_at=link.created_at,
    )
