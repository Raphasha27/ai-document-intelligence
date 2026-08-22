import { Brain } from "lucide-react";

interface HeaderProps {
  isHealthy: boolean;
}

export function Header({ isHealthy }: HeaderProps) {
  return (
    <header className="bg-slate-900 border-b border-slate-800 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-100">
              AI Document Intelligence
            </h1>
            <p className="text-xs text-slate-500">RAG-Powered Q&A</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${
              isHealthy ? "bg-emerald-500" : "bg-red-500"
            }`}
          />
          <span className="text-xs text-slate-500">
            {isHealthy ? "Connected" : "Disconnected"}
          </span>
        </div>
      </div>
    </header>
  );
}
