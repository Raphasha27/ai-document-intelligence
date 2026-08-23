from unittest.mock import AsyncMock, patch

import pytest
from app.main import app
from httpx import ASGITransport, AsyncClient


@pytest.fixture
def anyio_backend():
    return "asyncio"


@pytest.mark.anyio
async def test_query_documents():
    mock_sources = [
        {
            "chunk_id": "abc123",
            "text_snippet": "Relevant text from document",
            "metadata": {"document_id": "doc1", "filename": "test.pdf"},
        }
    ]
    with patch("app.routers.query.rag_service") as mock_rag:
        mock_rag.query = AsyncMock(return_value=("This is the answer.", mock_sources))
        async with AsyncClient(
            transport=ASGITransport(app=app), base_url="http://test"
        ) as client:
            response = await client.post(
                "/api/query",
                json={"question": "What is this about?"},
            )
    assert response.status_code == 200
    data = response.json()
    assert data["answer"] == "This is the answer."
    assert len(data["sources"]) == 1
    assert data["sources"][0]["chunk_id"] == "abc123"


@pytest.mark.anyio
async def test_query_empty_results():
    with patch("app.routers.query.rag_service") as mock_rag:
        mock_rag.query = AsyncMock(
            return_value=("No relevant documents found.", [])
        )
        async with AsyncClient(
            transport=ASGITransport(app=app), base_url="http://test"
        ) as client:
            response = await client.post(
                "/api/query",
                json={"question": "Something unrelated?"},
            )
    assert response.status_code == 200
    data = response.json()
    assert data["sources"] == []


@pytest.mark.anyio
async def test_health_check():
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as client:
        response = await client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"
