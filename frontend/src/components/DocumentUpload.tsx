import { useState, useCallback, useRef } from "react";
import { Upload, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { uploadDocument } from "../lib/api";
import type { DocumentUpload } from "../types";

export function DocumentUploadComponent() {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [result, setResult] = useState<DocumentUpload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(async (file: File) => {
    setIsUploading(true);
    setError(null);
    setResult(null);

    try {
      const uploadResult = await uploadDocument(file);
      setResult(uploadResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setIsUploading(false);
    }
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback(() => setIsDragging(false), []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-100">Upload Documents</h2>
        <p className="text-slate-400 mt-1">
          Upload text files to index them for semantic search and Q&A.
        </p>
      </div>

      <div
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onClick={() => fileInputRef.current?.click()}
        className={`card cursor-pointer transition-all duration-200 border-dashed ${
          isDragging
            ? "border-indigo-500 bg-indigo-500/5"
            : "border-slate-700 hover:border-slate-600"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept=".txt,.md,.csv,.json,.pdf"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />
        <div className="flex flex-col items-center justify-center py-12">
          {isUploading ? (
            <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mb-4" />
          ) : (
            <Upload className="w-12 h-12 text-slate-600 mb-4" />
          )}
          <p className="text-slate-300 font-medium">
            {isUploading ? "Uploading..." : "Drop a file here or click to browse"}
          </p>
          <p className="text-slate-500 text-sm mt-1">
            Supports TXT, MD, CSV, JSON, PDF
          </p>
        </div>
      </div>

      {result && (
        <div className="card flex items-start gap-3 border-emerald-500/30 bg-emerald-500/5">
          <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
          <div>
            <p className="text-emerald-400 font-medium">Upload successful</p>
            <p className="text-slate-400 text-sm mt-1">
              <span className="text-slate-300">{result.filename}</span> was
              indexed into {result.chunk_count} chunks.
            </p>
            <p className="text-slate-600 text-xs mt-1">
              ID: {result.document_id}
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="card flex items-start gap-3 border-red-500/30 bg-red-500/5">
          <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
          <div>
            <p className="text-red-400 font-medium">Upload failed</p>
            <p className="text-slate-400 text-sm mt-1">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
}
