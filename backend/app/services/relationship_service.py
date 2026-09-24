from typing import List
from sqlalchemy.orm import Session
from app.models.case import Case
from app.models.relationship import Relationship
from app.schemas.relationship import RelationshipCreate, RelationshipResponse
from app.core.exceptions import AppException

class RelationshipService:
    @staticmethod
    def get_case_relationships(db: Session, case_id_or_human: str) -> List[RelationshipResponse]:
        case_obj = db.query(Case).filter((Case.id == case_id_or_human) | (Case.human_id == case_id_or_human)).first()
        if not case_obj:
            raise AppException(code="CASE_NOT_FOUND", message=f"Case '{case_id_or_human}' not found", status_code=404)

        rel_items = db.query(Relationship).filter(Relationship.case_id == case_obj.id).all()
        return [RelationshipResponse.model_validate(r) for r in rel_items]

    @staticmethod
    def create_relationship(db: Session, rel_in: RelationshipCreate) -> RelationshipResponse:
        case_obj = db.query(Case).filter((Case.id == rel_in.case_id) | (Case.human_id == rel_in.case_id)).first()
        if not case_obj:
            raise AppException(code="CASE_NOT_FOUND", message=f"Case '{rel_in.case_id}' not found", status_code=404)

        rel = Relationship(
            case_id=case_obj.id,
            source_entity_id=rel_in.source_entity,
            target_entity_id=rel_in.target_entity,
            relationship_type=rel_in.relationship_type,
            confidence=rel_in.confidence or 1.0,
            metadata_json=rel_in.metadata or {}
        )
        db.add(rel)
        db.commit()
        db.refresh(rel)
        return RelationshipResponse.model_validate(rel)
