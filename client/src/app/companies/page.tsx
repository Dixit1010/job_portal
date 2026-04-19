import { ArrowRight, Building2, Globe } from "lucide-react";
import Link from "next/link";

// Mock Data
const MOCK_COMPANIES = [
  { id: 1, name: "Vercel", industry: "Cloud Infrastructure", employees: "100-500", openRoles: 14 },
  { id: 2, name: "Stripe", industry: "Financial Services", employees: "5000+", openRoles: 112 },
  { id: 3, name: "Linear", industry: "Productivity Software", employees: "50-100", openRoles: 8 },
  { id: 4, name: "OpenAI", industry: "Artificial Intelligence", employees: "1000+", openRoles: 43 },
];

export default function CompaniesPage() {
  return (
    <div className="min-h-screen bg-background text-foreground py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter mb-4">Top Companies</h1>
        <p className="text-muted-foreground text-lg mb-12 max-w-2xl">Discover and follow the world&apos;s most innovative organizations actively hiring top talent on JobZee.</p>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_COMPANIES.map((company) => (
            <Link key={company.id} href="/jobs" className="group rounded-3xl border border-white/10 bg-card/40 backdrop-blur-sm p-6 flex flex-col transition-all hover:-translate-y-1 hover:border-white/20">
              <div className="flex justify-between items-start mb-6">
                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-xl font-bold">
                  {company.name.charAt(0)}
                </div>
                <span className="bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full border border-primary/20">
                  {company.openRoles} open roles
                </span>
              </div>
              <h3 className="text-xl font-bold tracking-tight mb-2">{company.name}</h3>
              <div className="flex flex-wrap gap-4 mt-auto">
                <div className="flex items-center text-xs text-muted-foreground">
                  <Building2 className="w-3.5 h-3.5 mr-1.5 opacity-70" />
                  {company.industry}
                </div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <Globe className="w-3.5 h-3.5 mr-1.5 opacity-70" />
                  {company.employees}
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        <div className="mt-16 flex justify-center">
          <button className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors border border-white/10 rounded-full px-6 py-2">
            View all companies <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
