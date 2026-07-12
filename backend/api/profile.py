from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from core.database import get_db
from models.user import User
from schemas.profile import ProfileRead, ProfileUpsertRequest
from services.auth import get_current_user
from services.profile import require_profile, upsert_profile


router = APIRouter(prefix='/profile', tags=['profile'])


@router.post('/', response_model=ProfileRead)
def upsert_my_profile(payload: ProfileUpsertRequest, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    profile = upsert_profile(db, user.id, payload)
    return ProfileRead.model_validate(profile, from_attributes=True)


@router.get('/', response_model=ProfileRead)
def get_my_profile(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    profile = require_profile(db, user.id)
    return ProfileRead.model_validate(profile, from_attributes=True)
