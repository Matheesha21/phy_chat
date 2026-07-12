"""create competition tables (student profiles, quizzes, leaderboard entries)

Revision ID: 0002_create_competition_tables
Revises: 0001_create_users_and_sessions
Create Date: 2026-07-13 00:00:00.000000
"""

from alembic import op
import sqlalchemy as sa


revision = '0002_create_competition_tables'
down_revision = '0001_create_users_and_sessions'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        'student_profiles',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('user_id', sa.Integer(), sa.ForeignKey('users.id', ondelete='CASCADE'), nullable=False, unique=True),
        sa.Column('study_year', sa.Integer(), nullable=False),
        sa.Column('interest_modules', sa.ARRAY(sa.String(length=255)), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
    )

    op.create_table(
        'quizzes',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('user_id', sa.Integer(), sa.ForeignKey('users.id', ondelete='CASCADE'), nullable=False),
        sa.Column('topic', sa.String(length=255), nullable=True),
        sa.Column('question', sa.Text(), nullable=False),
        sa.Column('options', sa.ARRAY(sa.String(length=500)), nullable=False),
        sa.Column('correct_option_index', sa.Integer(), nullable=False),
        sa.Column('selected_option_index', sa.Integer(), nullable=True),
        sa.Column('is_correct', sa.Boolean(), nullable=True),
        sa.Column('time_taken_seconds', sa.Float(), nullable=True),
        sa.Column('answered_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
    )
    op.create_index('ix_quizzes_user_id', 'quizzes', ['user_id'])

    op.create_table(
        'leaderboard_entries',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('user_id', sa.Integer(), sa.ForeignKey('users.id', ondelete='CASCADE'), nullable=False, unique=True),
        sa.Column('correct_answers', sa.Integer(), nullable=False, server_default=sa.text('0')),
        sa.Column('wrong_answers', sa.Integer(), nullable=False, server_default=sa.text('0')),
        sa.Column('total_time_seconds', sa.Float(), nullable=False, server_default=sa.text('0')),
        sa.Column('score', sa.Integer(), nullable=False, server_default=sa.text('0')),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
    )


def downgrade() -> None:
    op.drop_table('leaderboard_entries')
    op.drop_index('ix_quizzes_user_id', table_name='quizzes')
    op.drop_table('quizzes')
    op.drop_table('student_profiles')
