import { Bookmark, Briefcase } from "lucide-react";
import Link from "next/link";

export default function SavedJobsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tighter mb-2">Saved Jobs</h1>
        <p className="text-muted-foreground mb-12">Your personal collection of bookmarked opportunities.</p>
        
        <div className="bg-card border border-white/10 rounded-3xl p-12 text-center flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
            <Bookmark className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-xl font-bold tracking-tight mb-3">No saved jobs yet</h2>
          <p className="text-muted-foreground max-w-sm mb-8">
            When you find a role that catches your eye, use the bookmark icon to save it here for later review.
          </p>
          <Link href="/jobs" className="px-6 py-3 rounded-full bg-primary text-primary-foreground font-medium transition-transform hover:-translate-y-0.5 shadow-lg shadow-primary/20 flex items-center gap-2">
            <Briefcase className="w-4 h-4" />
            Explore Open Roles
          </Link>
        </div>
      </div>
    </div>
  );
}
