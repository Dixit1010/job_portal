"use client";

import { motion } from "framer-motion";
import { Building2 } from "lucide-react";
import { FADE_IN_UP, STAGGER_CONTAINER } from "@/lib/animations";

const COMPANIES = [
  { name: "Google", color: "text-blue-500", bg: "bg-blue-500/10" },
  { name: "Microsoft", color: "text-green-500", bg: "bg-green-500/10" },
  { name: "Amazon", color: "text-orange-500", bg: "bg-orange-500/10" },
  { name: "Netflix", color: "text-red-500", bg: "bg-red-500/10" },
  { name: "Spotify", color: "text-green-400", bg: "bg-green-400/10" },
  { name: "Meta", color: "text-blue-600", bg: "bg-blue-600/10" },
  { name: "Apple", color: "text-foreground", bg: "bg-muted" },
  { name: "Tesla", color: "text-red-600", bg: "bg-red-600/10" },
];

export function CompanyLogos() {
  return (
    <section className="py-16 border-y border-border/50 bg-muted/20">
      <div className="container mx-auto px-4 max-w-7xl">
        <p className="text-center text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-10">
          Trusted by 500+ Companies Worldwide
        </p>

        <motion.div
          variants={STAGGER_CONTAINER}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex flex-wrap gap-6 items-center justify-center"
        >
          {COMPANIES.map((company) => (
            <motion.div
              key={company.name}
              variants={FADE_IN_UP}
              className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-card/50 backdrop-blur-sm border border-border/40 grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-300 cursor-default group"
            >
              <div className={`w-7 h-7 rounded-lg ${company.bg} flex items-center justify-center shrink-0 transition-colors duration-300`}>
                <Building2 className={`w-3.5 h-3.5 ${company.color}`} />
              </div>
              <span className="text-sm font-semibold text-foreground">{company.name}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
