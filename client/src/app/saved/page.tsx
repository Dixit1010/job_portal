"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { Bookmark, Building2, MapPin, DollarSign, ArrowRight, X, Loader2, Briefcase } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import api from "@/services/api";
import type { SavedJob } from "@/hooks/useDashboardData";

function formatSalary(job: SavedJob) {
  if (job.fixedSalary) return `$${job.fixedSalary.toLocaleString()}`;
  if (job.salaryFrom && job.salaryTo)
    return `$${job.salaryFrom.toLocaleString()} – $${job.salaryTo.toLocaleString()}`;
  return "Negotiable";
}

function timeAgo(dateStr?: string): string {
  if (!dateStr) return "—";
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86_400_000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 30) return `${days}d ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

function SkeletonCard() {
  return (
    <div className="bg-card/60 border border-border/50 rounded-2xl p-5 flex flex-col gap-4 animate-pulse">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 bg-muted/60 rounded-xl flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-muted/60 rounded w-3/4" />
          <div className="h-3 bg-muted/40 rounded w-1/2" />
        </div>
      </div>
      <div className="flex gap-2">
        <div className="h-5 bg-muted/40 rounded-md w-20" />
        <div className="h-5 bg-muted/40 rounded-md w-16" />
      </div>
      <div className="pt-3 border-t border-border/40 flex justify-between">
        <div className="h-3 bg-muted/40 rounded w-12" />
        <div className="h-7 bg-muted/40 rounded w-16" />
      </div>
    </div>
  );
}

export default function SavedJobsPage() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  const authHeaders = async () => {
    const token = await getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const headers = await authHeaders();
      const res = await api.get("/user/profile", { headers });
      return res.data.user as { savedJobs: SavedJob[] };
    },
  });

  const unsaveMutation = useMutation({
    mutationFn: async (jobId: string) => {
      const headers = await authHeaders();
      await api.post(`/user/saved-jobs/${jobId}`, {}, { headers });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });

  const savedJobs = profile?.savedJobs ?? [];

  return (
    <div className="min-h-screen bg-background text-foreground py-12 sm:py-16 md:py-20 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-8 sm:mb-10">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tighter mb-2">Saved Jobs</h1>
            <p className="text-muted-foreground">Your personal collection of bookmarked opportunities.</p>
          </div>
          {!isLoading && savedJobs.length > 0 && (
            <span className="text-sm text-muted-foreground font-medium">
              {savedJobs.length} {savedJobs.length === 1 ? "job" : "jobs"} saved
            </span>
          )}
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="grid sm:grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {/* Empty */}
        {!isLoading && savedJobs.length === 0 && (
          <div className="bg-card border border-border/50 rounded-3xl p-16 text-center flex flex-col items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
              <Bookmark className="w-7 h-7 text-primary" />
            </div>
            <h2 className="text-xl font-bold tracking-tight">No saved jobs yet</h2>
            <p className="text-muted-foreground max-w-sm text-sm">
              When you find a role that catches your eye, use the bookmark icon to save it here.
            </p>
            <Link href="/jobs" className="mt-2">
              <Button className="rounded-full gap-2">
                <Briefcase className="w-4 h-4" />
                Explore Open Roles
              </Button>
            </Link>
          </div>
        )}

        {/* Grid */}
        {!isLoading && savedJobs.length > 0 && (
          <div className="grid sm:grid-cols-2 gap-4">
            {savedJobs.map((job, i) => (
              <motion.div
                key={job._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="bg-card/60 backdrop-blur-md border border-border/50 rounded-2xl p-5 hover:border-primary/30 hover:shadow-lg transition-all duration-200 flex flex-col gap-4 relative"
              >
                {/* Unsave button */}
                <button
                  onClick={() => unsaveMutation.mutate(job._id)}
                  disabled={unsaveMutation.isPending}
                  className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-muted/50 transition-colors"
                  title="Remove from saved"
                >
                  {unsaveMutation.isPending
                    ? <Loader2 className="w-3.5 h-3.5 animate-spin text-muted-foreground" />
                    : <X className="w-3.5 h-3.5 text-muted-foreground hover:text-destructive transition-colors" />
                  }
                </button>

                <div className="flex items-start gap-3 pr-6">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm line-clamp-2">{job.title}</p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                      <MapPin className="w-3 h-3 flex-shrink-0" />
                      {job.city}, {job.country}
                    </div>
                  </div>
                  {job.expired && (
                    <span className="text-xs bg-destructive/10 text-destructive px-2 py-0.5 rounded-full border border-destructive/20 flex-shrink-0">
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
                  <span className="text-xs text-muted-foreground">{timeAgo(job.jobPostedOn)}</span>
                  <Link href={`/jobs/${job._id}`}>
                    <Button variant="ghost" size="sm" className="h-8 text-xs hover:text-primary">
                      View <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
