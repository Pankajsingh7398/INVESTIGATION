from typing import List, Optional
from fastapi import APIRouter, Depends, UploadFile, File, Form, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.core.security import get_current_user, AuthUser
from app.schemas.evidence import EvidenceUploadResponse, EvidenceResponse
from app.services.evidence_service import EvidenceService

router = APIRouter(prefix="/evidence", tags=["Evidence"])

@router.post("/upload", response_model=EvidenceUploadResponse, status_code=status.HTTP_201_CREATED)
async def upload_evidence(
    case_id: str = Form(...),
    file_type: Optional[str] = Form(None),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: AuthUser = Depends(get_current_user)
):
    return await EvidenceService.upload_evidence(db, case_id, file, file_type)

@router.get("/case/{case_id}", response_model=List[EvidenceResponse])
def get_case_evidence(
    case_id: str,
    db: Session = Depends(get_db),
    current_user: AuthUser = Depends(get_current_user)
):
    return EvidenceService.get_case_evidence(db, case_id)

@router.get("/{evidence_id}", response_model=EvidenceResponse)
def get_evidence_detail(
    evidence_id: str,
    db: Session = Depends(get_db),
    current_user: AuthUser = Depends(get_current_user)
):
    return EvidenceService.get_evidence_detail(db, evidence_id)

@router.delete("/{evidence_id}")
def delete_evidence(
    evidence_id: str,
    db: Session = Depends(get_db),
    current_user: AuthUser = Depends(get_current_user)
):
    return EvidenceService.delete_evidence(db, evidence_id)
