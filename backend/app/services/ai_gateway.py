import logging
import httpx
from typing import Dict, Any, Optional
from app.core.config import settings

logger = logging.getLogger(__name__)

class AIGatewayService:
    """
    Clean interface/gateway for Khushboo's AI service.
    Pankaj's backend ONLY dispatches payloads and handles structured responses.
    Does NOT execute OCR, NER, NLP, RAG, or LLM logic locally.
    """
    @staticmethod
    async def dispatch_processing_job(
        job_id: str,
        case_id: str,
        evidence_id: str,
        file_path: str,
        file_hash: str
    ) -> Optional[Dict[str, Any]]:
        payload = {
            "job_id": job_id,
            "case_id": case_id,
            "evidence_id": evidence_id,
            "file_url": file_path,
            "file_hash": file_hash
        }
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.post(
                    f"{settings.AI_SERVICE_URL}/process",
                    json=payload
                )
                if response.status_code == 200:
                    return response.json()
                logger.warning(f"AI Service returned status code {response.status_code}")
        except Exception as e:
            logger.info(f"AI Service currently unreachable at {settings.AI_SERVICE_URL} ({e}). Processing job queued.")
        return None

    @staticmethod
    async def forward_assistant_question(case_id: str, question: str) -> Optional[Dict[str, Any]]:
        payload = {
            "case_id": case_id,
            "question": question
        }
        try:
            async with httpx.AsyncClient(timeout=15.0) as client:
                response = await client.post(
                    f"{settings.AI_SERVICE_URL}/ask",
                    json=payload
                )
                if response.status_code == 200:
                    return response.json()
        except Exception as e:
            logger.info(f"AI Assistant service unreachable at {settings.AI_SERVICE_URL} ({e}). Falling back to evidence-grounded DB response.")
        return None
