"use client";

import Link from "next/link";
import {
  Briefcase,
  Globe,
  MessageSquare,
  Code2,
  BadgeCheck,
  Building2,
} from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { useAuthStore } from "@/store/useAuthStore";

// ─── Link definitions ─────────────────────────────────────────────────────────

const CANDIDATE_LINKS_GUEST = [
  { label: "Browse Jobs", href: "/jobs" },
  { label: "Browse Companies", href: "/companies" },
];

const CANDIDATE_LINKS_SEEKER = [
  { label: "Browse Jobs", href: "/jobs" },
  { label: "Browse Companies", href: "/companies" },
  { label: "My Dashboard", href: "/dashboard" },
  { label: "Saved Jobs", href: "/saved" },
  { label: "My Applications", href: "/dashboard?tab=applications" },
];

const EMPLOYER_LINKS_GUEST = [
  { label: "Post a Job", href: "/employer/post-job" },
  { label: "Pricing", href: "/pricing" },
];

const EMPLOYER_LINKS_EMPLOYER = [
  { label: "Post a Job", href: "/employer/post-job" },
  { label: "Search Resumes", href: "/employer/applicants" },
  { label: "Employer Dashboard", href: "/employer/dashboard" },
  { label: "Analytics", href: "/employer/analytics" },
  { label: "Pricing", href: "/pricing" },
];

const COMPANY_LINKS = [
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Careers", href: "/careers" },
  { label: "Blog", href: "/blog" },
];


const SOCIALS = [
  { icon: Globe, href: "#", label: "LinkedIn" },
  { icon: MessageSquare, href: "#", label: "Twitter" },
  { icon: Code2, href: "#", label: "GitHub" },
];

// ─── Helper ───────────────────────────────────────────────────────────────────

function FooterLinkColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <h4 className="font-semibold text-sm mb-5 text-foreground">{title}</h4>
      <ul className="space-y-3">
        {links.map(({ label, href }) => (
          <li key={label}>
            <Link
              href={href}
              className="text-sm text-muted-foreground hover:text-primary transition-colors duration-150"
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

export function Footer() {
  const { user: clerkUser, isLoaded } = useUser();
  const { user: storeUser, isAuthenticated } = useAuthStore();

  // Role resolution — Clerk is primary, auth store is fallback
  const clerkRole = isLoaded && clerkUser
    ? String(clerkUser.publicMetadata?.role || clerkUser.unsafeMetadata?.role || "").toLowerCase()
    : "";
  const storeRole = storeUser?.role?.toLowerCase().replace("_", " ") ?? "";
  const rawRole = clerkRole || storeRole;

  const isLoggedIn = (isLoaded && !!clerkUser) || isAuthenticated;
  const isEmployer = rawRole.includes("employer");
  const isJobSeeker = isLoggedIn && !isEmployer;

  // Build dynamic link columns based on role
  const columns: { title: string; links: { label: string; href: string }[] }[] = [];

  if (!isLoggedIn) {
    // Guest: show both sections with generic links
    columns.push({ title: "For Candidates", links: CANDIDATE_LINKS_GUEST });
    columns.push({ title: "For Employers", links: EMPLOYER_LINKS_GUEST });
  } else if (isJobSeeker) {
    columns.push({ title: "For Candidates", links: CANDIDATE_LINKS_SEEKER });
  } else if (isEmployer) {
    columns.push({ title: "For Employers", links: EMPLOYER_LINKS_EMPLOYER });
  }

  columns.push({ title: "Company", links: COMPANY_LINKS });

  // Role badge shown in brand column
  const roleBadge = isJobSeeker
    ? { label: "Signed in as Job Seeker", icon: BadgeCheck, color: "text-blue-600 bg-blue-500/10 border-blue-500/20" }
    : isEmployer
    ? { label: "Signed in as Employer", icon: Building2, color: "text-primary bg-primary/10 border-primary/20" }
    : null;

  return (
    <footer className="border-t border-border/50 bg-muted/20">
      <div className="container mx-auto max-w-7xl px-4 md:px-8 py-14">
        {/* Main grid — brand always spans 2 cols, remaining cols fill in */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10">
          {/* ── Brand column ── */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-4 w-fit group">
              <div className="p-1.5 rounded-lg bg-primary text-primary-foreground shadow-sm transition-transform duration-200 group-hover:-translate-y-0.5">
                <Briefcase className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold tracking-tight">JobZee</span>
            </Link>

            <p className="text-sm text-muted-foreground max-w-xs leading-relaxed mb-5">
              Find your dream job or hire the best talent. The premier platform built for
              modern careers.
            </p>

            {/* Role badge */}
            {roleBadge && (
              <div
                className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border mb-5 ${roleBadge.color}`}
              >
                <roleBadge.icon className="w-3 h-3" />
                {roleBadge.label}
              </div>
            )}

            {/* Social icons */}
            <div className="flex gap-2.5">
              {SOCIALS.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-lg bg-muted/60 border border-border/50 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted hover:border-border transition-all duration-150"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* ── Dynamic link columns ── */}
          {columns.map((col) => (
            <FooterLinkColumn key={col.title} title={col.title} links={col.links} />
          ))}
        </div>

        {/* ── Bottom bar ── */}
        <div className="mt-12 pt-6 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} JobZee. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Built with ♥ for job seekers everywhere
          </p>
        </div>
      </div>
    </footer>
  );
}
