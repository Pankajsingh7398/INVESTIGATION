from typing import List
from sqlalchemy.orm import Session
from app.models.evidence import Evidence
from app.models.custody import ChainOfCustody
from app.schemas.custody import CustodyRecordResponse
from app.core.exceptions import AppException

class CustodyService:
    @staticmethod
    def get_evidence_custody(db: Session, evidence_id_or_human: str) -> List[CustodyRecordResponse]:
        evidence = db.query(Evidence).filter(
            (Evidence.id == evidence_id_or_human) | (Evidence.evidence_id == evidence_id_or_human)
        ).first()
        if not evidence:
            raise AppException(code="EVIDENCE_NOT_FOUND", message=f"Evidence '{evidence_id_or_human}' not found", status_code=404)

        records = db.query(ChainOfCustody).filter(ChainOfCustody.evidence_id == evidence.id).order_by(ChainOfCustody.timestamp.asc()).all()

        return [
            CustodyRecordResponse(
                id=r.id,
                evidence_id=evidence.evidence_id,
                timestamp=r.timestamp,
                action=r.action,
                actor=r.actor,
                sha256_hash=r.sha256_hash,
                status=r.status,
                details=r.details
            )
            for r in records
        ]
