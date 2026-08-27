from unittest.mock import AsyncMock, patch

import pytest
from httpx import ASGITransport, AsyncClient

from app.main import app


@pytest.fixture
def anyio_backend():
    return "asyncio"


@pytest.mark.anyio
async def test_upload_document():
    mock_ingest = AsyncMock(return_value=5)
    with patch("app.routers.documents.rag_service") as mock_rag:
        mock_rag.ingest_document = mock_ingest
        async with AsyncClient(
            transport=ASGITransport(app=app), base_url="http://test"
        ) as client:
            response = await client.post(
                "/api/documents/upload",
                files={"file": ("test.txt", b"Hello world test content", "text/plain")},
            )
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "indexed"
    assert "document_id" in data


@pytest.mark.anyio
async def test_list_documents():
    with patch("app.routers.documents.rag_service") as mock_rag:
        mock_rag.embeddings.list_documents.return_value = [
            {"id": "doc1", "filename": "test.pdf", "chunk_count": 3}
        ]
        async with AsyncClient(
            transport=ASGITransport(app=app), base_url="http://test"
        ) as client:
            response = await client.get("/api/documents")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["filename"] == "test.pdf"


@pytest.mark.anyio
async def test_delete_document():
    with patch("app.routers.documents.rag_service") as mock_rag:
        mock_rag.embeddings.delete_document.return_value = 3
        async with AsyncClient(
            transport=ASGITransport(app=app), base_url="http://test"
        ) as client:
            response = await client.delete("/api/documents/doc1")
    assert response.status_code == 200
    assert response.json()["status"] == "deleted"


@pytest.mark.anyio
async def test_delete_document_not_found():
    with patch("app.routers.documents.rag_service") as mock_rag:
        mock_rag.embeddings.delete_document.return_value = 0
        async with AsyncClient(
            transport=ASGITransport(app=app), base_url="http://test"
        ) as client:
            response = await client.delete("/api/documents/nonexistent")
    assert response.status_code == 404
