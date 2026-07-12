from __future__ import annotations

import random
from datetime import UTC, datetime

from fastapi import HTTPException, status
from langchain_core.messages import HumanMessage, SystemMessage
from langchain_google_genai import ChatGoogleGenerativeAI
from sqlalchemy import select
from sqlalchemy.orm import Session

from core.config import get_gemini_model, get_google_api_key
from models.profile import StudentProfile
from models.quiz import Quiz
from schemas.quiz import GeneratedQuestion, QuizAnswerRequest, QuizAnswerResponse
from services.leaderboard import record_answer, score_for_answer

SYSTEM_PROMPT = (
    'You are a physics tutor for university students. Generate a single multiple-choice question '
    'tailored to the student profile provided. The question must have exactly four answer options '
    'with exactly one correct answer. Keep the question and options concise and unambiguous.'
)


def _build_llm() -> ChatGoogleGenerativeAI:
    return ChatGoogleGenerativeAI(model=get_gemini_model(), google_api_key=get_google_api_key())


def _build_user_prompt(profile: StudentProfile) -> str:
    topic = random.choice(profile.interest_modules)
    return (
        f'Study year: {profile.study_year}\n'
        f'Focus topic for this question: {topic}\n'
        f'Other interest modules: {", ".join(profile.interest_modules)}\n'
        f'Student description: {profile.description or "N/A"}\n\n'
        f'Generate one MCQ physics question about "{topic}" appropriate for a year {profile.study_year} '
        'university student.'
    )


def generate_question(db: Session, user_id: int, profile: StudentProfile) -> Quiz:
    llm = _build_llm().with_structured_output(GeneratedQuestion)
    messages = [SystemMessage(content=SYSTEM_PROMPT), HumanMessage(content=_build_user_prompt(profile))]

    try:
        generated: GeneratedQuestion = llm.invoke(messages)
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail='Failed to generate a quiz question',
        ) from exc

    quiz = Quiz(
        user_id=user_id,
        topic=generated.topic,
        question=generated.question,
        options=generated.options,
        correct_option_index=generated.correct_option_index,
    )
    db.add(quiz)
    db.commit()
    db.refresh(quiz)
    return quiz


def get_owned_quiz(db: Session, quiz_id: int, user_id: int) -> Quiz:
    quiz = db.scalar(select(Quiz).where(Quiz.id == quiz_id))
    if not quiz:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Quiz question not found')
    if quiz.user_id != user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail='This quiz question belongs to another user')
    return quiz


def submit_answer(db: Session, user_id: int, quiz_id: int, payload: QuizAnswerRequest) -> QuizAnswerResponse:
    quiz = get_owned_quiz(db, quiz_id, user_id)
    if quiz.answered_at is not None:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail='This quiz question has already been answered')

    is_correct = payload.selected_option_index == quiz.correct_option_index
    score_awarded = score_for_answer(is_correct, payload.time_taken_seconds)

    quiz.selected_option_index = payload.selected_option_index
    quiz.is_correct = is_correct
    quiz.time_taken_seconds = payload.time_taken_seconds
    quiz.answered_at = datetime.now(UTC)
    db.commit()

    record_answer(db, user_id, is_correct, payload.time_taken_seconds, score_awarded)

    return QuizAnswerResponse(
        quiz_id=quiz.id,
        is_correct=is_correct,
        correct_option_index=quiz.correct_option_index,
        score_awarded=score_awarded,
    )
