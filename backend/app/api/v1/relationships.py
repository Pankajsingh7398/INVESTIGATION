from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.core.security import get_current_user, AuthUser
from app.schemas.relationship import RelationshipCreate, RelationshipResponse
from app.services.relationship_service import RelationshipService

router = APIRouter(prefix="/relationships", tags=["Relationships"])

@router.get("/{case_id}", response_model=List[RelationshipResponse])
def get_case_relationships(
    case_id: str,
    db: Session = Depends(get_db),
    current_user: AuthUser = Depends(get_current_user)
):
    return RelationshipService.get_case_relationships(db, case_id)

@router.post("", response_model=RelationshipResponse, status_code=status.HTTP_201_CREATED)
def create_relationship(
    rel_in: RelationshipCreate,
    db: Session = Depends(get_db),
    current_user: AuthUser = Depends(get_current_user)
):
    return RelationshipService.create_relationship(db, rel_in)
