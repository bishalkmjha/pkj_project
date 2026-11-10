import secrets
from collections import Counter

from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session

from app import subscriptions as subs
from app.db import get_db
from app.deps import get_current_plan, get_current_user, require_feature
from app.models import Click, Link, User
from app.plans import FEATURE_ANALYTICS, FEATURE_CUSTOM_SLUGS, Plan
from app.routers.serializers import link_out
from app.schemas import LinkIn, LinkOut, LinkStatsOut

router = APIRouter()


def _new_slug(db: Session) -> str:
    while True:
        slug = secrets.token_urlsafe(5)
        if not db.query(Link).filter_by(slug=slug).first():
            return slug


def _own_link(db: Session, user: User, link_id: int) -> Link:
    link = db.get(Link, link_id)
    if link is None or link.owner_id != user.id:
        raise HTTPException(404, "Link not found")
    return link


@router.post("/links", response_model=LinkOut, status_code=201, tags=["links"])
def create_link(body: LinkIn, user: User = Depends(get_current_user),
                plan: Plan = Depends(get_current_plan), db: Session = Depends(get_db)):
    used = subs.link_count(db, user.id)
    if plan.link_limit is not None and used >= plan.link_limit:
        raise HTTPException(402, f"{plan.name} plan allows {plan.link_limit} links. Upgrade for more.")
    if body.slug:
        if FEATURE_CUSTOM_SLUGS not in plan.features:
            raise HTTPException(402, "Custom slugs are a Business plan feature.")
        if db.query(Link).filter_by(slug=body.slug).first():
            raise HTTPException(409, "Slug already taken")
    link = Link(owner_id=user.id, slug=body.slug or _new_slug(db), target_url=str(body.url))
    db.add(link)
    db.commit()
    return link_out(link)


@router.get("/links", response_model=list[LinkOut], tags=["links"])
def list_links(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    rows = db.query(Link).filter_by(owner_id=user.id).order_by(Link.id.desc()).all()
    return [link_out(link) for link in rows]


@router.delete("/links/{link_id}", status_code=204, tags=["links"])
def delete_link(link_id: int, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    db.delete(_own_link(db, user, link_id))
    db.commit()


@router.get("/links/{link_id}/stats", response_model=LinkStatsOut, tags=["links"])
def link_stats(link_id: int, user: User = Depends(get_current_user),
               _plan: Plan = Depends(require_feature(FEATURE_ANALYTICS)), db: Session = Depends(get_db)):
    link = _own_link(db, user, link_id)
    clicks = db.query(Click).filter_by(link_id=link.id).all()
    by_day = Counter(c.created_at.strftime("%Y-%m-%d") for c in clicks)
    refs = Counter(c.referrer or "(direct)" for c in clicks)
    return LinkStatsOut(link_id=link.id, total_clicks=len(clicks),
                        clicks_by_day=dict(sorted(by_day.items())), top_referrers=dict(refs.most_common(10)))


@router.get("/r/{slug}", tags=["redirect"])
def follow(slug: str, request: Request, db: Session = Depends(get_db)):
    link = db.query(Link).filter_by(slug=slug).first()
    if link is None:
        raise HTTPException(404, "Short link not found")
    db.add(Click(link_id=link.id, referrer=request.headers.get("referer"),
                 user_agent=(request.headers.get("user-agent") or "")[:512]))
    db.commit()
    return RedirectResponse(link.target_url, status_code=307)
