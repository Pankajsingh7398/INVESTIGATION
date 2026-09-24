export type CaseStatus = 'ACTIVE' | 'ARCHIVED' | 'CLOSED' | 'UNDER_REVIEW';
export type CasePriority = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export interface Case {
  case_id: string;
  title: string;
  description: string;
  status: CaseStatus;
  priority: CasePriority;
  investigator: string;
  badge_number: string;
  department: string;
  created_at: string;
  updated_at: string;
  evidence_count: number;
  entity_count: number;
  event_count: number;
  tags: string[];
}

export type EvidenceType = 'Document' | 'Image' | 'Chat' | 'Audio' | 'Archive' | 'Financial Record' | 'Server Log';

export type EvidenceProcessingStatus =
  | 'UPLOADED'
  | 'PROCESSING'
  | 'TEXT_EXTRACTED'
  | 'ENTITIES_EXTRACTED'
  | 'RELATIONSHIPS_GENERATED'
  | 'COMPLETED'
  | 'FAILED';

export interface CustodyStep {
  step: string;
  timestamp: string;
  actor: string;
  action: string;
  hash: string;
  verified: boolean;
  notes: string;
}

export interface Evidence {
  evidence_id: string;
  case_id: string;
  file_name: string;
  file_type: EvidenceType;
  file_size: string;
  uploaded_at: string;
  sha256: string;
  status: EvidenceProcessingStatus;
  progress_percent?: number;
  extracted_text?: string;
  extracted_entities?: string[];
  chain_of_custody: CustodyStep[];
  source_device?: string;
  seizure_location?: string;
}

export type EntityType = 'PERSON' | 'LOCATION' | 'ORGANIZATION' | 'EVENT' | 'OTHER';

export interface EntityMetadata {
  role?: string;
  mentions?: number;
  risk_score?: number;
  aliases?: string[];
  department?: string;
  address?: string;
  description?: string;
}

export interface Entity {
  id: string;
  case_id: string;
  type: EntityType;
  label: string;
  metadata: EntityMetadata;
}

export interface GraphEdge {
  id?: string;
  source: string;
  target: string;
  relationship: string;
  confidence: number;
  evidence_refs?: string[];
}

export interface GraphData {
  nodes: Entity[];
  edges: GraphEdge[];
}

export interface TimelineEvent {
  id: string;
  case_id: string;
  date: string;
  time?: string;
  event: string;
  description?: string;
  entities: string[];
  evidence: string[];
  location?: string;
  severity?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export interface SupportingEvidenceRef {
  evidence_id: string;
  file_name: string;
  snippet: string;
  relevance_score: number;
  sha256_prefix: string;
}

export interface AIQueryResponse {
  id: string;
  question: string;
  answer: string;
  entities: string[];
  relationships: Array<{
    source: string;
    target: string;
    relationship: string;
  }>;
  events: string[];
  supporting_evidence: SupportingEvidenceRef[];
  confidence: number;
  timestamp: string;
}

export type UserRole = 'INVESTIGATOR' | 'FORENSIC_ANALYST' | 'JUDICIAL_AUDITOR';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  badge_number: string;
  department: string;
  avatar_initials: string;
  permissions: {
    canUploadEvidence: boolean;
    canCreateCase: boolean;
    canUseAssistant: boolean;
    canVerifyChainOfCustody: boolean;
  };
}
