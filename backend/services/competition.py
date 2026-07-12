from dataclasses import dataclass

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from models.quiz_attempt import QuizAttempt
from models.user import User
from schemas.competition import (
    AnswerIn,
    LeaderboardEntryOut,
    ModuleOut,
    QuestionOut,
    StudyYear,
    SubmitResult,
)


@dataclass(frozen=True)
class _Module:
    id: str
    year: int
    code: str
    name: str
    description: str
    question_count: int = 3


@dataclass(frozen=True)
class _Question:
    id: str
    module_id: str
    prompt: str
    options: list[str]
    correct_option: int
    explanation: str
    points: int = 10


MODULES: list[_Module] = [
    _Module(
        id='foundation-mechanics',
        year=1,
        code='PHY 101',
        name='Classical Mechanics',
        description='Motion, forces, work, and energy fundamentals.',
    ),
    _Module(
        id='foundation-waves',
        year=1,
        code='PHY 102',
        name='Waves & Optics',
        description='Oscillations, wave behaviour, and basic optics.',
    ),
    _Module(
        id='applied-electricity',
        year=2,
        code='PHY 204',
        name='Applied Electricity',
        description='Circuit analysis, electrostatics, and practical electrical systems.',
    ),
    _Module(
        id='thermal-physics',
        year=2,
        code='PHY 205',
        name='Thermal Physics',
        description='Heat, thermodynamic laws, and thermal processes.',
    ),
    _Module(
        id='quantum-physics',
        year=3,
        code='PHY 306',
        name='Quantum Physics',
        description='Wave functions, uncertainty, and atomic systems.',
    ),
    _Module(
        id='electromagnetic-theory',
        year=3,
        code='PHY 307',
        name='Electromagnetic Theory',
        description='Fields, Maxwell’s equations, and electromagnetic waves.',
    ),
    _Module(
        id='solid-state',
        year=4,
        code='PHY 408',
        name='Solid State Physics',
        description='Crystal structures, semiconductors, and modern materials.',
    ),
]

QUESTIONS: list[_Question] = [
    _Question(
        id='ae-1',
        module_id='applied-electricity',
        prompt='A 12 V source is connected across a 4 Ω resistor. What current flows through the resistor?',
        options=['0.33 A', '3 A', '16 A', '48 A'],
        correct_option=1,
        explanation='Ohm’s law gives I = V/R = 12/4 = 3 A.',
    ),
    _Question(
        id='ae-2',
        module_id='applied-electricity',
        prompt='Which component primarily stores energy in an electric field?',
        options=['Resistor', 'Inductor', 'Capacitor', 'Diode'],
        correct_option=2,
        explanation='A capacitor stores electrical potential energy in the electric field between its plates.',
    ),
    _Question(
        id='ae-3',
        module_id='applied-electricity',
        prompt='Two 6 Ω resistors are connected in parallel. What is their equivalent resistance?',
        options=['12 Ω', '6 Ω', '3 Ω', '1.5 Ω'],
        correct_option=2,
        explanation='For identical parallel resistors, the equivalent is R/2: 6 Ω / 2 = 3 Ω.',
    ),
    _Question(
        id='cm-1',
        module_id='foundation-mechanics',
        prompt='What is the SI unit of force?',
        options=['Joule', 'Newton', 'Watt', 'Pascal'],
        correct_option=1,
        explanation='The newton (N) is the SI unit of force.',
    ),
    _Question(
        id='cm-2',
        module_id='foundation-mechanics',
        prompt='An object moves with constant velocity. Its resultant force is:',
        options=['Constant and positive', 'Zero', 'Increasing', 'Equal to its mass'],
        correct_option=1,
        explanation='By Newton’s first law, constant velocity means zero resultant force.',
    ),
    _Question(
        id='cm-3',
        module_id='foundation-mechanics',
        prompt='Kinetic energy depends on which quantity squared?',
        options=['Mass', 'Force', 'Velocity', 'Displacement'],
        correct_option=2,
        explanation='Kinetic energy is ½mv², so it depends on velocity squared.',
    ),
]

