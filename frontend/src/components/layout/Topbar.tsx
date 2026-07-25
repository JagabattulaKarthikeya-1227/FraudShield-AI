import React from 'react';
import { Link, useLocation } from"react-router-dom";
import { Moon, Sun, ChevronDown, LayoutDashboard, List, Bell, BarChart3, Cpu, Activity, Settings, Menu } from"lucide-react";
import { useThemeStore } from '@/store/themeStore';
import { cn } from"@/utils/cn";

export function Topbar() {
 const { isDarkMode, toggleDarkMode } = useThemeStore();
 const location = useLocation();

 const navItems = [
 { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
 { name: 'Transactions', icon: List, path: '/transactions' },
 { name: 'Alerts', icon: Bell, path: '/alerts' },
 { name: 'Analytics', icon: BarChart3, path: '/analytics' },
 { name: 'Risk Calculator', icon: Cpu, path: '/calculate' },
 { name: 'Model Performance', icon: Activity, path: '/models' },
 { name: 'Settings', icon: Settings, path: '/settings' },
 ];

 return (
 <header className="h-[72px] bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-30 shadow-sm overflow-x-auto no-scrollbar">
 <div className="flex items-center gap-6 flex-1 min-w-max">
 <Link to="/" className="flex items-center gap-2 select-none mr-4">
 <img src="/logo.svg" alt="FraudShield AI Logo" className="w-6 h-6" />
 <h1 className="text-lg font-bold leading-none tracking-tight text-primary hidden md:block">FraudShield AI</h1>
 </Link>
 
 {/* Navigation Pills */}
 <nav className="flex items-center gap-1 bg-slate-100 p-1 rounded-full border border-slate-200">
 {navItems.map((item) => {
 const isActive = location.pathname.startsWith(item.path);
 const Icon = item.icon;
 return (
 <Link
 key={item.name}
 to={item.path}
 className={cn(
"flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200",
 isActive
 ?"bg-primary text-primary-foreground shadow-sm"
 :"text-slate-500 hover:text-slate-900 hover:bg-slate-200"
 )}
 >
 <Icon className={cn("h-4 w-4", isActive ?"text-primary-foreground" :"text-slate-400")} />
 <span className="hidden lg:inline">{item.name}</span>
 </Link>
 );
 })}
 </nav>
 </div>
 
 <div className="flex items-center gap-4 md:gap-6 pl-4">
 {/* Action Icons */}
 <div className="flex items-center gap-2">
 <button 
 onClick={toggleDarkMode}
 aria-label="Toggle dark mode" 
 className="p-2 text-slate-500 hover:text-slate-900 :text-slate-100 hover:bg-slate-50 :bg-slate-800 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
 >
 {isDarkMode ? <Sun className="h-4 w-4" aria-hidden="true" /> : <Moon className="h-4 w-4" aria-hidden="true" />}
 </button>
 </div>
 
 {/* User Profile */}
 <button aria-label="User profile menu" className="flex items-center gap-3 hover:opacity-80 transition-opacity pl-2 border-l border-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-lg p-1">
 <div className="h-9 w-9 rounded-full bg-slate-900 flex items-center justify-center font-bold text-sm text-white shadow-sm border border-slate-700">
 JA
 </div>
 <ChevronDown className="h-3.5 w-3.5 text-slate-400 ml-1" />
 </button>
 </div>
 </header>
 );
}
