from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    CHROMA_PATH: str = "./chroma_data"
    CHROMA_COLLECTION: str = "documents"
    OLLAMA_BASE_URL: str = "http://localhost:11434"
    MODEL_NAME: str = "llama3.2"
    EMBEDDING_MODEL: str = "nomic-embed-text"
    CHUNK_SIZE: int = 500
    CHUNK_OVERLAP: int = 50
    TOP_K: int = 5

    model_config = {"env_prefix": "RAG_"}


settings = Settings()
