from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models.case import Case
from app.models.evidence import Evidence
from app.models.entity import Entity
from app.models.timeline import TimelineEvent
from app.schemas.case import CaseCreate, CaseUpdate, CaseResponse
from app.core.exceptions import AppException

class CaseService:
    @staticmethod
    def get_next_case_human_id(db: Session) -> str:
        cases = db.query(Case).all()
        max_num = 100
        for c in cases:
            if c.human_id and c.human_id.startswith("CASE-"):
                try:
                    num = int(c.human_id.replace("CASE-", ""))
                    if num > max_num:
                        max_num = num
                except ValueError:
                    pass
        return f"CASE-{max_num + 1}"

    @staticmethod
    def create_case(db: Session, case_in: CaseCreate) -> CaseResponse:
        human_id = CaseService.get_next_case_human_id(db)
        case_obj = Case(
            human_id=human_id,
            name=case_in.name,
            description=case_in.description,
            investigator=case_in.investigator or "Lead Investigator",
            status=case_in.status or "ACTIVE",
            priority=case_in.priority or "HIGH"
        )
        db.add(case_obj)
        db.commit()
        db.refresh(case_obj)
        return CaseService.build_case_response(db, case_obj)

    @staticmethod
    def get_cases(db: Session) -> List[CaseResponse]:
        cases = db.query(Case).all()
        return [CaseService.build_case_response(db, c) for c in cases]

    @staticmethod
    def get_case(db: Session, case_id: str) -> CaseResponse:
        case_obj = db.query(Case).filter((Case.id == case_id) | (Case.human_id == case_id)).first()
        if not case_obj:
            raise AppException(code="CASE_NOT_FOUND", message=f"Case '{case_id}' was not found", status_code=404)
        return CaseService.build_case_response(db, case_obj)

    @staticmethod
    def update_case(db: Session, case_id: str, case_in: CaseUpdate) -> CaseResponse:
        case_obj = db.query(Case).filter((Case.id == case_id) | (Case.human_id == case_id)).first()
        if not case_obj:
            raise AppException(code="CASE_NOT_FOUND", message=f"Case '{case_id}' was not found", status_code=404)

        if case_in.name is not None:
            case_obj.name = case_in.name
        if case_in.description is not None:
            case_obj.description = case_in.description
        if case_in.investigator is not None:
            case_obj.investigator = case_in.investigator
        if case_in.status is not None:
            case_obj.status = case_in.status
        if case_in.priority is not None:
            case_obj.priority = case_in.priority

        db.commit()
        db.refresh(case_obj)
        return CaseService.build_case_response(db, case_obj)

    @staticmethod
    def delete_case(db: Session, case_id: str) -> dict:
        case_obj = db.query(Case).filter((Case.id == case_id) | (Case.human_id == case_id)).first()
        if not case_obj:
            raise AppException(code="CASE_NOT_FOUND", message=f"Case '{case_id}' was not found", status_code=404)
        db.delete(case_obj)
        db.commit()
        return {"message": f"Case '{case_id}' successfully deleted/archived"}

    @staticmethod
    def build_case_response(db: Session, case_obj: Case) -> CaseResponse:
        evidence_count = db.query(func.count(Evidence.id)).filter(Evidence.case_id == case_obj.id).scalar() or 0
        entity_count = db.query(func.count(Entity.id)).filter(Entity.case_id == case_obj.id).scalar() or 0
        event_count = db.query(func.count(TimelineEvent.id)).filter(TimelineEvent.case_id == case_obj.id).scalar() or 0

        return CaseResponse(
            id=case_obj.id,
            human_id=case_obj.human_id,
            name=case_obj.name,
            description=case_obj.description,
            investigator=case_obj.investigator,
            status=case_obj.status,
            priority=case_obj.priority,
            created_at=case_obj.created_at,
            updated_at=case_obj.updated_at,
            evidence_count=evidence_count,
            entity_count=entity_count,
            event_count=event_count
        )
