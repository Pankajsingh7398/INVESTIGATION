import { Case, Evidence, Entity, GraphEdge, TimelineEvent, AIQueryResponse } from '@/types/forensics';

export const DEMO_CASE_102: Case = {
  case_id: 'CASE-102',
  title: 'Operation Paper Trail — Multi-Jurisdiction Financial Fraud',
  description: 'Investigation into systemic diversion of corporate reserves amounting to ₹52.4 Crores from ABC Company Ltd. through fictitious consultancy invoices, offshore shell corporations in BVI and Dubai, and covert hawala channels.',
  status: 'ACTIVE',
  priority: 'CRITICAL',
  investigator: 'Insp. Alok Vishwakarma',
  badge_number: 'ED-CYBER-8841',
  department: 'Digital Forensics & Cyber Financial Crimes Unit',
  created_at: '2026-08-10T09:30:00Z',
  updated_at: '2026-09-21T18:45:00Z',
  evidence_count: 12,
  entity_count: 31,
  event_count: 18,
  tags: ['Hawala', 'Money Laundering', 'Shell Companies', 'Offshore Banking', 'Evidence Tampering']
};

export const DEMO_EVIDENCE_102: Evidence[] = [
  {
    evidence_id: 'EV-101',
    case_id: 'CASE-102',
    file_name: 'WhatsApp_Chat_Export_Rahul_Amit.txt',
    file_type: 'Chat',
    file_size: '1.4 MB',
    uploaded_at: '2026-08-11T10:15:00Z',
    sha256: '8f91a72d3e9b1049c67bb8f12d8a5439a2632b7194f4a9b5f5431682337e6f88',
    status: 'COMPLETED',
    progress_percent: 100,
    source_device: "Seized iPhone 15 Pro (Rahul Sharma)",
    seizure_location: "Residence, New Delhi",
    extracted_text: `[12/08/2026, 21:14:02] Rahul Sharma: Amit, the second tranche of ₹18 Cr is cleared under Consultancy Invoice INV-2026-88.
[12/08/2026, 21:15:18] Amit Verma: Received confirmation. Transferring via Royal Logistics FZE to Apex Holdings Dubai tomorrow morning.
[12/08/2026, 21:16:05] Rahul Sharma: Ensure Priya in internal audit doesn't see the vendor clearance notes. She was asking for physical delivery proof.
[12/08/2026, 21:17:40] Amit Verma: Already taken care of. Met Vikram at Taj Mumbai yesterday; he confirmed the Board approved without objections.`,
    extracted_entities: ['Rahul Sharma', 'Amit Verma', 'Royal Logistics FZE', 'Apex Holdings Dubai', 'Priya Kapoor', 'Vikram Malhotra', 'Mumbai'],
    chain_of_custody: [
      {
        step: 'Seizure & Hashing',
        timestamp: '2026-08-11T07:30:00Z',
        actor: 'Forensic Officer K. Rawat',
        action: 'Physical extraction via Cellebrite UFED 4PC',
        hash: '8f91a72d3e9b1049c67bb8f12d8a5439a2632b7194f4a9b5f5431682337e6f88',
        verified: true,
        notes: 'Faraday isolation pouch used immediately upon seizure.'
      },
      {
        step: 'Ingestion & Verification',
        timestamp: '2026-08-11T10:15:00Z',
        actor: 'System Evidence Ingestor',
        action: 'SHA-256 Integrity Verification',
        hash: '8f91a72d3e9b1049c67bb8f12d8a5439a2632b7194f4a9b5f5431682337e6f88',
        verified: true,
        notes: 'Bit-stream replica matched master forensic hash.'
      },
      {
        step: 'AI OCR & NLP Extraction',
        timestamp: '2026-08-11T10:16:12Z',
        actor: 'Khushboo AI Pipeline',
        action: 'Named Entity Recognition & Relation Triples',
        hash: '8f91a72d3e9b1049c67bb8f12d8a5439a2632b7194f4a9b5f5431682337e6f88',
        verified: true,
        notes: 'Identified 7 critical financial entities.'
      }
    ]
  },
  {
    evidence_id: 'EV-102',
    case_id: 'CASE-102',
    file_name: 'HDFC_Wire_Transfer_Slip_50L.pdf',
    file_type: 'Financial Record',
    file_size: '3.2 MB',
    uploaded_at: '2026-08-12T11:45:00Z',
    sha256: '4a3b890ef9c4217da7e31b67f10b54e389df0b7a8c3d2e1f40985a6b7c8d9e0f',
    status: 'COMPLETED',
    progress_percent: 100,
    source_device: "HDFC Core Banking API Subpoena",
    seizure_location: "HDFC Connaught Place Branch, New Delhi",
    extracted_text: `HDFC BANK LTD - OUTWARD REMITTANCE ADVICE
Txn Ref: HDFC-NEFT-2026-08-88412
Remitter: ABC Company Ltd (A/C: 5020003194881)
Beneficiary: Horizon Shell Corp Ltd (A/C: 9918230192)
Amount: INR 50,000,000 (INR 5.00 Crores)
Narration: Feasibility Study - MENA Expansion Project Phase 1
Authorized Signatory: Rahul Sharma (Chief Financial Officer)`,
    extracted_entities: ['ABC Company Ltd', 'Horizon Shell Corp Ltd', 'Rahul Sharma', 'New Delhi'],
    chain_of_custody: [
      {
        step: 'Subpoena Acquisition',
        timestamp: '2026-08-12T09:00:00Z',
        actor: 'Insp. Alok Vishwakarma',
        action: 'Official Section 91 CrPC Production Order',
        hash: '4a3b890ef9c4217da7e31b67f10b54e389df0b7a8c3d2e1f40985a6b7c8d9e0f',
        verified: true,
        notes: 'Digital signature from HDFC Compliance Officer validated.'
      },
      {
        step: 'System Ingest',
        timestamp: '2026-08-12T11:45:00Z',
        actor: 'EvidenceGraph Secure Pipeline',
        action: 'SHA-256 Generation & Cryptographic Stamp',
        hash: '4a3b890ef9c4217da7e31b67f10b54e389df0b7a8c3d2e1f40985a6b7c8d9e0f',
        verified: true,
        notes: 'Original evidence unmanipulated.'
      }
    ]
  },
  {
    evidence_id: 'EV-103',
    case_id: 'CASE-102',
    file_name: 'ABC_Corp_Board_Resolution_Minutes.pdf',
    file_type: 'Document',
    file_size: '5.1 MB',
    uploaded_at: '2026-08-13T14:20:00Z',
    sha256: '91c4d8e72b0f1a638e9d5a7b3c2e1f40985a6b7c8d9e0fa3b890ef9c4217da7e',
    status: 'COMPLETED',
    progress_percent: 100,
    source_device: "Corporate Office Server",
    seizure_location: "ABC Tower, Barakhamba Road, New Delhi",
    extracted_text: `EXTRACT OF BOARD MEETING DATED 28 JULY 2026
Item 4: Ratification of Overseas Strategic Consulting Retainer.
Resolved that the company approve upfront retainership of up to INR 55 Crores to Horizon Shell Corp Ltd (BVI) for trade route development.
Moved by: Vikram Malhotra (MD)
Seconded by: Rahul Sharma (CFO)
Dissenting: Priya Kapoor (Chief Internal Auditor note appended questioning vendor legitimacy).`,
    extracted_entities: ['ABC Company Ltd', 'Horizon Shell Corp Ltd', 'Vikram Malhotra', 'Rahul Sharma', 'Priya Kapoor'],
    chain_of_custody: [
      {
        step: 'Server Image Seizure',
        timestamp: '2026-08-13T12:00:00Z',
        actor: 'Digital Forensics Team',
        action: 'Bit-stream image verification',
        hash: '91c4d8e72b0f1a638e9d5a7b3c2e1f40985a6b7c8d9e0fa3b890ef9c4217da7e',
        verified: true,
        notes: 'Board minutes signed by corporate secretary.'
      }
    ]
  },
  {
    evidence_id: 'EV-104',
    case_id: 'CASE-102',
    file_name: 'CCTV_Footage_Hotel_Taj_Lobby_Mumbai.mp4',
    file_type: 'Image',
    file_size: '48.6 MB',
    uploaded_at: '2026-08-14T16:10:00Z',
    sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    status: 'COMPLETED',
    progress_percent: 100,
    source_device: "Hikvision DVR Lobby Cam 04",
    seizure_location: "Grand Taj Luxury Hotels, Colaba, Mumbai",
    extracted_text: `FACIAL RECOGNITION & OBJECT DETECTION REPORT:
Timestamp: 2026-08-11 18:22:14 IST
Positive Match: Rahul Sharma (Confidence 98.4%) entering Private Lounge 3.
Positive Match: Amit Verma (Confidence 96.1%) carrying black attache case.
Positive Match: Sanjay Gupta (Confidence 94.7%) joining at 18:35:10 IST.
Handover observed: Physical documents and encrypted hardware token exchanged.`,
    extracted_entities: ['Rahul Sharma', 'Amit Verma', 'Sanjay Gupta', 'Grand Taj Luxury Hotels', 'Mumbai'],
    chain_of_custody: [
      {
        step: 'DVR Seizure',
        timestamp: '2026-08-14T11:00:00Z',
        actor: 'Insp. S. Patil (Mumbai Police)',
        action: 'Raw NVR export directly to encrypted SSD',
        hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        verified: true,
        notes: 'Tamper-evident seal #MUM-DVR-991.'
      }
    ]
  },
  {
    evidence_id: 'EV-105',
    case_id: 'CASE-102',
    file_name: 'Encrypted_Ledger_Swiss_Vault.zip',
    file_type: 'Archive',
    file_size: '12.8 MB',
    uploaded_at: '2026-08-15T09:20:00Z',
    sha256: '7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
    status: 'COMPLETED',
    progress_percent: 100,
    source_device: "Encrypted SanDisk Extreme 1TB",
    seizure_location: "Private Safe, Mumbai",
    extracted_text: `DECRYPTED SHADOW LEDGER:
Account: Swiss Horizon Private Bank (Zurich)
Sub-account: #CH-9921
Beneficial Owner: Rajesh Singhania (Nominee for Rahul Sharma & Vikram Malhotra)
Balance: USD 6,240,000
Recent Inflow: $2,400,000 originating from Apex Holdings Dubai via Hawala bridge handled by Sanjay Gupta.`,
    extracted_entities: ['Swiss Horizon Private Bank', 'Swiss Vault Account #CH-9921', 'Rajesh Singhania', 'Rahul Sharma', 'Vikram Malhotra', 'Zurich', 'Apex Holdings Dubai', 'Sanjay Gupta'],
    chain_of_custody: [
      {
        step: 'Cryptanalysis Decryption',
        timestamp: '2026-08-15T08:00:00Z',
        actor: 'Khushboo Forensic ML/Crypto Unit',
        action: 'Password recovered via recovered keychain artifact',
        hash: '7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
        verified: true,
        notes: 'Decrypted duplicate stored in air-gapped forensic repository.'
      }
    ]
  },
  {
    evidence_id: 'EV-106',
    case_id: 'CASE-102',
    file_name: 'Flight_Ticket_PNR_DEL_BOM_IndiGo.pdf',
    file_type: 'Document',
    file_size: '820 KB',
    uploaded_at: '2026-08-16T13:10:00Z',
    sha256: '6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b',
    status: 'COMPLETED',
    progress_percent: 100,
    source_device: "Email Attachment - Gmail Subpoena",
    seizure_location: "Cloud Ingest",
    extracted_text: `IndiGo E-Ticket Confirmation - 6E 2041
Passenger: Rahul Sharma / Amit Verma (Consecutive PNR: K9X7W2)
Flight: New Delhi (DEL) to Mumbai (BOM)
Departure: 11 August 2026, 14:10 IST
Payment: Corporate Card ending 4410 (ABC Company Ltd)`,
    extracted_entities: ['Rahul Sharma', 'Amit Verma', 'New Delhi', 'Mumbai', 'ABC Company Ltd'],
    chain_of_custody: [
      {
        step: 'Cloud Ingestion',
        timestamp: '2026-08-16T13:10:00Z',
        actor: 'Investigator Alok',
        action: 'Imported from verified airline subpoena data',
        hash: '6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b',
        verified: true,
        notes: 'Matches CCTV arrival times in Mumbai.'
      }
    ]
  },
  {
    evidence_id: 'EV-107',
    case_id: 'CASE-102',
    file_name: 'Offshore_Entity_Registration_BVI.pdf',
    file_type: 'Document',
    file_size: '2.7 MB',
    uploaded_at: '2026-08-17T15:30:00Z',
    sha256: 'd4735e3a265e16eee03f59718b9b5d03019c07d8b6c51f90da3a666eec13ab35',
    status: 'COMPLETED',
    progress_percent: 100,
    source_device: "Interpol Financial Crimes Unit Exchange",
    seizure_location: "BVI Financial Services Commission",
    extracted_text: `BRITISH VIRGIN ISLANDS REGISTRAR OF CORPORATE AFFAIRS
Certificate of Incorporation: IBC No. 209841
Company Name: Horizon Shell Corp Ltd
Registered Agent: Portcullis Trust, Road Town, Tortola
Sole Director: Amit Verma
Power of Attorney Grantee: Rajesh Singhania`,
    extracted_entities: ['Horizon Shell Corp Ltd', 'Amit Verma', 'Rajesh Singhania'],
    chain_of_custody: [
      {
        step: 'Interpol MLAT Exchange',
        timestamp: '2026-08-17T14:00:00Z',
        actor: 'State Enforcement Directorate Liaison',
        action: 'Official diplomatic forensic transmission',
        hash: 'd4735e3a265e16eee03f59718b9b5d03019c07d8b6c51f90da3a666eec13ab35',
        verified: true,
        notes: 'Verified against BVI company register database.'
      }
    ]
  },
  {
    evidence_id: 'EV-108',
    case_id: 'CASE-102',
    file_name: 'Voice_Memo_Recorded_Meeting_Amit.m4a',
    file_type: 'Audio',
    file_size: '6.4 MB',
    uploaded_at: '2026-08-18T11:00:00Z',
    sha256: '4e07408562bedb8b60ce05c1decfe3ad16b72230967de01f640b7e4729b49fce',
    status: 'COMPLETED',
    progress_percent: 100,
    source_device: "Dictaphone Memo Seized from Briefcase",
    seizure_location: "Amit Verma Residence, Gurgaon",
    extracted_text: `TRANSCRIPTION (Whisper ASR Forensic Pipe):
Speaker 1 (Amit Verma): "Sanjay bhai, what is the exchange rate cut for the Dubai leg?"
Speaker 2 (Sanjay Gupta): "Four percent net. Sunil Patel will coordinate customs clearance in Dubai port for the fictitious electronics manifests. Once clearance stamp is on paper, Apex Holdings releases funds to Zurich."
Speaker 1: "Make sure no transaction references ABC directly. Everything must quote Bogus Invoice INV-2026-88."`,
    extracted_entities: ['Amit Verma', 'Sanjay Gupta', 'Sunil Patel', 'Dubai', 'Apex Holdings Dubai', 'Zurich', 'ABC Company Ltd', 'Bogus Invoice #INV-2026-88'],
    chain_of_custody: [
      {
        step: 'Hardware Seizure',
        timestamp: '2026-08-18T08:30:00Z',
        actor: 'Sub-Inspector Neha',
        action: 'Sony ICD Digital Voice Recorder Seized',
        hash: '4e07408562bedb8b60ce05c1decfe3ad16b72230967de01f640b7e4729b49fce',
        verified: true,
        notes: 'Original flash memory write-blocked before extraction.'
      }
    ]
  },
  {
    evidence_id: 'EV-109',
    case_id: 'CASE-102',
    file_name: 'Firewall_VPN_Gateway_Access_Logs.csv',
    file_type: 'Server Log',
    file_size: '9.3 MB',
    uploaded_at: '2026-08-19T10:00:00Z',
    sha256: '4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a',
    status: 'COMPLETED',
    progress_percent: 100,
    source_device: "Palo Alto Networks Next-Gen Firewall",
    seizure_location: "ABC Company Data Center, Noida",
    extracted_text: `LOG PARSER ALERT (ANOMALOUS ACTIVITY):
2026-08-13 02:44:11 IST - User: rahul.sharma - VPN IP: 185.220.101.5 (Tor Exit Node / Zurich Proxy)
Action: Mass export of confidential audit workpapers to Encrypted ProtonMail Node.
2026-08-13 03:15:22 IST - User: neha.joshi - Access to ledger files Revoked by Administrator.`,
    extracted_entities: ['Rahul Sharma', 'Neha Joshi', 'Zurich', 'Encrypted ProtonMail Node', 'ABC Company Ltd'],
    chain_of_custody: [
      {
        step: 'Syslog Export',
        timestamp: '2026-08-19T09:15:00Z',
        actor: 'Cyber Investigator Alok',
        action: 'Direct cryptographic dump from firewall SIEM',
        hash: '4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a',
        verified: true,
        notes: 'Syslog hash signed by PKI certificate.'
      }
    ]
  },
  {
    evidence_id: 'EV-110',
    case_id: 'CASE-102',
    file_name: 'Call_Data_Records_CDR_Tower_Dump.xlsx',
    file_type: 'Document',
    file_size: '14.1 MB',
    uploaded_at: '2026-08-20T12:00:00Z',
    sha256: 'ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d',
    status: 'COMPLETED',
    progress_percent: 100,
    source_device: "Airtel / Jio Lawful Intercept System",
    seizure_location: "Telecom Service Provider Core Switch",
    extracted_text: `CO-LOCATION & CDR TOWER ANALYSIS:
Phone A (+91-98110-XXXXX / Rahul Sharma) & Phone B (+91-98200-XXXXX / Amit Verma)
Co-located at Tower ID: BOM-COL-084 (Taj Colaba, Mumbai) on 11-Aug-2026 between 18:15 and 21:30 IST.
Subsequent outgoing calls to International Dial Code +971 (Dubai) - 14 calls to Sunil Patel.`,
    extracted_entities: ['Rahul Sharma', 'Amit Verma', 'Mumbai', 'Dubai', 'Sunil Patel'],
    chain_of_custody: [
      {
        step: 'Lawful Intercept Ingestion',
        timestamp: '2026-08-20T11:30:00Z',
        actor: 'State Enforcement Directorate',
        action: 'Official CDR subpoena processing',
        hash: 'ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d',
        verified: true,
        notes: 'Telecom carrier digital stamp intact.'
      }
    ]
  },
  {
    evidence_id: 'EV-111',
    case_id: 'CASE-102',
    file_name: 'Shell_Company_Invoice_Dubai_Logistics.pdf',
    file_type: 'Financial Record',
    file_size: '1.8 MB',
    uploaded_at: '2026-08-21T14:15:00Z',
    sha256: 'bc63a47fed0b67e34d19ef8a309f3e5b6accdf62725f7f84a50f45f37913d376',
    status: 'COMPLETED',
    progress_percent: 100,
    source_device: "Scanned Hardcopy Seized from Accountant Office",
    seizure_location: "Office of Neha Joshi, South Extension, New Delhi",
    extracted_text: `COMMERCIAL INVOICE # INV-2026-88
Issuer: Royal Logistics FZE, Jebel Ali Free Zone, Dubai
Client: ABC Company Ltd, New Delhi
Description: Supply Chain Maritime Insurance and Freight Security Escort
Total Billed: AED 8,100,000 (~ INR 18.2 Crores)
Auditor Stamped: REJECTED FOR PAYMENT BY PRIYA KAPOOR - LACKS BILL OF LADING.
Override Stamp: EMERGENCY DISBURSEMENT AUTHORIZED BY RAHUL SHARMA.`,
    extracted_entities: ['Royal Logistics FZE', 'Dubai', 'ABC Company Ltd', 'New Delhi', 'Priya Kapoor', 'Rahul Sharma', 'Bogus Invoice #INV-2026-88'],
    chain_of_custody: [
      {
        step: 'Physical Raid Seizure',
        timestamp: '2026-08-21T11:00:00Z',
        actor: 'Insp. Alok Vishwakarma',
        action: 'Original ink document seized under panchnama',
        hash: 'bc63a47fed0b67e34d19ef8a309f3e5b6accdf62725f7f84a50f45f37913d376',
        verified: true,
        notes: 'Handwriting samples forwarded to Central Forensic Science Lab.'
      }
    ]
  },
  {
    evidence_id: 'EV-112',
    case_id: 'CASE-102',
    file_name: 'Seized_MacBook_Pro_Disk_Image_Hash.dd',
    file_type: 'Archive',
    file_size: '4.2 MB (Forensic Metadata)',
    uploaded_at: '2026-08-22T17:00:00Z',
    sha256: 'f2ca1bb6c7e907d06dafe4687e579fce76b37e4e93b7605022da52e6ccc26fd2',
    status: 'COMPLETED',
    progress_percent: 100,
    source_device: "Apple MacBook Pro M3 Max (Serial #C02G8819Q)",
    seizure_location: "Vikram Malhotra Residence, Chanakyapuri, New Delhi",
    extracted_text: `FORENSIC DISK IMAGE ARTIFACTS:
Evidence of anti-forensics tool execution: Eraser v6.2 and BleachBit executed at 2026-08-13 04:12 IST.
Carved unallocated clusters yielded drafts of offshore shell formation agreements with Portcullis Trust (Mauritius & BVI).
Deleted email found: "Vikram to Rahul: Once Amit wraps the Dubai wire, we have 48 hours before the statutory auditor resigns."`,
    extracted_entities: ['Vikram Malhotra', 'Rahul Sharma', 'Amit Verma', 'New Delhi', 'Dubai', 'Port Louis (Mauritius)'],
    chain_of_custody: [
      {
        step: 'Hardware Seizure & Forensic Imaging',
        timestamp: '2026-08-22T06:00:00Z',
        actor: 'Forensic Officer K. Rawat',
        action: 'Bit-level raw DD clone using Tableau T8u Forensic USB Bridge',
        hash: 'f2ca1bb6c7e907d06dafe4687e579fce76b37e4e93b7605022da52e6ccc26fd2',
        verified: true,
        notes: 'Original machine hardware seals undamaged.'
      }
    ]
  }
];

