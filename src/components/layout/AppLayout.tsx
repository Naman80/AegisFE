import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import TopNavBar from "./TopNavBar";
// import AegisAssistant from "./AegisAssistant";

export default function AppLayout() {
  return (
    <div className="flex h-screen overflow-hidden bg-background font-body text-on-background">
      <Sidebar />
      <main className="flex-1 flex flex-col relative overflow-hidden bg-surface">
        <TopNavBar />
        <div className="flex-1 overflow-y-auto w-full max-w-full">
          <Outlet />
        </div>
      </main>
      {/* <AegisAssistant /> */}
    </div>
  );
}
