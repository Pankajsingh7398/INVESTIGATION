from datetime import datetime
from typing import Optional, Dict, Any
from pydantic import BaseModel, ConfigDict

class EvidenceUploadResponse(BaseModel):
    evidence_id: str
    job_id: str
    status: str
    cloudinary_public_id: Optional[str] = None
    cloudinary_url: Optional[str] = None

class EvidenceResponse(BaseModel):
    id: str
    evidence_id: str
    case_id: str
    file_name: str
    file_type: str
    file_size: str
    uploaded_at: datetime
    sha256: str
    status: str
    extracted_text: Optional[str] = None
    metadata_json: Optional[Dict[str, Any]] = None

    # Cloudinary asset fields
    cloudinary_public_id: Optional[str] = None
    cloudinary_url: Optional[str] = None
    cloudinary_resource_type: Optional[str] = None
    cloudinary_format: Optional[str] = None
    cloudinary_version: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)
