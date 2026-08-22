import { useState, useEffect, useCallback } from "react";
import {
  FileText,
  Trash2,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { listDocuments, deleteDocument } from "../lib/api";
import type { DocumentSummary } from "../types";

export function DocumentList() {
  const [documents, setDocuments] = useState<DocumentSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDocuments = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const docs = await listDocuments();
      setDocuments(docs);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load documents");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const handleDelete = async (id: string) => {
    try {
      await deleteDocument(id);
      setDocuments((prev) => prev.filter((d) => d.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-100">Documents</h2>
          <p className="text-slate-400 mt-1">
            Manage your indexed documents.
          </p>
        </div>
        <button
          onClick={fetchDocuments}
          disabled={isLoading}
          className="btn-primary flex items-center gap-2 text-sm"
        >
          <RefreshCw
            className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
          />
          Refresh
        </button>
      </div>

      {error && (
        <div className="card flex items-start gap-3 border-red-500/30 bg-red-500/5">
          <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {!isLoading && documents.length === 0 && (
        <div className="card text-center py-12">
          <FileText className="w-12 h-12 text-slate-700 mx-auto mb-4" />
          <p className="text-slate-500">No documents uploaded yet.</p>
        </div>
      )}

      <div className="space-y-3">
        {documents.map((doc) => (
          <div key={doc.id} className="card flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-indigo-500/10 p-3 rounded-lg">
                <FileText className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <p className="text-slate-200 font-medium">{doc.filename}</p>
                <p className="text-slate-500 text-xs mt-0.5">
                  {doc.chunk_count} chunks &middot; {doc.status}
                </p>
              </div>
            </div>
            <button
              onClick={() => handleDelete(doc.id)}
              className="btn-danger flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
