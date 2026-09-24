# Frontend Architecture

## Main user flow
```
Login
  → Dashboard
    → Create / Select Case
      → Upload Evidence
        → Evidence Processing (live status)
          → Evidence Results
            → Entity Extraction (view)
              → Timeline
                → Entity Graph
                  → AI Investigation Assistant
                    → Evidence-backed Answer
```

## Required screens
1. **Auth** — Login, logout, session handling, role-based UI
2. **Dashboard** — total/active cases, evidence count, recent activity,
   high-priority + recent cases, "Quick Create Case"
3. **Case Management** — list, create, details, overview, status,
   investigator info, stats
4. **Evidence Management** — upload, list, details, type, upload time,
   status, SHA-256 hash display, processing status
5. **Timeline** — chronological events, people, locations, evidence refs,
   clickable events → details
6. **Entity Graph** — nodes (Person/Location/Org/Event/Evidence), edges
   (relationship type + confidence), zoom/pan, node click → details panel
7. **AI Investigation Assistant** — chat-like but evidence-first (see below),
   loading + error states
8. **Evidence Details** — original file info, metadata, hash, extracted
   text/entities, related events/evidence, chain of custody

## AI Assistant UI — important constraint
Must **not** look like a generic ChatGPT clone. The layout should emphasize
provenance over conversation:
```
AI Answer → Supporting Evidence → Timeline Event → Entity
```
Every answer must show clickable evidence citations (e.g. `[Evidence #04]`)
that open the evidence detail view.

## Chain of Custody UI
Vertical timeline of hash/state events, e.g.:
```
Uploaded → SHA-256 Generated → Processed → Investigator Reviewed
```
with visible ✅ "Hash Verified" / "Original Evidence" / "Integrity Confirmed"
badges.

## Evidence processing states (drive your UI loading states)
```
UPLOADED → PROCESSING → TEXT_EXTRACTED → ENTITIES_EXTRACTED →
RELATIONSHIPS_GENERATED → COMPLETED   (or FAILED)
```

## Suggested folder structure (Next.js)
```
frontend/
├─ app/
│  ├─ (auth)/login/
│  ├─ dashboard/
│  ├─ cases/
│  │  ├─ [caseId]/
│  │  │  ├─ evidence/
│  │  │  ├─ timeline/
│  │  │  ├─ graph/
│  │  │  └─ assistant/
│  ├─ evidence/[evidenceId]/
├─ components/
│  ├─ ui/            # design system: Button, Card, Modal, Badge, Table...
│  ├─ evidence/       # EvidenceCard, FileUploader, HashBadge
│  ├─ timeline/
│  ├─ graph/          # GraphNode, GraphCanvas (React Flow wrapper)
│  └─ assistant/
├─ lib/
│  ├─ api/            # fetch wrappers per resource (cases, evidence, graph, timeline, ask)
│  └─ mock/           # fixture JSON matching real API shapes
├─ types/              # shared TS types for Case, Evidence, Entity, Event, etc.
└─ styles/
```

## Data model you're rendering against (owned by Pankaj)
`User → Case → Evidence → Entities → Relationships → Events`
Evidence links to: Entities, Events, Timeline, Case.
