import { useState, useEffect } from "react";
import { Layout } from "./components/Layout";
import { DocumentUploadComponent } from "./components/DocumentUpload";
import { QueryPanel } from "./components/QueryPanel";
import { DocumentList } from "./components/DocumentList";
import type { Page } from "./types";

function App() {
  const [currentPage, setCurrentPage] = useState<Page>("upload");
  const [isHealthy, setIsHealthy] = useState(false);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const res = await fetch("/health");
        setIsHealthy(res.ok);
      } catch {
        setIsHealthy(false);
      }
    };
    checkHealth();
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case "upload":
        return <DocumentUploadComponent />;
      case "query":
        return <QueryPanel />;
      case "documents":
        return <DocumentList />;
    }
  };

  return (
    <Layout
      currentPage={currentPage}
      onNavigate={setCurrentPage}
      isHealthy={isHealthy}
    >
      {renderPage()}
    </Layout>
  );
}

export default App;
