"use client";

import { useEffect, useState } from "react";
import { User2, Loader2, ExternalLink, CheckCircle, XCircle, Clock, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import api from "@/services/api";
import { useAuth } from "@clerk/nextjs";

type Application = {
  _id: string;
  name: string;
  email: string;
  phone: number;
  address: string;
  coverLetter: string;
  status: "applied" | "shortlisted" | "rejected";
  resume: { public_id: string; url: string };
  job: { _id: string; title: string; city: string; country: string } | null;
  createdAt: string;
};

function pdfUrl(url: string): string {
  return url;
}

const statusStyles: Record<Application["status"], string> = {
  applied: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  shortlisted: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  rejected: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

export default function EmployerApplicantsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const { getToken } = useAuth();

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = await getToken();
        const res = await api.get("/application/employer/getall", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const data = res.data as { applications: Application[] };
        setApplications(data.applications || []);
      } catch (err) {
        console.error("Failed to fetch applications", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchApplications();
  }, [getToken]);

  const updateStatus = async (id: string, status: "shortlisted" | "rejected") => {
    setUpdatingId(id);
    try {
      const token = await getToken();
      await api.put(`/application/status/${id}`, { status }, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setApplications(prev => prev.map(a => a._id === id ? { ...a, status } : a));
    } catch (err) {
      console.error("Failed to update status", err);
    } finally {
      setUpdatingId(null);
    }
  };

  const pending = applications.filter(a => a.status === "applied").length;
  const shortlisted = applications.filter(a => a.status === "shortlisted").length;
  const rejected = applications.filter(a => a.status === "rejected").length;

  return (
    <div className="flex-1 flex flex-col container mx-auto px-4 max-w-7xl py-6 sm:py-8">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Applicants</h1>
          <p className="text-muted-foreground mt-1 text-sm">Review and manage applications for your job postings.</p>
        </div>
        {!isLoading && applications.length > 0 && (
          <span className="text-sm font-medium text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full border">
            {applications.length} total
          </span>
        )}
      </div>

      {/* Stats Cards */}
      {!isLoading && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="bg-card border rounded-xl p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-muted/50">
              <Users className="w-4 h-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total</p>
              <p className="text-xl font-bold">{applications.length}</p>
            </div>
          </div>
          <div className="bg-card border rounded-xl p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
              <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Pending</p>
              <p className="text-xl font-bold">{pending}</p>
            </div>
          </div>
          <div className="bg-card border rounded-xl p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
              <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Shortlisted</p>
              <p className="text-xl font-bold">{shortlisted}</p>
            </div>
          </div>
          <div className="bg-card border rounded-xl p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30">
              <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Rejected</p>
              <p className="text-xl font-bold">{rejected}</p>
            </div>
          </div>
        </div>
      )}

      {/* Table / Content — flex-1 so it fills remaining height */}
      <div className="flex-1 flex flex-col bg-card border rounded-2xl overflow-hidden shadow-sm">

        {/* Loading */}
        {isLoading && (
          <div className="flex-1 flex flex-col items-center justify-center py-20 text-muted-foreground">
            <Loader2 className="w-8 h-8 animate-spin mb-3" />
            <p className="text-sm">Loading applicants...</p>
          </div>
        )}

        {/* Empty state */}
        {!isLoading && applications.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center py-20 text-center text-muted-foreground px-4">
            <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
              <User2 className="w-8 h-8 opacity-40" />
            </div>
            <h3 className="text-base font-semibold text-foreground mb-1">No applicants yet</h3>
            <p className="text-sm max-w-xs">
              Once job seekers apply to your postings, their applications will appear here.
            </p>
          </div>
        )}

        {/* Desktop table */}
        {!isLoading && applications.length > 0 && (
          <>
            <div className="hidden sm:block overflow-x-auto flex-1">
              <table className="w-full text-left text-sm">
                <thead className="bg-muted/30 border-b text-muted-foreground tracking-wide uppercase text-xs sticky top-0">
                  <tr>
                    <th scope="col" className="px-6 py-4 font-medium">Candidate</th>
                    <th scope="col" className="px-6 py-4 font-medium">Applied For</th>
                    <th scope="col" className="px-6 py-4 font-medium hidden md:table-cell">Date</th>
                    <th scope="col" className="px-6 py-4 font-medium">Resume</th>
                    <th scope="col" className="px-6 py-4 font-medium">Status</th>
                    <th scope="col" className="px-6 py-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {applications.map((app) => (
                    <tr key={app._id} className="hover:bg-muted/20 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-semibold text-sm">{app.name}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{app.email}</p>
                      </td>
                      <td className="px-6 py-4">
                        {app.job
                          ? <p className="font-medium text-sm">{app.job.title}</p>
                          : <span className="text-muted-foreground text-xs">—</span>
                        }
                      </td>
                      <td className="px-6 py-4 hidden md:table-cell text-muted-foreground text-xs">
                        {new Date(app.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </td>
                      <td className="px-6 py-4">
                        <a
                          href={pdfUrl(app.resume.url)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-primary text-xs font-medium hover:underline"
                        >
                          View Resume <ExternalLink className="w-3 h-3" />
                        </a>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusStyles[app.status]}`}>
                          {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {app.status === "applied" ? (
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 text-xs text-green-600 border-green-200 hover:bg-green-50 dark:border-green-800 dark:hover:bg-green-900/20"
                              disabled={updatingId === app._id}
                              onClick={() => updateStatus(app._id, "shortlisted")}
                            >
                              {updatingId === app._id
                                ? <Loader2 className="w-3 h-3 animate-spin" />
                                : <><CheckCircle className="w-3 h-3 mr-1" />Shortlist</>
                              }
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 text-xs text-red-600 border-red-200 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-900/20"
                              disabled={updatingId === app._id}
                              onClick={() => updateStatus(app._id, "rejected")}
                            >
                              <XCircle className="w-3 h-3 mr-1" />Reject
                            </Button>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="sm:hidden divide-y divide-border/50">
              {applications.map((app) => (
                <div key={app._id} className="p-4 space-y-3">
                  <div className="flex justify-between items-start gap-2">
                    <div className="min-w-0">
                      <p className="font-semibold text-sm truncate">{app.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{app.email}</p>
                    </div>
                    <span className={`flex-shrink-0 px-2.5 py-1 rounded-full text-xs font-semibold ${statusStyles[app.status]}`}>
                      {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                    </span>
                  </div>

                  {app.job && (
                    <p className="text-xs text-muted-foreground">
                      Applied for: <span className="font-medium text-foreground">{app.job.title}</span>
                    </p>
                  )}

                  <p className="text-xs text-muted-foreground">
                    {new Date(app.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </p>

                  <div className="flex items-center justify-between pt-1">
                    <a
                      href={pdfUrl(app.resume.url)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary font-medium hover:underline inline-flex items-center gap-1"
                    >
                      View Resume <ExternalLink className="w-3 h-3" />
                    </a>
                    {app.status === "applied" && (
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="h-7 text-xs text-green-600 border-green-200" disabled={updatingId === app._id} onClick={() => updateStatus(app._id, "shortlisted")}>
                          Shortlist
                        </Button>
                        <Button size="sm" variant="outline" className="h-7 text-xs text-red-600 border-red-200" disabled={updatingId === app._id} onClick={() => updateStatus(app._id, "rejected")}>
                          Reject
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
