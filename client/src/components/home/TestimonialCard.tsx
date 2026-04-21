"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { FADE_IN_UP, STAGGER_CONTAINER } from "@/lib/animations";

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
];

export function TestimonialsSection() {
  return (
    <section className="py-24 bg-muted/20">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Loved by Thousands
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
            Real stories from job seekers and employers who found success on JobZee.
          </p>
        </div>

        <motion.div
          variants={STAGGER_CONTAINER}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-6"
        >
          {TESTIMONIALS.map((t) => (
            <motion.div
              key={t.name}
              variants={FADE_IN_UP}
              className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 flex flex-col gap-4 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
            >
              {/* Quote icon */}
              <Quote className="w-6 h-6 text-primary/30 group-hover:text-primary/60 transition-colors" />

              {/* Stars */}
              <div className="flex gap-0.5">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>

              {/* Text */}
              <p className="text-sm text-foreground/80 leading-relaxed flex-1">
                &ldquo;{t.text}&rdquo;
              </p>

              {/* Author */}
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
                <span
                  className={`text-xs px-2 py-0.5 rounded-full border font-medium shrink-0 ${t.badgeColor}`}
                >
                  {t.badge}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
