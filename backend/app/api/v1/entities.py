from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.core.security import get_current_user, AuthUser
from app.schemas.entity import EntityCreate, EntityUpdate, EntityResponse
from app.services.entity_service import EntityService

router = APIRouter(prefix="/entities", tags=["Entities"])

@router.get("/{case_id}", response_model=List[EntityResponse])
def list_case_entities(
    case_id: str,
    db: Session = Depends(get_db),
    current_user: AuthUser = Depends(get_current_user)
):
    return EntityService.get_case_entities(db, case_id)

@router.get("/item/{entity_id}", response_model=EntityResponse)
def get_entity_detail(
    entity_id: str,
    db: Session = Depends(get_db),
    current_user: AuthUser = Depends(get_current_user)
):
    return EntityService.get_entity(db, entity_id)

@router.post("", response_model=EntityResponse, status_code=status.HTTP_201_CREATED)
def create_entity(
    entity_in: EntityCreate,
    db: Session = Depends(get_db),
    current_user: AuthUser = Depends(get_current_user)
):
    return EntityService.create_entity(db, entity_in)

@router.put("/{entity_id}", response_model=EntityResponse)
def update_entity(
    entity_id: str,
    entity_in: EntityUpdate,
    db: Session = Depends(get_db),
    current_user: AuthUser = Depends(get_current_user)
):
    return EntityService.update_entity(db, entity_id, entity_in)
