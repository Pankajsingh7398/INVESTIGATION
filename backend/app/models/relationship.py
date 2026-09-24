import uuid
from datetime import datetime
from sqlalchemy import Column, String, Float, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.db.base import Base

class Relationship(Base):
    __tablename__ = "relationships"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    case_id = Column(String(36), ForeignKey("cases.id", ondelete="CASCADE"), nullable=False)
    source_entity_id = Column(String(255), nullable=False) # e.g. ENT-001 or entity name
    target_entity_id = Column(String(255), nullable=False) # e.g. ENT-002 or entity name
    relationship_type = Column(String(100), nullable=False) # e.g. contacted, travelled_to, employed_at
    confidence = Column(Float, nullable=False, default=1.0)
    metadata_json = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    case = relationship("Case", back_populates="relationships")
