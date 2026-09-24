# EvidenceGraph AI — Backend & Database (Pankaj's Scope)

**SIH 2026 | Problem Statement ID:** SIH26194  
**Title:** AI-Assisted Digital Evidence Intelligence  
**Role:** Pankaj — FastAPI Backend, PostgreSQL Database, Cloudinary Asset Integration & Storage Gateway  

---

## 🚀 Scope Overview

Pankaj's backend provides the robust data layer, PostgreSQL structured application storage, Cloudinary evidence asset storage, cryptographic verification, processing job lifecycle, and clean integration gateways for **EvidenceGraph AI**.

### Implemented Functionality
1. **FastAPI Application & Routing:** Thin, clean routes with service-repository layer separation.
2. **PostgreSQL Primary Database:** Relational models for Users, Cases, Evidence, Processing Jobs, Entities, Relationships, Timeline Events, Chain of Custody, and AI Queries/Citations.
3. **Cloudinary Asset Storage Service (`app/services/cloudinary_service.py`):** Dedicated binary evidence storage layer for images, videos, PDFs, audio, and documents.
4. **Original File Integrity & SHA-256:** Cryptographic SHA-256 hashing computed from the **ORIGINAL uploaded file BEFORE any transformation**, stored in PostgreSQL.
5. **Database Transaction Safety:** If PostgreSQL insert fails after Cloudinary upload, the newly uploaded asset is automatically cleaned up and database transactions roll back.
6. **Configurable File Size & Upload Limits:** Enforces configurable limits (`MAX_UPLOAD_SIZE_MB=50`) and rejects oversized/invalid files.
7. **Safe Delete Flow:** Authorization check → PostgreSQL lookup → Cloudinary deletion via `cloudinary_service` → DB record deletion/archive & custody record update.
8. **Alembic Database Migrations:** Schema migrations including Cloudinary metadata columns (`cloudinary_public_id`, `cloudinary_url`, `cloudinary_resource_type`, `cloudinary_format`, `cloudinary_version`).
9. **Case Management APIs:** Full CRUD + aggregated stats (`evidence_count`, `entity_count`, `event_count`).
10. **Chain of Custody Tracking:** Audit trail with status verification badges ("Uploaded", "SHA-256 Generated", "Cloudinary Stored", "Processed", "Verified").
11. **Processing Job Management:** Non-blocking async job creation (`JOB-1001`), state transitions, failure handling with error preservation.
12. **Entity & Relationship Persistence:** Structured storage for extracted entities (`PERSON`, `LOCATION`, `ORGANIZATION`, `EVENT`, `OTHER`) and entity-relationship confidence edges.
13. **Timeline & Graph APIs:** Chronological event retrieval and PostgreSQL-driven node-edge graph format for React Flow frontend rendering.
14. **AI Gateway Interface (`app/services/ai_gateway.py`):** Clean integration boundary for Khushboo's external AI/ML pipeline.
15. **Clerk-Compatible Auth & RBAC Layer:** User identity parsing and role checking (`INVESTIGATOR`, `ADMIN`, `VIEWER`).
16. **Deterministic Demo Backend Mode:** `POST /api/v1/demo/load` seeds/resets Case #102 (*Operation Paper Trail*) with 12 evidence items, 31 entities, 18 timeline events, and 42 relationships for offline judging.
17. **Pytest Suite:** 7/7 passing unit & integration tests covering all backend responsibilities with mocked Cloudinary SDK calls.

---

## 🛠️ Tech Stack
- **Framework:** FastAPI
- **Primary Database:** PostgreSQL (with SQLite fallback for local quick-start)
- **Binary File Storage:** Cloudinary (SDK `cloudinary>=1.40.0` with local storage fallback)
- **ORM & Migrations:** SQLAlchemy 2.0 + Alembic
- **Validation:** Pydantic v2
- **File Handling & Multipart:** `python-multipart` + Local filesystem (`./uploads`)
- **HTTP Client:** `httpx`
- **Testing:** `pytest` (with mocked Cloudinary tests)
- **Auth:** Clerk-compatible headers / JWT verification

---

## 📂 Project Structure

```
backend/
├── app/
│   ├── main.py                # FastAPI entry point & CORS configuration
│   ├── api/v1/                # Endpoint controllers (cases, evidence, graph, etc.)
│   ├── core/                  # Configuration, security/auth & error handlers
│   ├── db/                    # SQLAlchemy engine, sessions & base models
│   ├── models/                # Database entities (Case, Evidence, Entity, Custody, etc.)
│   ├── schemas/               # Pydantic v2 request/response schemas
│   ├── services/              # Business logic (CaseService, EvidenceService, CloudinaryService, AIGateway, etc.)
│   └── storage/               # FileStore helper & SHA-256 generator
├── tests/                     # Pytest suite with Cloudinary unit tests
├── uploads/                   # Temporary local evidence storage directory
├── alembic/                   # Alembic database migration scripts
├── .env                       # Environment configuration
├── requirements.txt           # Python dependencies
└── README.md
```

---

## 📡 Key API Endpoints

### Case Management
- `POST /api/v1/cases` — Create a new case
- `GET /api/v1/cases` — List all cases with evidence/entity/event counts
- `GET /api/v1/cases/{case_id}` — Get single case details
- `PUT /api/v1/cases/{case_id}` — Update case details
- `DELETE /api/v1/cases/{case_id}` — Archive/delete case

### Evidence Management
- `POST /api/v1/evidence/upload` — Upload evidence file to Cloudinary & calculate SHA-256 (returns `evidence_id`, `job_id`, `status: PROCESSING`, `cloudinary_url`, `cloudinary_public_id`)
- `GET /api/v1/evidence/case/{case_id}` — List all evidence for a case
- `GET /api/v1/evidence/{evidence_id}` — Evidence detail, SHA-256 hash & Cloudinary URL
- `DELETE /api/v1/evidence/{evidence_id}` — Safely delete asset from Cloudinary & DB

### Processing & AI Callback
- `POST /api/v1/processing/{evidence_id}` — Retry or trigger processing
- `GET /api/v1/processing/{job_id}` — Processing job status
- `POST /api/v1/processing/callback` — Ingest extracted AI results from Khushboo's pipeline

### Entities, Graph & Timeline
- `GET /api/v1/entities/{case_id}` — List entities for a case
- `GET /api/v1/relationships/{case_id}` — List entity relationships
- `GET /api/v1/graph/{case_id}` — Graph nodes & edges for React Flow
- `GET /api/v1/timeline/{case_id}` — Chronological timeline events

### Chain of Custody & AI Assistant
- `GET /api/v1/custody/{evidence_id}` — Chain of custody audit records & verification
- `POST /api/v1/assistant/ask` — Ask AI Assistant evidence-backed question

### Demo Dataset
- `POST /api/v1/demo/load` — Loads Case #102 demo dataset instantly

---

## ⚡ How to Run Locally

### 1. Set Up Virtual Environment & Dependencies
```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### 2. Configure Cloudinary Credentials (`.env`)
```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
MAX_UPLOAD_SIZE_MB=50
```

### 3. Run Database Migrations (PostgreSQL)
```bash
alembic upgrade head
```

### 4. Start Development Server
```bash
uvicorn app.main:app --reload --port 8000
```

### 5. Run Pytest Suite
```bash
pytest -v
```
