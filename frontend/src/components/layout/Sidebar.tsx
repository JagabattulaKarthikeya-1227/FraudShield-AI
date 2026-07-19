import { Link, useLocation } from "react-router-dom";
import { cn } from "@/utils/cn";
import {
  LayoutDashboard,
  List,
  Bell,
  BarChart3,
  Cpu,
  Activity,
  User,
  Settings,
  LogOut,
} from "lucide-react";

export function Sidebar() {
  const location = useLocation();

  const mainNavItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'Transactions', icon: List, path: '/transactions' },
    { name: 'Alerts', icon: Bell, path: '/alerts' },
    { name: 'Analytics', icon: BarChart3, path: '/analytics' },
    { name: 'AI Engine', icon: Cpu, path: '/explainability' },
    { name: 'Model Performance', icon: Activity, path: '/models' },
  ];

  const accountNavItems = [
    { name: 'Profile', icon: User, path: '/profile' },
    { name: 'Settings', icon: Settings, path: '/settings' },
  ];

  const NavItem = ({ item }: { item: any }) => {
    const isActive = location.pathname.startsWith(item.path);
    const Icon = item.icon;
    return (
      <Link
        to={item.path}
        className={cn(
          "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors mb-1",
          isActive 
            ? "bg-emerald-50 text-emerald-900 dark:bg-emerald-900/30 dark:text-emerald-100" 
            : "text-slate-500 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800/50"
        )}
      >
        <Icon className={cn("h-4 w-4", isActive ? "text-emerald-600 dark:text-emerald-400" : "")} />
        {item.name}
      </Link>
    );
  };

  return (
    <aside className="w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 flex flex-col justify-between hidden md:flex">
      <div className="p-6 overflow-y-auto">
        <Link to="/" className="flex items-center gap-2 mb-10">
          <img src="/logo.svg" alt="FraudShield AI Logo" className="w-6 h-6 dark:invert" />
          <h1 className="text-lg font-bold leading-none tracking-tight text-slate-900 dark:text-white">FraudShield AI</h1>
        </Link>
        
        <nav className="mb-10">
          {mainNavItems.map((item) => <NavItem key={item.name} item={item} />)}
        </nav>

        <div>
          <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-3 px-3">Account</p>
          <nav>
            {accountNavItems.map((item) => <NavItem key={item.name} item={item} />)}
          </nav>
        </div>
      </div>

      <div className="p-6 border-t border-slate-200 dark:border-slate-800">
        <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-500 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800/50 w-full transition-colors justify-between">
          <div className="flex items-center gap-3">
            <LogOut className="h-4 w-4" />
            Logout
          </div>
        </button>
      </div>
    </aside>
  );
}
