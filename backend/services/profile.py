from __future__ import annotations

from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from models.profile import StudentProfile
from schemas.profile import ProfileUpsertRequest


def get_profile(db: Session, user_id: int) -> StudentProfile | None:
    return db.scalar(select(StudentProfile).where(StudentProfile.user_id == user_id))


def require_profile(db: Session, user_id: int) -> StudentProfile:
    profile = get_profile(db, user_id)
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail='Complete your profile before generating quiz questions',
        )
    return profile


def upsert_profile(db: Session, user_id: int, payload: ProfileUpsertRequest) -> StudentProfile:
    profile = get_profile(db, user_id)
    if profile:
        profile.study_year = payload.study_year
        profile.interest_modules = payload.interest_modules
        profile.description = payload.description
    else:
        profile = StudentProfile(
            user_id=user_id,
            study_year=payload.study_year,
            interest_modules=payload.interest_modules,
            description=payload.description,
        )
        db.add(profile)

    db.commit()
    db.refresh(profile)
    return profile
