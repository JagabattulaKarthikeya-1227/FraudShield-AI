import React from 'react';
import { Bell, Menu, ChevronDown, Search, Moon, Activity, Cpu } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Topbar() {
  return (
    <header className="h-[72px] bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-30 shadow-sm">
      <div className="flex items-center gap-6 flex-1">
        <button className="p-2 text-slate-500 hover:text-slate-900 transition-colors rounded-lg hover:bg-slate-50 lg:hidden">
          <Menu className="h-5 w-5" />
        </button>
        
        {/* Search */}
        <div className="hidden md:flex relative max-w-md w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search transactions, alerts, or entities..." 
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-slate-400"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-medium text-slate-500 bg-white border border-slate-200 rounded">⌘</kbd>
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-medium text-slate-500 bg-white border border-slate-200 rounded">K</kbd>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-4 md:gap-6">
        
        {/* System Status Indicators */}
        <div className="hidden lg:flex items-center gap-4 mr-2 border-r border-slate-200 pr-6">
          <div className="flex items-center gap-2 text-xs font-semibold">
            <Cpu className="h-4 w-4 text-slate-400" />
            <span className="text-slate-500">Current Model:</span>
            <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">Hybrid Ensemble v4.2</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold">
            <Activity className="h-4 w-4 text-slate-400" />
            <span className="text-slate-500">Prediction Status:</span>
            <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md border border-emerald-100">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Online (42ms)
            </div>
          </div>
        </div>

        {/* Action Icons */}
        <div className="flex items-center gap-2">
          <button className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors">
            <Moon className="h-4 w-4" />
          </button>
          <button className="p-2 relative text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors">
            <Bell className="h-4 w-4" />
            <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-rose-500 ring-2 ring-white" />
          </button>
        </div>
        
        {/* User Profile */}
        <button className="flex items-center gap-3 hover:opacity-80 transition-opacity pl-2 border-l border-slate-200">
          <div className="h-9 w-9 rounded-full bg-slate-900 flex items-center justify-center font-bold text-sm text-white shadow-sm border border-slate-700">
            JA
          </div>
          <div className="hidden md:flex flex-col items-start">
            <span className="text-sm font-bold text-slate-900 leading-tight">Jane Analyst</span>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-tight">Senior Fraud Analyst</span>
          </div>
          <ChevronDown className="h-3.5 w-3.5 text-slate-400 ml-1" />
        </button>
      </div>
    </header>
  );
}
