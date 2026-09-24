from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.core.security import get_current_user, AuthUser
from app.schemas.timeline import TimelineEventCreate, TimelineEventResponse
from app.services.timeline_service import TimelineService

router = APIRouter(prefix="/timeline", tags=["Timeline"])

@router.get("/{case_id}", response_model=List[TimelineEventResponse])
def get_case_timeline(
    case_id: str,
    db: Session = Depends(get_db),
    current_user: AuthUser = Depends(get_current_user)
):
    return TimelineService.get_case_timeline(db, case_id)

@router.post("", response_model=TimelineEventResponse, status_code=status.HTTP_201_CREATED)
def create_timeline_event(
    event_in: TimelineEventCreate,
    db: Session = Depends(get_db),
    current_user: AuthUser = Depends(get_current_user)
):
    return TimelineService.create_timeline_event(db, event_in)
