from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.core.security import get_current_user, AuthUser
from app.schemas.custody import CustodyRecordResponse
from app.services.custody_service import CustodyService

router = APIRouter(prefix="/custody", tags=["Chain of Custody"])

@router.get("/{evidence_id}", response_model=List[CustodyRecordResponse])
def get_evidence_custody(
    evidence_id: str,
    db: Session = Depends(get_db),
    current_user: AuthUser = Depends(get_current_user)
):
    return CustodyService.get_evidence_custody(db, evidence_id)
