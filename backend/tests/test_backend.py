import io
import pytest
from unittest.mock import patch
from app.services.cloudinary_service import CloudinaryService

def test_health_check(client):
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "Pankaj" in data["owner"]

def test_case_lifecycle(client):
    # 1. Create Case
    create_payload = {
        "name": "Test Financial Fraud Investigation",
        "description": "Testing case management API",
        "investigator": "Insp. Pankaj",
        "priority": "HIGH"
    }
    resp = client.post("/api/v1/cases", json=create_payload)
    assert resp.status_code == 201
    case_data = resp.json()
    assert case_data["name"] == create_payload["name"]
    assert case_data["human_id"].startswith("CASE-")
    case_id = case_data["id"]

    # 2. List Cases
    list_resp = client.get("/api/v1/cases")
    assert list_resp.status_code == 200
    assert len(list_resp.json()) >= 1

    # 3. Get Case Detail
    get_resp = client.get(f"/api/v1/cases/{case_id}")
    assert get_resp.status_code == 200
    assert get_resp.json()["id"] == case_id

    # 4. Update Case
    update_resp = client.put(f"/api/v1/cases/{case_id}", json={"status": "CLOSED"})
    assert update_resp.status_code == 200
    assert update_resp.json()["status"] == "CLOSED"

def test_evidence_upload_and_custody(client):
    # Create Case
    c_resp = client.post("/api/v1/cases", json={"name": "Evidence Test Case"})
    case_human_id = c_resp.json()["human_id"]

    # Upload File
    file_content = b"Dummy forensic file content for SHA-256 testing"
    file_obj = io.BytesIO(file_content)

    upload_resp = client.post(
        "/api/v1/evidence/upload",
        data={"case_id": case_human_id, "file_type": "Document"},
        files={"file": ("test_file.txt", file_obj, "text/plain")}
    )
    assert upload_resp.status_code == 201
    up_data = upload_resp.json()
    assert "evidence_id" in up_data
    assert "job_id" in up_data
    assert up_data["status"] == "PROCESSING"

    ev_id = up_data["evidence_id"]

    # Retrieve Evidence Detail
    ev_detail = client.get(f"/api/v1/evidence/{ev_id}")
    assert ev_detail.status_code == 200
    ev_json = ev_detail.json()
    assert ev_json["file_name"] == "test_file.txt"
    assert len(ev_json["sha256"]) == 64 # Verified SHA-256 hex string length

    # Chain of Custody
    custody_resp = client.get(f"/api/v1/custody/{ev_id}")
    assert custody_resp.status_code == 200
    custody_data = custody_resp.json()
    assert len(custody_data) >= 1
    assert custody_data[0]["sha256_hash"] == ev_json["sha256"]

def test_cloudinary_upload_mocked(client):
    # Mock Cloudinary upload response
    mock_c_meta = {
        "public_id": "evidence/CASE-999/EV-999",
        "secure_url": "https://res.cloudinary.com/demo/image/upload/v1234/evidence/CASE-999/EV-999.png",
        "resource_type": "image",
        "format": "png",
        "bytes": 1024,
        "version": "1234"
    }

    c_resp = client.post("/api/v1/cases", json={"name": "Cloudinary Test Case"})
    case_human_id = c_resp.json()["human_id"]

    file_obj = io.BytesIO(b"Cloudinary test image payload")

    with patch.object(CloudinaryService, 'upload_evidence', return_value=mock_c_meta):
        upload_resp = client.post(
            "/api/v1/evidence/upload",
            data={"case_id": case_human_id, "file_type": "Image"},
            files={"file": ("sample_image.png", file_obj, "image/png")}
        )
        assert upload_resp.status_code == 201
        data = upload_resp.json()
        assert data["cloudinary_public_id"] == "evidence/CASE-999/EV-999"
        assert "cloudinary.com" in data["cloudinary_url"]

        ev_id = data["evidence_id"]

        # Verify details stored in DB
        ev_detail = client.get(f"/api/v1/evidence/{ev_id}").json()
        assert ev_detail["cloudinary_public_id"] == "evidence/CASE-999/EV-999"
        assert ev_detail["cloudinary_url"] == mock_c_meta["secure_url"]

    # Test Deletion with Cloudinary Mock
    with patch.object(CloudinaryService, 'delete_evidence', return_value=True) as mock_del:
        del_resp = client.delete(f"/api/v1/evidence/{ev_id}")
        assert del_resp.status_code == 200
        mock_del.assert_called_once_with("evidence/CASE-999/EV-999", resource_type="image")

def test_file_size_limit_rejection(client):
    c_resp = client.post("/api/v1/cases", json={"name": "Size Limit Case"})
    case_human_id = c_resp.json()["human_id"]

    # Mock file size larger than 50MB
    with patch("app.core.config.settings.MAX_UPLOAD_SIZE_MB", 1): # 1MB limit for testing
        large_content = b"X" * (2 * 1024 * 1024) # 2MB
        file_obj = io.BytesIO(large_content)

        upload_resp = client.post(
            "/api/v1/evidence/upload",
            data={"case_id": case_human_id},
            files={"file": ("oversized.iso", file_obj, "application/octet-stream")}
        )
        assert upload_resp.status_code == 400
        assert upload_resp.json()["error"]["code"] == "FILE_TOO_LARGE"

def test_demo_load(client):
    load_resp = client.post("/api/v1/demo/load")
    assert load_resp.status_code == 201
    case_data = load_resp.json()
    assert case_data["human_id"] == "CASE-102"
    assert case_data["evidence_count"] == 12
    assert case_data["entity_count"] == 31
    assert case_data["event_count"] == 18

    # Query Graph API for Case-102
    graph_resp = client.get("/api/v1/graph/CASE-102")
    assert graph_resp.status_code == 200
    g_data = graph_resp.json()
    assert len(g_data["nodes"]) == 31
    assert len(g_data["edges"]) == 42

    # Query Timeline API for Case-102
    t_resp = client.get("/api/v1/timeline/CASE-102")
    assert t_resp.status_code == 200
    assert len(t_resp.json()) == 18

    # Ask AI Assistant Question
    ask_resp = client.post("/api/v1/assistant/ask", json={
        "case_id": "CASE-102",
        "question": "What evidence connects Rahul Sharma and Amit Verma?"
    })
    assert ask_resp.status_code == 200
    a_data = ask_resp.json()
    assert "Rahul" in a_data["answer"]
    assert len(a_data["supporting_evidence"]) >= 1

def test_ai_callback_ingestion_and_failure_handling(client):
    # Create Case
    c_resp = client.post("/api/v1/cases", json={"name": "Callback Test Case"})
    case_human_id = c_resp.json()["human_id"]

    # Upload File
    file_obj = io.BytesIO(b"Callback test content")
    upload_resp = client.post(
        "/api/v1/evidence/upload",
        data={"case_id": case_human_id},
        files={"file": ("callback_file.txt", file_obj, "text/plain")}
    )
    job_id = upload_resp.json()["job_id"]
    ev_id = upload_resp.json()["evidence_id"]

    # Test FAILED AI Job reporting
    fail_payload = {
        "job_id": job_id,
        "status": "FAILED",
        "error_info": "OCR failed due to corrupt image encoding"
    }
    cb_resp = client.post("/api/v1/processing/callback", json=fail_payload)
    assert cb_resp.status_code == 200
    assert cb_resp.json()["status"] == "FAILED"

    # Verify original evidence and SHA-256 are preserved
    ev_detail = client.get(f"/api/v1/evidence/{ev_id}").json()
    assert ev_detail["status"] == "FAILED"
    assert len(ev_detail["sha256"]) == 64
