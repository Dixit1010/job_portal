"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Search, Briefcase, Users, Star } from "lucide-react";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
};

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background"></div>
        <div className="container mx-auto px-4 max-w-7xl">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div variants={fadeIn} className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-primary/10 text-primary mb-6 border border-primary/20">
              <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"></span>
              The #1 Job Board for SaaS Professionals
            </motion.div>
            
            <motion.div variants={fadeIn}>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter mb-8 text-foreground">
                Find Your True Calling. <br className="hidden md:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500">
                  Build Your Dream Team.
                </span>
              </h1>
            </motion.div>

            <motion.p variants={fadeIn} className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed font-medium">
              JobZee connects top-tier tech talent with fast-growing startups and established enterprises. Powered by AI matchmaking.
            </motion.p>
            
            <motion.div variants={fadeIn} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/jobs">
                <Button size="lg" className="h-14 px-8 text-base rounded-full shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                  <Search className="mr-2 h-5 w-5" />
                  Find a Job
                </Button>
              </Link>
              <Link href="/employer/dashboard">
                <Button size="lg" variant="outline" className="h-14 px-8 text-base rounded-full bg-background/50 backdrop-blur-sm border-2 hover:bg-muted transition-all hover:-translate-y-1">
                  <Briefcase className="mr-2 h-5 w-5" />
                  Post a Job
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Why Choose JobZee?</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
              Everything you need in a modern job board platform, built for speed and results.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Search className="w-8 h-8 text-primary" />,
                title: "Smart Global Search",
                desc: "Find exactly what you're looking for with our command palette and AI-powered filters."
              },
              {
                icon: <Users className="w-8 h-8 text-blue-500" />,
                title: "Top 1% Talent",
                desc: "Access a curated pool of vetted professionals ready to make an impact on day one."
              },
              {
                icon: <CheckCircle className="w-8 h-8 text-green-500" />,
                title: "Automated Tracking",
                desc: "Manage applicants effortlessly with our built-in Applicant Tracking System (ATS)."
              }
            ].map((feature, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2, duration: 0.5 }}
                className="bg-card/50 backdrop-blur-sm p-8 rounded-3xl border border-border/50 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div className="bg-primary/10 w-14 h-14 rounded-2xl flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold tracking-tight mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 dark:bg-primary/10 -z-10"></div>
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-5xl font-bold tracking-tighter mb-6">Ready to Supercharge Your Career?</h2>
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
              Join thousands of professionals and companies already using JobZee.
            </p>
            <Link href="/register">
              <Button size="lg" className="h-14 px-8 text-lg rounded-full shadow-lg">
                Create Free Account
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
