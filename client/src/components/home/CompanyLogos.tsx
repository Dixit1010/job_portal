"use client";

import { Building2 } from "lucide-react";

const COMPANIES = [
  { name: "Google",    color: "text-blue-500",    bg: "bg-blue-500/10"  },
  { name: "Microsoft", color: "text-green-500",   bg: "bg-green-500/10" },
  { name: "Amazon",    color: "text-orange-500",  bg: "bg-orange-500/10"},
  { name: "Netflix",   color: "text-red-500",     bg: "bg-red-500/10"   },
  { name: "Spotify",   color: "text-green-400",   bg: "bg-green-400/10" },
  { name: "Meta",      color: "text-blue-600",    bg: "bg-blue-600/10"  },
  { name: "Apple",     color: "text-foreground",  bg: "bg-muted"        },
  { name: "Tesla",     color: "text-red-600",     bg: "bg-red-600/10"   },
];

// Duplicate for seamless infinite loop
const ITEMS = [...COMPANIES, ...COMPANIES];

export function CompanyLogos() {
  return (
    <section className="py-16 border-y border-border/50 bg-muted/20 overflow-hidden">
      <p className="text-center text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-10">
        Trusted by 500+ Companies Worldwide
      </p>

      {/* marquee-track enables pause-on-hover via CSS */}
      <div className="marquee-track relative">
        {/* fade edges */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 z-10 bg-gradient-to-r from-muted/20 to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 z-10 bg-gradient-to-l from-muted/20 to-transparent" />

        <div
          className="animate-marquee flex gap-6 w-max"
          style={{ animationDuration: "30s" }}
        >
          {ITEMS.map((company, i) => (
            <div
              key={i}
              className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-card/50 backdrop-blur-sm border border-border/40 grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-300 cursor-default shrink-0"
            >
              <div className={`w-7 h-7 rounded-lg ${company.bg} flex items-center justify-center shrink-0`}>
                <Building2 className={`w-3.5 h-3.5 ${company.color}`} />
              </div>
              <span className="text-sm font-semibold text-foreground">{company.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
