import uuid
from datetime import datetime
from sqlalchemy import Column, String, Text, DateTime, ForeignKey, Integer, JSON
from sqlalchemy.orm import relationship
from app.db.base import Base

class Evidence(Base):
    __tablename__ = "evidence"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    evidence_id = Column(String(50), unique=True, nullable=False, index=True) # e.g. EV-004
    case_id = Column(String(36), ForeignKey("cases.id", ondelete="CASCADE"), nullable=False)
    file_name = Column(String(255), nullable=False)
    file_type = Column(String(50), nullable=False) # Image, Document, Audio, Chat, etc.
    file_size = Column(String(50), nullable=False)
    storage_path = Column(String(512), nullable=False)

    # Cloudinary asset fields
    cloudinary_public_id = Column(String(255), nullable=True)
    cloudinary_url = Column(String(512), nullable=True)
    cloudinary_resource_type = Column(String(50), nullable=True)
    cloudinary_format = Column(String(50), nullable=True)
    cloudinary_version = Column(String(50), nullable=True)

    uploaded_at = Column(DateTime, default=datetime.utcnow)
    sha256 = Column(String(64), nullable=False, index=True)
    status = Column(String(50), nullable=False, default="UPLOADED")
    extracted_text = Column(Text, nullable=True)
    metadata_json = Column(JSON, nullable=True)

    case = relationship("Case", back_populates="evidence_items")
    processing_jobs = relationship("EvidenceProcessing", back_populates="evidence", cascade="all, delete-orphan")
    custody_records = relationship("ChainOfCustody", back_populates="evidence", cascade="all, delete-orphan")

class EvidenceProcessing(Base):
    __tablename__ = "evidence_processing"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    job_id = Column(String(50), unique=True, nullable=False, index=True) # e.g. JOB-1024
    evidence_id = Column(String(36), ForeignKey("evidence.id", ondelete="CASCADE"), nullable=False)
    status = Column(String(50), nullable=False, default="PROCESSING")
    error_info = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    evidence = relationship("Evidence", back_populates="processing_jobs")
