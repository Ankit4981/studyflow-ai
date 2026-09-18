"use client";

import { useEffect, useSyncExternalStore } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Header } from "@/components/navigation/Header";
import { Footer } from "@/components/navigation/Footer";
import { StudyMentor } from "@/components/chat/StudyMentor";
import { useScholar } from "@/lib/hooks/useScholar";

const emptySubscribe = () => () => {};

function useIsClient() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated } = useScholar();
  const isClient = useIsClient();

  useEffect(() => {
    if (!isClient) return;
    if (!isAuthenticated && pathname !== "/login") {
      router.replace("/login");
    } else if (isAuthenticated && pathname === "/login") {
      router.replace("/");
    }
  }, [isClient, isAuthenticated, pathname, router]);

  // If on /login, render only the distraction-free login screen (no header, footer, or chatbot)
  if (pathname === "/login") {
    return (
      <main className="w-full min-h-screen bg-background">
        {children}
      </main>
    );
  }

  // If still rendering on server or not authenticated on a protected route, show clean loading splash
  if (!isClient || !isAuthenticated) {
    return (
      <div className="min-h-screen w-full bg-background flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 rounded-full border-3 border-primary/20 border-t-primary animate-spin" />
        <p className="text-xs font-label text-on-surface-variant tracking-wider uppercase">
          Loading Revision Dojo…
        </p>
      </div>
    );
  }

  // Authenticated dashboard layout
  return (
    <>
      <Header />
      <main className="w-full pt-24 md:pt-16 bg-background min-h-screen">
        {children}
      </main>
      <StudyMentor />
      <Footer />
    </>
  );
}
