import uuid
from datetime import datetime
from sqlalchemy import Column, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base import Base

class ChainOfCustody(Base):
    __tablename__ = "chain_of_custody"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    evidence_id = Column(String(36), ForeignKey("evidence.id", ondelete="CASCADE"), nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)
    action = Column(String(100), nullable=False) # e.g. Uploaded, SHA-256 Generated, Processed, Investigator Reviewed
    actor = Column(String(255), nullable=False, default="System")
    sha256_hash = Column(String(64), nullable=False)
    status = Column(String(50), nullable=False, default="VERIFIED")
    details = Column(Text, nullable=True)

    evidence = relationship("Evidence", back_populates="custody_records")
