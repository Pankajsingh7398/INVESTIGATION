from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.core.security import get_current_user, AuthUser
from app.schemas.processing import ProcessingJobResponse, AIResultPayload
from app.services.processing_service import ProcessingService

router = APIRouter(prefix="/processing", tags=["Processing"])

@router.post("/callback", response_model=ProcessingJobResponse)
def handle_ai_callback(
    payload: AIResultPayload,
    db: Session = Depends(get_db)
):
    """
    Endpoint for Khushboo's AI pipeline to post extracted results back to Pankaj's backend.
    Must be declared BEFORE /{evidence_id} route to avoid path parameter matching collision.
    """
    return ProcessingService.apply_ai_result(db, payload)

@router.post("/{evidence_id}", response_model=ProcessingJobResponse)
def trigger_processing(
    evidence_id: str,
    db: Session = Depends(get_db),
    current_user: AuthUser = Depends(get_current_user)
):
    return ProcessingService.trigger_or_retry_processing(db, evidence_id)

@router.get("/{job_id}", response_model=ProcessingJobResponse)
def get_job_status(
    job_id: str,
    db: Session = Depends(get_db),
    current_user: AuthUser = Depends(get_current_user)
):
    return ProcessingService.get_job_status(db, job_id)
