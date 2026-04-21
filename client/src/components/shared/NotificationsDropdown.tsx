"use client";

import { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import { DROPDOWN_VARIANTS } from "@/lib/animations";

export interface Notification {
  id: number;
  text: string;
  time: string;
  unread: boolean;
}

interface NotificationsDropdownProps {
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  unreadCount: number;
  notifications: Notification[];
}

export function NotificationsDropdown({
  isOpen,
  onToggle,
  onClose,
  unreadCount,
  notifications,
}: NotificationsDropdownProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={onToggle}
        aria-label="Notifications"
        aria-expanded={isOpen}
        aria-haspopup="true"
        className={cn(
          "relative w-9 h-9 rounded-full flex items-center justify-center transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20",
          isOpen ? "bg-muted" : "hover:bg-muted"
        )}
      >
        <Bell className="w-[1.1rem] h-[1.1rem]" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 min-w-[16px] h-4 bg-destructive text-[9px] font-bold text-white rounded-full flex items-center justify-center px-0.5 border-2 border-background">
            {unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={DROPDOWN_VARIANTS}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute right-0 top-full mt-2 w-80 bg-card/95 backdrop-blur-xl border border-border/50 rounded-2xl shadow-xl z-50 overflow-hidden"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-border/50 bg-muted/20">
              <h3 className="font-semibold text-sm">Notifications</h3>
              {unreadCount > 0 && (
                <span className="text-[11px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                  {unreadCount} new
                </span>
              )}
            </div>
            <div className="max-h-72 overflow-y-auto divide-y divide-border/30">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className={cn(
                    "flex gap-3 px-4 py-3 hover:bg-muted/40 transition-colors cursor-pointer",
                    n.unread && "bg-primary/5"
                  )}
                >
                  <span
                    className={cn(
                      "mt-1.5 w-1.5 h-1.5 rounded-full shrink-0",
                      n.unread ? "bg-primary" : "bg-transparent"
                    )}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-foreground leading-relaxed">{n.text}</p>
                    <p className="text-[11px] text-muted-foreground mt-1">{n.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-4 py-2.5 border-t border-border/50 text-center">
              <button className="text-xs text-primary font-medium hover:underline">
                Mark all as read
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
