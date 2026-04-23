"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Search, Briefcase, Users, Star, Mail } from "lucide-react";
import { CompaniesMarquee } from "@/components/home/CompaniesMarquee";
import { StatsCounter } from "@/components/home/StatsCounter";
import { TestimonialsMarquee } from "@/components/home/TestimonialsMarquee";
import { HowItWorks } from "@/components/home/HowItWorks";

import { FADE_IN_UP, STAGGER_CONTAINER } from "@/lib/animations";

// ─── Floating blobs ───────────────────────────────────────────────────────────

function FloatingBlobs() {
  return (
    <>
      <motion.div
        animate={{ y: [0, -18, 0], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-24 left-8 w-72 h-72 bg-primary/15 rounded-full blur-3xl -z-10 pointer-events-none"
      />
      <motion.div
        animate={{ y: [0, 22, 0], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
        className="absolute top-32 right-8 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -z-10 pointer-events-none"
      />
      <motion.div
        animate={{ y: [0, -14, 0], opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        className="absolute bottom-16 left-1/3 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -z-10 pointer-events-none"
      />
      <motion.div
        animate={{ y: [0, 16, 0], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute top-1/2 left-1/2 w-56 h-56 bg-green-500/8 rounded-full blur-3xl -z-10 pointer-events-none"
      />
    </>
  );
}

// ─── Email CTA ────────────────────────────────────────────────────────────────

function EmailCTA() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
    setEmail("");
  };

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-primary/5 dark:bg-primary/10 -z-10" />
      <motion.div
        animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent -z-10 pointer-events-none"
      />

      <div className="container mx-auto px-4 max-w-4xl text-center">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <h2 className="text-3xl md:text-5xl font-bold tracking-tighter">
            Ready to Supercharge Your Career?
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Join thousands of professionals and companies already using JobZee. Get the latest
            job alerts delivered straight to your inbox.
          </p>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 bg-green-500/10 text-green-600 border border-green-500/20 px-6 py-3 rounded-full text-sm font-medium"
            >
              <CheckCircle className="w-4 h-4" />
              You&apos;re on the list! We&apos;ll be in touch soon.
            </motion.div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            >
              <div className="relative flex-1">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full h-12 pl-10 pr-4 rounded-full bg-background/80 border border-border/60 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
                />
              </div>
              <Button type="submit" className="h-12 px-6 rounded-full shrink-0">
                Get Job Alerts
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </form>
          )}

          <p className="text-xs text-muted-foreground">
            No spam, ever. Unsubscribe anytime with one click.
          </p>

          <div className="flex items-center justify-center gap-6 pt-2">
            <Link href="/sign-up">
              <Button size="lg" className="h-13 px-8 text-base rounded-full shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5">
                Create Free Account
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Features Grid ────────────────────────────────────────────────────────────

const FEATURES = [
  {
    icon: <Search className="w-8 h-8 text-primary" />,
    bg: "bg-primary/10",
    title: "Smart Global Search",
    desc: "Find exactly what you're looking for with our command palette and AI-powered filters.",
  },
  {
    icon: <Users className="w-8 h-8 text-blue-500" />,
    bg: "bg-blue-500/10",
    title: "Top 1% Talent",
    desc: "Access a curated pool of vetted professionals ready to make an impact on day one.",
  },
  {
    icon: <CheckCircle className="w-8 h-8 text-green-500" />,
    bg: "bg-green-500/10",
    title: "Automated Tracking",
    desc: "Manage applicants effortlessly with our built-in Applicant Tracking System (ATS).",
  },
];

function FeaturesSection() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Why Choose JobZee?
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
            Everything you need in a modern job board platform, built for speed and results.
          </p>
        </div>

        <motion.div
          variants={STAGGER_CONTAINER}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-8"
        >
          {FEATURES.map((feature, idx) => (
            <motion.div
              key={idx}
              variants={FADE_IN_UP}
              className="bg-card/50 backdrop-blur-sm p-8 rounded-3xl border border-border/50 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <div className={`${feature.bg} w-14 h-14 rounded-2xl flex items-center justify-center mb-6`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold tracking-tight mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* ── Hero ── */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background" />
        <FloatingBlobs />

        <div className="container mx-auto px-4 max-w-7xl">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={STAGGER_CONTAINER}
            className="text-center max-w-4xl mx-auto"
          >
            {/* Badge */}
            <motion.div variants={FADE_IN_UP} className="flex justify-center mb-6">
              <span className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-primary/10 text-primary border border-primary/20">
                <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse" />
                The #1 Job Board for SaaS Professionals
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={FADE_IN_UP}
              className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter mb-8 text-foreground"
            >
              Find Your True Calling.{" "}
              <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500">
                Build Your Dream Team.
              </span>
            </motion.h1>

            {/* Subtext */}
            <motion.p
              variants={FADE_IN_UP}
              className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed font-medium"
            >
              JobZee connects top-tier tech talent with fast-growing startups and established
              enterprises. Powered by AI matchmaking.
            </motion.p>

            {/* CTAs */}
            <motion.div
              variants={FADE_IN_UP}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link href="/jobs">
                <Button
                  size="lg"
                  className="h-14 px-8 text-base rounded-full shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
                >
                  <Search className="mr-2 h-5 w-5" />
                  Find a Job
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-14 px-8 text-base rounded-full bg-background/50 backdrop-blur-sm border-2 hover:bg-muted transition-all hover:-translate-y-1"
                >
                  <Briefcase className="mr-2 h-5 w-5" />
                  Post a Job
                </Button>
              </Link>
            </motion.div>

            {/* Social proof pill */}
            <motion.div
              variants={FADE_IN_UP}
              className="flex items-center justify-center gap-2 mt-8 text-sm text-muted-foreground"
            >
              <div className="flex -space-x-2">
                {["A", "B", "C", "D"].map((l) => (
                  <div
                    key={l}
                    className="w-7 h-7 rounded-full bg-primary/20 border-2 border-background flex items-center justify-center text-[10px] font-bold text-primary"
                  >
                    {l}
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span>Trusted by 50,000+ professionals</span>
            </motion.div>

          </motion.div>
        </div>
      </section>

      {/* ── Company Logos ── */}
      <CompaniesMarquee />

      {/* ── Stats ── */}
      <StatsCounter />

      {/* ── Features ── */}
      <FeaturesSection />

      {/* ── How It Works ── */}
      <HowItWorks />

      {/* ── Testimonials ── */}
      <TestimonialsMarquee />

      {/* ── Email CTA ── */}
      <EmailCTA />
    </div>
  );
}
