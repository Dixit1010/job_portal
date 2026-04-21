"use client";

import { motion } from "framer-motion";
import { CheckCircle, Building2, Zap, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FADE_IN_UP, STAGGER_CONTAINER } from "@/lib/animations";

const PLANS = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    desc: "Perfect for small businesses getting started.",
    icon: Building2,
    iconColor: "text-muted-foreground",
    iconBg: "bg-muted/60",
    features: [
      "Post 1 active job",
      "Basic applicant tracking",
      "Email notifications",
      "Standard listing placement",
    ],
    cta: "Get Started Free",
    href: "/sign-up",
    highlighted: false,
    variant: "outline" as const,
  },
  {
    name: "Pro",
    price: "$49",
    period: "/month",
    desc: "For growing teams that need more reach.",
    icon: Zap,
    iconColor: "text-primary",
    iconBg: "bg-primary/10",
    features: [
      "Unlimited job posts",
      "Advanced ATS dashboard",
      "Priority search placement",
      "Candidate shortlisting tools",
      "Analytics & reporting",
      "Remove JobZee branding",
    ],
    cta: "Start Free Trial",
    href: "/sign-up",
    highlighted: true,
    variant: "default" as const,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "pricing",
    desc: "For large organizations with custom needs.",
    icon: Sparkles,
    iconColor: "text-purple-500",
    iconBg: "bg-purple-500/10",
    features: [
      "Everything in Pro",
      "Dedicated account manager",
      "REST API access",
      "SSO & SCIM provisioning",
      "Custom integrations",
      "SLA guarantee",
    ],
    cta: "Contact Sales",
    href: "/contact",
    highlighted: false,
    variant: "outline" as const,
  },
];

export function PricingSection() {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
            Start free. Scale as you grow. No hidden fees, no surprises.
          </p>
        </div>

        <motion.div
          variants={STAGGER_CONTAINER}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-6 items-start"
        >
          {PLANS.map((plan) => (
            <motion.div
              key={plan.name}
              variants={FADE_IN_UP}
              className={`relative bg-card/50 backdrop-blur-sm border rounded-2xl p-7 flex flex-col gap-5 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                plan.highlighted
                  ? "border-primary/50 shadow-lg shadow-primary/10 ring-1 ring-primary/20"
                  : "border-border/50"
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold px-4 py-1.5 rounded-full shadow-md">
                  Most Popular
                </div>
              )}

              {/* Header */}
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl ${plan.iconBg} border border-border/40 flex items-center justify-center shrink-0`}
                >
                  <plan.icon className={`w-5 h-5 ${plan.iconColor}`} />
                </div>
                <div>
                  <h3 className="font-bold text-base leading-tight">{plan.name}</h3>
                  <p className="text-xs text-muted-foreground leading-tight">{plan.desc}</p>
                </div>
              </div>

              {/* Price */}
              <div className="flex items-end gap-1">
                <span className="text-4xl font-bold tracking-tight">{plan.price}</span>
                <span className="text-muted-foreground text-sm mb-1.5">{plan.period}</span>
              </div>

              {/* Features */}
              <ul className="space-y-2.5 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                    <span className="text-foreground/80 leading-snug">{f}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link href={plan.href}>
                <Button className="w-full" variant={plan.variant}>
                  {plan.cta}
                </Button>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
