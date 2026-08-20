# 🧠 AI Document Intelligence (RAG)

![Python](https://img.shields.io/badge/Python-3.11-blue?style=for-the-badge&logo=python)
![TypeScript](https://img.shields.io/badge/TypeScript-React-blue?style=for-the-badge&logo=typescript)
![AI](https://img.shields.io/badge/AI-RAG%20Pipeline-orange?style=for-the-badge)

A full-stack Retrieval-Augmented Generation (RAG) application. Upload PDFs and chat with them using semantic search and LLMs.

## Features
- **Document Ingestion:** Parses PDFs and extracts text.
- **Vector Search:** Chunks text and creates vector embeddings for fast semantic retrieval.
- **LLM Synthesis:** Injects context into LLM prompts to generate accurate, hallucination-free answers.
- **Source Citations:** AI answers include exact snippets and page numbers from the source document.
- **Modern UI:** Built with React, TypeScript, and TailwindCSS.

## Architecture
`
[React Frontend] --> (Upload PDF) --> [FastAPI] --> (Chunking & Embeddings) --> [Vector DB]
[React Frontend] <-- (Chat Answer) <-- [FastAPI] <-- (Context + LLM Prompt) <-- [Vector DB]
`

## Running Locally
**Backend:**
cd backend && pip install -r requirements.txt && uvicorn app.main:app --reload

**Frontend:**
cd frontend && npm install && npm run dev
