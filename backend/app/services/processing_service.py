from sqlalchemy.orm import Session
from app.models.evidence import Evidence, EvidenceProcessing
from app.models.entity import Entity
from app.models.relationship import Relationship
from app.models.timeline import TimelineEvent
from app.models.custody import ChainOfCustody
from app.schemas.processing import ProcessingJobResponse, AIResultPayload
from app.core.exceptions import AppException

class ProcessingService:
    @staticmethod
    def get_job_status(db: Session, job_id_or_human: str) -> ProcessingJobResponse:
        job = db.query(EvidenceProcessing).filter(
            (EvidenceProcessing.id == job_id_or_human) | (EvidenceProcessing.job_id == job_id_or_human)
        ).first()
        if not job:
            raise AppException(code="JOB_NOT_FOUND", message=f"Job '{job_id_or_human}' not found", status_code=404)
        return ProcessingJobResponse.model_validate(job)

    @staticmethod
    def trigger_or_retry_processing(db: Session, evidence_id_or_human: str) -> ProcessingJobResponse:
        evidence = db.query(Evidence).filter(
            (Evidence.id == evidence_id_or_human) | (Evidence.evidence_id == evidence_id_or_human)
        ).first()
        if not evidence:
            raise AppException(code="EVIDENCE_NOT_FOUND", message=f"Evidence '{evidence_id_or_human}' not found", status_code=404)

        # Reset/Create job
        job_count = db.query(EvidenceProcessing).count()
        new_job_id = f"JOB-{1000 + job_count + 1}"
        job = EvidenceProcessing(
            job_id=new_job_id,
            evidence_id=evidence.id,
            status="PROCESSING"
        )
        evidence.status = "PROCESSING"
        db.add(job)
        db.commit()
        db.refresh(job)
        return ProcessingJobResponse.model_validate(job)

    @staticmethod
    def apply_ai_result(db: Session, payload: AIResultPayload) -> ProcessingJobResponse:
        job = db.query(EvidenceProcessing).filter(
            (EvidenceProcessing.id == payload.job_id) | (EvidenceProcessing.job_id == payload.job_id)
        ).first()
        if not job:
            raise AppException(code="JOB_NOT_FOUND", message=f"Processing job '{payload.job_id}' not found", status_code=404)

        evidence = db.query(Evidence).filter(Evidence.id == job.evidence_id).first()

        if payload.status == "FAILED":
            job.status = "FAILED"
            job.error_info = payload.error_info or "AI Processing failed during analysis"
            if evidence:
                evidence.status = "FAILED"
            db.commit()
            db.refresh(job)
            return ProcessingJobResponse.model_validate(job)

        # 1. Update text if provided
        if payload.extracted_text and evidence:
            evidence.extracted_text = payload.extracted_text

        # 2. Store extracted entities
        if payload.entities and evidence:
            for ent_data in payload.entities:
                name = ent_data.get("name") or ent_data.get("label")
                ent_type = ent_data.get("type", "OTHER").upper()
                if name:
                    entity = Entity(
                        case_id=evidence.case_id,
                        name=name,
                        type=ent_type,
                        metadata_json=ent_data.get("metadata", {})
                    )
                    db.add(entity)

        # 3. Store extracted relationships
        if payload.relationships and evidence:
            for rel_data in payload.relationships:
                rel = Relationship(
                    case_id=evidence.case_id,
                    source_entity_id=rel_data.get("source"),
                    target_entity_id=rel_data.get("target"),
                    relationship_type=rel_data.get("relationship", "associated_with"),
                    confidence=float(rel_data.get("confidence", 0.9)),
                    metadata_json=rel_data.get("metadata", {})
                )
                db.add(rel)

        # 4. Store timeline events
        if payload.events and evidence:
            for ev_data in payload.events:
                event = TimelineEvent(
                    case_id=evidence.case_id,
                    date=ev_data.get("date", "2026-01-01"),
                    event_title=ev_data.get("event") or ev_data.get("event_title", "Extracted Event"),
                    description=ev_data.get("description", ""),
                    entities=ev_data.get("entities", []),
                    evidence_refs=[evidence.evidence_id]
                )
                db.add(event)

        # 5. Update Statuses & Custody
        job.status = "COMPLETED"
        if evidence:
            evidence.status = "COMPLETED"
            custody = ChainOfCustody(
                evidence_id=evidence.id,
                action="Processed & Verified by AI Pipeline",
                actor="AI Processing Gateway",
                sha256_hash=evidence.sha256,
                status="COMPLETED",
                details="Extracted entities, relationships, and timeline markers attached."
            )
            db.add(custody)

        db.commit()
        db.refresh(job)
        return ProcessingJobResponse.model_validate(job)
