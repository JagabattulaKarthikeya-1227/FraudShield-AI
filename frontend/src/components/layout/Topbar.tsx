import { Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Topbar() {
  return (
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
  );
}
