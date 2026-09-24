from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict

class CaseCreate(BaseModel):
    name: str
    description: Optional[str] = None
    investigator: Optional[str] = "Lead Investigator"
    status: Optional[str] = "ACTIVE"
    priority: Optional[str] = "HIGH"

class CaseUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    investigator: Optional[str] = None
    status: Optional[str] = None
    priority: Optional[str] = None

class CaseResponse(BaseModel):
    id: str
    human_id: str
    name: str
    description: Optional[str] = None
    investigator: str
    status: str
    priority: str
    created_at: datetime
    updated_at: datetime
    evidence_count: int = 0
    entity_count: int = 0
    event_count: int = 0

    model_config = ConfigDict(from_attributes=True)
