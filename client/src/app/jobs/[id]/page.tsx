"use client";

import { motion } from "framer-motion";
import { Bookmark, Building2, MapPin, DollarSign, Clock, CheckCircle2, Share2, CornerUpLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ReactNode } from "react";
import { useParams } from "next/navigation";

export default function JobDetailsPage() {
  const params = useParams();
  
  return (
    <div className="container mx-auto px-4 max-w-5xl py-8 min-h-screen">
      <Link href="/dashboard" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary mb-6 transition-colors">
        <CornerUpLeft className="w-4 h-4 mr-2" />
        Back to search
      </Link>

      <div className="grid md:grid-cols-3 gap-8">
        
        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border rounded-3xl p-8 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-6 flex gap-3 z-10">
              <Button variant="outline" size="icon" className="rounded-full shadow-sm hover:text-primary">
                <Share2 className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon" className="rounded-full shadow-sm hover:text-primary">
                <Bookmark className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex items-center gap-6 mb-8 relative z-0">
              <div className="w-20 h-20 bg-blue-500 rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-blue-500/20">
                T
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tighter mb-2 text-foreground">Senior Frontend Engineer</h1>
                <div className="text-lg text-muted-foreground font-medium flex items-center">
                  TechCorp Inc.
                  <CheckCircle2 className="w-5 h-5 text-blue-500 ml-2" />
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 mb-8 relative z-0">
              <Badge icon={<MapPin className="w-4 h-4" />} text="San Francisco, CA" />
              <Badge icon={<DollarSign className="w-4 h-4" />} text="$140k - $180k" />
              <Badge icon={<Building2 className="w-4 h-4" />} text="Full-time" />
              <Badge icon={<Clock className="w-4 h-4" />} text="Posted 2 days ago" />
            </div>

            <div className="prose dark:prose-invert max-w-none mt-10">
              <h3 className="text-xl font-semibold tracking-tight text-foreground mb-4">About the Role</h3>
              <p className="text-muted-foreground leading-relaxed text-base">
                We are looking for an experienced Senior Frontend Engineer to join our core product team. 
                You will be responsible for building scalable, high-performance web applications using React and Next.js. 
                You will work closely with our design and backend teams to deliver exceptional user experiences.
              </p>

              <h3 className="text-xl font-semibold tracking-tight text-foreground mt-8 mb-4">Responsibilities</h3>
              <ul className="text-muted-foreground space-y-2 list-disc pl-5">
                <li>Architect and develop complex UI components using React and TypeScript.</li>
                <li>Optimize application performance for maximum speed and scalability.</li>
                <li>Collaborate with UX/UI designers to implement highly interactive designs.</li>
                <li>Write clean, maintainable, and testable code.</li>
              </ul>

              <h3 className="text-xl font-semibold tracking-tight text-foreground mt-8 mb-4">Requirements</h3>
              <ul className="text-muted-foreground space-y-2 list-disc pl-5">
                <li>5+ years of experience in frontend development.</li>
                <li>Deep understanding of React, Next.js, and modern CSS (Tailwind).</li>
                <li>Strong proficiency in TypeScript and JavaScript optimization.</li>
                <li>Experience with state management libraries (Zustand, Redux).</li>
              </ul>
            </div>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="md:col-span-1 space-y-6">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card border rounded-3xl p-6 sticky top-24"
          >
            {/* AI Match Score Mock */}
            <div className="p-5 bg-gradient-to-br from-green-500/10 to-teal-500/5 rounded-2xl border border-green-500/20 mb-6 text-center shadow-sm">
              <div className="text-4xl font-black text-green-600 dark:text-green-400 mb-1 tracking-tight">94%</div>
              <div className="text-sm font-semibold text-green-700/80 dark:text-green-300">AI Resume Match</div>
              <p className="text-xs text-muted-foreground mt-2 px-2 font-medium">Your skills heavily align with this role&apos;s requirements.</p>
            </div>

            <Button size="lg" className="w-full text-base font-semibold h-14 rounded-xl shadow-lg mb-4 hover:-translate-y-1 transition-transform">
              Apply Now
            </Button>
            <Button size="lg" variant="outline" className="w-full text-base font-semibold h-14 rounded-xl mb-6">
              Save Job
            </Button>

            <div className="pt-6 border-t text-sm space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Experience level</span>
                <span className="font-medium">Mid-Senior level</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Industry</span>
                <span className="font-medium">Information Technology</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Applicants</span>
                <span className="font-medium">48 so far</span>
              </div>
            </div>
          </motion.div>
        </div>

      </div>
    </div>
  );
}

function Badge({ icon, text }: { icon: ReactNode, text: string }) {
  return (
    <div className="flex items-center text-sm font-medium bg-muted/50 text-muted-foreground px-3 py-1.5 rounded-lg border border-border/50">
      {icon}
      <span className="ml-2">{text}</span>
    </div>
  );
}
