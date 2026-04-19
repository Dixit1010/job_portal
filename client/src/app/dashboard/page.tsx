"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter, SlidersHorizontal, Loader2 } from "lucide-react";
import { JobCard, JobData } from "@/components/shared/JobCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import api from "@/services/api";

type ApiJob = {
  _id: string;
  title: string;
  city: string;
  country: string;
  category?: string;
  fixedSalary?: number;
  salaryFrom?: number;
  salaryTo?: number;
  jobPostedOn?: string;
};

export default function JobSeekerDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [jobs, setJobs] = useState<JobData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await api.get("/job/getall");
        const data = response.data as { jobs?: ApiJob[] };
        if (data?.jobs) {
          const formatted = data.jobs.map((j) => ({
            id: j._id,
            title: j.title,
            company: "Platform Employer",
            location: `${j.city}, ${j.country}`,
            type: j.category || "Full-time",
            salary: j.fixedSalary ? `$${j.fixedSalary}` : `$${j.salaryFrom} - $${j.salaryTo}`,
            postedAt: j.jobPostedOn ? new Date(j.jobPostedOn).toLocaleDateString() : "Just now",
            logoColor: "bg-blue-500",
          }));
          setJobs(formatted);
        }
      } catch (error) {
        console.error("Failed to fetch jobs", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    job.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 max-w-7xl py-8 min-h-screen">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Fillters */}
        <aside className="w-full md:w-64 space-y-6">
          <div className="bg-card border rounded-2xl p-6 sticky top-24 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold flex items-center">
                <Filter className="w-5 h-5 mr-2" /> Filters
              </h2>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <SlidersHorizontal className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold mb-3 text-muted-foreground">Job Type</h3>
                <div className="space-y-2">
                  {["Full-time", "Contract", "Part-time", "Freelance"].map(type => (
                    <label key={type} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="rounded text-primary focus:ring-primary w-4 h-4 accent-primary bg-background border-input" />
                      <span className="text-sm">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t">
                <h3 className="text-sm font-semibold mb-3 text-muted-foreground">Location</h3>
                <div className="space-y-2">
                  {["Remote", "On-site", "Hybrid"].map(loc => (
                    <label key={loc} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="rounded text-primary focus:ring-primary w-4 h-4 accent-primary bg-background border-input" />
                      <span className="text-sm">{loc}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            
            <Button className="w-full mt-8 rounded-xl h-10">Apply Filters</Button>
          </div>
        </aside>

        {/* Main Feed */}
        <main className="flex-1">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-2xl md:text-3xl font-bold mb-2">Recommended for You</h1>
            <p className="text-muted-foreground">Based on your profile and search history.</p>
          </motion.div>

          <div className="relative mb-8">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input 
              placeholder="Search by role, company, or keywords..." 
              className="pl-10 h-14 bg-card shadow-sm rounded-xl border border-input text-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="space-y-4">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center p-20 text-muted-foreground">
                <Loader2 className="h-8 w-8 animate-spin mb-4 text-primary" />
                <p>Loading jobs...</p>
              </div>
            ) : filteredJobs.length > 0 ? (
              filteredJobs.map((job, idx) => (
                <JobCard key={job.id} job={job} index={idx} />
              ))
            ) : (
              <div className="text-center py-20 bg-card rounded-2xl border border-dashed">
                <div className="bg-muted w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-bold mb-2">No jobs found</h3>
                <p className="text-muted-foreground max-w-sm mx-auto">
                  We couldn&apos;t find any jobs matching &quot;{searchQuery}&quot;. Try adjusting your filters or search terms.
                </p>
                <Button 
                  variant="outline" 
                  className="mt-6"
                  onClick={() => setSearchQuery("")}
                >
                  Clear Search
                </Button>
              </div>
            )}
            
            {filteredJobs.length > 0 && (
              <motion.div 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="py-10 text-center"
              >
                <div className="inline-flex items-center gap-2 text-muted-foreground">
                  <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                  Loading more jobs...
                </div>
              </motion.div>
            )}
          </div>
        </main>
        
      </div>
    </div>
  );
}
