"use client";

import { motion } from "framer-motion";
import { UserPlus, Send, Trophy } from "lucide-react";
import { FADE_IN_UP, STAGGER_CONTAINER } from "@/lib/animations";

const STEPS = [
  {
    icon: UserPlus,
    step: "01",
    title: "Create Your Account",
    desc: "Sign up in 30 seconds. Build your profile with skills, experience, and upload your resume to stand out.",
    iconColor: "text-blue-500",
    iconBg: "bg-blue-500/10",
    iconBorder: "border-blue-500/20",
    connectorColor: "from-blue-500/30 to-primary/30",
  },
  {
    icon: Send,
    step: "02",
    title: "Apply to Jobs",
    desc: "Browse thousands of curated listings filtered by role, salary, and location. One-click apply with your saved profile.",
    iconColor: "text-primary",
    iconBg: "bg-primary/10",
    iconBorder: "border-primary/20",
    connectorColor: "from-primary/30 to-green-500/30",
  },
  {
    icon: Trophy,
    step: "03",
    title: "Get Hired",
    desc: "Track your applications in real-time, receive interview tips, and land your dream role faster than ever.",
    iconColor: "text-green-500",
    iconBg: "bg-green-500/10",
    iconBorder: "border-green-500/20",
    connectorColor: "",
  },
];

export function HowItWorks() {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Get Hired in 3 Simple Steps
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
            Our streamlined process gets you from signup to hired in record time.
          </p>
        </div>

        <motion.div
          variants={STAGGER_CONTAINER}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-8 relative"
        >
          {STEPS.map((step, i) => (
            <motion.div
              key={step.title}
              variants={FADE_IN_UP}
              className="relative flex flex-col items-center text-center"
            >
              {/* Connector line between steps */}
              {i < STEPS.length - 1 && (
                <div
                  className={`hidden md:block absolute top-10 left-[calc(50%+2.5rem)] right-[calc(-50%+2.5rem)] h-px bg-gradient-to-r ${step.connectorColor}`}
                />
              )}

              {/* Step label */}
              <span className="text-xs font-bold text-muted-foreground/40 mb-3 tracking-[0.2em] uppercase">
                Step {step.step}
              </span>

              {/* Icon circle */}
              <div
                className={`w-20 h-20 rounded-2xl ${step.iconBg} border ${step.iconBorder} bg-card/50 backdrop-blur-sm flex items-center justify-center mb-6 shadow-sm`}
              >
                <step.icon className={`w-9 h-9 ${step.iconColor}`} />
              </div>

              <h3 className="text-xl font-semibold mb-3 tracking-tight">{step.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-xs mx-auto">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
