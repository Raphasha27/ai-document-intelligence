import hashlib
from typing import Any

import chromadb
import httpx

from app.config import settings


class EmbeddingService:
    def __init__(self) -> None:
        self.chroma_client = chromadb.PersistentClient(path=settings.CHROMA_PATH)
        self.collection = self.chroma_client.get_or_create_collection(
            name=settings.CHROMA_COLLECTION,
            metadata={"hnsw:space": "cosine"},
        )
        self.ollama_base = settings.OLLAMA_BASE_URL

    def _generate_id(self, document_id: str, index: int) -> str:
        raw = f"{document_id}:{index}"
        return hashlib.sha256(raw.encode()).hexdigest()[:16]

    async def get_embedding(self, text: str) -> list[float]:
        async with httpx.AsyncClient(timeout=60.0) as client:
            response = await client.post(
                f"{self.ollama_base}/api/embeddings",
                json={"model": settings.EMBEDDING_MODEL, "prompt": text},
            )
            response.raise_for_status()
            data: dict[str, Any] = response.json()
            return data["embedding"]

    async def get_embeddings(self, texts: list[str]) -> list[list[float]]:
        embeddings: list[list[float]] = []
        for text in texts:
            embedding = await self.get_embedding(text)
            embeddings.append(embedding)
        return embeddings

    async def store_chunks(
        self, document_id: str, chunks: list[str], metadata: dict[str, str]
    ) -> None:
        embeddings = await self.get_embeddings(chunks)
        ids = [self._generate_id(document_id, i) for i in range(len(chunks))]
        metadatas = [{**metadata, "chunk_index": str(i)} for i in range(len(chunks))]
        self.collection.add(
            ids=ids,
            documents=chunks,
            embeddings=embeddings,
            metadatas=metadatas,
        )

    async def query(self, query_text: str, top_k: int = settings.TOP_K) -> list[dict[str, Any]]:
        embedding = await self.get_embedding(query_text)
        results = self.collection.query(
            query_embeddings=[embedding],
            n_results=top_k,
            include=["documents", "metadatas", "distances"],
        )
        items: list[dict[str, Any]] = []
        if results["documents"] and results["documents"][0]:
            docs = results["documents"][0]
            metas = results["metadatas"][0] if results["metadatas"] else [{}] * len(docs)
            ids = results["ids"][0] if results["ids"] else [""] * len(docs)
            for doc, meta, chunk_id in zip(docs, metas, ids):
                items.append({"chunk_id": chunk_id, "text": doc, "metadata": meta})
        return items

    def delete_document(self, document_id: str) -> int:
        results = self.collection.get(where={"document_id": document_id})
        if results["ids"]:
            self.collection.delete(ids=results["ids"])
            return len(results["ids"])
        return 0

    def list_documents(self) -> list[dict[str, Any]]:
        all_results = self.collection.get(include=["metadatas"])
        doc_map: dict[str, dict[str, Any]] = {}
        if all_results["metadatas"]:
            for meta in all_results["metadatas"]:
                doc_id = meta.get("document_id", "unknown")
                if doc_id not in doc_map:
                    doc_map[doc_id] = {
                        "id": doc_id,
                        "filename": meta.get("filename", "unknown"),
                        "chunk_count": 0,
                    }
                doc_map[doc_id]["chunk_count"] += 1
        return list(doc_map.values())
