from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.core.security import get_current_user, AuthUser
from app.schemas.assistant import AskRequest, AskResponse
from app.services.assistant_service import AssistantService

router = APIRouter(tags=["AI Assistant"])

@router.post("/assistant/ask", response_model=AskResponse)
@router.post("/ask", response_model=AskResponse)
async def ask_question(
    ask_in: AskRequest,
    db: Session = Depends(get_db),
    current_user: AuthUser = Depends(get_current_user)
):
    return await AssistantService.ask_question(db, ask_in)
