"""add has_completed_competition_onboarding to users

Revision ID: 0003_add_onboarding_flag
Revises: 0002_create_competition_tables
Create Date: 2026-07-13 00:00:00.000000
"""

from alembic import op
import sqlalchemy as sa


revision = '0003_add_onboarding_flag'
down_revision = '0002_create_competition_tables'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column(
        'users',
        sa.Column(
            'has_completed_competition_onboarding',
            sa.Boolean(),
            nullable=False,
            server_default=sa.text('false'),
        ),
    )


def downgrade() -> None:
    op.drop_column('users', 'has_completed_competition_onboarding')
