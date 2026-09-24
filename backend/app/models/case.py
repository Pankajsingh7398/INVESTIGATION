import uuid
from datetime import datetime
from sqlalchemy import Column, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base import Base

class Case(Base):
    __tablename__ = "cases"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    human_id = Column(String(50), unique=True, nullable=False, index=True) # e.g. CASE-102
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    investigator = Column(String(255), nullable=False, default="Lead Investigator")
    status = Column(String(50), nullable=False, default="ACTIVE") # ACTIVE, ARCHIVED, CLOSED
    priority = Column(String(50), nullable=False, default="HIGH") # HIGH, MEDIUM, LOW
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    evidence_items = relationship("Evidence", back_populates="case", cascade="all, delete-orphan")
    entities = relationship("Entity", back_populates="case", cascade="all, delete-orphan")
    relationships = relationship("Relationship", back_populates="case", cascade="all, delete-orphan")
    timeline_events = relationship("TimelineEvent", back_populates="case", cascade="all, delete-orphan")

class CaseMember(Base):
    __tablename__ = "case_members"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    case_id = Column(String(36), ForeignKey("cases.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(String(255), nullable=False)
    role = Column(String(50), nullable=False, default="INVESTIGATOR")
    joined_at = Column(DateTime, default=datetime.utcnow)
