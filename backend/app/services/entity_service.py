from typing import List
from sqlalchemy.orm import Session
from app.models.case import Case
from app.models.entity import Entity
from app.schemas.entity import EntityCreate, EntityUpdate, EntityResponse
from app.core.exceptions import AppException

class EntityService:
    @staticmethod
    def get_case_entities(db: Session, case_id_or_human: str) -> List[EntityResponse]:
        case_obj = db.query(Case).filter((Case.id == case_id_or_human) | (Case.human_id == case_id_or_human)).first()
        if not case_obj:
            raise AppException(code="CASE_NOT_FOUND", message=f"Case '{case_id_or_human}' not found", status_code=404)

        entities = db.query(Entity).filter(Entity.case_id == case_obj.id).all()
        return [EntityResponse.model_validate(e) for e in entities]

    @staticmethod
    def get_entity(db: Session, entity_id_or_human: str) -> EntityResponse:
        entity = db.query(Entity).filter(
            (Entity.id == entity_id_or_human) | (Entity.entity_id == entity_id_or_human)
        ).first()
        if not entity:
            raise AppException(code="ENTITY_NOT_FOUND", message=f"Entity '{entity_id_or_human}' not found", status_code=404)
        return EntityResponse.model_validate(entity)

    @staticmethod
    def create_entity(db: Session, entity_in: EntityCreate) -> EntityResponse:
        case_obj = db.query(Case).filter((Case.id == entity_in.case_id) | (Case.human_id == entity_in.case_id)).first()
        if not case_obj:
            raise AppException(code="CASE_NOT_FOUND", message=f"Case '{entity_in.case_id}' not found", status_code=404)

        count = db.query(Entity).filter(Entity.case_id == case_obj.id).count()
        human_ent_id = f"ENT-{count + 1:03d}"

        entity = Entity(
            entity_id=human_ent_id,
            case_id=case_obj.id,
            name=entity_in.name,
            type=entity_in.type.upper(),
            metadata_json=entity_in.metadata or {}
        )
        db.add(entity)
        db.commit()
        db.refresh(entity)
        return EntityResponse.model_validate(entity)

    @staticmethod
    def update_entity(db: Session, entity_id_or_human: str, entity_in: EntityUpdate) -> EntityResponse:
        entity = db.query(Entity).filter(
            (Entity.id == entity_id_or_human) | (Entity.entity_id == entity_id_or_human)
        ).first()
        if not entity:
            raise AppException(code="ENTITY_NOT_FOUND", message=f"Entity '{entity_id_or_human}' not found", status_code=404)

        if entity_in.name is not None:
            entity.name = entity_in.name
        if entity_in.type is not None:
            entity.type = entity_in.type.upper()
        if entity_in.metadata is not None:
            entity.metadata_json = entity_in.metadata

        db.commit()
        db.refresh(entity)
        return EntityResponse.model_validate(entity)
