"use client";

import { useState, useEffect } from "react";
import {
  Briefcase,
  Search,
  Bell,
  Menu,
  Sun,
  Moon,
  LayoutDashboard,
  BookmarkCheck,
  PlusCircle,
  Users,
  BarChart3,
  Building2,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useUser, useAuth } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { NotificationsDropdown } from "./NotificationsDropdown";
import { UserAvatar } from "./UserAvatar";
import { MobileMenu } from "./MobileMenu";
import type { Notification } from "./NotificationsDropdown";

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

const MOCK_NOTIFICATIONS: Notification[] = [
  { id: 1, text: "Your application for Senior Frontend Engineer was viewed.", time: "2m ago", unread: true },
  { id: 2, text: "New job match: Product Designer at Google.", time: "1h ago", unread: true },
  { id: 3, text: "Welcome to JobZee! Complete your profile to get matches.", time: "1d ago", unread: false },
];

function NavLink({
  href,
  label,
  pathname,
}: {
  href: string;
  label: string;
  pathname: string;
}) {
  const active = pathname === href || (href !== "/" && pathname.startsWith(href + "/"));
  return (
    <Link
      href={href}
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

  const isDark = resolvedTheme === "dark";

  const rawRole =
    isLoaded && user
      ? String(user.publicMetadata?.role || user.unsafeMetadata?.role || "").toLowerCase()
      : "";
  const isEmployer = rawRole.includes("employer");
  const navLinks = !user ? GUEST_LINKS : isEmployer ? EMPLOYER_LINKS : JOB_SEEKER_LINKS;

  const userName = user?.fullName || user?.firstName || "User";
  const userEmail = user?.emailAddresses?.[0]?.emailAddress ?? "";
  const initials = (user?.fullName || user?.firstName || "U").charAt(0).toUpperCase();
  const avatarUrl = user?.imageUrl ?? null;
  const unreadCount = MOCK_NOTIFICATIONS.filter((n) => n.unread).length;

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

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

  const isHome = pathname === "/";

  return (
    <>
      <nav
        className={cn(
          "sticky top-0 z-50 w-full border-b backdrop-blur-md transition-colors duration-300",
          isHome
            ? "border-white/10 bg-white/5"
            : "border-border/50 bg-background/80"
        )}
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
            {/* Search */}
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

            {/* Post a Job (employer) */}
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
              <NotificationsDropdown
                isOpen={notifOpen}
                onToggle={() => {
                  setNotifOpen((v) => !v);
                  setUserMenuOpen(false);
                }}
                onClose={() => setNotifOpen(false)}
                unreadCount={unreadCount}
                notifications={MOCK_NOTIFICATIONS}
              />
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

            {/* User avatar / auth buttons */}
            {isLoaded && user ? (
              <UserAvatar
                isOpen={userMenuOpen}
                onToggle={() => {
                  setUserMenuOpen((v) => !v);
                  setNotifOpen(false);
                }}
                onClose={() => setUserMenuOpen(false)}
                userName={userName}
                userEmail={userEmail}
                initials={initials}
                avatarUrl={avatarUrl}
                isEmployer={isEmployer}
                isDark={isDark}
                onToggleTheme={toggleTheme}
                onLogout={handleLogout}
              />
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

      <MobileMenu
        isOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        navLinks={navLinks}
        pathname={pathname}
        user={user}
        isLoaded={isLoaded}
        isEmployer={isEmployer}
        onLogout={handleLogout}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearchSubmit={handleSearch}
      />
    </>
  );
}
