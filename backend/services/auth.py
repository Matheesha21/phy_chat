from __future__ import annotations

from datetime import datetime

from fastapi import Depends, HTTPException, Request, Response, status
from google.auth.transport.requests import Request as GoogleAuthRequest
from google.oauth2 import id_token as google_id_token
from sqlalchemy import select
from sqlalchemy.orm import Session

from core.config import get_allowed_email_domain, get_google_client_id, get_session_cookie_name, is_cookie_secure
from core.database import get_db
from models.user import User
from schemas.auth import AuthResponse, UserRead
from services.session_store import create_session, delete_session, get_session_user_id


def _build_user_read(user: User) -> UserRead:
    return UserRead(
        id=user.id,
        google_sub=user.google_sub,
        email=user.email,
        full_name=user.full_name,
        picture_url=user.picture_url,
        is_active=user.is_active,
    )


def verify_google_id_token(token: str) -> dict:
    try:
        return google_id_token.verify_oauth2_token(token, GoogleAuthRequest(), get_google_client_id())
    except Exception as exc:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Invalid Google ID token') from exc


def _assert_allowed_email(email: str) -> None:
    allowed_domain = get_allowed_email_domain()
    domain = email.rsplit('@', 1)[-1].lower()
    if domain != allowed_domain:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f'Only @{allowed_domain} email addresses are allowed',
        )


def get_or_create_user_from_google(db: Session, claims: dict) -> User:
    google_sub = claims.get('sub')
    email = claims.get('email')
    if not google_sub or not email:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='Google token is missing required claims')

    if not claims.get('email_verified'):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Google email is not verified')

    _assert_allowed_email(email)

    user = db.scalar(select(User).where(User.google_sub == google_sub))
    if user:
        user.email = email
        user.full_name = claims.get('name')
        user.picture_url = claims.get('picture')
        user.is_active = True
        db.commit()
        db.refresh(user)
        return user

    user = User(
        google_sub=google_sub,
        email=email,
        full_name=claims.get('name'),
        picture_url=claims.get('picture'),
        is_active=True,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def build_auth_response(user: User, session_expires_at: datetime) -> AuthResponse:
    return AuthResponse(user=_build_user_read(user), session_expires_at=session_expires_at)


def set_session_cookie(response: Response, session_token: str, expires_at: datetime) -> None:
    response.set_cookie(
        key=get_session_cookie_name(),
        value=session_token,
        httponly=True,
        secure=is_cookie_secure(),
        samesite='lax',
        expires=expires_at,
        path='/',
    )


def clear_session_cookie(response: Response) -> None:
    response.delete_cookie(key=get_session_cookie_name(), path='/')


def authenticate_with_google(db: Session, token: str) -> tuple[AuthResponse, str]:
    claims = verify_google_id_token(token)
    user = get_or_create_user_from_google(db, claims)
    session_token, expires_at = create_session(user.id)
    return build_auth_response(user, expires_at), session_token


def get_current_user(request: Request, db: Session = Depends(get_db)) -> User:
    session_token = request.cookies.get(get_session_cookie_name())
    if not session_token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Not authenticated')

    user_id = get_session_user_id(session_token)
    if user_id is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Session expired or invalid')

    user = db.get(User, user_id)
    if not user or not user.is_active:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='User is not active')

    return user


def revoke_current_session(request: Request) -> None:
    session_token = request.cookies.get(get_session_cookie_name())
    if not session_token:
        return

    delete_session(session_token)
