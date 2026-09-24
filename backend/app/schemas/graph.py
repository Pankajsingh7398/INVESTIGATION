from typing import List, Dict, Any, Optional
from pydantic import BaseModel

class GraphNode(BaseModel):
    id: str
    type: str
    label: str
    metadata: Optional[Dict[str, Any]] = {}

class GraphEdge(BaseModel):
    source: str
    target: str
    relationship: str
    confidence: float = 1.0
    metadata: Optional[Dict[str, Any]] = {}

class GraphResponse(BaseModel):
    nodes: List[GraphNode]
    edges: List[GraphEdge]
