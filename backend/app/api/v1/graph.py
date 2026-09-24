from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.core.security import get_current_user, AuthUser
from app.schemas.graph import GraphResponse
from app.services.graph_service import GraphService

router = APIRouter(prefix="/graph", tags=["Graph"])

@router.get("/{case_id}", response_model=GraphResponse)
def get_case_graph(
    case_id: str,
    db: Session = Depends(get_db),
    current_user: AuthUser = Depends(get_current_user)
):
    return GraphService.get_case_graph(db, case_id)
