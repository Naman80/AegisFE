import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { TooltipProvider } from "@/components/ui/Tooltip";
import { DatasourceProvider } from "@/contexts/DatasourceContext";

export default function AppLayout() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <DatasourceProvider>
      <TooltipProvider delayDuration={400}>
        <div className="flex h-screen overflow-hidden bg-background font-body text-on-background">
        <Sidebar isCollapsed={isSidebarCollapsed} onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />
        <main className="flex-1 flex flex-col relative overflow-hidden bg-surface">
          <div className="flex-1 overflow-y-auto w-full max-w-full">
            <Outlet />
          </div>
        </main>
        {/* <AegisAssistant /> */}
      </div>
      </TooltipProvider>
    </DatasourceProvider>
  );
}
