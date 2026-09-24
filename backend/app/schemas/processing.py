from datetime import datetime
from typing import Optional, Dict, Any, List
from pydantic import BaseModel, ConfigDict

class ProcessingJobResponse(BaseModel):
    id: str
    job_id: str
    evidence_id: str
    status: str
    error_info: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

class AIResultPayload(BaseModel):
    job_id: str
    status: str
    extracted_text: Optional[str] = None
    entities: Optional[List[Dict[str, Any]]] = []
    relationships: Optional[List[Dict[str, Any]]] = []
    events: Optional[List[Dict[str, Any]]] = []
    error_info: Optional[str] = None
