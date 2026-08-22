import {
  Upload,
  MessageSquare,
  FileText,
} from "lucide-react";
import type { Page } from "../types";
import { Header } from "./Header";

interface LayoutProps {
  children: React.ReactNode;
  currentPage: Page;
  onNavigate: (page: Page) => void;
  isHealthy: boolean;
}

const navItems: { id: Page; label: string; icon: typeof Upload }[] = [
  { id: "upload", label: "Upload", icon: Upload },
  { id: "query", label: "Query", icon: MessageSquare },
  { id: "documents", label: "Documents", icon: FileText },
];

export function Layout({ children, currentPage, onNavigate, isHealthy }: LayoutProps) {
  return (
    <div className="flex h-screen bg-slate-950">
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col">
        <Header isHealthy={isHealthy} />
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={
                  currentPage === item.id
                    ? "sidebar-link-active w-full"
                    : "sidebar-link w-full"
                }
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm">{item.label}</span>
              </button>
            );
          })}
        </nav>
        <div className="p-4 border-t border-slate-800">
          <p className="text-xs text-slate-600 text-center">
            v1.0.0 &middot; Built with FastAPI + React
          </p>
        </div>
      </aside>
      <main className="flex-1 overflow-auto">
        <div className="p-8 max-w-5xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
