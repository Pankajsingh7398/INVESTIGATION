from typing import List
from sqlalchemy.orm import Session
from app.models.case import Case
from app.models.timeline import TimelineEvent
from app.schemas.timeline import TimelineEventCreate, TimelineEventResponse
from app.core.exceptions import AppException

class TimelineService:
    @staticmethod
    def get_case_timeline(db: Session, case_id_or_human: str) -> List[TimelineEventResponse]:
        case_obj = db.query(Case).filter((Case.id == case_id_or_human) | (Case.human_id == case_id_or_human)).first()
        if not case_obj:
            raise AppException(code="CASE_NOT_FOUND", message=f"Case '{case_id_or_human}' not found", status_code=404)

        events = db.query(TimelineEvent).filter(TimelineEvent.case_id == case_obj.id).order_by(TimelineEvent.date.asc()).all()

        results = []
        for ev in events:
            results.append(TimelineEventResponse(
                id=ev.id,
                date=ev.date,
                event=ev.event_title,
                description=ev.description,
                entities=ev.entities or [],
                evidence=ev.evidence_refs or []
            ))
        return results

    @staticmethod
    def create_timeline_event(db: Session, event_in: TimelineEventCreate) -> TimelineEventResponse:
        case_obj = db.query(Case).filter((Case.id == event_in.case_id) | (Case.human_id == event_in.case_id)).first()
        if not case_obj:
            raise AppException(code="CASE_NOT_FOUND", message=f"Case '{event_in.case_id}' not found", status_code=404)

        ev = TimelineEvent(
            case_id=case_obj.id,
            date=event_in.date,
            event_title=event_in.event,
            description=event_in.description,
            entities=event_in.entities or [],
            evidence_refs=event_in.evidence or []
        )
        db.add(ev)
        db.commit()
        db.refresh(ev)
        return TimelineEventResponse(
            id=ev.id,
            date=ev.date,
            event=ev.event_title,
            description=ev.description,
            entities=ev.entities or [],
            evidence=ev.evidence_refs or []
        )
