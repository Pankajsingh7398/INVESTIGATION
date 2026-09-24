import uuid
from datetime import datetime
from sqlalchemy import Column, String, Text, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.db.base import Base

class TimelineEvent(Base):
    __tablename__ = "timeline_events"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    case_id = Column(String(36), ForeignKey("cases.id", ondelete="CASCADE"), nullable=False)
    date = Column(String(50), nullable=False) # ISO date string e.g. "2026-08-12"
    event_title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    entities = Column(JSON, nullable=True) # list of entity names/ids e.g. ["Rahul", "Amit"]
    evidence_refs = Column(JSON, nullable=True) # list of evidence human ids e.g. ["EV-03"]
    created_at = Column(DateTime, default=datetime.utcnow)

    case = relationship("Case", back_populates="timeline_events")

class EvidenceEvent(Base):
    __tablename__ = "evidence_events"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    evidence_id = Column(String(36), ForeignKey("evidence.id", ondelete="CASCADE"), nullable=False)
    event_id = Column(String(36), ForeignKey("timeline_events.id", ondelete="CASCADE"), nullable=False)
