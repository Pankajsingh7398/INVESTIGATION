# Tasks by Phase

## Phase 0 — Setup (do first, day 1)
- [x] Next.js + Tailwind project scaffolded
- [x] Folder structure in place (see architecture doc)
- [x] Design system started: Button, Card, Modal, Table, Badge, Alert, StatCard
- [x] Mock data fixtures written for Case #102 demo dataset
- [x] TypeScript types for Case, Evidence, Entity, Relationship, Event

## Phase 1 — P0 (MUST complete — this is the demo)
- [x] Login UI (Clerk) + role-based UI shell
- [x] Main dashboard (case count, evidence count, recent activity, quick create)
- [x] Case management (list, create, details)
- [x] Evidence upload (drag & drop, progress, processing status stepper)
- [x] Evidence explorer (list) + Evidence details (metadata, hash, extracted text/entities)
- [x] Timeline view (chronological, clickable events)
- [x] Entity/relationship graph (React Flow, node click → details panel)
- [x] AI Investigation Assistant UI (answer → evidence → timeline → entity chain)
- [ ] Real API integration (swap mocks for Pankaj's endpoints) ← PANKAJ'S SCOPE
- [x] "Load Demo Investigation" button
- [ ] End-to-end walkthrough tested start to finish, multiple times

## Phase 2 — P1 (only after P0 is fully stable and demoed)
- [ ] Chain of custody UI (hash verified / integrity confirmed badges)
- [ ] Global search + filters (date, evidence type, entity, case, status, confidence)
- [ ] Advanced graph interactions
- [ ] Role-based UI refinements
- [ ] Notifications
- [ ] DoSJE shared-component support (only if Yagyesh needs it)
- [ ] API docs alignment / error-state polish

## Phase 3 — P2 (nice-to-have, only if time is left over)
- [ ] Advanced animations
- [ ] Dark mode
- [ ] Mobile-specific UI
- [ ] Extra dashboards / advanced analytics
- [ ] Non-essential visual effects

## PPT ownership (parallel track, not blocking dev)
- [ ] Title slide, solution overview, user journey, EvidenceGraph workflow
- [ ] UI screenshots (grab once each P0 screen is stable — don't screenshot early drafts)
- [ ] Timeline + graph visuals, AI assistant screenshot
- [ ] Final visual polish — pull content from Khushboo, format from you
