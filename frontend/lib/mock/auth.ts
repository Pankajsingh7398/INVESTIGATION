import { UserProfile } from '@/types/forensics';

export const PRESET_USERS: Record<string, UserProfile> = {
  investigator: {
    id: 'USR-01',
    name: 'Insp. Alok Vishwakarma',
    email: 'alok.vishwakarma@ed.gov.in',
    role: 'INVESTIGATOR',
    badge_number: 'ED-CYBER-8841',
    department: 'Digital Forensics & Cyber Financial Crimes Unit',
    avatar_initials: 'AV',
    permissions: {
      canUploadEvidence: true,
      canCreateCase: true,
      canUseAssistant: true,
      canVerifyChainOfCustody: true
    }
  },
  analyst: {
    id: 'USR-02',
    name: 'Khushboo Rawat',
    email: 'khushboo.rawat@cfsl.gov.in',
    role: 'FORENSIC_ANALYST',
    badge_number: 'CFSL-NER-304',
    department: 'Central Forensic Science Laboratory (CFSL)',
    avatar_initials: 'KR',
    permissions: {
      canUploadEvidence: true,
      canCreateCase: false,
      canUseAssistant: true,
      canVerifyChainOfCustody: true
    }
  },
  auditor: {
    id: 'USR-03',
    name: 'Hon. S. Narayanan',
    email: 'judicial.audit@delhicourts.gov.in',
    role: 'JUDICIAL_AUDITOR',
    badge_number: 'JUD-DEL-2026',
    department: 'Special Judicial Oversight & Evidence Tribunal',
    avatar_initials: 'SN',
    permissions: {
      canUploadEvidence: false,
      canCreateCase: false,
      canUseAssistant: true,
      canVerifyChainOfCustody: true
    }
  }
};
