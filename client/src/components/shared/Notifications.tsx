"use client";

import { useState, useRef, useEffect } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@clerk/nextjs";

const MOCK_NOTIFICATIONS = [
  { id: 1, text: "Your application for Senior Frontend Engineer was viewed.", time: "2m ago", unread: true },
  { id: 2, text: "New job matches your profile: Product Designer at Google.", time: "1h ago", unread: true },
  { id: 3, text: "Welcome to JobZee! Complete your profile to get matches.", time: "1d ago", unread: false },
];

export function Notifications() {
  const [open, setOpen] = useState(false);
  const { isSignedIn } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  if (!isSignedIn) return null;

  const unreadCount = MOCK_NOTIFICATIONS.filter(n => n.unread).length;

  return (
    <div className="relative" ref={dropdownRef}>
      <Button 
        variant="ghost" 
        size="icon" 
        className="rounded-full w-9 h-9 relative"
        onClick={() => setOpen(!open)}
      >
        <Bell className="w-[1.2rem] h-[1.2rem]" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-background"></span>
        )}
      </Button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-card border rounded-2xl shadow-xl z-50 overflow-hidden animate-in slide-in-from-top-2 fade-in duration-200">
          <div className="p-4 border-b flex justify-between items-center bg-muted/20">
            <h3 className="font-semibold">Notifications</h3>
            {unreadCount > 0 && (
              <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                {unreadCount} new
              </span>
            )}
          </div>
          <div className="max-h-[300px] overflow-y-auto">
            {MOCK_NOTIFICATIONS.map((notif) => (
              <div 
                key={notif.id} 
                className={`p-4 border-b last:border-0 hover:bg-muted/50 transition-colors cursor-pointer flex gap-3 ${notif.unread ? 'bg-primary/5' : ''}`}
              >
                <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${notif.unread ? 'bg-primary' : 'bg-transparent'}`}></div>
                <div>
                  <p className="text-sm text-foreground">{notif.text}</p>
                  <span className="text-xs text-muted-foreground mt-1 block">{notif.time}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="p-3 border-t text-center bg-card">
            <button className="text-xs text-primary font-medium hover:underline">Mark all as read</button>
          </div>
        </div>
      )}
    </div>
  );
}
