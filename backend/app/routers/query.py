from fastapi import APIRouter

from app.models import QueryRequest, QueryResponse, Source
from app.services.rag import RAGService

router = APIRouter(prefix="/api/query", tags=["query"])

rag_service = RAGService()


@router.post("", response_model=QueryResponse)
async def query_documents(req: QueryRequest) -> QueryResponse:
    answer, sources_data = await rag_service.query(req.question)
    sources = [
        Source(
            chunk_id=s["chunk_id"],
            text_snippet=s["text_snippet"],
            metadata=s["metadata"],
        )
        for s in sources_data
    ]
    return QueryResponse(answer=answer, sources=sources)
