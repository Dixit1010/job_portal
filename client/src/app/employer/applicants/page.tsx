"use client";

import { User2 } from "lucide-react";

export default function EmployerApplicantsPage() {
  return (
    <div className="w-full px-4 sm:px-0">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Applicants</h1>
          <p className="text-muted-foreground mt-1 text-sm">Review incoming applications for your active jobs.</p>
        </div>
      </div>

      <div className="bg-card border border-white/10 rounded-2xl overflow-hidden shadow-sm">

        {/* Desktop table */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-white/5 border-b border-white/10 text-muted-foreground tracking-wide uppercase text-xs">
              <tr>
                <th scope="col" className="px-6 py-4 font-medium">Candidate</th>
                <th scope="col" className="px-6 py-4 font-medium">Applied For</th>
                <th scope="col" className="px-6 py-4 font-medium hidden md:table-cell">Date</th>
                <th scope="col" className="px-6 py-4 font-medium">Status</th>
                <th scope="col" className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                  <User2 className="w-10 h-10 mx-auto mb-3 opacity-20" />
                  <p className="text-sm">No applicants yet.</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Mobile empty state */}
        <div className="sm:hidden p-10 text-center text-muted-foreground">
          <User2 className="w-10 h-10 mx-auto mb-3 opacity-20" />
          <p className="text-sm">No applicants yet.</p>
        </div>
      </div>
    </div>
  );
}
