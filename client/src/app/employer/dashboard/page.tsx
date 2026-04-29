"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plus, Users, Edit, Trash2, Loader2, Briefcase, Calendar } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import api from "@/services/api";
import { useAuth } from "@clerk/nextjs";

type PostedJob = {
  _id: string;
  title: string;
  category?: string;
  jobPostedOn?: string;
};

export default function EmployerDashboard() {
  const [postedJobs, setPostedJobs] = useState<PostedJob[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { getToken } = useAuth();

  useEffect(() => {
    const fetchMyJobs = async () => {
      try {
        const token = await getToken();
        const response = await api.get("/job/getmyjobs", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const data = response.data as { myJobs?: PostedJob[] };
        if (data?.myJobs) setPostedJobs(data.myJobs);
      } catch (error) {
        console.error("Failed to fetch employer jobs", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMyJobs();
  }, [getToken]);

  return (
    <div className="container mx-auto px-4 max-w-7xl py-6 sm:py-8 min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-2xl sm:text-3xl font-bold">Employer Dashboard</h1>
          <p className="text-muted-foreground mt-1 text-sm">Manage your job postings and applicants.</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full sm:w-auto">
          <Link href="/employer/post-job">
            <Button size="lg" className="rounded-full shadow-md w-full sm:w-auto">
              <Plus className="w-5 h-5 mr-2" />
              Post a New Job
            </Button>
          </Link>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-card border rounded-2xl shadow-sm overflow-hidden"
      >
        <div className="p-4 sm:p-6 border-b flex justify-between items-center bg-muted/20">
          <h3 className="text-lg sm:text-xl font-bold">Recent Postings</h3>
          <Button variant="outline" size="sm">View All</Button>
        </div>

        {/* Desktop table — hidden on mobile */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b text-sm text-muted-foreground bg-muted/10">
                <th className="p-4 font-medium">Job Title</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Applicants</th>
                <th className="p-4 font-medium">Posted</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-muted-foreground">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                    Loading your postings...
                  </td>
                </tr>
              ) : postedJobs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-muted-foreground">
                    No active job postings. Please create one!
                  </td>
                </tr>
              ) : (
                postedJobs.map((job) => (
                  <tr key={job._id} className="border-b transition-colors hover:bg-muted/30">
                    <td className="p-4">
                      <div className="font-semibold">{job.title}</div>
                      <div className="text-xs text-muted-foreground">{job.category}</div>
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                        Active
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center font-medium">
                        <Users className="w-4 h-4 text-muted-foreground mr-2" />
                        0
                      </div>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">
                      {job.jobPostedOn ? new Date(job.jobPostedOn).toLocaleDateString() : "—"}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2 text-muted-foreground">
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-primary">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-destructive">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile cards — shown only on small screens */}
        <div className="md:hidden">
          {isLoading && (
            <div className="p-8 text-center text-muted-foreground">
              <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
              Loading your postings...
            </div>
          )}
          {!isLoading && postedJobs.length === 0 && (
            <div className="p-8 text-center text-muted-foreground text-sm">
              No active job postings. Please create one!
            </div>
          )}
          {!isLoading && postedJobs.length > 0 && (
            <div className="divide-y divide-border/50">
              {postedJobs.map((job) => (
                <div key={job._id} className="p-4 flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">{job.title}</p>
                    <div className="flex flex-wrap items-center gap-2 mt-1.5">
                      {job.category && (
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Briefcase className="w-3 h-3" />{job.category}
                        </span>
                      )}
                      {job.jobPostedOn && (
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(job.jobPostedOn).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                        Active
                      </span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Users className="w-3 h-3" /> 0 applicants
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-primary">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-destructive">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
