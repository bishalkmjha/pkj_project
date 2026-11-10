from datetime import datetime
from typing import Literal

from pydantic import BaseModel, EmailStr, Field, HttpUrl

Interval = Literal["month", "year"]


class SignupIn(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)


class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"


class PlanOut(BaseModel):
    code: str
    name: str
    monthly_price_cents: int
    yearly_price_cents: int
    link_limit: int | None
    features: list[str]
    trial_days: int


class SubscriptionOut(BaseModel):
    plan: str
    effective_plan: str
    interval: str
    status: str
    current_period_end: datetime | None
    cancel_at_period_end: bool
    pending_plan: str | None


class UsageOut(BaseModel):
    plan: str
    links_used: int
    link_limit: int | None
    features: list[str]


class MeOut(BaseModel):
    id: int
    email: str
    is_admin: bool
    subscription: SubscriptionOut
    usage: UsageOut


class CheckoutIn(BaseModel):
    plan: str
    interval: Interval = "month"


class CheckoutOut(BaseModel):
    session_id: str
    checkout_url: str
    trial_days: int


class ChangePlanIn(BaseModel):
    plan: str


class MessageOut(BaseModel):
    message: str
    subscription: SubscriptionOut


class InvoiceOut(BaseModel):
    id: int
    plan_code: str
    amount_cents: int
    status: str
    period_start: datetime
    period_end: datetime
    created_at: datetime


class LinkIn(BaseModel):
    url: HttpUrl
    slug: str | None = Field(default=None, pattern=r"^[A-Za-z0-9_-]{3,64}$")


class LinkOut(BaseModel):
    id: int
    slug: str
    target_url: str
    short_url: str
    created_at: datetime


class LinkStatsOut(BaseModel):
    link_id: int
    total_clicks: int
    clicks_by_day: dict[str, int]
    top_referrers: dict[str, int]


class MetricsOut(BaseModel):
    users: int
    subscribers_by_plan: dict[str, int]
    subscribers_by_status: dict[str, int]
    mrr_cents: int
    revenue_cents: int