export const DEMO_ENTITIES_102: Entity[] = [
  // Persons (8)
  { id: 'ENT-01', case_id: 'CASE-102', type: 'PERSON', label: 'Rahul Sharma', metadata: { role: 'Chief Financial Officer (ABC Co.)', risk_score: 95, mentions: 48, description: 'Primary coordinator of bogus remittances and offshore diverter.' } },
  { id: 'ENT-02', case_id: 'CASE-102', type: 'PERSON', label: 'Amit Verma', metadata: { role: 'Director (Horizon Shell Corp)', risk_score: 92, mentions: 42, description: 'Front director for shell companies; executed banking hops.' } },
  { id: 'ENT-03', case_id: 'CASE-102', type: 'PERSON', label: 'Priya Kapoor', metadata: { role: 'Chief Internal Auditor (Whistleblower)', risk_score: 10, mentions: 16, description: 'Flagged fraudulent consultancy invoices; raised dissent in board minutes.' } },
  { id: 'ENT-04', case_id: 'CASE-102', type: 'PERSON', label: 'Vikram Malhotra', metadata: { role: 'Managing Director (ABC Co.)', risk_score: 90, mentions: 34, description: 'Approved overrides on auditor flags; beneficiary of Swiss accounts.' } },
  { id: 'ENT-05', case_id: 'CASE-102', type: 'PERSON', label: 'Sanjay Gupta', metadata: { role: 'Hawala Operator & Cash Broker', risk_score: 88, mentions: 22, description: 'Managed cross-border currency conversion between Mumbai and Dubai.' } },
  { id: 'ENT-06', case_id: 'CASE-102', type: 'PERSON', label: 'Rajesh Singhania', metadata: { role: 'Offshore Nominee & Legal Counsel', risk_score: 85, mentions: 18, description: 'Nominee holder for Swiss Horizon Account and BVI entity.' } },
  { id: 'ENT-07', case_id: 'CASE-102', type: 'PERSON', label: 'Neha Joshi', metadata: { role: 'Senior Accountant (ABC Co.)', risk_score: 45, mentions: 12, description: 'Accountant whose ledger access was abruptly revoked after questioning transfers.' } },
  { id: 'ENT-08', case_id: 'CASE-102', type: 'PERSON', label: 'Sunil Patel', metadata: { role: 'Customs & Port Liaison', risk_score: 78, mentions: 15, description: 'Fabricated port clearance paperwork for fictitious electronics in Dubai.' } },

  // Organizations (7)
  { id: 'ENT-09', case_id: 'CASE-102', type: 'ORGANIZATION', label: 'ABC Company Ltd', metadata: { role: 'Defrauded Corporate Entity', risk_score: 60, mentions: 64, address: 'Barakhamba Road, New Delhi' } },
  { id: 'ENT-10', case_id: 'CASE-102', type: 'ORGANIZATION', label: 'Horizon Shell Corp Ltd', metadata: { role: 'BVI Shell Entity', risk_score: 98, mentions: 39, address: 'Tortola, British Virgin Islands' } },
  { id: 'ENT-11', case_id: 'CASE-102', type: 'ORGANIZATION', label: 'Apex Holdings Dubai', metadata: { role: 'Offshore Conduit Entity', risk_score: 94, mentions: 28, address: 'Business Bay, Dubai, UAE' } },
  { id: 'ENT-12', case_id: 'CASE-102', type: 'ORGANIZATION', label: 'Swiss Horizon Private Bank', metadata: { role: 'Custodian Offshore Bank', risk_score: 75, mentions: 20, address: 'Bahnhofstrasse, Zurich, Switzerland' } },
  { id: 'ENT-13', case_id: 'CASE-102', type: 'ORGANIZATION', label: 'Grand Taj Luxury Hotels', metadata: { role: 'Meeting Venue', risk_score: 20, mentions: 14, address: 'Colaba, Mumbai' } },
  { id: 'ENT-14', case_id: 'CASE-102', type: 'ORGANIZATION', label: 'Royal Logistics FZE', metadata: { role: 'Fictitious Freight Entity', risk_score: 89, mentions: 25, address: 'Jebel Ali Free Zone, Dubai' } },
  { id: 'ENT-15', case_id: 'CASE-102', type: 'ORGANIZATION', label: 'State Enforcement Directorate', metadata: { role: 'Lead Investigating Agency', risk_score: 0, mentions: 18, address: 'Khan Market, New Delhi' } },

  // Locations (6)
  { id: 'ENT-16', case_id: 'CASE-102', type: 'LOCATION', label: 'New Delhi', metadata: { role: 'Origin of Remittance / Corporate HQ', risk_score: 40, mentions: 52 } },
  { id: 'ENT-17', case_id: 'CASE-102', type: 'LOCATION', label: 'Mumbai', metadata: { role: 'Hawala Coordination & CCTV Meeting Hub', risk_score: 70, mentions: 38 } },
  { id: 'ENT-18', case_id: 'CASE-102', type: 'LOCATION', label: 'Dubai', metadata: { role: 'Transit Laundering Jurisdiction', risk_score: 90, mentions: 45 } },
  { id: 'ENT-19', case_id: 'CASE-102', type: 'LOCATION', label: 'Zurich', metadata: { role: 'Ultimate Offshore Destination', risk_score: 85, mentions: 30 } },
  { id: 'ENT-20', case_id: 'CASE-102', type: 'LOCATION', label: 'Port Louis (Mauritius)', metadata: { role: 'Tax Haven Conduit', risk_score: 80, mentions: 12 } },
  { id: 'ENT-21', case_id: 'CASE-102', type: 'LOCATION', label: 'Singapore', metadata: { role: 'Backup Banking Routing', risk_score: 50, mentions: 8 } },

  // Events (6)
  { id: 'ENT-22', case_id: 'CASE-102', type: 'EVENT', label: 'Secret Strategy Meeting Mumbai', metadata: { role: 'CCTV Verified Conspiratorial Meeting', risk_score: 95, mentions: 16 } },
  { id: 'ENT-23', case_id: 'CASE-102', type: 'EVENT', label: 'Bogus Overseas Wire ₹50 Cr', metadata: { role: 'Primary Diversion Transaction', risk_score: 99, mentions: 24 } },
  { id: 'ENT-24', case_id: 'CASE-102', type: 'EVENT', label: 'Whistleblower Internal Audit Flag', metadata: { role: 'Initial Discovery Event', risk_score: 20, mentions: 15 } },
  { id: 'ENT-25', case_id: 'CASE-102', type: 'EVENT', label: 'Offshore Incorporation BVI', metadata: { role: 'Entity Setup Event', risk_score: 85, mentions: 10 } },
  { id: 'ENT-26', case_id: 'CASE-102', type: 'EVENT', label: 'Emergency Hard Drive Wipe Attempt', metadata: { role: 'Anti-Forensics Event', risk_score: 96, mentions: 14 } },
  { id: 'ENT-27', case_id: 'CASE-102', type: 'EVENT', label: 'Raid and Evidence Seizure', metadata: { role: 'Enforcement Action', risk_score: 10, mentions: 22 } },

  // Other / Accounts / Hardware (4)
  { id: 'ENT-28', case_id: 'CASE-102', type: 'OTHER', label: 'Swiss Vault Account #CH-9921', metadata: { role: 'Bank Account holding $6.24M', risk_score: 99, mentions: 26 } },
  { id: 'ENT-29', case_id: 'CASE-102', type: 'OTHER', label: 'Seized iPhone 15 Pro (Rahul)', metadata: { role: 'Primary Digital Device', risk_score: 80, mentions: 20 } },
  { id: 'ENT-30', case_id: 'CASE-102', type: 'OTHER', label: 'Encrypted ProtonMail Node', metadata: { role: 'Covert Communication Channel', risk_score: 88, mentions: 15 } },
  { id: 'ENT-31', case_id: 'CASE-102', type: 'OTHER', label: 'Bogus Invoice #INV-2026-88', metadata: { role: 'Fabricated Financial Instrument', risk_score: 95, mentions: 28 } }
];

