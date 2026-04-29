"use client";

import { motion } from "framer-motion";
import { MapPin, ArrowRight, BookmarkPlus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { Job } from "@/hooks/useJobs";

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
  if (days < 30) return `${days}d ago`;
  return `${Math.floor(days / 30)}mo ago`;
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

interface JobCardProps {
  readonly job: Job;
  readonly index?: number;
}

export function JobCard({ job, index = 0 }: JobCardProps) {
  const companyName = typeof job.postedBy === "object" ? job.postedBy.name : "Company";

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: "easeOut" }}
      className="group bg-card/60 backdrop-blur-md border border-border/50 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/30 relative overflow-hidden flex flex-col h-full"
    >
      <div className="absolute top-0 right-0 p-6 z-10">
        <BookmarkPlus className="text-muted-foreground w-5 h-5 hover:text-primary transition-colors cursor-pointer" />
      </div>

      <div className="flex items-start gap-4 mb-5">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white text-lg font-bold shadow-sm flex-shrink-0 ${pickColor(companyName)}`}>
          {companyName.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-base sm:text-lg font-semibold tracking-tight group-hover:text-primary transition-colors line-clamp-1 pr-8">
            {job.title}
          </h3>
          <p className="text-sm text-muted-foreground font-medium mt-0.5 truncate">{companyName}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4 mt-auto">
        <span className="flex items-center text-xs font-medium text-muted-foreground bg-muted/50 px-2.5 py-1 rounded-md border border-border/50">
          <MapPin className="w-3.5 h-3.5 mr-1.5 flex-shrink-0" />
          {job.city}, {job.country}
        </span>
        <span className="text-xs font-semibold text-foreground bg-primary/5 px-2.5 py-1 rounded-md border border-primary/20 font-mono">
          {formatSalary(job)}
        </span>
        <span className="text-xs font-medium text-muted-foreground bg-muted/50 px-2.5 py-1 rounded-md border border-border/50 truncate max-w-[120px]">
          {job.category}
        </span>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-border/40">
        <span className="text-xs text-muted-foreground font-medium">
          {timeAgo(job.jobPostedOn)}
        </span>
        <Link href={`/jobs/${job._id}`}>
          <Button variant="ghost" size="sm" className="h-8 text-xs font-semibold group-hover:bg-primary/10 group-hover:text-primary transition-colors">
            View Details
            <ArrowRight className="w-3.5 h-3.5 ml-1.5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}
