import os
import hashlib
from typing import Tuple
from fastapi import UploadFile
from app.core.config import settings

class FileStore:
    @staticmethod
    async def save_file(file: UploadFile, case_id: str) -> Tuple[str, str, str, int]:
        """
        Saves uploaded file to local filesystem, calculates SHA-256 hash.
        Returns: (file_path, file_name, sha256_hash, file_size_bytes)
        """
        case_dir = os.path.join(settings.STORAGE_DIR, case_id)
        os.makedirs(case_dir, exist_ok=True)

        file_path = os.path.join(case_dir, file.filename)
        sha256 = hashlib.sha256()
        size_bytes = 0

        with open(file_path, "wb") as buffer:
            while chunk := await file.read(8192):
                sha256.update(chunk)
                buffer.write(chunk)
                size_bytes += len(chunk)

        # Reset file pointer for future reading if needed
        await file.seek(0)

        hash_hex = sha256.hexdigest()
        return file_path, file.filename, hash_hex, size_bytes

    @staticmethod
    def format_size(size_bytes: int) -> str:
        if size_bytes < 1024:
            return f"{size_bytes} B"
        elif size_bytes < 1024 * 1024:
            return f"{size_bytes / 1024:.1f} KB"
        else:
            return f"{size_bytes / (1024 * 1024):.1f} MB"