_MODULES_BY_ID = {module.id: module for module in MODULES}


def _fallback_questions(module: _Module) -> list[_Question]:
    return [
        _Question(
            id=f'{module.id}-{index + 1}',
            module_id=module.id,
            prompt=f'Which area is most central to {module.name}?',
            options=[
                'The concepts introduced in this module',
                'Only laboratory safety',
                'The history of architecture',
                'Literary analysis',
            ],
            correct_option=0,
            explanation=f'{module.name} questions focus on the physical principles taught in this module.',
        )
        for index in range(3)
    ]


def _questions_for_module(module_id: str) -> list[_Question]:
    matched = [question for question in QUESTIONS if question.module_id == module_id]
    if matched:
        return matched

    module = _MODULES_BY_ID.get(module_id)
    if module is None:
        return []
    return _fallback_questions(module)


def get_modules(year: StudyYear) -> list[ModuleOut]:
    return [
        ModuleOut(
            id=module.id,
            year=module.year,
            code=module.code,
            name=module.name,
            description=module.description,
            question_count=module.question_count,
        )
        for module in MODULES
        if module.year == year
    ]


def get_questions(module_id: str) -> list[QuestionOut]:
    return [
        QuestionOut(
            id=question.id,
            module_id=question.module_id,
            prompt=question.prompt,
            options=question.options,
            correct_option=question.correct_option,
            explanation=question.explanation,
            points=question.points,
        )
        for question in _questions_for_module(module_id)
    ]


def submit_quiz(db: Session, user: User, module_id: str, answers: list[AnswerIn]) -> SubmitResult:
    questions_by_id = {question.id: question for question in _questions_for_module(module_id)}

    awarded_points = 0
    correct_answers = 0
    for answer in answers:
        question = questions_by_id.get(answer.question_id)
        if question is not None and question.correct_option == answer.selected_option:
            awarded_points += question.points
            correct_answers += 1

    attempt = QuizAttempt(
        user_id=user.id,
        module_id=module_id,
        awarded_points=awarded_points,
        correct_answers=correct_answers,
        total_questions=len(answers),
    )
    db.add(attempt)
    db.commit()

    total_points = db.scalar(
        select(func.coalesce(func.sum(QuizAttempt.awarded_points), 0)).where(QuizAttempt.user_id == user.id)
    )

    return SubmitResult(
        awarded_points=awarded_points,
        correct_answers=correct_answers,
        total_questions=len(answers),
        total_points=int(total_points or 0),
    )


def get_leaderboard(db: Session, current_user: User) -> list[LeaderboardEntryOut]:
    points_col = func.coalesce(func.sum(QuizAttempt.awarded_points), 0).label('points')
    quizzes_col = func.count(QuizAttempt.id).label('quizzes_completed')

    rows = db.execute(
        select(User.id, User.email, User.full_name, points_col, quizzes_col)
        .join(QuizAttempt, QuizAttempt.user_id == User.id)
        .group_by(User.id)
        .order_by(points_col.desc())
    ).all()

    entries = [
        {
            'user_id': row.id,
            'student_id': row.email,
            'student_name': row.full_name or row.email,
            'points': int(row.points),
            'quizzes_completed': int(row.quizzes_completed),
        }
        for row in rows
    ]

    if not any(entry['user_id'] == current_user.id for entry in entries):
        entries.append(
            {
                'user_id': current_user.id,
                'student_id': current_user.email,
                'student_name': current_user.full_name or current_user.email,
                'points': 0,
                'quizzes_completed': 0,
            }
        )
        entries.sort(key=lambda entry: entry['points'], reverse=True)

    return [
        LeaderboardEntryOut(
            rank=index + 1,
            student_id=entry['student_id'],
            student_name=entry['student_name'],
            points=entry['points'],
            quizzes_completed=entry['quizzes_completed'],
            is_current_student=entry['user_id'] == current_user.id,
        )
        for index, entry in enumerate(entries)
    ]
