export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground py-20 px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-extrabold tracking-tighter mb-4">Terms of Service</h1>
        <p className="text-sm text-muted-foreground mb-12">Last updated: March 2026</p>
        
        <div className="prose prose-invert max-w-none text-muted-foreground space-y-8">
          <section>
            <h2 className="text-2xl font-bold tracking-tight text-foreground mb-4">1. Acceptance of Terms</h2>
            <p>
              By accessing or using JobZee, you agree to be bound by these Terms of Service. If you disagree with any part of these terms, you may not access the Service.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold tracking-tight text-foreground mb-4">2. User Accounts</h2>
            <p>
              You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password. Job Seekers must provide accurate representation of their skills and experience. Employers must post legitimate, verifiable job opportunities.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold tracking-tight text-foreground mb-4">3. Acceptable Use</h2>
            <p>
              You agree not to use the Service to:
            </p>
            <ul className="pl-5 mt-2 space-y-2 list-disc">
              <li>Upload malicious code, viruses, or invalid file types (resumes must be PDF).</li>
              <li>Scrape or reverse-engineer our platform API.</li>
              <li>Harass, abuse, or harm another person.</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
