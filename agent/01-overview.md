# EvidenceGraph AI — Frontend (Alok's Scope)

**SIH 2026 | Problem Statement ID:** SIH26194
**Title:** AI-Assisted Digital Evidence Intelligence
**Theme:** Cybersecurity & Digital Forensics
**Team:** Team Stark

## What the product does
EvidenceGraph AI ingests scattered digital evidence (documents, images, chats,
logs) and helps investigators:
- See everything in one place (case + evidence management)
- Discover hidden connections (entity/relationship graph)
- Reconstruct chronology (timeline)
- Ask questions and get evidence-grounded answers (AI Investigation Assistant)
- Trust the output (chain of custody, SHA-256 hashing, source citations)

## Your role (Alok)
Full Stack + UI/UX. **Primary owner of the EvidenceGraph AI frontend.**
You also own the shared design system, final PPT visual design, and demo
integration. You do **not** own DoSJE frontend (Yagyesh does) — you only
support it with shared components.

## Team split (for context)
| Member | Owns |
|---|---|
| **Alok (you)** | EvidenceGraph frontend, UI/UX, design system, PPT visuals |
| Pankaj | EvidenceGraph backend + database (FastAPI + PostgreSQL) |
| Khushboo | AI/ML pipeline for both PS (OCR/NLP/NER/RAG) + PPT content |
| Yagyesh | DoSJE frontend |
| Ankur | DoSJE backend |

## Definition of done (single most important goal)
One complete, polished, end-to-end demo flow that works flawlessly:

```
Login → Dashboard → Create/Select Case → Upload Evidence → AI Processing →
Extracted Entities → Timeline → Relationship Graph → AI Investigation
Assistant → Evidence-backed Answer → Chain of Custody
```

Judges should be able to watch this once and immediately understand the
product. Breadth of screens matters far less than this one flow being smooth.
