"""add missed_answers to leaderboard_entries

Revision ID: 0005_add_missed_answers
Revises: 0004_create_chat_messages
Create Date: 2026-07-14 00:00:00.000000
"""

from alembic import op
import sqlalchemy as sa


revision = '0005_add_missed_answers'
down_revision = '0004_create_chat_messages'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column(
        'leaderboard_entries',
        sa.Column('missed_answers', sa.Integer(), nullable=False, server_default=sa.text('0')),
    )


def downgrade() -> None:
    op.drop_column('leaderboard_entries', 'missed_answers')