export const DEMO_RELATIONSHIPS_102: GraphEdge[] = [
  // Total 42 relationships
  { source: 'ENT-01', target: 'ENT-02', relationship: 'contacted', confidence: 0.94, evidence_refs: ['EV-101', 'EV-110'] },
  { source: 'ENT-01', target: 'ENT-09', relationship: 'cfo_of', confidence: 0.99, evidence_refs: ['EV-102', 'EV-103'] },
  { source: 'ENT-04', target: 'ENT-09', relationship: 'managing_director_of', confidence: 0.99, evidence_refs: ['EV-103'] },
  { source: 'ENT-01', target: 'ENT-04', relationship: 'colluded_with', confidence: 0.91, evidence_refs: ['EV-101', 'EV-112'] },
  { source: 'ENT-03', target: 'ENT-09', relationship: 'audited', confidence: 0.98, evidence_refs: ['EV-103', 'EV-111'] },
  { source: 'ENT-03', target: 'ENT-01', relationship: 'confronted', confidence: 0.95, evidence_refs: ['EV-101', 'EV-111'] },
  { source: 'ENT-01', target: 'ENT-16', relationship: 'resides_in', confidence: 0.99, evidence_refs: ['EV-101'] },
  { source: 'ENT-01', target: 'ENT-17', relationship: 'travelled_to', confidence: 0.97, evidence_refs: ['EV-104', 'EV-106'] },
  { source: 'ENT-02', target: 'ENT-17', relationship: 'travelled_to', confidence: 0.96, evidence_refs: ['EV-104', 'EV-106'] },
  { source: 'ENT-01', target: 'ENT-13', relationship: 'visited_venue', confidence: 0.98, evidence_refs: ['EV-104'] },
  { source: 'ENT-02', target: 'ENT-13', relationship: 'visited_venue', confidence: 0.96, evidence_refs: ['EV-104'] },
  { source: 'ENT-05', target: 'ENT-13', relationship: 'attended_meeting_at', confidence: 0.94, evidence_refs: ['EV-104'] },
  { source: 'ENT-01', target: 'ENT-22', relationship: 'participated_in', confidence: 0.98, evidence_refs: ['EV-104'] },
  { source: 'ENT-02', target: 'ENT-22', relationship: 'participated_in', confidence: 0.97, evidence_refs: ['EV-104'] },
  { source: 'ENT-05', target: 'ENT-22', relationship: 'participated_in', confidence: 0.95, evidence_refs: ['EV-104'] },
  { source: 'ENT-02', target: 'ENT-10', relationship: 'director_of', confidence: 0.99, evidence_refs: ['EV-107'] },
  { source: 'ENT-06', target: 'ENT-10', relationship: 'power_of_attorney', confidence: 0.97, evidence_refs: ['EV-107'] },
  { source: 'ENT-09', target: 'ENT-10', relationship: 'wired_funds_to', confidence: 0.99, evidence_refs: ['EV-102'] },
  { source: 'ENT-09', target: 'ENT-23', relationship: 'originating_entity', confidence: 0.99, evidence_refs: ['EV-102'] },
  { source: 'ENT-10', target: 'ENT-23', relationship: 'receiving_entity', confidence: 0.99, evidence_refs: ['EV-102'] },
  { source: 'ENT-10', target: 'ENT-14', relationship: 'routed_capital_to', confidence: 0.92, evidence_refs: ['EV-101', 'EV-111'] },
  { source: 'ENT-14', target: 'ENT-18', relationship: 'incorporated_in', confidence: 0.99, evidence_refs: ['EV-111'] },
  { source: 'ENT-14', target: 'ENT-11', relationship: 'transferred_funds', confidence: 0.95, evidence_refs: ['EV-101'] },
  { source: 'ENT-11', target: 'ENT-18', relationship: 'located_in', confidence: 0.99, evidence_refs: ['EV-101', 'EV-108'] },
  { source: 'ENT-05', target: 'ENT-18', relationship: 'managed_hawala_node', confidence: 0.91, evidence_refs: ['EV-108'] },
  { source: 'ENT-08', target: 'ENT-14', relationship: 'falsified_manifests_for', confidence: 0.89, evidence_refs: ['EV-108'] },
  { source: 'ENT-08', target: 'ENT-18', relationship: 'stationed_at', confidence: 0.95, evidence_refs: ['EV-108'] },
  { source: 'ENT-11', target: 'ENT-28', relationship: 'funneled_assets_to', confidence: 0.96, evidence_refs: ['EV-105'] },
  { source: 'ENT-28', target: 'ENT-12', relationship: 'account_held_at', confidence: 0.99, evidence_refs: ['EV-105'] },
  { source: 'ENT-12', target: 'ENT-19', relationship: 'located_in', confidence: 0.99, evidence_refs: ['EV-105'] },
  { source: 'ENT-06', target: 'ENT-28', relationship: 'nominee_holder_of', confidence: 0.98, evidence_refs: ['EV-105'] },
  { source: 'ENT-01', target: 'ENT-28', relationship: 'beneficial_owner_of', confidence: 0.93, evidence_refs: ['EV-105'] },
  { source: 'ENT-04', target: 'ENT-28', relationship: 'beneficial_owner_of', confidence: 0.92, evidence_refs: ['EV-105', 'EV-112'] },
  { source: 'ENT-03', target: 'ENT-24', relationship: 'initiated_action', confidence: 0.99, evidence_refs: ['EV-103', 'EV-111'] },
  { source: 'ENT-07', target: 'ENT-09', relationship: 'accountant_at', confidence: 0.97, evidence_refs: ['EV-109', 'EV-111'] },
  { source: 'ENT-01', target: 'ENT-30', relationship: 'communicated_via', confidence: 0.94, evidence_refs: ['EV-109'] },
  { source: 'ENT-01', target: 'ENT-29', relationship: 'user_of_device', confidence: 0.99, evidence_refs: ['EV-101'] },
  { source: 'ENT-14', target: 'ENT-31', relationship: 'issued_document', confidence: 0.99, evidence_refs: ['EV-111'] },
  { source: 'ENT-01', target: 'ENT-31', relationship: 'authorized_payment', confidence: 0.99, evidence_refs: ['EV-111'] },
  { source: 'ENT-04', target: 'ENT-26', relationship: 'executed_wipe', confidence: 0.95, evidence_refs: ['EV-112'] },
  { source: 'ENT-15', target: 'ENT-27', relationship: 'executed_operation', confidence: 0.99, evidence_refs: ['EV-104', 'EV-112'] },
  { source: 'ENT-15', target: 'ENT-09', relationship: 'investigating_target', confidence: 0.99, evidence_refs: ['EV-102', 'EV-103'] }
];

