"use client";

import { useRef } from "react";
import { Star, Quote } from "lucide-react";

const TESTIMONIALS = [
  {
    name: "Priya Sharma",
    role: "Frontend Developer",
    company: "Hired at Razorpay",
    text: "Got hired within 2 weeks of creating my profile. The AI job matching is incredibly accurate — every suggestion felt tailor-made for my skillset.",
    avatar: "PS",
    badge: "Job Seeker",
    badgeColor: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  },
  {
    name: "Marcus Chen",
    role: "Head of Engineering",
    company: "TechCorp Inc.",
    text: "We found our CTO in less than a month. The talent quality on JobZee is exceptional — every candidate we interviewed was genuinely impressive.",
    avatar: "MC",
    badge: "Employer",
    badgeColor: "bg-primary/10 text-primary border-primary/20",
  },
  {
    name: "Aisha Patel",
    role: "Product Manager",
    company: "Hired at Stripe",
    text: "I had been searching for 6 months on other platforms. JobZee helped me land 3 interviews in one week. The profile tips alone were a game-changer.",
    avatar: "AP",
    badge: "Job Seeker",
    badgeColor: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  },
  {
    name: "Ravi Menon",
    role: "Backend Engineer",
    company: "Hired at Flipkart",
    text: "Multiple offers in just 3 weeks. The resume builder and smart job alerts saved me so much time. Highly recommend to anyone serious about their career.",
    avatar: "RM",
    badge: "Job Seeker",
    badgeColor: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  },
  {
    name: "Sarah Kim",
    role: "VP of Talent",
    company: "Acme Corp",
    text: "JobZee cut our time-to-hire by 40%. The candidate filtering tools are best-in-class and our recruiting team couldn't imagine going back.",
    avatar: "SK",
    badge: "Employer",
    badgeColor: "bg-primary/10 text-primary border-primary/20",
  },
];

const ALL = [...TESTIMONIALS, ...TESTIMONIALS];

function Card({ t }: { t: (typeof TESTIMONIALS)[number] }) {
  return (
    <div
      style={{ flexShrink: 0, width: "320px" }}
      className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 flex flex-col gap-3"
    >
      <Quote className="w-5 h-5 text-primary/30" />
      <div className="flex gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
        ))}
      </div>
      <p className="text-sm text-foreground/80 leading-relaxed flex-1">&ldquo;{t.text}&rdquo;</p>
      <div className="flex items-center gap-3 pt-3 border-t border-border/40">
        <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-xs font-bold text-primary shrink-0">
          {t.avatar}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm truncate">{t.name}</p>
          <p className="text-xs text-muted-foreground truncate">{t.role} · {t.company}</p>
        </div>
        <span className={`text-xs px-2 py-0.5 rounded-full border font-medium shrink-0 ${t.badgeColor}`}>
          {t.badge}
        </span>
      </div>
    </div>
  );
}

export function TestimonialsMarquee() {
  const trackRef = useRef<HTMLDivElement>(null);

  const pause  = () => { if (trackRef.current) trackRef.current.style.animationPlayState = "paused";  };
  const resume = () => { if (trackRef.current) trackRef.current.style.animationPlayState = "running"; };

  return (
    <section className="py-24 bg-muted/20">
      <style>{`
        @keyframes marquee-left {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>

      <div className="text-center mb-14 px-4">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Loved by Thousands</h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Real stories from job seekers and employers who found success on JobZee.
        </p>
      </div>

      <div
        className="overflow-hidden relative"
        onMouseEnter={pause}
        onMouseLeave={resume}
      >
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 z-10 bg-gradient-to-r from-muted/20 to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 z-10 bg-gradient-to-l from-muted/20 to-transparent" />

        <div
          ref={trackRef}
          style={{
            display: "flex",
            gap: "1.25rem",
            width: "max-content",
            animation: "marquee-left 40s linear infinite",
          }}
        >
          {ALL.map((t, i) => <Card key={i} t={t} />)}
        </div>
      </div>
    </section>
  );
}
