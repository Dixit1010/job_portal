"use client";

import { motion } from "framer-motion";
import { Bookmark, Building2, MapPin, DollarSign, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { SavedJob } from "@/hooks/useDashboardData";

function formatSalary(job: SavedJob) {
  if (job.fixedSalary) return `$${job.fixedSalary.toLocaleString()}`;
  if (job.salaryFrom && job.salaryTo)
    return `$${job.salaryFrom.toLocaleString()} – $${job.salaryTo.toLocaleString()}`;
  return "Negotiable";
}

function formatDate(dateStr?: string) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

interface SavedJobsListProps {
  savedJobs: SavedJob[];
}

export function SavedJobsList({ savedJobs }: SavedJobsListProps) {
  if (savedJobs.length === 0) {
    return (
      <div className="bg-card/60 backdrop-blur-md border border-border/50 rounded-2xl p-12 text-center">
        <Bookmark className="w-10 h-10 mx-auto mb-3 opacity-30" />
        <h3 className="font-semibold mb-1">No saved jobs yet</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Bookmark jobs you like to review them later.
        </p>
        <Link href="/jobs">
          <Button>Browse Jobs</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {savedJobs.map((job) => (
        <motion.div
          key={job._id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card/60 backdrop-blur-md border border-border/50 rounded-2xl p-5 hover:border-primary/30 hover:shadow-lg transition-all duration-200 flex flex-col gap-4"
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
              <Building2 className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm line-clamp-2">{job.title}</p>
              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                <MapPin className="w-3 h-3" />
                {job.city}, {job.country}
              </div>
            </div>
            {job.expired && (
              <span className="text-xs bg-destructive/10 text-destructive px-2 py-0.5 rounded-full border border-destructive/20 shrink-0">
                Expired
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {job.category && (
              <span className="text-xs bg-muted/50 px-2 py-0.5 rounded-md border border-border/50 text-muted-foreground">
                {job.category}
              </span>
            )}
            <span className="inline-flex items-center gap-1 text-xs bg-primary/5 text-primary px-2 py-0.5 rounded-md border border-primary/20 font-mono">
              <DollarSign className="w-3 h-3" />
              {formatSalary(job).replace("$", "")}
            </span>
          </div>

          <div className="flex items-center justify-between mt-auto pt-3 border-t border-border/40">
            <span className="text-xs text-muted-foreground">
              {job.jobPostedOn ? formatDate(job.jobPostedOn) : "—"}
            </span>
            <Link href={`/jobs/${job._id}`}>
              <Button variant="ghost" size="sm" className="h-8 text-xs">
                View <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </Link>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
