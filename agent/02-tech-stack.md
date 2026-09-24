# Tech Stack

## Frontend (your stack)
| Layer | Choice |
|---|---|
| Framework | Next.js (React) |
| Styling | Tailwind CSS |
| Graph visualization | React Flow (or similar graph lib) |
| Charts/timeline | A charting lib as needed (e.g. Recharts) — keep light |
| Auth | Clerk (SSO, RBAC) |
| State/data fetching | Native fetch / React Query (optional) |

## Backend & AI (not yours, but you integrate against these)
| Layer | Owner | Tech |
|---|---|---|
| Backend API | Pankaj | Python + FastAPI |
| Database | Pankaj | PostgreSQL (+ pgvector for RAG later) |
| Auth backend | Pankaj (shared w/ Clerk) | Clerk + RBAC |
| AI services | Khushboo | Python — OCR (Tesseract/EasyOCR), NLP (spaCy/transformers), LLM (local or API) |
| Graph DB (later) | Pankaj/infra | Neo4j (P2, not MVP) |
| File storage | Pankaj | Local for MVP, S3-compatible later |

## Full recommended stack (reference / long-term vision)
From the architecture poster — useful context, not all of it is MVP scope:
Frontend: Next.js/React · Mobile: React/PWA · Auth: Clerk · Backend: FastAPI ·
DB: PostgreSQL · Vector DB: pgvector · Graph DB: PostgreSQL/Neo4j · File
storage: MinIO/S3 · Search: OpenSearch · OCR: Tesseract/EasyOCR · NLP:
spaCy/Transformers · Speech-to-text: Whisper · LLM/RAG: Llama/Mistral/OpenAI ·
Containerization: Docker · Orchestration: Kubernetes/Docker Compose ·
Monitoring: Prometheus+Grafana · CI/CD: GitHub Actions.

**MVP note:** Whisper, Neo4j, OpenSearch, Kubernetes, full monitoring stack
are all P1/P2 — do not build against them for the hackathon MVP.

## Your build tooling
- `create-next-app` with Tailwind preset
- Component-driven: build the shared design system first (Navbar, Sidebar,
  Button, Card, Modal, Table, Badge, Alert, StatCard, FileUploader,
  EvidenceCard, TimelineItem, GraphNode, SearchBar, Filter, Loading/Empty/
  Error states, Notification)
- Mock data layer first (JSON fixtures matching the real API shapes) so UI
  work never blocks on backend completion
