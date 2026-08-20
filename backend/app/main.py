from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="AI Document Intelligence - RAG API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class QueryRequest(BaseModel):
    document_id: str
    question: str

@app.post("/api/documents/upload")
async def upload_document(file: UploadFile = File(...)):
    # Mocking ingestion & vector DB embedding
    return {"document_id": "doc_12345", "filename": file.filename, "status": "indexed"}

@app.post("/api/chat/query")
async def query_document(req: QueryRequest):
    # Mocking RAG retrieval + LLM synthesis
    return {
        "answer": f"Based on the uploaded document, here is the answer to: '{req.question}'. The system found 3 relevant text chunks using semantic search.",
        "sources": [
            {"page": 1, "text_snippet": "...relevant context from page 1..."},
            {"page": 3, "text_snippet": "...more context from page 3..."}
        ]
    }
