"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Briefcase,
  Search,
  Bell,
  Menu,
  X,
  Sun,
  Moon,
  LayoutDashboard,
  BookmarkCheck,
  ClipboardList,
  PlusCircle,
  Users,
  BarChart3,
  Settings,
  LogOut,
  ChevronDown,
  Building2,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useUser, useAuth } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

// ── Animation variants ────────────────────────────────────────────────────────

const DROPDOWN_VARIANTS = {
  hidden: { opacity: 0, y: -6, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring" as const, damping: 30, stiffness: 400 },
  },
  exit: { opacity: 0, y: -6, scale: 0.96, transition: { duration: 0.12 } },
};

const MOBILE_PANEL_VARIANTS = {
  hidden: { x: "-100%" },
  visible: {
    x: 0,
    transition: { type: "spring" as const, damping: 28, stiffness: 300 },
  },
  exit: { x: "-100%", transition: { duration: 0.22, ease: "easeIn" as const } },
};

// ── Nav link definitions ──────────────────────────────────────────────────────

type NavLinkDef = { href: string; label: string; icon: React.ElementType };

const GUEST_LINKS: NavLinkDef[] = [
  { href: "/jobs", label: "Find Jobs", icon: Search },
  { href: "/companies", label: "Companies", icon: Building2 },
];

const JOB_SEEKER_LINKS: NavLinkDef[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/jobs", label: "Find Jobs", icon: Search },
  { href: "/companies", label: "Companies", icon: Building2 },
  { href: "/saved", label: "Saved Jobs", icon: BookmarkCheck },
];

const EMPLOYER_LINKS: NavLinkDef[] = [
  { href: "/employer/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/employer/post-job", label: "Post Job", icon: PlusCircle },
  { href: "/employer/applicants", label: "Applicants", icon: Users },
  { href: "/employer/analytics", label: "Analytics", icon: BarChart3 },
];

// ── Mock notifications ────────────────────────────────────────────────────────

const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    text: "Your application for Senior Frontend Engineer was viewed.",
    time: "2m ago",
    unread: true,
  },
  {
    id: 2,
    text: "New job match: Product Designer at Google.",
    time: "1h ago",
    unread: true,
  },
  {
    id: 3,
    text: "Welcome to JobZee! Complete your profile to get matches.",
    time: "1d ago",
    unread: false,
  },
];

// ── Reusable NavLink ──────────────────────────────────────────────────────────

function NavLink({
  href,
  label,
  pathname,
  onClick,
}: {
  href: string;
  label: string;
  pathname: string;
  onClick?: () => void;
}) {
  const active =
    pathname === href || (href !== "/" && pathname.startsWith(href + "/"));
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20",
        active
          ? "bg-primary/10 text-primary"
          : "text-muted-foreground hover:bg-primary/5 hover:text-foreground"
      )}
    >
      {label}
    </Link>
  );
}

// ── DropdownItem ──────────────────────────────────────────────────────────────

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

// ── Main Navbar ───────────────────────────────────────────────────────────────

