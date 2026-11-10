from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app import subscriptions as subs
from app.config import get_settings
from app.db import get_db
from app.deps import get_current_user
from app.models import User
from app.routers.serializers import subscription_out, usage_out
from app.schemas import MeOut, SignupIn, TokenOut
from app.security import create_access_token, hash_password, verify_password

router = APIRouter(tags=["auth"])


@router.post("/auth/signup", response_model=TokenOut, status_code=201)
def signup(body: SignupIn, db: Session = Depends(get_db)):
    email = body.email.lower()
    if db.query(User).filter_by(email=email).first():
        raise HTTPException(status.HTTP_409_CONFLICT, "Email already registered")
    user = User(email=email, password_hash=hash_password(body.password),
                is_admin=get_settings().is_admin_email(email))
    db.add(user)
    db.flush()
    subs.ensure_subscription(db, user)
    db.commit()
    return TokenOut(access_token=create_access_token(user.id))


@router.post("/auth/token", response_model=TokenOut)
def login(form: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter_by(email=form.username.lower()).first()
    if not user or not verify_password(form.password, user.password_hash):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Incorrect email or password")
    return TokenOut(access_token=create_access_token(user.id))


@router.get("/me", response_model=MeOut)
def me(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return MeOut(
        id=user.id, email=user.email, is_admin=user.is_admin,
        subscription=subscription_out(user.subscription), usage=usage_out(db, user),
    )
