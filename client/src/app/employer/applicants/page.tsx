"use client";

import { Check, X, User2, Eye } from "lucide-react";

export default function EmployerApplicantsPage() {
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
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                  <User2 className="w-12 h-12 mx-auto mb-4 opacity-20" />
                  <p>No applicants yet.</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