export function Navbar() {
  const { user, isLoaded } = useUser();
  const { signOut } = useAuth();
  const { resolvedTheme, setTheme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const isDark = resolvedTheme === "dark";

  // Role
  const rawRole = isLoaded && user
    ? String(user.publicMetadata?.role || user.unsafeMetadata?.role || "").toLowerCase()
    : "";
  const isEmployer = rawRole.includes("employer");
  const navLinks = !user ? GUEST_LINKS : isEmployer ? EMPLOYER_LINKS : JOB_SEEKER_LINKS;

  // User info
  const userName = user?.fullName || user?.firstName || "User";
  const userEmail = user?.emailAddresses?.[0]?.emailAddress ?? "";
  const initials = (user?.fullName || user?.firstName || "U").charAt(0).toUpperCase();
  const avatarUrl = user?.imageUrl ?? null;
  const unreadCount = MOCK_NOTIFICATIONS.filter((n) => n.unread).length;

  // Click outside — close dropdowns
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node))
        setNotifOpen(false);
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node))
        setUserMenuOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (q) {
      router.push(`/jobs?keyword=${encodeURIComponent(q)}`);
      setSearchQuery("");
      setMobileOpen(false);
    }
  };

  const handleLogout = async () => {
    setUserMenuOpen(false);
    setMobileOpen(false);
    await signOut();
    if (typeof window !== "undefined") localStorage.removeItem("token");
    router.push("/");
  };

  const toggleTheme = () => setTheme(isDark ? "light" : "dark");

  return (
    <>
      {/* ── Navbar bar ───────────────────────────────────────────────────── */}
      <nav
        className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-md"
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="container mx-auto max-w-7xl flex h-16 items-center gap-3 px-4 md:px-6">

          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 shrink-0 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 rounded-lg"
          >
            <div className="relative p-1.5 rounded-lg bg-primary text-primary-foreground shadow-sm transition-all duration-300 group-hover:shadow-md group-hover:shadow-primary/20 group-hover:-translate-y-0.5">
              <Briefcase className="w-5 h-5" />
            </div>
            <span className="text-lg font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
              JobZee
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-0.5 flex-1">
            {navLinks.map(({ href, label }) => (
              <NavLink key={href} href={href} label={label} pathname={pathname} />
            ))}
          </div>

          {/* Desktop right section */}
          <div className="hidden md:flex items-center gap-1.5 ml-auto shrink-0">

            {/* Search bar */}
            <form onSubmit={handleSearch} className="relative">
              <div
                className={cn(
                  "flex items-center rounded-full bg-muted/40 border border-border/50 transition-all duration-300",
                  searchFocused
                    ? "w-72 ring-2 ring-primary/20 border-primary/30 bg-background/60"
                    : "w-52 hover:bg-muted/60"
                )}
              >
                <Search className="absolute left-3 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  placeholder="Search jobs, companies…"
                  aria-label="Search jobs"
                  className="w-full h-8 pl-8 pr-3 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none rounded-full"
                />
              </div>
            </form>

            {/* Post a Job (employers only) */}
            {isLoaded && user && isEmployer && (
              <Link href="/employer/post-job">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5 border-border/70 hover:border-primary/40 ml-1"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  Post a Job
                </Button>
              </Link>
            )}

            {/* Notifications */}
            {isLoaded && user && (
              <div className="relative" ref={notifRef}>
                <button
                  onClick={() => { setNotifOpen((v) => !v); setUserMenuOpen(false); }}
                  aria-label="Notifications"
                  aria-expanded={notifOpen}
                  aria-haspopup="true"
                  className={cn(
                    "relative w-9 h-9 rounded-full flex items-center justify-center transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20",
                    notifOpen ? "bg-muted" : "hover:bg-muted"
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
                  {notifOpen && (
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
                        {MOCK_NOTIFICATIONS.map((n) => (
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
            )}

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
              suppressHydrationWarning
              className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-muted transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
            >
              <Sun className="h-[1.1rem] w-[1.1rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.1rem] w-[1.1rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </button>

            {/* Auth: avatar or login/signup */}
            {isLoaded && user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => { setUserMenuOpen((v) => !v); setNotifOpen(false); }}
                  aria-label="User menu"
                  aria-expanded={userMenuOpen}
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
                      userMenuOpen && "rotate-180"
                    )}
                  />
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      variants={DROPDOWN_VARIANTS}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="absolute right-0 top-full mt-2 w-56 bg-card/95 backdrop-blur-xl border border-border/50 rounded-2xl shadow-xl z-50 overflow-hidden py-1.5"
                    >
                      {/* User header */}
                      <div className="px-3 py-2.5 border-b border-border/50 mb-1">
                        <p className="text-sm font-semibold truncate">{userName}</p>
                        <p className="text-[11px] text-muted-foreground truncate mt-0.5">
                          {userEmail}
                        </p>
                      </div>

                      <div className="px-1.5 space-y-0.5">
                        <DropdownItem
                          icon={LayoutDashboard}
                          href={isEmployer ? "/employer/dashboard" : "/dashboard"}
                          onClick={() => setUserMenuOpen(false)}
                        >
                          Dashboard
                        </DropdownItem>

                        <DropdownItem
                          icon={Settings}
                          href="/dashboard"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          Profile Settings
                        </DropdownItem>

                        {!isEmployer && (
                          <>
                            <DropdownItem
                              icon={BookmarkCheck}
                              href="/saved"
                              onClick={() => setUserMenuOpen(false)}
                            >
                              Saved Jobs
                            </DropdownItem>
                            <DropdownItem
                              icon={ClipboardList}
                              href="/dashboard"
                              onClick={() => setUserMenuOpen(false)}
                            >
                              My Applications
                            </DropdownItem>
                          </>
                        )}
                      </div>

                      <div className="my-1.5 border-t border-border/50" />

                      <div className="px-1.5">
                        <DropdownItem
                          icon={isDark ? Sun : Moon}
                          onClick={() => { toggleTheme(); setUserMenuOpen(false); }}
                        >
                          {isDark ? "Light Mode" : "Dark Mode"}
                        </DropdownItem>
                      </div>

                      <div className="my-1.5 border-t border-border/50" />

                      <div className="px-1.5">
                        <DropdownItem icon={LogOut} onClick={handleLogout} danger>
                          Log out
                        </DropdownItem>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : isLoaded && !user ? (
              <div className="flex items-center gap-1.5 ml-1">
                <Link href="/sign-in">
                  <Button variant="ghost" size="sm">
                    Log in
                  </Button>
                </Link>
                <Link href="/sign-up">
                  <Button size="sm">Sign Up</Button>
                </Link>
              </div>
            ) : null}
          </div>

          {/* Mobile right strip */}
          <div className="flex md:hidden items-center gap-1 ml-auto">
            <button
              onClick={toggleTheme}
              aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
              suppressHydrationWarning
              className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
            >
              <Sun className="h-[1.1rem] w-[1.1rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.1rem] w-[1.1rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </button>

            {isLoaded && user && (
              <button
                onClick={() => setNotifOpen((v) => !v)}
                aria-label="Notifications"
                className="relative w-9 h-9 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
              >
                <Bell className="w-[1.1rem] h-[1.1rem]" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 min-w-[16px] h-4 bg-destructive text-[9px] font-bold text-white rounded-full flex items-center justify-center px-0.5 border-2 border-background">
                    {unreadCount}
                  </span>
                )}
              </button>
            )}

            <button
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      {/* ── Mobile slide-out menu ─────────────────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="mob-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm md:hidden"
              onClick={() => setMobileOpen(false)}
              aria-hidden="true"
            />

            {/* Panel */}
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
              {/* Panel header */}
              <div className="flex items-center justify-between px-4 py-3.5 border-b border-border/50">
                <Link
                  href="/"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2"
                >
                  <div className="p-1.5 rounded-lg bg-primary text-primary-foreground">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <span className="text-base font-bold tracking-tight">JobZee</span>
                </Link>
                <button
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close menu"
                  className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Panel body */}
              <div className="flex-1 overflow-y-auto p-3 space-y-1">

                {/* Search */}
                <form
                  onSubmit={handleSearch}
                  className="relative mb-3"
                >
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search jobs, companies…"
                    aria-label="Search jobs"
                    className="w-full h-10 pl-9 pr-4 rounded-full bg-muted/50 border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
                  />
                </form>

                {/* Nav links */}
                {navLinks.map(({ href, label, icon: Icon }) => {
                  const active =
                    pathname === href ||
                    (href !== "/" && pathname.startsWith(href + "/"));
                  return (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setMobileOpen(false)}
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

                {/* Post a Job (employer) */}
                {isLoaded && user && isEmployer && (
                  <Link
                    href="/employer/post-job"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium border border-primary/20 text-primary hover:bg-primary/5 transition-colors min-h-[48px] mt-1"
                  >
                    <PlusCircle className="w-4 h-4 shrink-0" />
                    Post a Job
                  </Link>
                )}

                {/* User info card */}
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

              {/* Panel footer */}
              <div className="p-4 border-t border-border/50 space-y-2">
                {isLoaded && user ? (
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 h-10 rounded-xl text-sm font-medium text-destructive border border-destructive/20 hover:bg-destructive/10 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Log out
                  </button>
                ) : isLoaded && !user ? (
                  <div className="flex flex-col gap-2">
                    <Link href="/sign-in" onClick={() => setMobileOpen(false)}>
                      <button className="w-full h-10 rounded-xl text-sm font-medium border border-border/50 hover:bg-muted transition-colors">
                        Log in
                      </button>
                    </Link>
                    <Link href="/sign-up" onClick={() => setMobileOpen(false)}>
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
    </>
  );
}
