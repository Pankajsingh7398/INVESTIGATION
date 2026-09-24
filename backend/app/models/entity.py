import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.db.base import Base

class Entity(Base):
    __tablename__ = "entities"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    entity_id = Column(String(50), nullable=True, index=True) # e.g. ENT-001
    case_id = Column(String(36), ForeignKey("cases.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(255), nullable=False) # e.g. Rahul
    type = Column(String(50), nullable=False) # PERSON, LOCATION, ORGANIZATION, EVENT, OTHER
    metadata_json = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    case = relationship("Case", back_populates="entities")

class EvidenceEntity(Base):
    __tablename__ = "evidence_entities"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    evidence_id = Column(String(36), ForeignKey("evidence.id", ondelete="CASCADE"), nullable=False)
    entity_id = Column(String(36), ForeignKey("entities.id", ondelete="CASCADE"), nullable=False)
