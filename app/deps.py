from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from app import subscriptions as subs
from app.db import get_db
from app.models import User
from app.plans import Plan
from app.security import decode_access_token

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/token")


def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> User:
    user_id = decode_access_token(token)
    user = db.get(User, user_id) if user_id else None
    if user is None:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid or expired token",
                            headers={"WWW-Authenticate": "Bearer"})
    subs.sync(db, subs.ensure_subscription(db, user))
    db.commit()
    return user


def get_current_plan(user: User = Depends(get_current_user)) -> Plan:
    return subs.effective_plan(user.subscription)


def require_feature(feature: str):
    def checker(plan: Plan = Depends(get_current_plan)) -> Plan:
        if feature not in plan.features:
            raise HTTPException(status.HTTP_402_PAYMENT_REQUIRED,
                                f"Your plan ({plan.name}) does not include '{feature}'. Upgrade to unlock it.")
        return plan
    return checker


def require_admin(user: User = Depends(get_current_user)) -> User:
    if not user.is_admin:
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Admins only")
    return user
