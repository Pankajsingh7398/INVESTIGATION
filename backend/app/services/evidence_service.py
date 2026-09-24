import os
from typing import List
from sqlalchemy.orm import Session
from fastapi import UploadFile
from app.core.config import settings
from app.models.case import Case
from app.models.evidence import Evidence, EvidenceProcessing
from app.models.custody import ChainOfCustody
from app.schemas.evidence import EvidenceUploadResponse, EvidenceResponse
from app.storage.file_store import FileStore
from app.core.exceptions import AppException
from app.services.ai_gateway import AIGatewayService
from app.services.cloudinary_service import CloudinaryService

class EvidenceService:
    @staticmethod
    def get_next_evidence_id(db: Session, case_db_id: str) -> str:
        count = db.query(Evidence).filter(Evidence.case_id == case_db_id).count()
        return f"EV-{count + 1:03d}"

    @staticmethod
    def get_next_job_id(db: Session) -> str:
        count = db.query(EvidenceProcessing).count()
        return f"JOB-{1000 + count + 1}"

    @staticmethod
    async def upload_evidence(
        db: Session,
        case_id_or_human: str,
        file: UploadFile,
        file_type_override: str = None
    ) -> EvidenceUploadResponse:
        # 1. Resolve Case
        case_obj = db.query(Case).filter((Case.id == case_id_or_human) | (Case.human_id == case_id_or_human)).first()
        if not case_obj:
            raise AppException(code="CASE_NOT_FOUND", message=f"Case '{case_id_or_human}' not found", status_code=404)

        if not file.filename:
            raise AppException(code="INVALID_FILE", message="Uploaded file must have a filename", status_code=400)

        # 2. File size validation check against MAX_UPLOAD_SIZE_MB
        max_bytes = settings.MAX_UPLOAD_SIZE_MB * 1024 * 1024
        file.file.seek(0, 2)
        actual_size = file.file.tell()
        await file.seek(0)

        if actual_size > max_bytes:
            raise AppException(
                code="FILE_TOO_LARGE",
                message=f"File size exceeds maximum limit of {settings.MAX_UPLOAD_SIZE_MB}MB",
                status_code=400
            )

        # 3. Generate Evidence & Job IDs
        ev_human_id = EvidenceService.get_next_evidence_id(db, case_obj.id)
        job_human_id = EvidenceService.get_next_job_id(db)

        # 4. Save file locally & compute original SHA-256 hash BEFORE any transformation
        file_path, file_name, sha256_hash, file_size_bytes = await FileStore.save_file(file, case_obj.id)
        file_size_formatted = FileStore.format_size(file_size_bytes)

        # Infer file type
        ext = os.path.splitext(file_name)[1].lower()
        file_type = file_type_override or "Document"
        resource_type = "raw"
        if ext in ['.png', '.jpg', '.jpeg', '.webp', '.gif']:
            file_type = "Image"
            resource_type = "image"
        elif ext in ['.mp4', '.avi', '.mov', '.mkv']:
            file_type = "Video"
            resource_type = "video"
        elif ext in ['.mp3', '.wav', '.m4a']:
            file_type = "Audio"
            resource_type = "video"
        elif ext in ['.pdf', '.doc', '.docx', '.json', '.csv', '.xlsx']:
            file_type = "Document"
            resource_type = "raw"

        # 5. Upload original evidence file to Cloudinary
        c_metadata = None
        try:
            c_metadata = CloudinaryService.upload_evidence(
                file_path_or_bytes=file_path,
                case_id=case_obj.human_id,
                evidence_id=ev_human_id,
                file_name=file_name,
                resource_type=resource_type
            )
        except Exception as e:
            raise AppException(code="STORAGE_UPLOAD_ERROR", message=f"Cloudinary file upload failed: {str(e)}", status_code=500)

        # 6. Create PostgreSQL Evidence Record with Transaction Safety
        try:
            evidence_obj = Evidence(
                evidence_id=ev_human_id,
                case_id=case_obj.id,
                file_name=file_name,
                file_type=file_type,
                file_size=file_size_formatted,
                storage_path=file_path,
                cloudinary_public_id=c_metadata.get("public_id") if c_metadata else None,
                cloudinary_url=c_metadata.get("secure_url") if c_metadata else None,
                cloudinary_resource_type=c_metadata.get("resource_type") if c_metadata else None,
                cloudinary_format=c_metadata.get("format") if c_metadata else None,
                cloudinary_version=c_metadata.get("version") if c_metadata else None,
                sha256=sha256_hash,
                status="PROCESSING"
            )
            db.add(evidence_obj)
            db.commit()
            db.refresh(evidence_obj)

            # Create Chain of Custody Record
            custody_record = ChainOfCustody(
                evidence_id=evidence_obj.id,
                action="Uploaded, SHA-256 Generated & Cloudinary Stored",
                actor="Investigator (System Ingestion)",
                sha256_hash=sha256_hash,
                status="VERIFIED",
                details=f"Original file '{file_name}' ingested. Hash: {sha256_hash[:12]}... Cloudinary URL: {c_metadata.get('secure_url') if c_metadata else 'Local'}"
            )
            db.add(custody_record)

            # Create Processing Job Record
            job_obj = EvidenceProcessing(
                job_id=job_human_id,
                evidence_id=evidence_obj.id,
                status="PROCESSING"
            )
            db.add(job_obj)
            db.commit()
            db.refresh(job_obj)
        except Exception as db_err:
            db.rollback()
            # Clean up newly uploaded Cloudinary asset if DB transaction fails
            if c_metadata and c_metadata.get("public_id"):
                CloudinaryService.delete_evidence(c_metadata["public_id"], resource_type=resource_type)
            raise AppException(code="DATABASE_ERROR", message=f"Failed to record evidence in database: {str(db_err)}", status_code=500)

        # 7. Dispatch processing job to Khushboo's AI Gateway
        await AIGatewayService.dispatch_processing_job(
            job_id=job_human_id,
            case_id=case_obj.human_id,
            evidence_id=ev_human_id,
            file_path=c_metadata.get("secure_url") if c_metadata else file_path,
            file_hash=sha256_hash
        )

        return EvidenceUploadResponse(
            evidence_id=ev_human_id,
            job_id=job_human_id,
            status="PROCESSING",
            cloudinary_public_id=c_metadata.get("public_id") if c_metadata else None,
            cloudinary_url=c_metadata.get("secure_url") if c_metadata else None
        )

    @staticmethod
    def get_case_evidence(db: Session, case_id_or_human: str) -> List[EvidenceResponse]:
        case_obj = db.query(Case).filter((Case.id == case_id_or_human) | (Case.human_id == case_id_or_human)).first()
        if not case_obj:
            raise AppException(code="CASE_NOT_FOUND", message=f"Case '{case_id_or_human}' not found", status_code=404)

        items = db.query(Evidence).filter(Evidence.case_id == case_obj.id).all()
        return [EvidenceResponse.model_validate(item) for item in items]

    @staticmethod
    def get_evidence_detail(db: Session, evidence_id_or_human: str) -> EvidenceResponse:
        item = db.query(Evidence).filter(
            (Evidence.id == evidence_id_or_human) | (Evidence.evidence_id == evidence_id_or_human)
        ).first()
        if not item:
            raise AppException(code="EVIDENCE_NOT_FOUND", message=f"Evidence '{evidence_id_or_human}' not found", status_code=404)
        return EvidenceResponse.model_validate(item)

    @staticmethod
    def delete_evidence(db: Session, evidence_id_or_human: str) -> dict:
        item = db.query(Evidence).filter(
            (Evidence.id == evidence_id_or_human) | (Evidence.evidence_id == evidence_id_or_human)
        ).first()
        if not item:
            raise AppException(code="EVIDENCE_NOT_FOUND", message=f"Evidence '{evidence_id_or_human}' not found", status_code=404)

        # 1. Delete from Cloudinary if asset exists
        if item.cloudinary_public_id:
            res_type = item.cloudinary_resource_type or "image"
            CloudinaryService.delete_evidence(item.cloudinary_public_id, resource_type=res_type)

        # 2. Delete/Archive DB record
        db.delete(item)
        db.commit()
        return {"message": f"Evidence '{evidence_id_or_human}' deleted successfully"}
