"use client";

import { Briefcase, Bookmark, User } from "lucide-react";
import type { Application, SavedJob } from "@/hooks/useDashboardData";

type Tab = "overview" | "profile" | "applications" | "saved";

interface StatsCardsProps {
  applications: Application[];
  savedJobs: SavedJob[];
  completion: number;
  onTabChange: (tab: Tab) => void;
}

export function StatsCards({ applications, savedJobs, completion, onTabChange }: StatsCardsProps) {
  const stats = [
    {
      label: "Applications",
      value: applications.length,
      icon: Briefcase,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      tab: "applications" as Tab,
    },
    {
      label: "Saved Jobs",
      value: savedJobs.length,
      icon: Bookmark,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
      tab: "saved" as Tab,
    },
    {
      label: "Profile",
      value: `${completion}%`,
      icon: User,
      color: "text-green-500",
      bg: "bg-green-500/10",
      tab: "profile" as Tab,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {stats.map(({ label, value, icon: Icon, color, bg, tab }) => (
        <button
          key={label}
          onClick={() => onTabChange(tab)}
          className="bg-card/60 backdrop-blur-md border border-border/50 rounded-2xl p-5 text-left hover:border-primary/30 hover:shadow-lg transition-all duration-200 group"
        >
          <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center mb-3`}>
            <Icon className={`w-5 h-5 ${color}`} />
          </div>
          <p className="text-3xl font-bold">{value}</p>
          <p className="text-sm text-muted-foreground mt-0.5">{label}</p>
        </button>
      ))}
    </div>
  );
}
