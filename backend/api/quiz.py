from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from core.database import get_db
from models.user import User
from schemas.quiz import QuizAnswerRequest, QuizAnswerResponse, QuizQuestionRead
from services.auth import get_current_user
from services.profile import require_profile
from services.quiz import generate_question, submit_answer


router = APIRouter(prefix='/quiz', tags=['quiz'])


@router.post('/generate', response_model=QuizQuestionRead)
def generate_quiz_question(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    profile = require_profile(db, user.id)
    quiz = generate_question(db, user.id, profile)
    return QuizQuestionRead(id=quiz.id, topic=quiz.topic, question=quiz.question, options=quiz.options)


@router.post('/{quiz_id}/answer', response_model=QuizAnswerResponse)
def answer_quiz_question(
    quiz_id: int,
    payload: QuizAnswerRequest,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return submit_answer(db, user.id, quiz_id, payload)