export const DEMO_TIMELINE_102: TimelineEvent[] = [
  {
    id: 'TIME-01',
    case_id: 'CASE-102',
    date: '2026-06-14',
    time: '11:20 IST',
    event: 'Offshore Incorporation of Horizon Shell Corp',
    description: 'Amit Verma incorporates Horizon Shell Corp Ltd in British Virgin Islands through nominee agent Portcullis Trust.',
    entities: ['Amit Verma', 'Horizon Shell Corp Ltd', 'Rajesh Singhania'],
    evidence: ['EV-107'],
    location: 'Tortola (BVI)',
    severity: 'MEDIUM'
  },
  {
    id: 'TIME-02',
    case_id: 'CASE-102',
    date: '2026-07-28',
    time: '15:30 IST',
    event: 'Board Resolution for Overseas Retainer',
    description: 'ABC Company Board Meeting passes ₹55 Cr strategic consulting allocation despite recorded dissent from Chief Internal Auditor Priya Kapoor.',
    entities: ['ABC Company Ltd', 'Vikram Malhotra', 'Rahul Sharma', 'Priya Kapoor'],
    evidence: ['EV-103'],
    location: 'New Delhi',
    severity: 'HIGH'
  },
  {
    id: 'TIME-03',
    case_id: 'CASE-102',
    date: '2026-08-02',
    time: '10:00 IST',
    event: 'First Bogus Invoice Generation',
    description: 'Royal Logistics FZE issues invoice INV-2026-88 for ₹18.2 Cr without accompanying maritime bills of lading.',
    entities: ['Royal Logistics FZE', 'Bogus Invoice #INV-2026-88', 'Dubai'],
    evidence: ['EV-111'],
    location: 'Dubai',
    severity: 'MEDIUM'
  },
  {
    id: 'TIME-04',
    case_id: 'CASE-102',
    date: '2026-08-04',
    time: '14:15 IST',
    event: 'Internal Audit Rejection Stamp',
    description: 'Priya Kapoor physically marks Invoice INV-2026-88 as REJECTED due to lack of verifiable service delivery.',
    entities: ['Priya Kapoor', 'Bogus Invoice #INV-2026-88'],
    evidence: ['EV-111'],
    location: 'New Delhi',
    severity: 'MEDIUM'
  },
  {
    id: 'TIME-05',
    case_id: 'CASE-102',
    date: '2026-08-05',
    time: '17:45 IST',
    event: 'CFO Override Authorization',
    description: 'Rahul Sharma uses emergency treasury powers to override the audit block and order immediate wire clearance.',
    entities: ['Rahul Sharma', 'ABC Company Ltd', 'Bogus Invoice #INV-2026-88'],
    evidence: ['EV-111'],
    location: 'New Delhi',
    severity: 'CRITICAL'
  },
  {
    id: 'TIME-06',
    case_id: 'CASE-102',
    date: '2026-08-11',
    time: '14:10 IST',
    event: 'Travel from Delhi to Mumbai',
    description: 'Rahul Sharma and Amit Verma board IndiGo flight 6E 2041 to Mumbai on corporate billed tickets.',
    entities: ['Rahul Sharma', 'Amit Verma', 'New Delhi', 'Mumbai'],
    evidence: ['EV-106'],
    location: 'Indira Gandhi Airport (DEL)',
    severity: 'LOW'
  },
  {
    id: 'TIME-07',
    case_id: 'CASE-102',
    date: '2026-08-11',
    time: '18:22 IST',
    event: 'Secret Strategy Meeting at Hotel Taj',
    description: 'CCTV records Rahul Sharma, Amit Verma, and Hawala broker Sanjay Gupta convening in Taj Mumbai Private Lounge 3.',
    entities: ['Rahul Sharma', 'Amit Verma', 'Sanjay Gupta', 'Grand Taj Luxury Hotels', 'Mumbai'],
    evidence: ['EV-104'],
    location: 'Colaba, Mumbai',
    severity: 'CRITICAL'
  },
  {
    id: 'TIME-08',
    case_id: 'CASE-102',
    date: '2026-08-11',
    time: '19:40 IST',
    event: 'Recorded Hawala Kickback Discussion',
    description: 'Voice recording captures Amit Verma negotiating 4% commission with Sanjay Gupta and customs clearance with Sunil Patel.',
    entities: ['Amit Verma', 'Sanjay Gupta', 'Sunil Patel', 'Dubai', 'Apex Holdings Dubai'],
    evidence: ['EV-108'],
    location: 'Mumbai',
    severity: 'CRITICAL'
  },
  {
    id: 'TIME-09',
    case_id: 'CASE-102',
    date: '2026-08-11',
    time: '21:14 IST',
    event: 'WhatsApp Confirmation of Wire',
    description: 'Rahul Sharma texts Amit Verma confirming ₹18 Cr wire clearance and instructing him to conceal vendor notes from Priya.',
    entities: ['Rahul Sharma', 'Amit Verma', 'Priya Kapoor', 'Vikram Malhotra'],
    evidence: ['EV-101'],
    location: 'Mumbai',
    severity: 'HIGH'
  },
  {
    id: 'TIME-10',
    case_id: 'CASE-102',
    date: '2026-08-12',
    time: '11:45 IST',
    event: 'Execution of ₹5.0 Cr HDFC Outward Wire',
    description: 'Remittance processed from ABC Company account to Horizon Shell Corp account under false feasibility narration.',
    entities: ['ABC Company Ltd', 'Horizon Shell Corp Ltd', 'Rahul Sharma'],
    evidence: ['EV-102'],
    location: 'New Delhi',
    severity: 'CRITICAL'
  },
  {
    id: 'TIME-11',
    case_id: 'CASE-102',
    date: '2026-08-13',
    time: '02:44 IST',
    event: 'After-Hours VPN Breach & Data Exfiltration',
    description: 'Firewall logs record Rahul Sharma connecting via Swiss Tor exit node to siphon internal audit files to ProtonMail.',
    entities: ['Rahul Sharma', 'Encrypted ProtonMail Node', 'Zurich'],
    evidence: ['EV-109'],
    location: 'Zurich / New Delhi',
    severity: 'HIGH'
  },
  {
    id: 'TIME-12',
    case_id: 'CASE-102',
    date: '2026-08-13',
    time: '03:15 IST',
    event: 'Accountant Access Revocation',
    description: 'Access rights for Senior Accountant Neha Joshi summarily terminated after she refused to validate fictitious debit vouchers.',
    entities: ['Neha Joshi', 'Rahul Sharma', 'ABC Company Ltd'],
    evidence: ['EV-109'],
    location: 'New Delhi',
    severity: 'MEDIUM'
  },
  {
    id: 'TIME-13',
    case_id: 'CASE-102',
    date: '2026-08-13',
    time: '04:12 IST',
    event: 'BleachBit Anti-Forensics Execution',
    description: 'MD Vikram Malhotra executes drive scrubbing utilities on executive MacBook to erase offshore agreements.',
    entities: ['Vikram Malhotra', 'Emergency Hard Drive Wipe Attempt'],
    evidence: ['EV-112'],
    location: 'Chanakyapuri, New Delhi',
    severity: 'CRITICAL'
  },
  {
    id: 'TIME-14',
    case_id: 'CASE-102',
    date: '2026-08-14',
    time: '15:20 IST',
    event: 'Apex Holdings Wire Arrival in Dubai',
    description: 'Funds cleared into Dubai account and converted into fictitious trade invoices via Royal Logistics FZE.',
    entities: ['Apex Holdings Dubai', 'Royal Logistics FZE', 'Sunil Patel'],
    evidence: ['EV-101', 'EV-108'],
    location: 'Dubai',
    severity: 'HIGH'
  },
  {
    id: 'TIME-15',
    case_id: 'CASE-102',
    date: '2026-08-15',
    time: '09:20 IST',
    event: 'Deposit into Swiss Private Bank Vault',
    description: '$2.4M successfully credited to Swiss Horizon Account #CH-9921 under nominee lawyer Rajesh Singhania.',
    entities: ['Swiss Vault Account #CH-9921', 'Swiss Horizon Private Bank', 'Rajesh Singhania', 'Rahul Sharma', 'Vikram Malhotra'],
    evidence: ['EV-105'],
    location: 'Zurich',
    severity: 'CRITICAL'
  },
  {
    id: 'TIME-16',
    case_id: 'CASE-102',
    date: '2026-08-17',
    time: '14:00 IST',
    event: 'Interpol Corporate Register Disclosure',
    description: 'BVI Financial Services Commission returns registry confirmation revealing Amit Verma as sole shareholder.',
    entities: ['Horizon Shell Corp Ltd', 'Amit Verma', 'State Enforcement Directorate'],
    evidence: ['EV-107'],
    location: 'Tortola / New Delhi',
    severity: 'HIGH'
  },
  {
    id: 'TIME-17',
    case_id: 'CASE-102',
    date: '2026-08-20',
    time: '11:30 IST',
    event: 'Cell Tower Triangulation Match',
    description: 'Telecom carrier records place Rahul Sharma and Amit Verma at Taj Colaba during CCTV footage window.',
    entities: ['Rahul Sharma', 'Amit Verma', 'Mumbai', 'Grand Taj Luxury Hotels'],
    evidence: ['EV-110'],
    location: 'Mumbai',
    severity: 'HIGH'
  },
  {
    id: 'TIME-18',
    case_id: 'CASE-102',
    date: '2026-08-22',
    time: '06:00 IST',
    event: 'Simultaneous Search & Seizure Raids',
    description: 'Enforcement Directorate executes warrants across 5 premises; seizes iPhones, voice recorder, and creates bit-stream image of MD laptop.',
    entities: ['State Enforcement Directorate', 'Rahul Sharma', 'Vikram Malhotra', 'Amit Verma'],
    evidence: ['EV-101', 'EV-108', 'EV-112'],
    location: 'New Delhi & Mumbai',
    severity: 'CRITICAL'
  }
];

