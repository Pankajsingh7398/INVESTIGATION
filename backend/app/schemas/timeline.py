from typing import Optional, List
from pydantic import BaseModel, ConfigDict, Field

class TimelineEventCreate(BaseModel):
    case_id: str
    date: str
    event: str = Field(..., alias="event_title")
    description: Optional[str] = None
    entities: Optional[List[str]] = []
    evidence: Optional[List[str]] = []

class TimelineEventResponse(BaseModel):
    id: str
    date: str
    event: str
    description: Optional[str] = None
    entities: List[str] = []
    evidence: List[str] = []

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)
