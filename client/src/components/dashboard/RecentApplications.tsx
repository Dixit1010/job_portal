"use client";

import { Briefcase, CheckCircle2, Clock, XCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { Application } from "@/hooks/useDashboardData";

const STATUS_CONFIG = {
  applied: { label: "Applied", icon: Clock, className: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
  shortlisted: { label: "Shortlisted", icon: CheckCircle2, className: "bg-green-500/10 text-green-600 border-green-500/20" },
  rejected: { label: "Rejected", icon: XCircle, className: "bg-red-500/10 text-red-600 border-red-500/20" },
};

function formatDate(dateStr?: string) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

interface RecentApplicationsProps {
  applications: Application[];
  onViewAll: () => void;
}

export function RecentApplications({ applications, onViewAll }: RecentApplicationsProps) {
  const recent = applications.slice(0, 3);

  return (
    <div className="bg-card/60 backdrop-blur-md border border-border/50 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-base">Recent Applications</h2>
        <button
          onClick={onViewAll}
          className="text-sm text-primary hover:underline flex items-center gap-1"
        >
          View all <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {recent.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <Briefcase className="w-8 h-8 mx-auto mb-2 opacity-30" />
          <p className="text-sm">No applications yet.</p>
          <Link href="/jobs">
            <Button size="sm" variant="outline" className="mt-3">
              Browse Jobs
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {recent.map((app) => {
            const s = STATUS_CONFIG[app.status];
            const Icon = s.icon;
            return (
              <div
                key={app._id}
                className="flex items-center justify-between gap-4 py-3 border-b border-border/40 last:border-0"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">
                    {app.job?.title ?? "Position Applied"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {app.job ? `${app.job.city}, ${app.job.country}` : app.address}
                    {app.createdAt && ` · ${formatDate(app.createdAt)}`}
                  </p>
                </div>
                <span
                  className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-lg border font-medium shrink-0 ${s.className}`}
                >
                  <Icon className="w-3 h-3" />
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
