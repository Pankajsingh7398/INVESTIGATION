import {
  Case,
  Evidence,
  Entity,
  GraphData,
  TimelineEvent,
  AIQueryResponse,
  EvidenceProcessingStatus
} from '@/types/forensics';
import {
  DEMO_CASE_102,
  DEMO_EVIDENCE_102,
  DEMO_ENTITIES_102,
  DEMO_RELATIONSHIPS_102,
  DEMO_TIMELINE_102,
  DEMO_AI_PRESETS_102
} from '@/lib/mock/case102';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK !== 'false';

// Client-side in-memory & LocalStorage storage helper
const STORAGE_KEYS = {
  CASES: 'evidencegraph_cases',
  EVIDENCE: 'evidencegraph_evidence',
  ENTITIES: 'evidencegraph_entities',
  GRAPH: 'evidencegraph_graph',
  TIMELINE: 'evidencegraph_timeline',
  ACTIVE_CASE: 'evidencegraph_active_case_id'
};

function getStoredItem<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (err) {
    console.warn(`Error reading ${key} from storage:`, err);
    return fallback;
  }
}

function setStoredItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn(`Error writing ${key} to storage:`, err);
  }
}

function normalizeCase(raw: any): Case {
  return {
    case_id: raw.case_id || raw.human_id || raw.id || 'CASE-102',
    title: raw.title || raw.name || 'Untitled Investigation',
    description: raw.description || '',
    status: raw.status || 'ACTIVE',
    priority: raw.priority || 'HIGH',
    investigator: raw.investigator || 'Insp. Alok Vishwakarma',
    badge_number: raw.badge_number || 'ED-CYBER-8841',
    department: raw.department || 'Digital Forensics & Cyber Intelligence',
    created_at: raw.created_at || new Date().toISOString(),
    updated_at: raw.updated_at || new Date().toISOString(),
    evidence_count: raw.evidence_count ?? 0,
    entity_count: raw.entity_count ?? 0,
    event_count: raw.event_count ?? 0,
    tags: Array.isArray(raw.tags) && raw.tags.length > 0
      ? raw.tags
      : ['Financial Fraud', 'Hawala', 'Offshore', 'Shell Companies']
  };
}