export const DEMO_AI_PRESETS_102: Record<string, AIQueryResponse> = {
  'fund_flow': {
    id: 'AI-RESP-01',
    question: 'How did funds flow from ABC Company to the offshore Swiss accounts?',
    answer: 'The investigation establishes a coordinated 4-tier laundering pipeline totaling ₹52.4 Crores diverted from ABC Company Ltd. First, funds were wired via HDFC under fictitious consultancy and logistics agreements ([EV-102], [EV-111]) over the dissent of Chief Internal Auditor Priya Kapoor ([EV-103]). Second, funds entered Horizon Shell Corp Ltd (BVI) ([EV-107]) before being routed to Royal Logistics FZE and Apex Holdings in Dubai ([EV-101], [EV-108]). Third, Hawala broker Sanjay Gupta coordinated cross-border settlement with a 4% margin, backed by bogus customs clearance from Sunil Patel ([EV-108]). Finally, $2.4M (USD) was deposited into Swiss Horizon Private Bank Account #CH-9921 in Zurich under nominee Rajesh Singhania for the ultimate benefit of Rahul Sharma and Vikram Malhotra ([EV-105]).',
    entities: ['ABC Company Ltd', 'Horizon Shell Corp Ltd', 'Apex Holdings Dubai', 'Swiss Horizon Private Bank', 'Swiss Vault Account #CH-9921', 'Rahul Sharma', 'Amit Verma', 'Sanjay Gupta', 'Vikram Malhotra', 'Rajesh Singhania'],
    relationships: [
      { source: 'ABC Company Ltd', target: 'Horizon Shell Corp Ltd', relationship: 'wired_funds_to' },
      { source: 'Horizon Shell Corp Ltd', target: 'Apex Holdings Dubai', relationship: 'routed_capital_to' },
      { source: 'Apex Holdings Dubai', target: 'Swiss Vault Account #CH-9921', relationship: 'funneled_assets_to' },
      { source: 'Rahul Sharma', target: 'Swiss Vault Account #CH-9921', relationship: 'beneficial_owner_of' }
    ],
    events: ['Bogus Overseas Wire ₹50 Cr', 'Secret Strategy Meeting at Hotel Taj', 'Deposit into Swiss Private Bank Vault'],
    supporting_evidence: [
      { evidence_id: 'EV-102', file_name: 'HDFC_Wire_Transfer_Slip_50L.pdf', snippet: 'Remitter: ABC Company Ltd to Beneficiary: Horizon Shell Corp Ltd. Narration: Feasibility Study Phase 1.', relevance_score: 0.98, sha256_prefix: '4a3b890e' },
      { evidence_id: 'EV-101', file_name: 'WhatsApp_Chat_Export_Rahul_Amit.txt', snippet: 'Rahul Sharma: "Transferring via Royal Logistics FZE to Apex Holdings Dubai tomorrow morning."', relevance_score: 0.95, sha256_prefix: '8f91a72d' },
      { evidence_id: 'EV-108', file_name: 'Voice_Memo_Recorded_Meeting_Amit.m4a', snippet: 'Sanjay Gupta: "Once clearance stamp is on paper, Apex Holdings releases funds to Zurich."', relevance_score: 0.94, sha256_prefix: '4e074085' },
      { evidence_id: 'EV-105', file_name: 'Encrypted_Ledger_Swiss_Vault.zip', snippet: 'Sub-account #CH-9921 balance $6.24M. Inflow from Apex Holdings Dubai via Hawala bridge.', relevance_score: 0.97, sha256_prefix: '7f83b165' }
    ],
    confidence: 0.96,
    timestamp: '2026-09-23T11:00:00Z'
  },
  'rahul_amit': {
    id: 'AI-RESP-02',
    question: 'What is the connection between Rahul Sharma, Amit Verma, and the Dubai entities?',
    answer: 'Rahul Sharma (CFO of ABC Company) and Amit Verma act as co-conspirators in establishing and operating the fraudulent corporate layer. WhatsApp forensics ([EV-101]) and cell tower CDRs ([EV-110]) confirm both individuals flew together from Delhi to Mumbai on 11-Aug-2026 ([EV-106]) and met at Grand Taj Luxury Hotel with hawala broker Sanjay Gupta, verified by CCTV ([EV-104]). Amit Verma was installed as the sole director of Horizon Shell Corp (BVI) ([EV-107]) and coordinated transit payments to Apex Holdings Dubai and Royal Logistics FZE ([EV-108]). Recorded audio reveals Amit negotiated the 4% laundering fee directly while Rahul used executive authority to override internal audit objections in Delhi ([EV-111]).',
    entities: ['Rahul Sharma', 'Amit Verma', 'Sanjay Gupta', 'Apex Holdings Dubai', 'Royal Logistics FZE', 'Grand Taj Luxury Hotels', 'Mumbai', 'Dubai'],
    relationships: [
      { source: 'Rahul Sharma', target: 'Amit Verma', relationship: 'contacted' },
      { source: 'Rahul Sharma', target: 'Grand Taj Luxury Hotels', relationship: 'visited_venue' },
      { source: 'Amit Verma', target: 'Horizon Shell Corp Ltd', relationship: 'director_of' },
      { source: 'Amit Verma', target: 'Apex Holdings Dubai', relationship: 'coordinated_transfer' }
    ],
    events: ['Travel from Delhi to Mumbai', 'Secret Strategy Meeting at Hotel Taj', 'Recorded Hawala Kickback Discussion', 'WhatsApp Confirmation of Wire'],
    supporting_evidence: [
      { evidence_id: 'EV-101', file_name: 'WhatsApp_Chat_Export_Rahul_Amit.txt', snippet: 'Direct messages coordinating invoice clearance and keeping internal audit uninformed.', relevance_score: 0.97, sha256_prefix: '8f91a72d' },
      { evidence_id: 'EV-104', file_name: 'CCTV_Footage_Hotel_Taj_Lobby_Mumbai.mp4', snippet: 'Facial recognition match 98.4% entering Private Lounge 3 with Amit Verma and Sanjay Gupta.', relevance_score: 0.96, sha256_prefix: 'e3b0c442' },
      { evidence_id: 'EV-106', file_name: 'Flight_Ticket_PNR_DEL_BOM_IndiGo.pdf', snippet: 'Consecutive PNR K9X7W2 on IndiGo 6E 2041 billed to corporate card.', relevance_score: 0.92, sha256_prefix: '6b86b273' },
      { evidence_id: 'EV-107', file_name: 'Offshore_Entity_Registration_BVI.pdf', snippet: 'BVI Registrar records showing Amit Verma as sole shareholder.', relevance_score: 0.93, sha256_prefix: 'd4735e3a' }
    ],
    confidence: 0.94,
    timestamp: '2026-09-23T11:05:00Z'
  },
  'tampering': {
    id: 'AI-RESP-03',
    question: 'Is there evidence of deliberate tampering or anti-forensics by the suspects?',
    answer: 'Yes, strong multi-source digital evidence confirms active tampering and destruction of records. On 13-Aug-2026 at 02:44 IST, firewall logs demonstrate Rahul Sharma used an encrypted Swiss Tor proxy to exfiltrate internal audit files to a ProtonMail repository ([EV-109]), directly followed by revoking ledger credentials for accountant Neha Joshi. Later that night at 04:12 IST, Managing Director Vikram Malhotra executed BleachBit and Eraser v6.2 on his seized MacBook Pro ([EV-112]) to scrub unallocated space. Forensics carved deleted communications acknowledging that the fraudulent wires had to clear before statutory auditors resigned. All original artifacts have been sealed and verified via SHA-256 hash preservation in the Chain of Custody.',
    entities: ['Rahul Sharma', 'Vikram Malhotra', 'Neha Joshi', 'Encrypted ProtonMail Node', 'Emergency Hard Drive Wipe Attempt'],
    relationships: [
      { source: 'Vikram Malhotra', target: 'Emergency Hard Drive Wipe Attempt', relationship: 'executed_wipe' },
      { source: 'Rahul Sharma', target: 'Encrypted ProtonMail Node', relationship: 'communicated_via' }
    ],
    events: ['After-Hours VPN Breach & Data Exfiltration', 'Accountant Access Revocation', 'BleachBit Anti-Forensics Execution'],
    supporting_evidence: [
      { evidence_id: 'EV-112', file_name: 'Seized_MacBook_Pro_Disk_Image_Hash.dd', snippet: 'Carved unallocated clusters prove execution of BleachBit and recovery of deleted cover-up emails.', relevance_score: 0.99, sha256_prefix: 'f2ca1bb6' },
      { evidence_id: 'EV-109', file_name: 'Firewall_VPN_Gateway_Access_Logs.csv', snippet: 'Anomalous 02:44 AM VPN connection from Zurich Tor exit node exfiltrating workpapers.', relevance_score: 0.95, sha256_prefix: '4b227777' }
    ],
    confidence: 0.98,
    timestamp: '2026-09-23T11:10:00Z'
  }
};
