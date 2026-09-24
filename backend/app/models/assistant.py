import uuid
from datetime import datetime
from sqlalchemy import Column, String, Text, Float, DateTime, ForeignKey, JSON
from app.db.base import Base

class AIQuery(Base):
    __tablename__ = "ai_queries"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    case_id = Column(String(36), ForeignKey("cases.id", ondelete="CASCADE"), nullable=False)
    question = Column(Text, nullable=False)
    answer = Column(Text, nullable=False)
    confidence = Column(Float, nullable=False, default=0.9)
    entities = Column(JSON, nullable=True)
    relationships = Column(JSON, nullable=True)
    events = Column(JSON, nullable=True)
    supporting_evidence = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class AICitation(Base):
    __tablename__ = "ai_citations"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    query_id = Column(String(36), ForeignKey("ai_queries.id", ondelete="CASCADE"), nullable=False)
    evidence_id = Column(String(50), nullable=False)
    relevance_score = Column(Float, nullable=False, default=1.0)
