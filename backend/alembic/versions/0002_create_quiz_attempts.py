"""create quiz attempts table

Revision ID: 0002_create_quiz_attempts
Revises: 0001_create_users_and_sessions
Create Date: 2026-07-12 00:00:00.000000
"""

from alembic import op
import sqlalchemy as sa


revision = '0002_create_quiz_attempts'
down_revision = '0001_create_users_and_sessions'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        'quiz_attempts',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('user_id', sa.Integer(), sa.ForeignKey('users.id', ondelete='CASCADE'), nullable=False),
        sa.Column('module_id', sa.String(length=64), nullable=False),
        sa.Column('awarded_points', sa.Integer(), nullable=False),
        sa.Column('correct_answers', sa.Integer(), nullable=False),
        sa.Column('total_questions', sa.Integer(), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
    )
    op.create_index('ix_quiz_attempts_user_id', 'quiz_attempts', ['user_id'])


def downgrade() -> None:
    op.drop_index('ix_quiz_attempts_user_id', table_name='quiz_attempts')
    op.drop_table('quiz_attempts')
