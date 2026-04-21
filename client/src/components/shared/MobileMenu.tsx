"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Briefcase, Search, X, LogOut, PlusCircle } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { MOBILE_PANEL_VARIANTS } from "@/lib/animations";

type NavLinkDef = { href: string; label: string; icon: React.ElementType };

interface MobileUserInfo {
  fullName?: string | null;
  firstName?: string | null;
  imageUrl?: string;
  emailAddresses?: Array<{ emailAddress: string }>;
}

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  navLinks: NavLinkDef[];
  pathname: string;
  user: MobileUserInfo | null | undefined;
  isLoaded: boolean;
  isEmployer: boolean;
  onLogout: () => void;
  searchQuery: string;
  onSearchChange: (v: string) => void;
  onSearchSubmit: (e: React.FormEvent) => void;
}

export function MobileMenu({
  isOpen,
  onClose,
  navLinks,
  pathname,
  user,
  isLoaded,
  isEmployer,
  onLogout,
  searchQuery,
  onSearchChange,
  onSearchSubmit,
}: MobileMenuProps) {
  const userName = user?.fullName || user?.firstName || "User";
  const userEmail = user?.emailAddresses?.[0]?.emailAddress ?? "";
  const initials = (user?.fullName || user?.firstName || "U").charAt(0).toUpperCase();
  const avatarUrl = user?.imageUrl ?? null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="mob-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm md:hidden"
            onClick={onClose}
            aria-hidden="true"
          />

          <motion.div
            key="mob-panel"
            variants={MOBILE_PANEL_VARIANTS}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed left-0 top-0 bottom-0 z-50 w-[min(80vw,320px)] bg-background/95 backdrop-blur-xl border-r border-border/50 shadow-2xl flex flex-col md:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
          >
            <div className="flex items-center justify-between px-4 py-3.5 border-b border-border/50">
              <Link href="/" onClick={onClose} className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-primary text-primary-foreground">
                  <Briefcase className="w-4 h-4" />
                </div>
                <span className="text-base font-bold tracking-tight">JobZee</span>
              </Link>
              <button
                onClick={onClose}
                aria-label="Close menu"
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-1">
              <form onSubmit={onSearchSubmit} className="relative mb-3">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder="Search jobs, companies…"
                  aria-label="Search jobs"
                  className="w-full h-10 pl-9 pr-4 rounded-full bg-muted/50 border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
                />
              </form>

              {navLinks.map(({ href, label, icon: Icon }) => {
                const active =
                  pathname === href || (href !== "/" && pathname.startsWith(href + "/"));
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={onClose}
                    className={cn(
                      "flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium min-h-[48px] transition-all duration-200 active:scale-[0.98]",
                      active
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                    )}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    {label}
                  </Link>
                );
              })}

              {isLoaded && user && isEmployer && (
                <Link
                  href="/employer/post-job"
                  onClick={onClose}
                  className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium border border-primary/20 text-primary hover:bg-primary/5 transition-colors min-h-[48px] mt-1"
                >
                  <PlusCircle className="w-4 h-4 shrink-0" />
                  Post a Job
                </Link>
              )}

              {isLoaded && user && (
                <div className="flex items-center gap-3 px-3 py-3 mt-2 rounded-xl bg-muted/30 border border-border/50">
                  <div className="w-9 h-9 rounded-xl overflow-hidden bg-primary/10 flex items-center justify-center shrink-0 border border-border/50">
                    {avatarUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={avatarUrl} alt={userName} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-sm font-bold text-primary">{initials}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{userName}</p>
                    <p className="text-[11px] text-muted-foreground truncate">{userEmail}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-border/50 space-y-2">
              {isLoaded && user ? (
                <button
                  onClick={onLogout}
                  className="w-full flex items-center justify-center gap-2 h-10 rounded-xl text-sm font-medium text-destructive border border-destructive/20 hover:bg-destructive/10 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Log out
                </button>
              ) : isLoaded && !user ? (
                <div className="flex flex-col gap-2">
                  <Link href="/sign-in" onClick={onClose}>
                    <button className="w-full h-10 rounded-xl text-sm font-medium border border-border/50 hover:bg-muted transition-colors">
                      Log in
                    </button>
                  </Link>
                  <Link href="/sign-up" onClick={onClose}>
                    <button className="w-full h-10 rounded-xl text-sm font-medium bg-primary text-primary-foreground hover:opacity-90 transition-opacity">
                      Sign Up
                    </button>
                  </Link>
                </div>
              ) : null}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
