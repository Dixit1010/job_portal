"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { motion } from "framer-motion";
import { FADE_IN_UP, STAGGER_CONTAINER } from "@/lib/animations";

const STATS = [
  { label: "Active Jobs", value: 10000, suffix: "+", color: "text-blue-500" },
  { label: "Companies Hiring", value: 500, suffix: "+", color: "text-primary" },
  { label: "Job Seekers", value: 50000, suffix: "+", color: "text-purple-500" },
  { label: "Placement Rate", value: 90, suffix: "%", color: "text-green-500" },
];

function CounterItem({
  value,
  suffix,
  label,
  color,
}: {
  value: number;
  suffix: string;
  label: string;
  color: string;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    const duration = 2000;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * value));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, value]);

  return (
    <motion.div
      ref={ref}
      variants={FADE_IN_UP}
      className="text-center group"
    >
      <p className={`text-4xl md:text-5xl font-bold mb-2 ${color} tabular-nums`}>
        {count.toLocaleString()}{suffix}
      </p>
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
    </motion.div>
  );
}

export function StatsCounter() {
  return (
    <section className="py-20 border-b border-border/50">
      <div className="container mx-auto px-4 max-w-7xl">
        <motion.div
          variants={STAGGER_CONTAINER}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-10 md:gap-16"
        >
          {STATS.map((stat) => (
            <CounterItem key={stat.label} {...stat} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
