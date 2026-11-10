# LinkPulse

A link-shortener SaaS built to show a complete **subscription business** in Python (FastAPI + SQLAlchemy).
Customers sign up for free, subscribe to a paid plan (with a free trial), and their plan controls what they can do.

## Plans

| Plan     | Price               | Links     | Features                    | Trial   |
|----------|---------------------|-----------|-----------------------------|---------|
| Free     | $0                  | 5         | —                           | —       |
| Pro      | $9/mo · $90/yr      | 100       | Click analytics             | 14 days |
| Business | $29/mo · $290/yr    | Unlimited | Analytics + custom slugs    | —       |

You can change the plans in `app/plans.py`, the single source of truth for prices, limits and features.

## What's included

- **Auth**: email + password signup and login (bcrypt, JWT bearer tokens).
- **Subscription lifecycle** (`app/subscriptions.py`)
  - Hosted checkout, then a `checkout.completed` webhook activates the plan.
  - Free trial, once per account.
  - Upgrades take effect right away, and you pay the prorated difference for the rest of the period.
  - Downgrades and cancellations take effect at the end of the period. You can undo them with `resume` or by picking the current plan again.
  - Renewals (`invoice.paid`), failed payments (`past_due`, which drops you to Free limits) and `subscription.deleted`.
  - A period that ends without a renewal payment goes to `past_due` automatically.
- **Entitlements**: per-plan link quotas and feature gates (`require_feature("analytics")`). A blocked request gets HTTP **402 Payment Required**.
- **Billing provider abstraction** (`app/billing.py`): it ships with a `FakeProvider` and a test-mode hosted checkout page, so everything runs locally with no payment account. Webhooks are HMAC-SHA256 signed and idempotent.
- **Invoices** for every charge and failed payment.
- **Admin metrics**: MRR, revenue, and subscriber counts by plan and status (`/admin/metrics`).
- **Dashboard UI** at `/`, a single page where you can sign up, subscribe, manage links, see stats and invoices, and simulate renewals or failed payments.
- **API docs** at `/docs` (OpenAPI).

## Run it

```bash
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env            # optional; set LINKPULSE_ADMIN_EMAILS=you@example.com for admin
uvicorn app.main:app --reload
```

Open http://localhost:8000. To run the tests, use `pytest`.

## API overview

| Method | Path                                   | Notes                                    |
|--------|----------------------------------------|------------------------------------------|
| POST   | `/auth/signup`, `/auth/token`          | Returns a bearer token                   |
| GET    | `/me`                                  | Profile, subscription and usage          |
| GET    | `/plans`                               | Public plan catalog                      |
| GET    | `/subscription`                        | Current subscription                     |
| POST   | `/subscription/checkout`               | `{plan, interval}` → `checkout_url`      |
| POST   | `/subscription/change`                 | `{plan}`: upgrade or downgrade           |
| POST   | `/subscription/cancel`, `/resume`      | Cancel at period end, or undo            |
| GET    | `/invoices`                            | Billing history                          |
| POST   | `/webhooks/billing`                    | Provider events, `X-Signature` header    |
| CRUD   | `/links`, `GET /links/{id}/stats`      | Stats need the analytics feature         |
| GET    | `/r/{slug}`                            | Public redirect, records a click         |
| GET    | `/admin/metrics`                       | Admins only                              |

## Going to production

1. Implement `BillingProvider` in `app/billing.py` for Stripe or Paddle, and map their webhook events
   (`checkout.session.completed`, `invoice.paid`, `invoice.payment_failed`,
   `customer.subscription.deleted`) onto `handle_event`. Verify the signatures the way the provider does.
2. Set `LINKPULSE_SECRET_KEY` and `LINKPULSE_WEBHOOK_SECRET` to strong random values.
3. Use Postgres (`LINKPULSE_DATABASE_URL=postgresql+psycopg://...`) and add Alembic migrations.
4. Set `LINKPULSE_BILLING_PROVIDER` to your real provider. This switches off the fake checkout endpoints.
