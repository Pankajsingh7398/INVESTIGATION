from datetime import datetime
from typing import Optional, Dict, Any
from pydantic import BaseModel, ConfigDict

class EntityCreate(BaseModel):
    case_id: str
    name: str
    type: str # PERSON, LOCATION, ORGANIZATION, EVENT, OTHER
    metadata: Optional[Dict[str, Any]] = None

class EntityUpdate(BaseModel):
    name: Optional[str] = None
    type: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None

class EntityResponse(BaseModel):
    id: str
    entity_id: Optional[str] = None
    case_id: str
    name: str
    type: str
    metadata_json: Optional[Dict[str, Any]] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
