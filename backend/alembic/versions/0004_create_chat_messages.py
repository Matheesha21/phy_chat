"""create chat_messages table

Revision ID: 0004_create_chat_messages
Revises: 0003_add_onboarding_flag
Create Date: 2026-07-14 00:00:00.000000
"""

from alembic import op
import sqlalchemy as sa


revision = '0004_create_chat_messages'
down_revision = '0003_add_onboarding_flag'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        'chat_messages',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('user_id', sa.Integer(), sa.ForeignKey('users.id', ondelete='CASCADE'), nullable=False),
        sa.Column('role', sa.String(length=20), nullable=False),
        sa.Column('message', sa.Text(), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
    )
    op.create_index('ix_chat_messages_user_id_created_at', 'chat_messages', ['user_id', 'created_at'])


def downgrade() -> None:
    op.drop_index('ix_chat_messages_user_id_created_at', table_name='chat_messages')
    op.drop_table('chat_messages')
