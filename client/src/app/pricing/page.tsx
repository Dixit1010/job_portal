import { Check } from "lucide-react";

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground py-20 px-6">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter text-center mb-6">
          Simple, transparent pricing
        </h1>
        <p className="text-lg text-muted-foreground text-center max-w-2xl mb-16 leading-relaxed">
          No hidden fees. No surprise charges. Just the tools you need to hire the best talent or find your dream job.
        </p>

        <div className="grid md:grid-cols-2 gap-8 w-full max-w-4xl">
          {/* Free Tier */}
          <div className="rounded-3xl border border-white/10 bg-card/40 backdrop-blur-xl p-8 flex flex-col transition-all hover:-translate-y-1 hover:border-white/20">
            <h3 className="text-2xl font-bold tracking-tight mb-2">Job Seeker</h3>
            <p className="text-sm text-muted-foreground mb-6">Everything you need to land your next role.</p>
            <div className="mb-6">
              <span className="text-5xl font-extrabold tracking-tighter">$0</span>
              <span className="text-sm text-muted-foreground ml-2">/forever</span>
            </div>
            <ul className="space-y-4 mb-8 flex-grow">
              {["Apply to unlimited jobs", "Profile & Resume builder", "AI Match Scores", "Application tracking"].map((feature) => (
                <li key={feature} className="flex items-center text-sm">
                  <Check className="h-5 w-5 text-primary mr-3 flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
            <button className="w-full py-3 px-4 rounded-xl bg-primary text-primary-foreground font-medium transition-colors hover:bg-primary/90">
              Get Started
            </button>
          </div>

          {/* Pro Tier */}
          <div className="rounded-3xl border border-primary/50 bg-primary/5 backdrop-blur-xl p-8 flex flex-col relative transition-all hover:-translate-y-1 hover:border-primary">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold py-1 px-3 rounded-full uppercase tracking-wider">
              Most Popular
            </div>
            <h3 className="text-2xl font-bold tracking-tight mb-2">Employer Pro</h3>
            <p className="text-sm text-muted-foreground mb-6">Advanced tools for growing teams.</p>
            <div className="mb-6">
              <span className="text-5xl font-extrabold tracking-tighter">$199</span>
              <span className="text-sm text-muted-foreground ml-2">/month</span>
            </div>
            <ul className="space-y-4 mb-8 flex-grow">
              {["Post unlimited jobs", "Advanced AI applicant filtering", "Analytics dashboard", "Priority support", "Custom organization page"].map((feature) => (
                <li key={feature} className="flex items-center text-sm">
                  <Check className="h-5 w-5 text-primary mr-3 flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
            <button className="w-full py-3 px-4 rounded-xl bg-primary text-primary-foreground font-medium transition-colors hover:bg-primary/90">
              Start 14-Day Free Trial
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
