"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  Bookmark, BookmarkCheck, MapPin, DollarSign, Clock,
  CornerUpLeft, Briefcase, AlertCircle, Loader2,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ReactNode } from "react";
import api from "@/services/api";
import type { Job } from "@/hooks/useJobs";
import { useAuth } from "@clerk/nextjs";

function formatSalary(job: Job): string {
  if (job.fixedSalary) return `$${job.fixedSalary.toLocaleString()}`;
  if (job.salaryFrom && job.salaryTo)
    return `$${job.salaryFrom.toLocaleString()} – $${job.salaryTo.toLocaleString()}`;
  return "Negotiable";
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86_400_000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 30) return `${days} days ago`;
  return `${Math.floor(days / 30)} months ago`;
}

const LOGO_COLORS = [
  "bg-blue-500", "bg-violet-500", "bg-emerald-500",
  "bg-orange-500", "bg-rose-500", "bg-cyan-500",
];

function pickColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (name.codePointAt(i) ?? 0) + ((hash << 5) - hash);
  return LOGO_COLORS[Math.abs(hash) % LOGO_COLORS.length];
}

function Badge({ icon, text }: { readonly icon: ReactNode; readonly text: string }) {
  return (
    <div className="flex items-center text-sm font-medium bg-muted/50 text-muted-foreground px-3 py-1.5 rounded-lg border border-border/50">
      {icon}
      <span className="ml-2">{text}</span>
    </div>
  );
}

