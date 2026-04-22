"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useEffect, useState } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import api from "@/services/api";

function ClerkUserSync() {
  const { isSignedIn, getToken } = useAuth();
  const { user } = useUser();
  const [hasSynced, setHasSynced] = useState(false);

  useEffect(() => {
    const sync = async () => {
      if (!isSignedIn || !user || hasSynced) return;
      try {
        const token = await getToken();
        if (!token) return;
        const metadataRole =
          String(user.publicMetadata?.role || user.unsafeMetadata?.role || "").trim();
        const email = user.emailAddresses?.[0]?.emailAddress ?? "";
        const name =
          user.fullName ||
          `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() ||
          "Clerk User";

        await api.post(
          "/user/clerk/sync",
          {
            role: metadataRole,
            email,
            name,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setHasSynced(true);
      } catch (error) {
        // Keep non-blocking UX even if sync request fails.
        console.error("Failed to sync Clerk user:", error);
      }
    };

    sync();
  }, [getToken, hasSynced, isSignedIn, user]);

  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
          },
        },
      })
  );

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <QueryClientProvider client={queryClient}>
        <ClerkUserSync />
        {children}
      </QueryClientProvider>
    </NextThemesProvider>
  );
}
