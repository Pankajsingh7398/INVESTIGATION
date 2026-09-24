"""initial_schema_postgresql

Revision ID: 001_initial_schema
Revises: 
Create Date: 2026-09-24

Creates all tables from scratch for PostgreSQL (Supabase).
Includes Cloudinary fields on evidence table.
"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

revision: str = '001_initial_schema'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # --- cases ---
    op.create_table(
        'cases',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('case_number', sa.String(50), nullable=False, unique=True),
        sa.Column('title', sa.String(255), nullable=False),
        sa.Column('description', sa.Text, nullable=True),
        sa.Column('status', sa.String(50), nullable=False, server_default='OPEN'),
        sa.Column('priority', sa.String(50), nullable=False, server_default='MEDIUM'),
        sa.Column('investigator_id', sa.String(255), nullable=True),
        sa.Column('created_at', sa.DateTime, nullable=True),
        sa.Column('updated_at', sa.DateTime, nullable=True),
        sa.Column('closed_at', sa.DateTime, nullable=True),
        sa.Column('metadata_json', sa.JSON, nullable=True),
    )
    op.create_index('ix_cases_case_number', 'cases', ['case_number'])

    # --- case_members ---
    op.create_table(
        'case_members',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('case_id', sa.String(36), sa.ForeignKey('cases.id', ondelete='CASCADE'), nullable=False),
        sa.Column('user_id', sa.String(255), nullable=False),
        sa.Column('role', sa.String(50), nullable=False, server_default='VIEWER'),
        sa.Column('added_at', sa.DateTime, nullable=True),
    )

    # --- evidence ---
    op.create_table(
        'evidence',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('evidence_id', sa.String(50), nullable=False, unique=True),
        sa.Column('case_id', sa.String(36), sa.ForeignKey('cases.id', ondelete='CASCADE'), nullable=False),
        sa.Column('file_name', sa.String(255), nullable=False),
        sa.Column('file_type', sa.String(50), nullable=False),
        sa.Column('file_size', sa.String(50), nullable=False),
        sa.Column('storage_path', sa.String(512), nullable=False),
        # Cloudinary fields
        sa.Column('cloudinary_public_id', sa.String(255), nullable=True),
        sa.Column('cloudinary_url', sa.String(512), nullable=True),
        sa.Column('cloudinary_resource_type', sa.String(50), nullable=True),
        sa.Column('cloudinary_format', sa.String(50), nullable=True),
        sa.Column('cloudinary_version', sa.String(50), nullable=True),
        # Processing fields
        sa.Column('uploaded_at', sa.DateTime, nullable=True),
        sa.Column('sha256', sa.String(64), nullable=False),
        sa.Column('status', sa.String(50), nullable=False, server_default='UPLOADED'),
        sa.Column('extracted_text', sa.Text, nullable=True),
        sa.Column('metadata_json', sa.JSON, nullable=True),
    )
    op.create_index('ix_evidence_evidence_id', 'evidence', ['evidence_id'])
    op.create_index('ix_evidence_sha256', 'evidence', ['sha256'])

    # --- evidence_processing ---
    op.create_table(
        'evidence_processing',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('job_id', sa.String(50), nullable=False, unique=True),
        sa.Column('evidence_id', sa.String(36), sa.ForeignKey('evidence.id', ondelete='CASCADE'), nullable=False),
        sa.Column('status', sa.String(50), nullable=False, server_default='PROCESSING'),
        sa.Column('error_info', sa.Text, nullable=True),
        sa.Column('created_at', sa.DateTime, nullable=True),
        sa.Column('updated_at', sa.DateTime, nullable=True),
    )
    op.create_index('ix_evidence_processing_job_id', 'evidence_processing', ['job_id'])

    # --- entities ---
    op.create_table(
        'entities',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('entity_id', sa.String(50), nullable=False, unique=True),
        sa.Column('case_id', sa.String(36), sa.ForeignKey('cases.id', ondelete='CASCADE'), nullable=False),
        sa.Column('name', sa.String(255), nullable=False),
        sa.Column('type', sa.String(100), nullable=False),
        sa.Column('confidence', sa.String(20), nullable=True),
        sa.Column('source_evidence_id', sa.String(36), nullable=True),
        sa.Column('metadata_json', sa.JSON, nullable=True),
        sa.Column('created_at', sa.DateTime, nullable=True),
    )
    op.create_index('ix_entities_entity_id', 'entities', ['entity_id'])

    # --- relationships ---
    op.create_table(
        'relationships',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('relationship_id', sa.String(50), nullable=False, unique=True),
        sa.Column('case_id', sa.String(36), sa.ForeignKey('cases.id', ondelete='CASCADE'), nullable=False),
        sa.Column('source_entity_id', sa.String(36), sa.ForeignKey('entities.id', ondelete='CASCADE'), nullable=False),
        sa.Column('target_entity_id', sa.String(36), sa.ForeignKey('entities.id', ondelete='CASCADE'), nullable=False),
        sa.Column('relationship_type', sa.String(100), nullable=False),
        sa.Column('confidence', sa.String(20), nullable=True),
        sa.Column('metadata_json', sa.JSON, nullable=True),
        sa.Column('created_at', sa.DateTime, nullable=True),
    )
    op.create_index('ix_relationships_relationship_id', 'relationships', ['relationship_id'])

    # --- timeline_events ---
    op.create_table(
        'timeline_events',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('event_id', sa.String(50), nullable=False, unique=True),
        sa.Column('case_id', sa.String(36), sa.ForeignKey('cases.id', ondelete='CASCADE'), nullable=False),
        sa.Column('title', sa.String(255), nullable=False),
        sa.Column('description', sa.Text, nullable=True),
        sa.Column('event_datetime', sa.DateTime, nullable=True),
        sa.Column('event_type', sa.String(100), nullable=True),
        sa.Column('source_evidence_id', sa.String(36), nullable=True),
        sa.Column('confidence', sa.String(20), nullable=True),
        sa.Column('metadata_json', sa.JSON, nullable=True),
        sa.Column('created_at', sa.DateTime, nullable=True),
    )
    op.create_index('ix_timeline_events_event_id', 'timeline_events', ['event_id'])

    # --- chain_of_custody ---
    op.create_table(
        'chain_of_custody',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('custody_id', sa.String(50), nullable=False, unique=True),
        sa.Column('evidence_id', sa.String(36), sa.ForeignKey('evidence.id', ondelete='CASCADE'), nullable=False),
        sa.Column('action', sa.String(100), nullable=False),
        sa.Column('performed_by', sa.String(255), nullable=True),
        sa.Column('notes', sa.Text, nullable=True),
        sa.Column('timestamp', sa.DateTime, nullable=True),
        sa.Column('metadata_json', sa.JSON, nullable=True),
    )
    op.create_index('ix_chain_of_custody_custody_id', 'chain_of_custody', ['custody_id'])

    # --- assistant_sessions ---
    op.create_table(
        'assistant_sessions',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('session_id', sa.String(50), nullable=False, unique=True),
        sa.Column('case_id', sa.String(36), sa.ForeignKey('cases.id', ondelete='CASCADE'), nullable=False),
        sa.Column('user_id', sa.String(255), nullable=True),
        sa.Column('question', sa.Text, nullable=False),
        sa.Column('answer', sa.Text, nullable=True),
        sa.Column('sources', sa.JSON, nullable=True),
        sa.Column('created_at', sa.DateTime, nullable=True),
    )
    op.create_index('ix_assistant_sessions_session_id', 'assistant_sessions', ['session_id'])


def downgrade() -> None:
    op.drop_table('assistant_sessions')
    op.drop_table('chain_of_custody')
    op.drop_table('timeline_events')
    op.drop_table('relationships')
    op.drop_table('entities')
    op.drop_table('evidence_processing')
    op.drop_table('evidence')
    op.drop_table('case_members')
    op.drop_table('cases')