export const forensicsApi = {
  // Load Demo Investigation (Case #102)
  loadDemoCase: async (): Promise<Case> => {
    if (!USE_MOCK) {
      try {
        const res = await fetch(`${API_BASE_URL}/demo/load`, { method: 'POST' });
        if (res.ok) {
          const raw = await res.json();
          return normalizeCase(raw);
        }
      } catch (e) {
        console.warn('Real /demo/load API failed, using fallback:', e);
      }
    }
    if (typeof window !== 'undefined') {
      const cases = getStoredItem<Case[]>(STORAGE_KEYS.CASES, []);
      const existingIdx = cases.findIndex(c => c.case_id === DEMO_CASE_102.case_id);
      if (existingIdx >= 0) {
        cases[existingIdx] = DEMO_CASE_102;
      } else {
        cases.unshift(DEMO_CASE_102);
      }
      setStoredItem(STORAGE_KEYS.CASES, cases);
      setStoredItem(STORAGE_KEYS.ACTIVE_CASE, DEMO_CASE_102.case_id);

      // Store Evidence
      const allEvidence = getStoredItem<Evidence[]>(STORAGE_KEYS.EVIDENCE, []);
      const non102Evidence = allEvidence.filter(e => e.case_id !== DEMO_CASE_102.case_id);
      setStoredItem(STORAGE_KEYS.EVIDENCE, [...DEMO_EVIDENCE_102, ...non102Evidence]);

      // Store Entities
      const allEntities = getStoredItem<Entity[]>(STORAGE_KEYS.ENTITIES, []);
      const non102Entities = allEntities.filter(e => e.case_id !== DEMO_CASE_102.case_id);
      setStoredItem(STORAGE_KEYS.ENTITIES, [...DEMO_ENTITIES_102, ...non102Entities]);

      // Store Timeline
      const allTimeline = getStoredItem<TimelineEvent[]>(STORAGE_KEYS.TIMELINE, []);
      const non102Timeline = allTimeline.filter(t => t.case_id !== DEMO_CASE_102.case_id);
      setStoredItem(STORAGE_KEYS.TIMELINE, [...DEMO_TIMELINE_102, ...non102Timeline]);
    }
    return normalizeCase(DEMO_CASE_102);
  },

  // Cases API
  getCases: async (): Promise<Case[]> => {
    if (!USE_MOCK) {
      try {
        const res = await fetch(`${API_BASE_URL}/cases`);
        if (res.ok) {
          const rawData = await res.json();
          return Array.isArray(rawData) ? rawData.map(normalizeCase) : [normalizeCase(rawData)];
        }
      } catch (e) {
        console.warn('Real API failed, falling back to mock:', e);
      }
    }
    const stored = getStoredItem<Case[]>(STORAGE_KEYS.CASES, [DEMO_CASE_102]);
    return stored.map(normalizeCase);
  },

  getCaseById: async (caseId: string): Promise<Case | null> => {
    if (!USE_MOCK) {
      try {
        const res = await fetch(`${API_BASE_URL}/cases/${caseId}`);
        if (res.ok) {
          const rawData = await res.json();
          return normalizeCase(rawData);
        }
      } catch (e) {
        console.warn('Real API failed, falling back to mock:', e);
      }
    }
    const cases = getStoredItem<Case[]>(STORAGE_KEYS.CASES, [DEMO_CASE_102]);
    const found = cases.find(c => c.case_id === caseId);
    return found ? normalizeCase(found) : null;
  },

  createCase: async (payload: Partial<Case>): Promise<Case> => {
    const newCase: Case = {
      case_id: `CASE-${Math.floor(100 + Math.random() * 900)}`,
      title: payload.title || 'Untitled Investigation',
      description: payload.description || 'No description provided.',
      status: payload.status || 'ACTIVE',
      priority: payload.priority || 'HIGH',
      investigator: payload.investigator || 'Insp. Alok Vishwakarma',
      badge_number: payload.badge_number || 'ED-CYBER-8841',
      department: payload.department || 'Digital Forensics & Cyber Intelligence',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      evidence_count: 0,
      entity_count: 0,
      event_count: 0,
      tags: payload.tags || ['Digital Evidence', 'Cyber Investigation']
    };

    if (!USE_MOCK) {
      try {
        const res = await fetch(`${API_BASE_URL}/cases`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newCase)
        });
        if (res.ok) return await res.json();
      } catch (e) {
        console.warn('Real API failed, falling back to mock:', e);
      }
    }

    const cases = getStoredItem<Case[]>(STORAGE_KEYS.CASES, [DEMO_CASE_102]);
    const updated = [newCase, ...cases];
    setStoredItem(STORAGE_KEYS.CASES, updated);
    return newCase;
  },

  // Evidence API
  getEvidenceForCase: async (caseId: string): Promise<Evidence[]> => {
    if (!USE_MOCK) {
      try {
        const res = await fetch(`${API_BASE_URL}/evidence/${caseId}`);
        if (res.ok) return await res.json();
      } catch (e) {
        console.warn('Real API failed, falling back to mock:', e);
      }
    }
    const all = getStoredItem<Evidence[]>(STORAGE_KEYS.EVIDENCE, DEMO_EVIDENCE_102);
    return all.filter(e => e.case_id === caseId);
  },

  getEvidenceItem: async (evidenceId: string): Promise<Evidence | null> => {
    if (!USE_MOCK) {
      try {
        const res = await fetch(`${API_BASE_URL}/evidence/item/${evidenceId}`);
        if (res.ok) return await res.json();
      } catch (e) {
        console.warn('Real API failed, falling back to mock:', e);
      }
    }
    const all = getStoredItem<Evidence[]>(STORAGE_KEYS.EVIDENCE, DEMO_EVIDENCE_102);
    return all.find(e => e.evidence_id === evidenceId) || null;
  },

  uploadEvidence: async (
    caseId: string,
    file: { name: string; size: string; type: Evidence['file_type']; rawSha256?: string }
  ): Promise<Evidence> => {
    // Generate deterministic or random mock SHA-256
    const randomHex = Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    const newEvidence: Evidence = {
      evidence_id: `EV-${Math.floor(200 + Math.random() * 800)}`,
      case_id: caseId,
      file_name: file.name,
      file_type: file.type,
      file_size: file.size,
      uploaded_at: new Date().toISOString(),
      sha256: file.rawSha256 || randomHex,
      status: 'PROCESSING',
      progress_percent: 25,
      source_device: 'Investigator Workstation Ingestion Portal',
      seizure_location: 'Forensic Lab Entry Console',
      extracted_text: 'Text extraction in progress via Khushboo OCR pipeline...',
      extracted_entities: [],
      chain_of_custody: [
        {
          step: 'Evidence Ingestion & Cryptographic Seal',
          timestamp: new Date().toISOString(),
          actor: 'Insp. Alok Vishwakarma',
          action: 'SHA-256 Computed & Tamper-Evident Enclave Ingest',
          hash: file.rawSha256 || randomHex,
          verified: true,
          notes: 'Cryptographic hash generated prior to any transformation.'
        }
      ]
    };

    if (!USE_MOCK) {
      try {
        const res = await fetch(`${API_BASE_URL}/evidence/upload`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newEvidence)
        });
        if (res.ok) return await res.json();
      } catch (e) {
        console.warn('Real API failed, falling back to mock:', e);
      }
    }

    const all = getStoredItem<Evidence[]>(STORAGE_KEYS.EVIDENCE, DEMO_EVIDENCE_102);
    setStoredItem(STORAGE_KEYS.EVIDENCE, [newEvidence, ...all]);

    // Update case evidence count
    const cases = getStoredItem<Case[]>(STORAGE_KEYS.CASES, [DEMO_CASE_102]);
    const cIdx = cases.findIndex(c => c.case_id === caseId);
    if (cIdx >= 0) {
      cases[cIdx].evidence_count += 1;
      setStoredItem(STORAGE_KEYS.CASES, cases);
    }

    return newEvidence;
  },

  updateEvidenceStatus: (evidenceId: string, status: EvidenceProcessingStatus, progress: number): void => {
    const all = getStoredItem<Evidence[]>(STORAGE_KEYS.EVIDENCE, DEMO_EVIDENCE_102);
    const idx = all.findIndex(e => e.evidence_id === evidenceId);
    if (idx >= 0) {
      all[idx].status = status;
      all[idx].progress_percent = progress;
      if (status === 'COMPLETED') {
        all[idx].extracted_text = all[idx].extracted_text || 'Automated OCR & NLP complete. 5 entities and 3 relationships indexed.';
        all[idx].chain_of_custody.push({
          step: 'Pipeline Verification Completed',
          timestamp: new Date().toISOString(),
          actor: 'Khushboo Forensic ML Engine',
          action: 'NER & Graph Node Indexing',
          hash: all[idx].sha256,
          verified: true,
          notes: 'Integrity matched master hash.'
        });
      }
      setStoredItem(STORAGE_KEYS.EVIDENCE, all);
    }
  },

  // Entities API
  getEntitiesForCase: async (caseId: string): Promise<Entity[]> => {
    if (!USE_MOCK) {
      try {
        const res = await fetch(`${API_BASE_URL}/entities/${caseId}`);
        if (res.ok) return await res.json();
      } catch (e) {
        console.warn('Real API failed, falling back to mock:', e);
      }
    }
    const all = getStoredItem<Entity[]>(STORAGE_KEYS.ENTITIES, DEMO_ENTITIES_102);
    return all.filter(ent => ent.case_id === caseId);
  },

  // Graph API
  getGraphForCase: async (caseId: string): Promise<GraphData> => {
    if (!USE_MOCK) {
      try {
        const res = await fetch(`${API_BASE_URL}/graph/${caseId}`);
        if (res.ok) return await res.json();
      } catch (e) {
        console.warn('Real API failed, falling back to mock:', e);
      }
    }
    const entities = await forensicsApi.getEntitiesForCase(caseId);
    // Filter edges for this case
    return {
      nodes: entities.length > 0 ? entities : DEMO_ENTITIES_102,
      edges: DEMO_RELATIONSHIPS_102
    };
  },

  // Timeline API
  getTimelineForCase: async (caseId: string): Promise<TimelineEvent[]> => {
    if (!USE_MOCK) {
      try {
        const res = await fetch(`${API_BASE_URL}/timeline/${caseId}`);
        if (res.ok) return await res.json();
      } catch (e) {
        console.warn('Real API failed, falling back to mock:', e);
      }
    }
    const all = getStoredItem<TimelineEvent[]>(STORAGE_KEYS.TIMELINE, DEMO_TIMELINE_102);
    return all.filter(t => t.case_id === caseId);
  },

  // AI Assistant API
  askAssistant: async (caseId: string, question: string): Promise<AIQueryResponse> => {
    if (!USE_MOCK) {
      try {
        const res = await fetch(`${API_BASE_URL}/ask`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ case_id: caseId, question })
        });
        if (res.ok) return await res.json();
      } catch (e) {
        console.warn('Real API failed, falling back to mock:', e);
      }
    }

    // Match smart mock response based on question keywords
    const lower = question.toLowerCase();
    if (lower.includes('rahul') || lower.includes('amit') || lower.includes('hotel') || lower.includes('taj')) {
      return DEMO_AI_PRESETS_102['rahul_amit'];
    }
    if (lower.includes('tamper') || lower.includes('erase') || lower.includes('vpn') || lower.includes('bleach') || lower.includes('wipe')) {
      return DEMO_AI_PRESETS_102['tampering'];
    }
    // Default to fund flow
    return DEMO_AI_PRESETS_102['fund_flow'];
  }
};
