import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { AICopilotPanel } from "../copilot/AICopilotPanel";

export function DashboardLayout() {
  return (
    <div className="min-h-screen flex bg-background text-foreground selection:bg-accent selection:text-accent-foreground">
      <Sidebar />
      <div className="flex-1 flex flex-col relative overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
      <AICopilotPanel />
    </div>
  );
}
