"use client";

import { useState } from "react";
import { Download, Check, X, User2, Eye } from "lucide-react";

// Placeholder data since no API is fetched yet
const MOCK_APPLICANTS = [
  { id: 1, name: "Alice Smith", email: "alice@example.com", status: "applied", jobTitle: "Senior Frontend Engineer", appliedOn: "Mar 25, 2026" },
  { id: 2, name: "Bob Johnson", email: "bob@example.com", status: "shortlisted", jobTitle: "UX Designer", appliedOn: "Mar 20, 2026" },
];

export default function EmployerApplicantsPage() {
  const [applicants] = useState(MOCK_APPLICANTS);

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Applicants</h1>
          <p className="text-muted-foreground mt-1 text-sm">Review incoming applications for your active jobs.</p>
        </div>
      </div>

      <div className="bg-card border border-white/10 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-white/5 border-b border-white/10 text-muted-foreground tracking-wide uppercase text-xs">
              <tr>
                <th scope="col" className="px-6 py-4 font-medium">Candidate</th>
                <th scope="col" className="px-6 py-4 font-medium">Applied For</th>
                <th scope="col" className="px-6 py-4 font-medium">Date</th>
                <th scope="col" className="px-6 py-4 font-medium">Status</th>
                <th scope="col" className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {applicants.map((app) => (
                <tr key={app.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                        {app.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium text-foreground">{app.name}</div>
                        <div className="text-muted-foreground text-xs">{app.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-primary">
                    {app.jobTitle}
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {app.appliedOn}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold
                      ${app.status === 'shortlisted' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 
                        app.status === 'applied' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' : 
                        'bg-rose-500/10 text-rose-500 border border-rose-500/20'}`}>
                      {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground rounded-lg transition-colors tooltip-trigger" title="View Resume">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 rounded-lg transition-colors tooltip-trigger" title="Shortlist">
                        <Check className="w-4 h-4" />
                      </button>
                      <button className="p-2 bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 rounded-lg transition-colors tooltip-trigger" title="Reject">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {applicants.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                    <User2 className="w-12 h-12 mx-auto mb-4 opacity-20" />
                    <p>No applicants found.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
