import hashlib
import uuid

from fastapi import APIRouter, File, HTTPException, UploadFile

from app.models import DocumentSummary, DocumentUpload
from app.services.rag import RAGService

router = APIRouter(prefix="/api/documents", tags=["documents"])

rag_service = RAGService()


@router.post("/upload", response_model=DocumentUpload)
async def upload_document(file: UploadFile = File(...)) -> DocumentUpload:
    if not file.filename:
        raise HTTPException(status_code=400, detail="No filename provided")

    content = await file.read()
    text = content.decode("utf-8", errors="ignore")

    document_id = hashlib.sha256(f"{uuid.uuid4()}:{file.filename}".encode()).hexdigest()[:12]
    chunk_count = await rag_service.ingest_document(document_id, file.filename, text)

    return DocumentUpload(
        document_id=document_id,
        filename=file.filename,
        status="indexed",
        chunk_count=chunk_count,
    )


@router.get("", response_model=list[DocumentSummary])
async def list_documents() -> list[DocumentSummary]:
    docs = rag_service.embeddings.list_documents()
    return [
        DocumentSummary(
            id=d["id"],
            filename=d["filename"],
            chunk_count=d["chunk_count"],
            status="indexed",
        )
        for d in docs
    ]


@router.delete("/{document_id}")
async def delete_document(document_id: str) -> dict[str, str]:
    deleted = rag_service.embeddings.delete_document(document_id)
    if deleted == 0:
        raise HTTPException(status_code=404, detail="Document not found")
    return {"status": "deleted", "chunks_removed": str(deleted)}
