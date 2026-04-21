"use client";

import { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  LayoutDashboard,
  Settings,
  BookmarkCheck,
  ClipboardList,
  LogOut,
  Sun,
  Moon,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { DROPDOWN_VARIANTS } from "@/lib/animations";

function DropdownItem({
  icon: Icon,
  href,
  onClick,
  children,
  danger,
}: {
  icon: React.ElementType;
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
  danger?: boolean;
}) {
  const cls = cn(
    "w-full flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20",
    danger
      ? "text-destructive hover:bg-destructive/10"
      : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
  );
  if (href) {
    return (
      <Link href={href} onClick={onClick} className={cls}>
        <Icon className="w-4 h-4 shrink-0" />
        {children}
      </Link>
    );
  }
  return (
    <button onClick={onClick} className={cls}>
      <Icon className="w-4 h-4 shrink-0" />
      {children}
    </button>
  );
}

interface UserAvatarProps {
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  userName: string;
  userEmail: string;
  initials: string;
  avatarUrl: string | null;
  isEmployer: boolean;
  isDark: boolean;
  onToggleTheme: () => void;
  onLogout: () => void;
}

export function UserAvatar({
  isOpen,
  onToggle,
  onClose,
  userName,
  userEmail,
  initials,
  avatarUrl,
  isEmployer,
  isDark,
  onToggleTheme,
  onLogout,
}: UserAvatarProps) {
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
        aria-label="User menu"
        aria-expanded={isOpen}
        aria-haspopup="true"
        className="flex items-center gap-1.5 rounded-xl px-1.5 py-1 hover:bg-muted transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 ml-0.5"
      >
        <div className="w-7 h-7 rounded-lg overflow-hidden bg-primary/10 flex items-center justify-center shrink-0 border border-border/50">
          {avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={avatarUrl} alt={userName} className="w-full h-full object-cover" />
          ) : (
            <span className="text-xs font-bold text-primary">{initials}</span>
          )}
        </div>
        <span className="hidden lg:block text-sm font-medium max-w-[72px] truncate">
          {userName.split(" ")[0]}
        </span>
        <ChevronDown
          className={cn(
            "w-3.5 h-3.5 text-muted-foreground transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={DROPDOWN_VARIANTS}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute right-0 top-full mt-2 w-56 bg-card/95 backdrop-blur-xl border border-border/50 rounded-2xl shadow-xl z-50 overflow-hidden py-1.5"
          >
            <div className="px-3 py-2.5 border-b border-border/50 mb-1">
              <p className="text-sm font-semibold truncate">{userName}</p>
              <p className="text-[11px] text-muted-foreground truncate mt-0.5">{userEmail}</p>
            </div>

            <div className="px-1.5 space-y-0.5">
              <DropdownItem
                icon={LayoutDashboard}
                href={isEmployer ? "/employer/dashboard" : "/dashboard"}
                onClick={onClose}
              >
                Dashboard
              </DropdownItem>
              <DropdownItem icon={Settings} href="/dashboard" onClick={onClose}>
                Profile Settings
              </DropdownItem>
              {!isEmployer && (
                <>
                  <DropdownItem icon={BookmarkCheck} href="/saved" onClick={onClose}>
                    Saved Jobs
                  </DropdownItem>
                  <DropdownItem icon={ClipboardList} href="/dashboard" onClick={onClose}>
                    My Applications
                  </DropdownItem>
                </>
              )}
            </div>

            <div className="my-1.5 border-t border-border/50" />

            <div className="px-1.5">
              <DropdownItem
                icon={isDark ? Sun : Moon}
                onClick={() => { onToggleTheme(); onClose(); }}
              >
                {isDark ? "Light Mode" : "Dark Mode"}
              </DropdownItem>
            </div>

            <div className="my-1.5 border-t border-border/50" />

            <div className="px-1.5">
              <DropdownItem icon={LogOut} onClick={onLogout} danger>
                Log out
              </DropdownItem>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
