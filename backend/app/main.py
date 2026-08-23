from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import documents, query

app = FastAPI(
    title="AI Document Intelligence - RAG API",
    description="RAG-powered document Q&A with vector search",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(documents.router)
app.include_router(query.router)


@app.get("/health")
async def health_check() -> dict[str, str]:
    return {"status": "healthy", "version": "1.0.0"}
