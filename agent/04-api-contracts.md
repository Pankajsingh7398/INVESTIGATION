# Expected API Contracts (from Pankaj / Khushboo)

Build your `lib/api/` fetch wrappers and mock fixtures to match these shapes
exactly, so swapping mock → real API is a non-event.

## Cases
- `POST /cases` — create case
- `GET /cases` — list all cases
- `GET /cases/{case_id}` — full case info
- `PUT /cases/{case_id}` — update
- `DELETE /cases/{case_id}` — archive/delete

## Evidence
- `POST /evidence/upload` — upload evidence
- `GET /evidence/{case_id}` — list evidence for a case
- `GET /evidence/item/{evidence_id}` — single evidence detail
- `DELETE /evidence/{evidence_id}` — remove/archive

Evidence metadata shape:
```json
{
  "evidence_id": "EV-004",
  "file_name": "WhatsApp_Image.png",
  "file_type": "Image",
  "file_size": "2.4 MB",
  "uploaded_at": "2026-09-15T10:32:00Z",
  "sha256": "8f91a72...",
  "status": "PROCESSED"
}
```

## Entities
- `GET /entities/{case_id}` — all entities for a case
- `GET /entities/{entity_id}` — entity detail
- `POST /entities` / `PUT /entities/{entity_id}`

Entity types: `PERSON, LOCATION, ORGANIZATION, EVENT, OTHER`

## Graph
- `GET /graph/{case_id}` — nodes + edges for the Entity Graph screen
```json
{
  "nodes": [{ "id": "...", "type": "PERSON", "label": "Rahul", "metadata": {} }],
  "edges": [{ "source": "...", "target": "...", "relationship": "contacted", "confidence": 0.89 }]
}
```

## Timeline
- `GET /timeline/{case_id}`
```json
[
  { "date": "2026-08-12", "event": "Contact", "entities": ["Rahul", "Amit"], "evidence": ["EV-03"] }
]
```

## AI Assistant
- `POST /ask` — body: `{ "case_id": "...", "question": "..." }`
```json
{
  "answer": "...",
  "entities": [],
  "relationships": [],
  "events": [],
  "supporting_evidence": [],
  "confidence": 0.91
}
```

## Error shapes to design for
- `404` Case not found
- `400` Invalid evidence format
- `401` Authentication required
- `403` Permission denied
- `500` Internal server error

Build empty/error UI states for every one of these — don't only design the
happy path.

## Demo/mock data to build fixtures around
**Case #102 — Financial Fraud Investigation:** 12 evidence files, 31 entities,
18 events, 42 relationships. Example entities: Rahul, Amit, Delhi, Mumbai, ABC
Company. Example relationship: `Rahul → contacted → Amit → travelled_to →
Delhi`. Build a "Load Demo Investigation" button that loads this instantly —
the whole demo must work with **zero dependency on live backend/AI services**.
