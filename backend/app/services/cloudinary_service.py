import logging
from typing import Optional, Dict, Any
import cloudinary
import cloudinary.uploader
import cloudinary.api
from app.core.config import settings

logger = logging.getLogger(__name__)

class CloudinaryService:
    """
    Dedicated Cloudinary Binary Evidence Storage Service.
    Isolated service layer that handles upload, retrieval, and deletion of binary assets.
    """
    @staticmethod
    def _initialize():
        if CloudinaryService.is_configured():
            cloudinary.config(
                cloud_name=settings.CLOUDINARY_CLOUD_NAME,
                api_key=settings.CLOUDINARY_API_KEY,
                api_secret=settings.CLOUDINARY_API_SECRET,
                secure=True
            )

    @staticmethod
    def is_configured() -> bool:
        return bool(
            settings.CLOUDINARY_CLOUD_NAME and
            settings.CLOUDINARY_API_KEY and
            settings.CLOUDINARY_API_SECRET
        )

    @staticmethod
    def upload_evidence(
        file_path_or_bytes,
        case_id: str,
        evidence_id: str,
        file_name: str,
        resource_type: str = "auto"
    ) -> Optional[Dict[str, Any]]:
        """
        Uploads original binary file to Cloudinary under folder 'evidence/<case_id>'.
        Returns dict containing: public_id, secure_url, resource_type, format, bytes, version.
        Returns None if Cloudinary is not configured or if upload fails.
        """
        if not CloudinaryService.is_configured():
            logger.info("Cloudinary is not configured. Preserving local storage file reference.")
            return None

        try:
            CloudinaryService._initialize()
            public_id_target = f"evidence/{case_id}/{evidence_id}"

            response = cloudinary.uploader.upload(
                file_path_or_bytes,
                public_id=public_id_target,
                overwrite=True,
                resource_type=resource_type,
                tags=[case_id, evidence_id, "evidence_graph_ai"]
            )

            return {
                "public_id": response.get("public_id"),
                "secure_url": response.get("secure_url"),
                "resource_type": response.get("resource_type", "auto"),
                "format": response.get("format", ""),
                "bytes": response.get("bytes", 0),
                "version": str(response.get("version", ""))
            }
        except Exception as e:
            logger.error(f"Cloudinary upload failed for evidence '{evidence_id}': {e}")
            raise e

    @staticmethod
    def delete_evidence(public_id: str, resource_type: str = "image") -> bool:
        """
        Deletes asset from Cloudinary when explicitly requested via FastAPI.
        """
        if not CloudinaryService.is_configured() or not public_id:
            return True

        try:
            CloudinaryService._initialize()
            result = cloudinary.uploader.destroy(public_id, resource_type=resource_type)
            return result.get("result") in ["ok", "not_found"]
        except Exception as e:
            logger.warning(f"Cloudinary asset deletion failed for '{public_id}': {e}")
            return False
