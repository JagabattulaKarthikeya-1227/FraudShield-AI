import { Outlet } from"react-router-dom";
import { AnimatePresence } from"framer-motion";
import { Sidebar } from"./Sidebar";
import { Topbar } from"./Topbar";
import { AICopilotPanel } from"../copilot/AICopilotPanel";
import { PageTransition } from"../motion/PageTransition";
import { OfflineBanner } from"../ui/OfflineBanner";

export function DashboardLayout() {
 return (
 <div className="min-h-screen flex bg-background text-foreground selection:bg-accent selection:text-accent-foreground">
 <OfflineBanner />
 <div className="flex-1 flex flex-col relative overflow-hidden">
 <Topbar />
 <main className="flex-1 overflow-y-auto overflow-x-hidden p-8 md:p-10 lg:p-12">
 <div className="max-w-7xl mx-auto w-full">
 <AnimatePresence mode="wait">
 <PageTransition>
 <Outlet />
 </PageTransition>
 </AnimatePresence>
 </div>
 </main>
 </div>
 <AICopilotPanel />
 </div>
 );
}
