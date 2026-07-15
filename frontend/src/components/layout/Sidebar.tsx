import { Link, useLocation } from "react-router-dom";
import { cn } from "@/utils/cn";
import {
  LayoutDashboard,
  ShieldAlert,
  Activity,
  Settings,
  List,
  BarChart3,
  Microscope,
  Shield,
  AlertOctagon,
  Lock,
  Eye,
  Server,
  Scale,
  Book,
  Database,
  Beaker,
  ActivitySquare,
  DatabaseZap,
  GitCompare
} from "lucide-react";

export function Sidebar() {
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard', roles: ['Administrator', 'Fraud Analyst', 'Customer'] },
    { name: 'Transactions', icon: List, path: '/transactions', roles: ['Administrator', 'Fraud Analyst'] },
    { name: 'Analytics', icon: BarChart3, path: '/analytics', roles: ['Administrator', 'Fraud Analyst'] },
    
    // MLOps & Operations
    { name: 'Decision Lab', icon: Microscope, path: '/explainability', roles: ['Administrator', 'Fraud Analyst'] },
    { name: 'Model Registry', icon: Database, path: '/registry', roles: ['Administrator'] },
    { name: 'Experiments', icon: Beaker, path: '/experiments', roles: ['Administrator'] },
    { name: 'Drift Det.', icon: ActivitySquare, path: '/drift', roles: ['Administrator'] },
    { name: 'Feature Store', icon: DatabaseZap, path: '/features', roles: ['Administrator'] },
    { name: 'Champion/Challenger', icon: GitCompare, path: '/champion', roles: ['Administrator'] },
    { name: 'System Health', icon: Activity, path: '/health', roles: ['Administrator'] },
    
    // GRC (Governance, Risk, Compliance)
    { name: 'Security Center', icon: Shield, path: '/security', roles: ['Administrator'] },
    { name: 'Incident Mgmt', icon: AlertOctagon, path: '/incidents', roles: ['Administrator', 'Fraud Analyst'] },
    { name: 'Audit Ledger', icon: Lock, path: '/audit', roles: ['Administrator'] },
    { name: 'Privacy Center', icon: Eye, path: '/privacy', roles: ['Administrator'] },
    { name: 'Compliance', icon: Server, path: '/compliance', roles: ['Administrator'] },
    { name: 'Responsible AI', icon: Scale, path: '/responsible-ai', roles: ['Administrator', 'Fraud Analyst'] },
    
    // User & Settings
    { name: 'Knowledge Center', icon: Book, path: '/knowledge', roles: ['Administrator', 'Fraud Analyst', 'Customer'] },
    { name: 'Settings', icon: Settings, path: '/settings', roles: ['Administrator', 'Fraud Analyst', 'Customer'] },
  ];

  return (
    <aside className="w-64 border-r bg-card/40 backdrop-blur-md flex flex-col justify-between hidden md:flex">
      <div className="p-6">
        <Link to="/" className="flex items-center gap-2 mb-10">
          <div className="h-8 w-8 rounded bg-primary flex items-center justify-center">
            <ShieldAlert className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold leading-none tracking-tight">FraudShield</h1>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mt-0.5">Intelligence</p>
          </div>
        </Link>
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
