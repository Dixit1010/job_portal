"use client";

import Link from "next/link";
import { UserButton, SignInButton, SignUpButton, useUser } from "@clerk/nextjs";
import { ThemeToggle } from "./ThemeToggle";
import { Notifications } from "./Notifications";
import { Button } from "@/components/ui/button";
import { Briefcase } from "lucide-react";

export function Navbar() {
  const { user, isLoaded } = useUser();

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container mx-auto max-w-7xl flex h-16 items-center px-4 md:px-8">
        <Link href="/" className="flex items-center space-x-2.5 mr-6 group">
          <div className="bg-primary text-primary-foreground p-1.5 rounded-lg shadow-sm group-hover:shadow-md transition-all duration-300 group-hover:-translate-y-0.5">
            <Briefcase className="w-5 h-5" />
          </div>
          <span className="text-lg md:text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80">JobZee</span>
        </Link>
        
        <div className="flex-1 flex gap-6 md:gap-8">
          <Link href="/jobs" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200">
            Find Jobs
          </Link>
          <Link href="/companies" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200">
            Companies
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <Notifications />
          <ThemeToggle />
          
          {isLoaded && user ? (
            <div className="flex items-center gap-4">
              <Link href={user?.publicMetadata?.role === "EMPLOYER" ? "/employer/dashboard" : "/dashboard"}>
                <Button variant="ghost">Dashboard</Button>
              </Link>
              <UserButton />
            </div>
          ) : isLoaded && !user ? (
            <div className="flex items-center gap-2">
              <SignInButton mode="modal">
                <Button variant="ghost">Log in</Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button>Sign Up</Button>
              </SignUpButton>
            </div>
          ) : null}
        </div>
      </div>
    </nav>
  );
}
