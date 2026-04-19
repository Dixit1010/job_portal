"use client";

import { motion } from "framer-motion";
import { Building2, MapPin, DollarSign, BookmarkPlus, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export interface JobData {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  logoColor?: string;
  postedAt: string;
}

interface JobCardProps {
  job: JobData;
  index?: number;
}

export function JobCard({ job, index = 0 }: JobCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: "easeOut" }}
      className="group bg-card/60 backdrop-blur-md border border-border/50 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/30 relative overflow-hidden flex flex-col h-full"
    >
      <div className="absolute top-0 right-0 p-6 z-10 transition-transform hover:scale-110 cursor-pointer">
        <BookmarkPlus className="text-muted-foreground w-6 h-6 hover:text-primary transition-colors" />
      </div>

      <div className="flex items-start gap-4 mb-5 relative z-0">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white text-lg font-bold shadow-sm ${job.logoColor || 'bg-blue-500'}`}>
          {job.company.charAt(0)}
        </div>
        <div className="flex-1">
          <h3 className="text-base sm:text-lg font-semibold tracking-tight group-hover:text-primary transition-colors line-clamp-1 pr-8">
            {job.title}
          </h3>
          <p className="text-sm text-muted-foreground font-medium mt-0.5">{job.company}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6 relative z-0 mt-auto">
        <div className="flex items-center text-xs font-medium text-muted-foreground bg-muted/50 px-2.5 py-1 rounded-md border border-border/50">
          <MapPin className="w-3.5 h-3.5 mr-1.5 text-muted-foreground/70" />
          <span className="truncate">{job.location}</span>
        </div>
        <div className="flex items-center text-xs font-semibold text-foreground bg-primary/5 px-2.5 py-1 rounded-md border border-primary/20 tracking-tight font-mono">
          <span className="text-primary/70 mr-1">$</span>
          <span className="truncate">{job.salary.replace('$', '')}</span>
        </div>
        <div className="flex items-center text-xs font-medium text-muted-foreground bg-muted/50 px-2.5 py-1 rounded-md border border-border/50">
          <div className="w-3.5 h-3.5 mr-1.5 rounded-full border border-current flex items-center justify-center text-[9px] font-bold text-muted-foreground/70">T</div>
          <span className="truncate">{job.type}</span>
        </div>
      </div>

      <div className="flex items-center justify-between mt-2 pt-4 border-t border-border/40 relative z-0">
        <span className="text-xs text-muted-foreground font-medium">
          {job.postedAt}
        </span>
        <Link href={`/jobs/${job.id}`}>
          <Button variant="ghost" size="sm" className="h-8 text-xs font-semibold group-hover:bg-primary/10 group-hover:text-primary transition-colors duration-300">
            View Details
            <ArrowRight className="w-3.5 h-3.5 ml-1.5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}
