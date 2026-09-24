from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.core.security import get_current_user, AuthUser
from app.schemas.case import CaseCreate, CaseUpdate, CaseResponse
from app.services.case_service import CaseService

router = APIRouter(prefix="/cases", tags=["Cases"])

@router.post("", response_model=CaseResponse, status_code=status.HTTP_201_CREATED)
def create_case(
    case_in: CaseCreate,
    db: Session = Depends(get_db),
    current_user: AuthUser = Depends(get_current_user)
):
    return CaseService.create_case(db, case_in)

@router.get("", response_model=List[CaseResponse])
def list_cases(
    db: Session = Depends(get_db),
    current_user: AuthUser = Depends(get_current_user)
):
    return CaseService.get_cases(db)

@router.get("/{case_id}", response_model=CaseResponse)
def get_case_detail(
    case_id: str,
    db: Session = Depends(get_db),
    current_user: AuthUser = Depends(get_current_user)
):
    return CaseService.get_case(db, case_id)

@router.put("/{case_id}", response_model=CaseResponse)
def update_case(
    case_id: str,
    case_in: CaseUpdate,
    db: Session = Depends(get_db),
    current_user: AuthUser = Depends(get_current_user)
):
    return CaseService.update_case(db, case_id, case_in)

@router.delete("/{case_id}")
def delete_case(
    case_id: str,
    db: Session = Depends(get_db),
    current_user: AuthUser = Depends(get_current_user)
):
    return CaseService.delete_case(db, case_id)
