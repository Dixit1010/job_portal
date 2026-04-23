"use client";

import { Star, Quote } from "lucide-react";

const TESTIMONIALS = [
  {
    name: "Priya Sharma",
    role: "Frontend Developer",
    company: "Hired at Razorpay",
    text: "Got hired within 2 weeks of creating my profile. The AI job matching is incredibly accurate — every suggestion felt tailor-made for my skillset.",
    avatar: "PS",
    rating: 5,
    badge: "Job Seeker",
    badgeColor: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  },
  {
    name: "Marcus Chen",
    role: "Head of Engineering",
    company: "TechCorp Inc.",
    text: "We found our CTO in less than a month. The talent quality on JobZee is exceptional — every candidate we interviewed was genuinely impressive and well-vetted.",
    avatar: "MC",
    rating: 5,
    badge: "Employer",
    badgeColor: "bg-primary/10 text-primary border-primary/20",
  },
  {
    name: "Aisha Patel",
    role: "Product Manager",
    company: "Hired at Stripe",
    text: "I had been searching for 6 months on other platforms. JobZee helped me land 3 interviews in one week. The profile completion tips alone were a game-changer.",
    avatar: "AP",
    rating: 5,
    badge: "Job Seeker",
    badgeColor: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  },
  {
    name: "Ravi Menon",
    role: "Backend Engineer",
    company: "Hired at Flipkart",
    text: "The resume builder and job alerts saved me so much time. I had multiple offers in just 3 weeks. Highly recommend to anyone serious about their job search.",
    avatar: "RM",
    rating: 5,
    badge: "Job Seeker",
    badgeColor: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  },
  {
    name: "Sarah Kim",
    role: "VP of Talent",
    company: "Acme Corp",
    text: "JobZee cut our time-to-hire by 40%. The candidate filtering tools are best-in-class and our recruiter team couldn't imagine going back to our old process.",
    avatar: "SK",
    rating: 5,
    badge: "Employer",
    badgeColor: "bg-primary/10 text-primary border-primary/20",
  },
  {
    name: "Diego Santos",
    role: "Data Scientist",
    company: "Hired at Swiggy",
    text: "Found a role perfectly aligned with my niche skills that I couldn't find anywhere else. The search filters and match scores are impressively accurate.",
    avatar: "DS",
    rating: 5,
    badge: "Job Seeker",
    badgeColor: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  },
];

function TestimonialCard({ t }: { t: (typeof TESTIMONIALS)[number] }) {
  return (
    <div className="w-80 shrink-0 bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 flex flex-col gap-4">
      <Quote className="w-6 h-6 text-primary/30" />
      <div className="flex gap-0.5">
        {Array.from({ length: t.rating }).map((_, j) => (
          <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
        ))}
      </div>
      <p className="text-sm text-foreground/80 leading-relaxed flex-1">
        &ldquo;{t.text}&rdquo;
      </p>
      <div className="flex items-center gap-3 pt-3 border-t border-border/40">
        <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-sm font-bold text-primary shrink-0">
          {t.avatar}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm truncate">{t.name}</p>
          <p className="text-xs text-muted-foreground truncate">
            {t.role} · {t.company}
          </p>
        </div>
        <span className={`text-xs px-2 py-0.5 rounded-full border font-medium shrink-0 ${t.badgeColor}`}>
          {t.badge}
        </span>
      </div>
    </div>
  );
}

export function TestimonialsSection() {
  const row1 = [...TESTIMONIALS, ...TESTIMONIALS];
  const row2 = [...TESTIMONIALS].reverse().concat([...TESTIMONIALS].reverse());

  return (
    <section className="py-24 bg-muted/20 overflow-hidden">
      <div className="text-center mb-16 px-4">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
          Loved by Thousands
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
          Real stories from job seekers and employers who found success on JobZee.
        </p>
      </div>

      {/* Row 1 — scrolls left */}
      <div className="marquee-track mb-4">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 z-10 bg-gradient-to-r from-muted/20 to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 z-10 bg-gradient-to-l from-muted/20 to-transparent" />
        <div
          className="animate-marquee flex gap-4 w-max"
          style={{ animationDuration: "40s" }}
        >
          {row1.map((t, i) => <TestimonialCard key={i} t={t} />)}
        </div>
      </div>

      {/* Row 2 — scrolls right (reverse) */}
      <div className="marquee-track">
        <div
          className="animate-marquee flex gap-4 w-max"
          style={{ animationDuration: "40s", animationDirection: "reverse" }}
        >
          {row2.map((t, i) => <TestimonialCard key={i} t={t} />)}
        </div>
      </div>
    </section>
  );
}
