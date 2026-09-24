from sqlalchemy.orm import Session
from app.models.case import Case
from app.models.entity import Entity
from app.models.relationship import Relationship
from app.schemas.graph import GraphResponse, GraphNode, GraphEdge
from app.core.exceptions import AppException

class GraphService:
    @staticmethod
    def get_case_graph(db: Session, case_id_or_human: str) -> GraphResponse:
        case_obj = db.query(Case).filter((Case.id == case_id_or_human) | (Case.human_id == case_id_or_human)).first()
        if not case_obj:
            raise AppException(code="CASE_NOT_FOUND", message=f"Case '{case_id_or_human}' not found", status_code=404)

        entities = db.query(Entity).filter(Entity.case_id == case_obj.id).all()
        relationships = db.query(Relationship).filter(Relationship.case_id == case_obj.id).all()

        # Build bidirectional map to translate name / UUID / entity_id to canonical node ID
        id_map = {}
        nodes = []
        for e in entities:
            node_id = e.entity_id or e.name or e.id
            nodes.append(
                GraphNode(
                    id=node_id,
                    type=e.type,
                    label=e.name,
                    metadata=e.metadata_json or {}
                )
            )
            id_map[e.id] = node_id
            if e.entity_id:
                id_map[e.entity_id] = node_id
            if e.name:
                id_map[e.name] = node_id

        edges = []
        for r in relationships:
            src_id = id_map.get(r.source_entity_id, r.source_entity_id)
            tgt_id = id_map.get(r.target_entity_id, r.target_entity_id)
            
            try:
                conf = float(r.confidence) if r.confidence is not None else 0.95
            except (ValueError, TypeError):
                conf = 0.95

            edges.append(
                GraphEdge(
                    source=src_id,
                    target=tgt_id,
                    relationship=r.relationship_type,
                    confidence=conf,
                    metadata=r.metadata_json or {}
                )
            )

        return GraphResponse(nodes=nodes, edges=edges)
