"use client";

import { useState } from "react";
import { SignUp } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import { Briefcase, Search, CheckCircle2, ArrowLeft } from "lucide-react";

type Role = "Job Seeker" | "Employer";

const ROLES = [
  {
    value: "Job Seeker" as Role,
    label: "Job Seeker",
    icon: Search,
    tagline: "Find your next opportunity",
    description: "Browse thousands of jobs, track applications, and get matched with top employers.",
    perks: ["Apply to jobs instantly", "AI-powered job matching", "Track application status"],
    gradient: "from-blue-500/20 to-cyan-500/10",
    border: "border-blue-500/30",
    iconBg: "bg-blue-500/10",
    iconColor: "text-blue-500",
    activeBorder: "border-blue-500",
    activeBg: "bg-blue-500/5",
  },
  {
    value: "Employer" as Role,
    label: "Employer",
    icon: Briefcase,
    tagline: "Hire top talent faster",
    description: "Post jobs, manage applicants, and find the perfect candidates for your team.",
    perks: ["Unlimited job postings", "Applicant tracking", "Analytics dashboard"],
    gradient: "from-violet-500/20 to-purple-500/10",
    border: "border-violet-500/30",
    iconBg: "bg-violet-500/10",
    iconColor: "text-violet-500",
    activeBorder: "border-violet-500",
    activeBg: "bg-violet-500/5",
  },
];

export default function SignUpPage() {
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />

      <AnimatePresence mode="wait">
        {!selectedRole ? (
          /* ── Step 1: Role Selection ─────────────────────────────────── */
          <motion.div
            key="role-select"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-2xl"
          >
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold tracking-tight">Join JobZee</h1>
              <p className="text-muted-foreground mt-2">
                Choose how you want to use JobZee to get started.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {ROLES.map(({ value, label, icon: Icon, tagline, description, perks, gradient, border, iconBg, iconColor }) => (
                <motion.button
                  key={value}
                  whileHover={{ y: -4, scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedRole(value)}
                  className={`relative text-left bg-card/60 backdrop-blur-md border ${border} rounded-2xl p-6 overflow-hidden group transition-all duration-300 hover:shadow-xl`}
                >
                  {/* Gradient blob */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                  <div className="relative z-10 space-y-4">
                    <div className={`w-12 h-12 ${iconBg} rounded-xl flex items-center justify-center`}>
                      <Icon className={`w-6 h-6 ${iconColor}`} />
                    </div>

                    <div>
                      <p className="font-bold text-lg">{label}</p>
                      <p className="text-sm text-muted-foreground mt-0.5">{tagline}</p>
                    </div>

                    <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>

                    <ul className="space-y-1.5">
                      {perks.map((perk) => (
                        <li key={perk} className="flex items-center gap-2 text-sm">
                          <CheckCircle2 className="w-3.5 h-3.5 text-green-500 shrink-0" />
                          {perk}
                        </li>
                      ))}
                    </ul>

                    <div className="pt-2">
                      <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary group-hover:gap-2.5 transition-all duration-200">
                        Continue as {label} →
                      </span>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>

            <p className="text-center text-sm text-muted-foreground mt-6">
              Already have an account?{" "}
              <a href="/sign-in" className="text-primary hover:underline font-medium">
                Sign in
              </a>
            </p>
          </motion.div>
        ) : (
          /* ── Step 2: Clerk Sign-Up Form ─────────────────────────────── */
          <motion.div
            key="clerk-signup"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center gap-4 w-full"
          >
            {/* Role badge + change button */}
            {(() => {
              const role = ROLES.find((r) => r.value === selectedRole)!;
              const Icon = role.icon;
              return (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`flex items-center gap-3 px-4 py-2.5 bg-card/60 backdrop-blur-md border ${role.activeBorder} ${role.activeBg} rounded-xl`}
                >
                  <div className={`w-7 h-7 ${role.iconBg} rounded-lg flex items-center justify-center`}>
                    <Icon className={`w-3.5 h-3.5 ${role.iconColor}`} />
                  </div>
                  <span className="text-sm font-medium">
                    Signing up as <strong>{selectedRole}</strong>
                  </span>
                  <button
                    onClick={() => setSelectedRole(null)}
                    className="ml-2 flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <ArrowLeft className="w-3 h-3" />
                    Change
                  </button>
                </motion.div>
              );
            })()}

            <SignUp
              unsafeMetadata={{ role: selectedRole }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
