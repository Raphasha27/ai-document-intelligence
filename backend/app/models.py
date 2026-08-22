from pydantic import BaseModel


class DocumentUpload(BaseModel):
    document_id: str
    filename: str
    status: str = "indexed"
    chunk_count: int = 0


class Source(BaseModel):
    chunk_id: str
    text_snippet: str
    metadata: dict[str, str] = {}


class QueryRequest(BaseModel):
    question: str


class QueryResponse(BaseModel):
    answer: str
    sources: list[Source]


class DocumentSummary(BaseModel):
    id: str
    filename: str
    chunk_count: int
    status: str
