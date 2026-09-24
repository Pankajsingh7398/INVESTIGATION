# What NOT To Do

## Scope discipline
- **Don't build many screens.** The goal is ONE polished end-to-end flow, not
  breadth. A judge should watch one smooth run and get it immediately.
- Don't start P1/P2 items before every P0 item works end-to-end.
- Don't build dark mode, advanced animations, GIS, or mobile-specific UI for
  the hackathon MVP — these are explicitly P2, "only if time remains."
- Don't build against Neo4j, OpenSearch, Whisper, or Kubernetes — those are
  long-term architecture, not MVP scope.

## AI Assistant
- Don't make the AI Assistant look like a generic ChatGPT clone. It must
  visually foreground evidence citations, not just chat bubbles.
- Don't let it display an answer without supporting evidence references —
  the whole pitch is "traceable, evidence-grounded AI," so an answer with no
  citation undermines the core value prop.

## Backend/data dependency
- Don't block your UI work on backend completion — build against mock data
  fixtures that match Pankaj's real API shapes from day one, then swap.
- Don't hardcode the demo data shape differently from what Pankaj/Khushboo
  will actually return — align field names now to avoid a late rewrite.
- Don't duplicate Yagyesh's DoSJE frontend work — you only supply shared
  components (Navbar, Button, Card, etc.) and visual consistency review, not
  DoSJE screens themselves.

## Demo reliability
- Don't make the demo depend on live external services (real backend, real
  AI calls) being up during judging — "Load Demo Investigation" must work
  fully offline/standalone.
- Don't skip testing the full flow multiple times before the deadline —
  a broken step in the middle of the demo is worse than a missing feature.

## Design system
- Don't build one-off styled components per screen — build the shared design
  system components once (Button, Card, Modal, Table, Badge, etc.) and reuse
  them everywhere, since they're also needed for DoSJE consistency.
