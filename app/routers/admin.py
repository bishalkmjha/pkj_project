from collections import Counter

from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session

from app import subscriptions as subs
from app.db import get_db
from app.deps import require_admin
from app.models import Invoice, Subscription, User
from app.plans import get_plan
from app.schemas import MetricsOut

router = APIRouter(prefix="/admin", tags=["admin"])


@router.get("/metrics", response_model=MetricsOut)
def metrics(_admin: User = Depends(require_admin), db: Session = Depends(get_db)):
    all_subs = db.query(Subscription).all()
    for s in all_subs:
        subs.sync(db, s)
    db.commit()
    by_plan = Counter(s.plan_code for s in all_subs)
    by_status = Counter(s.status for s in all_subs)
    mrr = 0
    for s in all_subs:
        if s.status == "active" and s.plan_code != "free":  # trials don't count toward MRR yet
            price = get_plan(s.plan_code).price_cents(s.interval)
            mrr += price // 12 if s.interval == "year" else price
    revenue = db.query(func.coalesce(func.sum(Invoice.amount_cents), 0)).filter_by(status="paid").scalar()
    return MetricsOut(
        users=db.query(func.count(User.id)).scalar(),
        subscribers_by_plan=dict(by_plan), subscribers_by_status=dict(by_status),
        mrr_cents=mrr, revenue_cents=revenue,
    )
