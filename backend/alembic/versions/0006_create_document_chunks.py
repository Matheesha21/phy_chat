"""create document_chunks table

Revision ID: 0006_create_document_chunks
Revises: 0005_add_missed_answers
Create Date: 2026-07-16 00:00:00.000000
"""

from alembic import op
import sqlalchemy as sa


revision = '0006_create_document_chunks'
down_revision = '0005_add_missed_answers'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        'document_chunks',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('source', sa.String(length=255), nullable=False),
        sa.Column('chunk_index', sa.Integer(), nullable=False),
        sa.Column('content', sa.Text(), nullable=False),
        sa.Column('embedding', sa.ARRAY(sa.Float()), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
    )
    op.create_index('ix_document_chunks_source', 'document_chunks', ['source'])


def downgrade() -> None:
    op.drop_index('ix_document_chunks_source', table_name='document_chunks')
    op.drop_table('document_chunks')
