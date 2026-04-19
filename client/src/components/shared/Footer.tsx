import Link from "next/link";
import { Briefcase } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-muted/20">
      <div className="container mx-auto max-w-7xl px-4 md:px-8 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          <div className="col-span-2 lg:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <div className="bg-primary text-primary-foreground p-1.5 rounded-lg">
                <Briefcase className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold tracking-tight">JobZee</span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-xs mb-6">
              The premier platform for finding your dream job or hiring world-class talent to scale your business.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-sm">Candidates</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/jobs" className="hover:text-primary transition-colors">Browse Jobs</Link></li>
              <li><Link href="/companies" className="hover:text-primary transition-colors">Browse Companies</Link></li>
              <li><Link href="/dashboard" className="hover:text-primary transition-colors">Candidate Dashboard</Link></li>
              <li><Link href="/saved" className="hover:text-primary transition-colors">Saved Jobs</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-sm">Employers</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/employer/dashboard" className="hover:text-primary transition-colors">Post a Job</Link></li>
              <li><Link href="/employer/applicants" className="hover:text-primary transition-colors">Search Resumes</Link></li>
              <li><Link href="/pricing" className="hover:text-primary transition-colors">Pricing</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-sm">Company</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
              <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} JobZee. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
