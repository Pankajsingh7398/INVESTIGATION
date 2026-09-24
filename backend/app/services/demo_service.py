from sqlalchemy.orm import Session
from app.models.case import Case
from app.models.evidence import Evidence, EvidenceProcessing
from app.models.entity import Entity
from app.models.relationship import Relationship
from app.models.timeline import TimelineEvent
from app.models.custody import ChainOfCustody
from app.models.assistant import AIQuery, AICitation
from app.schemas.case import CaseResponse
from app.services.case_service import CaseService

class DemoService:
    @staticmethod
    def load_demo_dataset(db: Session) -> CaseResponse:
        """
        Seeds deterministic Case #102 — Financial Fraud Investigation.
        12 evidence records, 31 entities, 18 timeline events, 42 relationships.
        Works fully standalone without Khushboo's AI service.
        """
        # 1. Clean existing Case #102 if present
        existing_case = db.query(Case).filter(Case.human_id == "CASE-102").first()
        if existing_case:
            db.delete(existing_case)
            db.commit()

        # 2. Create Case #102
        case_obj = Case(
            human_id="CASE-102",
            name="Operation Paper Trail — Multi-Jurisdiction Financial Fraud",
            description="Investigation into systemic diversion of corporate reserves amounting to ₹52.4 Crores from ABC Company Ltd. through fictitious consultancy invoices, offshore shell corporations in BVI and Dubai, and covert hawala channels.",
            investigator="Insp. Alok Vishwakarma",
            status="ACTIVE",
            priority="CRITICAL"
        )
        db.add(case_obj)
        db.commit()
        db.refresh(case_obj)

        # 3. Add 31 Entities
        entities_data = [
            # Persons
            ("ENT-001", "Rahul Sharma", "PERSON", {"role": "Chief Financial Officer (CFO)", "status": "Prime Suspect"}),
            ("ENT-002", "Amit Verma", "PERSON", {"role": "Managing Director, Royal Logistics FZE", "status": "Co-conspirator"}),
            ("ENT-003", "Priya Kapoor", "PERSON", {"role": "Chief Internal Auditor", "status": "Whistleblower"}),
            ("ENT-004", "Vikram Malhotra", "PERSON", {"role": "Managing Director (MD)", "status": "Under Investigation"}),
            ("ENT-005", "Suresh Hawaladar", "PERSON", {"role": "Hawala Operator, Zaveri Bazaar", "status": "Arrested"}),
            ("ENT-006", "Karan Singhania", "PERSON", {"role": "Offshore Director, BVI", "status": "Absconding"}),
            ("ENT-007", "Rohan Mehta", "PERSON", {"role": "Accountant, ABC Corp", "status": "Witness"}),
            ("ENT-008", "Neha Sen", "PERSON", {"role": "Legal Counsel, Apex Holdings", "status": "Person of Interest"}),

            # Organizations & Shell Companies
            ("ENT-009", "ABC Company Ltd", "ORGANIZATION", {"type": "Public Listed Entity", "hq": "New Delhi"}),
            ("ENT-010", "Royal Logistics FZE", "ORGANIZATION", {"type": "Free Zone Entity", "jurisdiction": "Sharjah / Dubai"}),
            ("ENT-011", "Apex Holdings Dubai", "ORGANIZATION", {"type": "Offshore Entity", "jurisdiction": "Dubai UAE"}),
            ("ENT-012", "Horizon Shell Corp Ltd", "ORGANIZATION", {"type": "Shell Company", "jurisdiction": "British Virgin Islands (BVI)"}),
            ("ENT-013", "Zenith Global Enterprises", "ORGANIZATION", {"type": "Front Company", "jurisdiction": "Cayman Islands"}),
            ("ENT-014", "HDFC Bank", "ORGANIZATION", {"type": "Financial Institution", "branch": "Connaught Place, New Delhi"}),
            ("ENT-015", "Emirates NBD Bank", "ORGANIZATION", {"type": "Financial Institution", "branch": "Downtown Dubai"}),
            ("ENT-016", "Standard Chartered Bank", "ORGANIZATION", {"type": "Financial Institution", "branch": "Mumbai"}),
            ("ENT-017", "Enforcement Directorate", "ORGANIZATION", {"type": "Law Enforcement", "agency": "ED Cyber Cell"}),

            # Locations
            ("ENT-018", "New Delhi", "LOCATION", {"type": "Jurisdiction / HQ"}),
            ("ENT-019", "Mumbai", "LOCATION", {"type": "Financial Hub / Meeting Site"}),
            ("ENT-020", "Dubai", "LOCATION", {"type": "Offshore Financial Hub"}),
            ("ENT-021", "British Virgin Islands", "LOCATION", {"type": "Tax Haven Jurisdiction"}),
            ("ENT-022", "Taj Mahal Palace Hotel Mumbai", "LOCATION", {"type": "Meeting Site"}),
            ("ENT-023", "Zaveri Bazaar Mumbai", "LOCATION", {"type": "Hawala Cash Handover Location"}),

            # Events
            ("ENT-024", "Board Resolution 28-July", "EVENT", {"date": "2026-07-28"}),
            ("ENT-025", "Secret Lobby Meeting Mumbai", "EVENT", {"date": "2026-08-10"}),
            ("ENT-026", "Wire Transfer 18 Crores", "EVENT", {"date": "2026-08-12"}),
            ("ENT-027", "Hawala Cash Exchange 5 Crores", "EVENT", {"date": "2026-08-15"}),
            ("ENT-028", "Internal Audit Red Flag", "EVENT", {"date": "2026-08-18"}),

            # Financial/Other
            ("ENT-029", "Consultancy Invoice INV-2026-88", "OTHER", {"amount": "₹18,00,00,000"}),
            ("ENT-030", "Consultancy Invoice INV-2026-92", "OTHER", {"amount": "₹34,40,00,000"}),
            ("ENT-031", "Cryptographic Hash Forensic Log", "OTHER", {"hash_type": "SHA-256"})
        ]

        entity_id_map = {}
        for ent_id, name, etype, meta in entities_data:
            ent = Entity(
                entity_id=ent_id,
                case_id=case_obj.id,
                name=name,
                type=etype,
                metadata_json=meta
            )
            db.add(ent)
            entity_id_map[ent_id] = name
            entity_id_map[name] = ent_id

        db.commit()

        # 4. Add 12 Evidence Records + Custody Records
        evidence_data = [
            ("EV-101", "WhatsApp_Chat_Export_Rahul_Amit.txt", "Chat", "1.4 MB", "8f91a72d3e9b1049c67bb8f12d8a5439a2632b7194f4a9b5f5431682337e6f88",
             "Rahul Sharma: Amit, second tranche of ₹18 Cr is cleared under Consultancy Invoice INV-2026-88.\nAmit Verma: Transferring via Royal Logistics FZE to Apex Holdings Dubai tomorrow."),
            ("EV-102", "HDFC_Wire_Transfer_Slip_50L.pdf", "Financial Record", "3.2 MB", "4a3b890ef9c4217da7e31b67f10b54e389df0b7a8c3d2e1f40985a6b7c8d9e0f",
             "HDFC BANK OUTWARD REMITTANCE: INR 50,000,000 from ABC Company Ltd to Horizon Shell Corp Ltd."),
            ("EV-103", "ABC_Corp_Board_Resolution_Minutes.pdf", "Document", "5.1 MB", "91c4d8e72b0f1a638e9d5a7b3c2e1f40985a6b7c8d9e0fa3b890ef9c4217da7e",
             "Board meeting approving retainership up to INR 55 Crores to Horizon Shell Corp Ltd (BVI). Moved by Vikram Malhotra, seconded by Rahul Sharma."),
            ("EV-104", "CCTV_Footage_Hotel_Taj_Lobby_Mumbai.mp4", "Image", "48.6 MB", "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
             "Video analytics verified faces: Rahul Sharma, Amit Verma, and Suresh Hawaladar present in Hotel Taj Lobby."),
            ("EV-105", "Hawala_Ledger_Handwritten_Notebook.png", "Image", "8.9 MB", "7f8e9d0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e",
             "Handwritten entry: 15-Aug ₹5,00,00,000 delivered to R.S. New Delhi via Suresh operator."),
            ("EV-106", "Email_Thread_Priya_Kapoor_Audit.eml", "Document", "840 KB", "1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b",
             "Priya Kapoor to Vikram Malhotra: Urgent warning - No physical deliverables found for INV-2026-88."),
            ("EV-107", "Dubai_Customs_Declaration_Royal_Logistics.pdf", "Financial Record", "2.1 MB", "b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3",
             "Declaration of zero material goods shipped under invoice INV-2026-88."),
            ("EV-108", "Call_Detail_Record_Rahul_Suresh.csv", "Data", "12.4 MB", "c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4",
             "47 encrypted calls recorded between Rahul Sharma (+91 98200XXXXX) and Suresh Hawaladar (+91 98111XXXXX)."),
            ("EV-109", "BVI_Corporate_Registry_Horizon_Shell.pdf", "Document", "1.8 MB", "d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5",
             "BVI Registrar: Ultimate beneficial owner of Horizon Shell Corp Ltd registered to Karan Singhania."),
            ("EV-110", "Encrypted_Signal_Chat_Backup.db", "Chat", "18.3 MB", "e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6",
             "Signal chat decryption: Discussion on routing funds through Cayman Islands front entity Zenith Global."),
            ("EV-111", "Forensic_Hard_Drive_Dump_CFO_Laptop.img", "Data", "120.4 GB", "f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7",
             "Deleted Excel sheet 'Offshore_Tranches_Master.xlsx' recovered from unallocated space on CFO laptop."),
            ("EV-112", "Seizure_Memo_ED_Search_Warrant.pdf", "Document", "950 KB", "a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2",
             "Enforcement Directorate search warrant execution report at Barakhamba Road corporate headquarters.")
        ]

        for ev_id, fname, ftype, fsize, sha, text in evidence_data:
            ev = Evidence(
                evidence_id=ev_id,
                case_id=case_obj.id,
                file_name=fname,
                file_type=ftype,
                file_size=fsize,
                storage_path=f"./uploads/{case_obj.id}/{fname}",
                sha256=sha,
                status="COMPLETED",
                extracted_text=text
            )
            db.add(ev)
            db.commit()
            db.refresh(ev)

            # Add Chain of Custody Record
            custody = ChainOfCustody(
                evidence_id=ev.id,
                action="Ingested & SHA-256 Verified",
                actor="Forensic Officer K. Rawat",
                sha256_hash=sha,
                status="VERIFIED",
                details=f"Digital evidence file '{fname}' verified with SHA-256 integrity hash."
            )
            db.add(custody)

            # Add Processing Job
            job = EvidenceProcessing(
                job_id=f"JOB-{ev_id.replace('EV-', '')}",
                evidence_id=ev.id,
                status="COMPLETED"
            )
            db.add(job)

        db.commit()

        # 5. Add 42 Relationships
        relationships_data = [
            ("Rahul Sharma", "Amit Verma", "contacted", 0.95),
            ("Rahul Sharma", "ABC Company Ltd", "employed_at", 1.0),
            ("Amit Verma", "Royal Logistics FZE", "manages", 0.98),
            ("Rahul Sharma", "Horizon Shell Corp Ltd", "transferred_funds", 0.94),
            ("ABC Company Ltd", "Horizon Shell Corp Ltd", "transferred_funds", 0.96),
            ("Vikram Malhotra", "ABC Company Ltd", "manages", 1.0),
            ("Vikram Malhotra", "Rahul Sharma", "authorized_by", 0.92),
            ("Priya Kapoor", "ABC Company Ltd", "audited", 0.99),
            ("Priya Kapoor", "Rahul Sharma", "flagged_suspicious_activity", 0.97),
            ("Rahul Sharma", "Suresh Hawaladar", "met_with", 0.91),
            ("Suresh Hawaladar", "Zaveri Bazaar Mumbai", "operates_in", 0.99),
            ("Rahul Sharma", "Taj Mahal Palace Hotel Mumbai", "attended_meeting_at", 0.93),
            ("Amit Verma", "Taj Mahal Palace Hotel Mumbai", "attended_meeting_at", 0.93),
            ("Suresh Hawaladar", "Taj Mahal Palace Hotel Mumbai", "attended_meeting_at", 0.89),
            ("Karan Singhania", "Horizon Shell Corp Ltd", "owns_shell_company", 0.98),
            ("Karan Singhania", "British Virgin Islands", "registered_in", 1.0),
            ("Royal Logistics FZE", "Apex Holdings Dubai", "transferred_funds", 0.95),
            ("Apex Holdings Dubai", "Dubai", "located_in", 1.0),
            ("Rahul Sharma", "HDFC Bank", "authorized_wire", 0.96),
            ("ABC Company Ltd", "HDFC Bank", "holds_account", 1.0),
            ("Horizon Shell Corp Ltd", "Standard Chartered Bank", "holds_account", 0.94),
            ("Rahul Sharma", "New Delhi", "resides_in", 0.95),
            ("Rahul Sharma", "Consultancy Invoice INV-2026-88", "issued_approval_for", 0.97),
            ("Consultancy Invoice INV-2026-88", "Royal Logistics FZE", "billed_to", 0.94),
            ("Consultancy Invoice INV-2026-92", "Apex Holdings Dubai", "billed_to", 0.92),
            ("Rohan Mehta", "ABC Company Ltd", "employed_at", 0.90),
            ("Rohan Mehta", "Rahul Sharma", "reported_to", 0.93),
            ("Neha Sen", "Apex Holdings Dubai", "legal_counsel_for", 0.91),
            ("Zenith Global Enterprises", "Cayman Islands", "registered_in", 0.96),
            ("Apex Holdings Dubai", "Zenith Global Enterprises", "routed_funds_to", 0.90),
            ("Enforcement Directorate", "ABC Company Ltd", "executing_search_at", 1.0),
            ("Enforcement Directorate", "Rahul Sharma", "investigating", 1.0),
            ("Board Resolution 28-July", "ABC Company Ltd", "ratified_by", 0.98),
            ("Secret Lobby Meeting Mumbai", "Taj Mahal Palace Hotel Mumbai", "occurred_at", 0.95),
            ("Wire Transfer 18 Crores", "HDFC Bank", "processed_by", 0.97),
            ("Hawala Cash Exchange 5 Crores", "Suresh Hawaladar", "facilitated_by", 0.96),
            ("Internal Audit Red Flag", "Priya Kapoor", "raised_by", 0.99),
            ("Rahul Sharma", "Cryptographic Hash Forensic Log", "associated_with", 0.92),
            ("Emirates NBD Bank", "Apex Holdings Dubai", "holds_account", 0.95),
            ("Rahul Sharma", "Mumbai", "travelled_to", 0.94),
            ("Amit Verma", "Mumbai", "travelled_to", 0.94),
            ("Suresh Hawaladar", "Rahul Sharma", "delivered_cash_to", 0.93)
        ]

        for src, tgt, rel_type, conf in relationships_data:
            rel = Relationship(
                case_id=case_obj.id,
                source_entity_id=src,
                target_entity_id=tgt,
                relationship_type=rel_type,
                confidence=conf
            )
            db.add(rel)

        # 6. Add 18 Timeline Events
        timeline_data = [
            ("2026-07-28", "Board Meeting Ratification", "Board meeting approving retainership up to ₹55 Cr to Horizon Shell Corp BVI.", ["Vikram Malhotra", "Rahul Sharma", "Priya Kapoor"], ["EV-103"]),
            ("2026-08-01", "Offshore Incorporation BVI", "Horizon Shell Corp Ltd registered in BVI under Karan Singhania.", ["Karan Singhania", "Horizon Shell Corp Ltd"], ["EV-109"]),
            ("2026-08-05", "First Wire Remittance ₹5 Cr", "HDFC outward wire transfer executed from ABC Corp to Horizon Shell Corp.", ["Rahul Sharma", "ABC Company Ltd", "Horizon Shell Corp Ltd"], ["EV-102"]),
            ("2026-08-10", "Secret Lobby Meeting Mumbai", "CCTV records Rahul Sharma, Amit Verma, and Suresh Hawaladar at Hotel Taj Lobby.", ["Rahul Sharma", "Amit Verma", "Suresh Hawaladar"], ["EV-104"]),
            ("2026-08-11", "WhatsApp Encrypted Discussion", "Rahul and Amit confirm second tranche of ₹18 Cr under Invoice INV-2026-88.", ["Rahul Sharma", "Amit Verma"], ["EV-101"]),
            ("2026-08-12", "Tranche #2 Wire Clearance ₹18 Cr", "₹18 Cr transferred via Royal Logistics FZE to Apex Holdings Dubai.", ["Rahul Sharma", "Royal Logistics FZE", "Apex Holdings Dubai"], ["EV-101", "EV-102"]),
            ("2026-08-13", "Dubai Customs Discrepancy Flag", "Customs declaration confirms zero physical cargo delivered for INV-2026-88.", ["Royal Logistics FZE", "Dubai"], ["EV-107"]),
            ("2026-08-15", "Hawala Handover Zaveri Bazaar", "Suresh Hawaladar delivers ₹5 Cr cash tranche in New Delhi.", ["Suresh Hawaladar", "Rahul Sharma"], ["EV-105"]),
            ("2026-08-18", "Internal Audit Memo Raised", "Priya Kapoor submits audit memo flagging missing delivery proofs.", ["Priya Kapoor", "Vikram Malhotra"], ["EV-106"]),
            ("2026-08-20", "CDR Record Spike Detected", "47 calls logged between Rahul Sharma and Suresh Hawaladar.", ["Rahul Sharma", "Suresh Hawaladar"], ["EV-108"]),
            ("2026-08-22", "Signal App Decryption", "Decrypted Signal chats reveal plan to route remaining ₹34.4 Cr to Cayman Islands.", ["Rahul Sharma", "Zenith Global Enterprises"], ["EV-110"]),
            ("2026-08-25", "Deleted Excel Recovery", "Forensic dump of CFO laptop recovers 'Offshore_Tranches_Master.xlsx'.", ["Rahul Sharma", "ABC Company Ltd"], ["EV-111"]),
            ("2026-08-28", "ED Subpoena Issued", "Enforcement Directorate issues Section 91 CrPC notice to HDFC Bank.", ["Enforcement Directorate", "HDFC Bank"], ["EV-102"]),
            ("2026-08-30", "Search Warrant Executed", "ED searches corporate office at Barakhamba Road New Delhi.", ["Enforcement Directorate", "ABC Company Ltd"], ["EV-112"]),
            ("2026-09-02", "Suresh Hawaladar Arrested", "Law enforcement arrests Suresh Hawaladar at Zaveri Bazaar.", ["Suresh Hawaladar", "Enforcement Directorate"], ["EV-105"]),
            ("2026-09-05", "BVI Beneficial Owner Confirmed", "BVI Registry confirms Karan Singhania as beneficial owner of Horizon Shell.", ["Karan Singhania", "Horizon Shell Corp Ltd"], ["EV-109"]),
            ("2026-09-10", "Lookout Circular (LOC) Issued", "LOC issued against Rahul Sharma and Vikram Malhotra.", ["Rahul Sharma", "Vikram Malhotra"], ["EV-112"]),
            ("2026-09-15", "ED Formal Charge Sheet Drafted", "Final forensic evidence graph compiled for judicial submission.", ["Enforcement Directorate", "Rahul Sharma"], ["EV-101", "EV-102", "EV-103"])
        ]

        for date_str, title, desc, ent_list, ev_list in timeline_data:
            ev_item = TimelineEvent(
                case_id=case_obj.id,
                date=date_str,
                event_title=title,
                description=desc,
                entities=ent_list,
                evidence_refs=ev_list
            )
            db.add(ev_item)

        db.commit()

        # 7. Add Sample AI Queries
        q1 = AIQuery(
            case_id=case_obj.id,
            question="What evidence connects Rahul Sharma and Amit Verma?",
            answer="Rahul Sharma and Amit Verma are linked via WhatsApp chat logs (EV-101) discussing the clearance of ₹18 Cr under Invoice INV-2026-88 to Apex Holdings Dubai. Furthermore, CCTV footage (EV-104) places both individuals together with Hawala operator Suresh Hawaladar at Hotel Taj Lobby, Mumbai on August 10, 2026.",
            confidence=0.96,
            entities=["Rahul Sharma", "Amit Verma", "Suresh Hawaladar", "Apex Holdings Dubai"],
            relationships=[{"source": "Rahul Sharma", "target": "Amit Verma", "relationship": "contacted"}],
            events=[{"date": "2026-08-10", "event": "Secret Lobby Meeting Mumbai"}],
            supporting_evidence=["EV-101", "EV-104"]
        )
        db.add(q1)
        db.commit()

        return CaseService.build_case_response(db, case_obj)
