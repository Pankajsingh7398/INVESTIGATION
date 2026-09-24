from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict

class CustodyRecordResponse(BaseModel):
    id: str
    evidence_id: str
    timestamp: datetime
    action: str
    actor: str
    sha256_hash: str
    status: str
    details: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)
