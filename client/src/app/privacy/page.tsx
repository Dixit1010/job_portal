export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground py-20 px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-extrabold tracking-tighter mb-4">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground mb-12">Last updated: March 2026</p>
        
        <div className="prose prose-invert max-w-none text-muted-foreground space-y-8">
          <section>
            <h2 className="text-2xl font-bold tracking-tight text-foreground mb-4">1. Data Collection</h2>
            <p>
              We collect information you provide directly to us when using JobZee, including your name, email address, resume data, and application history. We use this data strictly to facilitate the job matching process and improve our core AI matchmaking services.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold tracking-tight text-foreground mb-4">2. How We Use Your Information</h2>
            <p>
              Your data is utilized to:
            </p>
            <ul className="pl-5 mt-2 space-y-2 list-disc">
              <li>Provide, maintain, and improve our Service.</li>
              <li>Connect Job Seekers with potential Employers.</li>
              <li>Analyze usage patterns using aggregated, non-identifiable metrics.</li>
              <li>Communicate with you regarding account updates or support.</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold tracking-tight text-foreground mb-4">3. Data Security</h2>
            <p>
              We implement industry-standard security measures, including HTTPS encryption, secure database instances, and sanitized input validation to protect your personal data against unauthorized access or disclosure.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
