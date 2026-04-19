"use client";

import { useEffect, useState } from "react";
import { Command } from "cmdk";
import { Search, Briefcase, Building, User, Laptop } from "lucide-react";
import { useRouter } from "next/navigation";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = (command: () => void) => {
    setOpen(false);
    command();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-start justify-center pt-[15vh]">
      <div 
        className="fixed inset-0" 
        onClick={() => setOpen(false)}
      ></div>
      <div className="w-full max-w-2xl relative z-10 bg-card/80 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <Command className="flex w-full flex-col overflow-hidden rounded-md bg-transparent text-popover-foreground">
          <div className="flex items-center border-b border-border/50 px-3">
            <Search className="mr-3 h-5 w-5 shrink-0 text-muted-foreground" />
            <Command.Input 
              className="flex h-14 w-full rounded-md bg-transparent py-3 text-base md:text-lg font-medium outline-none placeholder:text-muted-foreground/70 disabled:cursor-not-allowed disabled:opacity-50 tracking-tight" 
              placeholder="Type a command or search..." 
              autoFocus
            />
          </div>
          
          <Command.List className="max-h-[300px] overflow-y-auto overflow-x-hidden p-2">
            <Command.Empty className="py-6 text-center text-sm">No results found.</Command.Empty>
            
            <Command.Group heading="Suggestions" className="px-2 py-1.5 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              <Command.Item 
                onSelect={() => runCommand(() => router.push("/dashboard"))}
                className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-3 text-sm outline-none hover:bg-muted aria-selected:bg-muted data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
              >
                <Briefcase className="mr-2 h-4 w-4" />
                <span>Search Jobs</span>
              </Command.Item>
              <Command.Item 
                onSelect={() => runCommand(() => router.push("/employer/post-job"))}
                className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-3 text-sm outline-none hover:bg-muted aria-selected:bg-muted data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
              >
                <Building className="mr-2 h-4 w-4" />
                <span>Post a Job</span>
              </Command.Item>
            </Command.Group>
            
            <Command.Group heading="Pages" className="px-2 pt-4 pb-1.5 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              <Command.Item 
                onSelect={() => runCommand(() => router.push("/"))}
                className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-3 text-sm outline-none hover:bg-muted aria-selected:bg-muted data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
              >
                <Laptop className="mr-2 h-4 w-4" />
                <span>Home Page</span>
              </Command.Item>
              <Command.Item 
                onSelect={() => runCommand(() => router.push("/login"))}
                className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-3 text-sm outline-none hover:bg-muted aria-selected:bg-muted data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
              >
                <User className="mr-2 h-4 w-4" />
                <span>Login</span>
              </Command.Item>
            </Command.Group>
          </Command.List>
          
          <div className="border-t border-border/50 px-4 py-3 text-xs text-muted-foreground flex items-center justify-between bg-muted/20">
            <div className="flex items-center gap-1">
              <kbd className="bg-muted/50 px-2 py-1 rounded border border-border/50 font-sans text-[10px] font-semibold uppercase shadow-sm">↑</kbd>
              <kbd className="bg-muted/50 px-2 py-1 rounded border border-border/50 font-sans text-[10px] font-semibold uppercase shadow-sm mr-1">↓</kbd>
              <span className="font-medium">to navigate</span>
            </div>
            <div className="flex items-center gap-1">
              <kbd className="bg-muted/50 px-2 py-1 rounded border border-border/50 font-sans text-[10px] font-semibold uppercase shadow-sm">esc</kbd>
              <span className="font-medium">to close</span>
            </div>
          </div>
        </Command>
      </div>
    </div>
  );
}
