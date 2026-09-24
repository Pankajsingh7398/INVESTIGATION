from datetime import datetime
from typing import Optional, Dict, Any
from pydantic import BaseModel, ConfigDict

class RelationshipCreate(BaseModel):
    case_id: str
    source_entity: str
    target_entity: str
    relationship_type: str
    confidence: Optional[float] = 1.0
    metadata: Optional[Dict[str, Any]] = None

class RelationshipResponse(BaseModel):
    id: str
    case_id: str
    source_entity_id: str
    target_entity_id: str
    relationship_type: str
    confidence: float
    metadata_json: Optional[Dict[str, Any]] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
