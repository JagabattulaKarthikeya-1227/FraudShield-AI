import React from 'react';
import { Bell, Search, GraduationCap, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAcademicMode } from "@/core/context/AcademicModeContext";
import { RecruiterShowcase } from "@/components/landing/RecruiterShowcase";

export function Topbar() {
  const { isAcademicMode, toggleAcademicMode } = useAcademicMode();
  const [isShowcaseOpen, setIsShowcaseOpen] = React.useState(false);

  return (
    <>
      <header className="h-16 border-b border-border/40 bg-background/60 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-30">
        <div className="flex items-center gap-4 flex-1">
          {/* Placeholder for Command Palette trigger */}
          <button className="flex items-center gap-2 text-sm text-muted-foreground bg-secondary/50 hover:bg-secondary px-3 py-1.5 rounded-md transition-colors w-64 border border-transparent hover:border-border">
            <Search className="h-4 w-4" />
            <span>Search transactions...</span>
            <kbd className="ml-auto text-[10px] font-sans font-semibold bg-background px-1.5 py-0.5 rounded border border-border">⌘K</kbd>
          </button>
        </div>
        
        <div className="flex items-center gap-4">
          
          <button 
            onClick={() => setIsShowcaseOpen(true)}
            className="hidden sm:flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-black dark:hover:bg-slate-200 transition-colors shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Portfolio Showcase
          </button>

          <div className="h-6 w-px bg-border/80" />

          {/* Academic Mode Toggle */}
          <button 
            onClick={toggleAcademicMode}
            className={`flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full transition-all border ${
              isAcademicMode 
                ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800' 
                : 'bg-transparent text-muted-foreground border-transparent hover:bg-secondary hover:text-foreground'
            }`}
            title="Toggle recruiter/academic explanations"
          >
            <GraduationCap className="w-4 h-4" />
            <span className="hidden sm:inline">{isAcademicMode ? 'Academic Mode: ON' : 'Academic Mode'}</span>
          </button>

          <div className="h-6 w-px bg-border/80" />

          <Button variant="ghost" size="icon" className="relative rounded-full hover:bg-secondary">
            <Bell className="h-4 w-4 text-foreground" />
            <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-destructive" />
          </Button>
          <div className="h-8 w-px bg-border/80" />
          <button className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="h-8 w-8 rounded-full bg-accent flex items-center justify-center font-bold text-xs text-accent-foreground">
              A
            </div>
          </button>
        </div>
      </header>

      <RecruiterShowcase isOpen={isShowcaseOpen} onClose={() => setIsShowcaseOpen(false)} />
    </>
  );
}
