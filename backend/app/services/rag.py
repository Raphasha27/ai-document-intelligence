import httpx

from app.config import settings
from app.services.embeddings import EmbeddingService

PROMPT_TEMPLATE = (
    "You are a helpful document assistant. Answer the user's question based ONLY on the "
    "following context extracted from uploaded documents. If the context does not contain "
    "enough information to answer, say so clearly.\n"
    "\n"
    "Context:\n"
    "{context}\n"
    "\n"
    "Question: {question}\n"
    "\n"
    "Answer:"
)


def chunk_text(text: str, chunk_size: int = settings.CHUNK_SIZE, overlap: int = settings.CHUNK_OVERLAP) -> list[str]:
    words = text.split()
    chunks: list[str] = []
    for i in range(0, len(words), chunk_size - overlap):
        chunk = " ".join(words[i : i + chunk_size])
        if chunk.strip():
            chunks.append(chunk)
    return chunks


class RAGService:
    def __init__(self) -> None:
        self.embeddings = EmbeddingService()

    async def ingest_document(self, document_id: str, filename: str, text: str) -> int:
        chunks = chunk_text(text)
        if not chunks:
            return 0
        metadata = {"document_id": document_id, "filename": filename}
        await self.embeddings.store_chunks(document_id, chunks, metadata)
        return len(chunks)

    async def query(self, question: str) -> tuple[str, list[dict[str, str]]]:
        results = await self.embeddings.query(question, top_k=settings.TOP_K)
        if not results:
            return "No relevant documents found. Please upload a document first.", []

        context_parts = [r["text"] for r in results]
        context = "\n\n---\n\n".join(context_parts)
        prompt = PROMPT_TEMPLATE.format(context=context, question=question)

        answer = await self._generate(prompt)

        sources = [
            {
                "chunk_id": r["chunk_id"],
                "text_snippet": r["text"][:300],
                "metadata": r["metadata"],
            }
            for r in results
        ]
        return answer, sources

    async def _generate(self, prompt: str) -> str:
        async with httpx.AsyncClient(timeout=120.0) as client:
            response = await client.post(
                f"{settings.OLLAMA_BASE_URL}/api/generate",
                json={
                    "model": settings.MODEL_NAME,
                    "prompt": prompt,
                    "stream": False,
                },
            )
            response.raise_for_status()
            data = response.json()
            return data.get("response", "No response generated.")
