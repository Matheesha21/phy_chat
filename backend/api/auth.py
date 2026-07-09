from fastapi import APIRouter, Depends, Request, Response, status
from sqlalchemy.orm import Session

from core.database import get_db
from models.user import User
from schemas.auth import AuthResponse, GoogleSignInRequest, MessageResponse, UserRead
from services.auth import (
    authenticate_with_google,
    clear_session_cookie,
    get_current_user,
    revoke_current_session,
    set_session_cookie,
)


router = APIRouter(prefix='/auth', tags=['auth'])


@router.post('/google', response_model=AuthResponse, status_code=status.HTTP_200_OK)
def google_sign_in(payload: GoogleSignInRequest, response: Response, db: Session = Depends(get_db)):
    auth_response, session_token = authenticate_with_google(db, payload.id_token)
    set_session_cookie(response, session_token, auth_response.session_expires_at)
    return auth_response


@router.post('/logout', response_model=MessageResponse)
def logout(request: Request, response: Response):
    revoke_current_session(request)
    clear_session_cookie(response)
    return MessageResponse(message='Logged out successfully')


@router.get('/me', response_model=UserRead)
def me(user: User = Depends(get_current_user)):
    return UserRead.model_validate(user, from_attributes=True)
