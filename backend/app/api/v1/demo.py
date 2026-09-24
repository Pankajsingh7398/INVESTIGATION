from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.schemas.case import CaseResponse
from app.services.demo_service import DemoService

router = APIRouter(prefix="/demo", tags=["Demo Mode"])

@router.post("/load", response_model=CaseResponse, status_code=status.HTTP_201_CREATED)
def load_demo(db: Session = Depends(get_db)):
    """
    Seeds/Resets Case #102 demo dataset into PostgreSQL / DB.
    Works 100% standalone with zero dependency on external AI services.
    """
    return DemoService.load_demo_dataset(db)
