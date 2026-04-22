import { Building2 } from "lucide-react";

export default function CompaniesPage() {
  return (
    <div className="min-h-screen bg-background text-foreground py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter mb-4">Top Companies</h1>
        <p className="text-muted-foreground text-lg mb-12 max-w-2xl">
          Discover and follow the world&apos;s most innovative organizations actively hiring top talent on JobZee.
        </p>

        <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
          <Building2 className="w-16 h-16 mb-6 opacity-20" />
          <p className="text-lg font-medium">Company profiles coming soon.</p>
          <p className="text-sm mt-2 opacity-70">Browse open positions in the meantime.</p>
        </div>
      </div>
    </div>
  );
}
