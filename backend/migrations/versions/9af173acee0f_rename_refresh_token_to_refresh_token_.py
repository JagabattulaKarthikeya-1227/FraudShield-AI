"""rename refresh_token to refresh_token_hash in sessions

Revision ID: 9af173acee0f
Revises: bb68a30aee7a
Create Date: 2026-09-09 15:26:59.579330

Security note
-------------
This migration replaces the plaintext `refresh_token` column with
`refresh_token_hash` (HMAC-SHA256, 64-char hex).

Existing sessions are dropped during upgrade — users will be required to
log in again after deployment.  This is intentional: old plaintext tokens
stored in the database are invalidated so they cannot be replayed by
anyone with prior DB read access.

Downgrade restores the column but cannot recover the original plaintext
tokens (hashes are one-way).  After a downgrade, all sessions will remain
empty until users log in again under the old scheme.
"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '9af173acee0f'
down_revision = 'bb68a30aee7a'
branch_labels = None
depends_on = None


def upgrade():
    # Replace plaintext refresh_token with HMAC-SHA256 hash column.
    # Existing rows are deleted first — this intentionally invalidates all
    # previously issued refresh tokens (they were stored in plaintext and
    # cannot be safely migrated to hashes without the original raw values).
    op.execute("DELETE FROM sessions")

    with op.batch_alter_table('sessions', schema=None) as batch_op:
        batch_op.add_column(sa.Column('refresh_token_hash', sa.String(length=64), nullable=False))
        batch_op.drop_index(batch_op.f('ix_sessions_refresh_token'))
        batch_op.create_index(batch_op.f('ix_sessions_refresh_token_hash'), ['refresh_token_hash'], unique=True)
        batch_op.drop_column('refresh_token')


def downgrade():
    # Restore the plaintext column.  All existing hashed sessions are lost —
    # users must log in again under the old (plaintext) scheme.
    with op.batch_alter_table('sessions', schema=None) as batch_op:
        batch_op.add_column(sa.Column('refresh_token', sa.VARCHAR(length=512), nullable=False))
        batch_op.drop_index(batch_op.f('ix_sessions_refresh_token_hash'))
        batch_op.create_index(batch_op.f('ix_sessions_refresh_token'), ['refresh_token'], unique=True)
        batch_op.drop_column('refresh_token_hash')
