export interface DocumentUpload {
  document_id: string;
  filename: string;
  status: string;
  chunk_count: number;
}

export interface Source {
  chunk_id: string;
  text_snippet: string;
  metadata: Record<string, string>;
}

export interface QueryResponse {
  answer: string;
  sources: Source[];
}

export interface DocumentSummary {
  id: string;
  filename: string;
  chunk_count: number;
  status: string;
}

export type Page = "upload" | "query" | "documents";