function SkeletonDetail() {
  return (
    <div className="grid md:grid-cols-3 gap-8 animate-pulse">
      <div className="md:col-span-2 space-y-6">
        <div className="bg-card border rounded-3xl p-8 space-y-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-muted/60 rounded-2xl flex-shrink-0" />
            <div className="space-y-3 flex-1">
              <div className="h-7 bg-muted/60 rounded w-3/4" />
              <div className="h-4 bg-muted/40 rounded w-1/3" />
            </div>
          </div>
          <div className="flex gap-3">
            {[100, 80, 90, 70].map((w) => (
              <div key={w} className="h-8 bg-muted/40 rounded-lg" style={{ width: `${w}px` }} />
            ))}
          </div>
          <div className="space-y-3 pt-4">
            <div className="h-4 bg-muted/40 rounded w-full" />
            <div className="h-4 bg-muted/40 rounded w-5/6" />
            <div className="h-4 bg-muted/40 rounded w-4/6" />
          </div>
        </div>
      </div>
      <div className="md:col-span-1">
        <div className="bg-card border rounded-3xl p-6 space-y-4">
          <div className="h-14 bg-muted/40 rounded-xl" />
          <div className="h-14 bg-muted/40 rounded-xl" />
          <div className="pt-4 border-t space-y-3">
            <div className="h-4 bg-muted/40 rounded w-full" />
            <div className="h-4 bg-muted/40 rounded w-4/5" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function JobDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  const authHeaders = async () => {
    const token = await getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const { data: job, isLoading, isError } = useQuery({
    queryKey: ["job", id],
    queryFn: async () => {
      const headers = await authHeaders();
      const res = await api.get(`/job/${id}`, { headers });
      return res.data.job as Job;
    },
    enabled: !!id,
    retry: 1,
  });

  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const headers = await authHeaders();
      const res = await api.get("/user/profile", { headers });
      return res.data.user as { savedJobs: { _id: string }[] };
    },
  });

  const isSaved = profile?.savedJobs?.some((j) => j._id === id) ?? false;

  const saveMutation = useMutation({
    mutationFn: async () => {
      const headers = await authHeaders();
      const res = await api.post(`/user/saved-jobs/${id}`, {}, { headers });
      return res.data as { saved: boolean };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });

  const companyName = job && typeof job.postedBy === "object" ? job.postedBy.name : "Company";

  let saveButtonIcon;
  if (saveMutation.isPending) {
    saveButtonIcon = <Loader2 className="w-4 h-4 animate-spin mr-2" />;
  } else if (isSaved) {
    saveButtonIcon = <BookmarkCheck className="w-4 h-4 mr-2" />;
  } else {
    saveButtonIcon = <Bookmark className="w-4 h-4 mr-2" />;
  }

  return (
    <div className="container mx-auto px-4 max-w-5xl py-8 min-h-screen">
      <button
        onClick={() => router.back()}
        className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary mb-6 transition-colors"
      >
        <CornerUpLeft className="w-4 h-4 mr-2" />
        Back to search
      </button>

      {isLoading && <SkeletonDetail />}

      {isError && (
        <div className="bg-card border border-border/50 rounded-3xl p-16 text-center flex flex-col items-center gap-3">
          <AlertCircle className="w-10 h-10 text-muted-foreground" />
          <h2 className="text-lg font-semibold">Job not found</h2>
          <p className="text-sm text-muted-foreground">This listing may have expired or been removed.</p>
          <Link href="/jobs">
            <Button variant="outline" className="mt-2">Browse all jobs</Button>
          </Link>
        </div>
      )}

      {!isLoading && !isError && job && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-8">

          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card border rounded-3xl p-4 sm:p-6 md:p-8 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-6 z-10">
                <button
                  onClick={() => saveMutation.mutate()}
                  disabled={saveMutation.isPending}
                  className="p-2 rounded-full hover:bg-muted/50 transition-colors"
                  title={isSaved ? "Remove from saved" : "Save job"}
                >
                  {isSaved
                    ? <BookmarkCheck className="w-5 h-5 text-primary" />
                    : <Bookmark className="w-5 h-5 text-muted-foreground hover:text-primary transition-colors" />
                  }
                </button>
              </div>

              {/* Company + Title */}
              <div className="flex items-center gap-3 sm:gap-6 mb-6 sm:mb-8 relative z-0">
                <div className={`w-20 h-20 rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-lg flex-shrink-0 ${pickColor(companyName)}`}>
                  {companyName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold tracking-tighter mb-1 text-foreground">
                    {job.title}
                  </h1>
                  <p className="text-base text-muted-foreground font-medium">{companyName}</p>
                </div>
              </div>

              {/* Meta badges */}
              <div className="flex flex-wrap gap-2 sm:gap-3 mb-6 sm:mb-8 relative z-0">
                <Badge icon={<MapPin className="w-4 h-4" />} text={`${job.city}, ${job.country}`} />
                <Badge icon={<DollarSign className="w-4 h-4" />} text={formatSalary(job)} />
                <Badge icon={<Briefcase className="w-4 h-4" />} text={job.category} />
                <Badge icon={<Clock className="w-4 h-4" />} text={`Posted ${timeAgo(job.jobPostedOn)}`} />
              </div>

              {/* Description */}
              <div className="mt-6 relative z-0">
                <h3 className="text-lg font-semibold tracking-tight text-foreground mb-3">About the Role</h3>
                <p className="text-muted-foreground leading-relaxed text-base whitespace-pre-line">
                  {job.description}
                </p>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="md:col-span-1 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-card border rounded-3xl p-6 sticky top-24"
            >
              <Button
                size="lg"
                className="w-full text-base font-semibold h-14 rounded-xl shadow-lg mb-3 hover:-translate-y-0.5 transition-transform"
              >
                Apply Now
              </Button>

              <Button
                size="lg"
                variant={isSaved ? "default" : "outline"}
                className="w-full text-base font-semibold h-14 rounded-xl mb-6"
                onClick={() => saveMutation.mutate()}
                disabled={saveMutation.isPending}
              >
                {saveButtonIcon}
                {isSaved ? "Saved" : "Save Job"}
              </Button>

              <div className="pt-6 border-t text-sm space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Category</span>
                  <span className="font-medium text-right max-w-[140px] truncate">{job.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Location</span>
                  <span className="font-medium text-right">{job.city}, {job.country}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Salary</span>
                  <span className="font-medium text-right font-mono">{formatSalary(job)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Posted</span>
                  <span className="font-medium">{timeAgo(job.jobPostedOn)}</span>
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      )}
    </div>
  );
}
