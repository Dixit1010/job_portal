"use client";

import { Search, Filter, MapPin } from "lucide-react";

export default function JobsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter mb-4">Find your next role.</h1>
            <p className="text-muted-foreground text-lg">Explore thousands of job opportunities across top tech companies.</p>
          </div>
          
          <div className="flex bg-card/50 backdrop-blur-md border border-white/10 rounded-full p-1.5 w-full md:w-auto shadow-sm">
            <div className="flex items-center pl-4 pr-2 w-full md:w-64">
              <Search className="w-4 h-4 text-muted-foreground mr-3" />
              <input type="text" placeholder="Job title or keyword" className="bg-transparent border-none text-sm w-full focus:outline-none placeholder:text-muted-foreground/50" />
            </div>
            <div className="hidden sm:flex items-center pl-4 pr-2 border-l border-white/10 w-48">
              <MapPin className="w-4 h-4 text-muted-foreground mr-3" />
              <input type="text" placeholder="Location" className="bg-transparent border-none text-sm w-full focus:outline-none placeholder:text-muted-foreground/50" />
            </div>
            <button className="bg-primary text-primary-foreground rounded-full px-6 py-2 text-sm font-medium transition-all hover:bg-primary/90">
              Search
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="hidden lg:block space-y-8 pr-6">
            <div>
              <h3 className="text-sm font-semibold tracking-wide uppercase text-muted-foreground mb-4 flex items-center gap-2">
                <Filter className="w-4 h-4" /> Filters
              </h3>
              <div className="space-y-3">
                {['Remote', 'Hybrid', 'On-site'].map(f => (
                  <label key={f} className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" className="rounded border-white/20 bg-transparent text-primary focus:ring-primary/50" />
                    <span className="text-sm text-foreground/80 group-hover:text-foreground transition-colors">{f}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Job List Directory Placeholder */}
          <div className="lg:col-span-3 space-y-4">
            <div className="bg-card border border-white/10 rounded-2xl p-12 text-center flex flex-col items-center">
              <div className="animate-pulse w-12 h-12 rounded-full bg-white/5 mb-4"></div>
              <h3 className="text-lg font-medium tracking-tight mb-2">Loading opportunities...</h3>
              <p className="text-sm text-muted-foreground max-w-sm">Fetching the latest roles from our high-signal database.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
