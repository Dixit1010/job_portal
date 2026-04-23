"use client";

import { useRef } from "react";

const COMPANIES = [
  { name: "Google",    initials: "G", bg: "#4285F4" },
  { name: "Microsoft", initials: "M", bg: "#00A4EF" },
  { name: "Amazon",    initials: "A", bg: "#FF9900" },
  { name: "Netflix",   initials: "N", bg: "#E50914" },
  { name: "Apple",     initials: "", bg: "#555555" },
  { name: "Meta",      initials: "f", bg: "#0866FF" },
];

const ALL = [...COMPANIES, ...COMPANIES];

export function CompaniesMarquee() {
  const trackRef = useRef<HTMLDivElement>(null);

  const pause  = () => { if (trackRef.current) trackRef.current.style.animationPlayState = "paused";  };
  const resume = () => { if (trackRef.current) trackRef.current.style.animationPlayState = "running"; };

  return (
    <section className="py-14 border-y border-border/50 bg-muted/20">
      <style>{`
        @keyframes marquee-left {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>

      <p className="text-center text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-10">
        Trusted by 500+ Companies Worldwide
      </p>

      <div
        className="overflow-hidden relative"
        onMouseEnter={pause}
        onMouseLeave={resume}
      >
        {/* fade edges */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-20 z-10 bg-gradient-to-r from-muted/20 to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-20 z-10 bg-gradient-to-l from-muted/20 to-transparent" />

        <div
          ref={trackRef}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "2.5rem",
            width: "max-content",
            animation: "marquee-left 25s linear infinite",
          }}
        >
          {ALL.map((c, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-[120px] flex flex-col items-center gap-2 grayscale hover:grayscale-0 opacity-50 hover:opacity-100 transition-all duration-300 cursor-default"
            >
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-sm"
                style={{ backgroundColor: c.bg }}
              >
                {c.initials}
              </div>
              <span className="text-sm font-semibold text-foreground">{c.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
