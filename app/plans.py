"""Plan catalog. Single source of truth for pricing, limits and features."""

from dataclasses import dataclass, field


@dataclass(frozen=True)
class Plan:
    code: str
    name: str
    monthly_price_cents: int
    yearly_price_cents: int
    link_limit: int | None  # None = unlimited
    features: frozenset[str] = field(default_factory=frozenset)
    trial_days: int = 0

    @property
    def is_paid(self) -> bool:
        return self.monthly_price_cents > 0

    def price_cents(self, interval: str) -> int:
        return self.yearly_price_cents if interval == "year" else self.monthly_price_cents


FEATURE_ANALYTICS = "analytics"
FEATURE_CUSTOM_SLUGS = "custom_slugs"

PLANS: dict[str, Plan] = {
    "free": Plan("free", "Free", 0, 0, link_limit=5),
    "pro": Plan(
        "pro", "Pro", 900, 9000, link_limit=100,
        features=frozenset({FEATURE_ANALYTICS}), trial_days=14,
    ),
    "business": Plan(
        "business", "Business", 2900, 29000, link_limit=None,
        features=frozenset({FEATURE_ANALYTICS, FEATURE_CUSTOM_SLUGS}),
    ),
}

# Ordering used to decide whether a change is an upgrade or a downgrade.
PLAN_RANK = {"free": 0, "pro": 1, "business": 2}


def get_plan(code: str) -> Plan:
    return PLANS[code]
