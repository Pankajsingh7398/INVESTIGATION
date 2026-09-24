from typing import List, Optional, Dict, Any
from pydantic import BaseModel

class AskRequest(BaseModel):
    case_id: str
    question: str

class AskResponse(BaseModel):
    answer: str
    entities: List[str] = []
    relationships: List[Dict[str, Any]] = []
    events: List[Dict[str, Any]] = []
    supporting_evidence: List[str] = []
    confidence: float = 0.91
