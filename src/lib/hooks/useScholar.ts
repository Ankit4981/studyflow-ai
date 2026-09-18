"use client";

import { useSyncExternalStore, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";

export const SCHOLAR_KEY = "studyflow_scholar";
export const SESSION_ACTIVE_KEY = "studyflow_session_active";

export interface ScholarProfile {
  name: string;
  avatar: string;
  tagline: string;
  gender: "boy" | "girl" | null;
  studentClass?: string;
  board?: string;
  school?: string;
  xp?: number;
  quizzesCompleted?: number;
  focusSessions?: number;
  createdAt?: string;
}

function subscribe(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("storage", callback);
  window.addEventListener("studyflow-scholar-updated", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("studyflow-scholar-updated", callback);
  };
}

function getSnapshot(): string | null {
  if (typeof window === "undefined") return null;
  // Read from localStorage directly; sessionStorage check was causing multi-tab auth failures
  return localStorage.getItem(SCHOLAR_KEY);
}

function getServerSnapshot(): string | null {
  return null;
}

export function useScholar() {
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const scholar = useMemo<ScholarProfile | null>(() => {
    if (!raw) return null;
    try {
      return JSON.parse(raw) as ScholarProfile;
    } catch {
      return null;
    }
  }, [raw]);

  return {
    scholar,
    isAuthenticated: Boolean(scholar),
    raw,
  };
}

export function notifyScholarUpdated() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("studyflow-scholar-updated"));
  }
}

export function getStoredScholar(): ScholarProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SCHOLAR_KEY);
    return raw ? (JSON.parse(raw) as ScholarProfile) : null;
  } catch {
    return null;
  }
}

export function activateScholarSession(profile?: ScholarProfile) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(SESSION_ACTIVE_KEY, "true");
  if (profile) {
    localStorage.setItem(SCHOLAR_KEY, JSON.stringify(profile));
  }
  notifyScholarUpdated();
}

export function awardScholarXP(amount: number) {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(SCHOLAR_KEY);
    if (!raw) return;
    const scholar = JSON.parse(raw) as ScholarProfile;
    // Use nullish coalescing (??) so 0 XP is preserved correctly (not overridden by fallback)
    scholar.xp = (scholar.xp ?? 0) + amount;
    localStorage.setItem(SCHOLAR_KEY, JSON.stringify(scholar));
    notifyScholarUpdated();
  } catch {
    // ignore
  }
}

/** Increment focusSessions counter (call when a Pomodoro/Deep session completes) */
export function awardScholarFocusSession() {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(SCHOLAR_KEY);
    if (!raw) return;
    const scholar = JSON.parse(raw) as ScholarProfile;
    scholar.focusSessions = (scholar.focusSessions ?? 0) + 1;
    localStorage.setItem(SCHOLAR_KEY, JSON.stringify(scholar));
    notifyScholarUpdated();
  } catch {
    // ignore
  }
}

/** Increment quizzesCompleted counter (call only when a quiz is genuinely scored) */
export function awardScholarQuizComplete() {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(SCHOLAR_KEY);
    if (!raw) return;
    const scholar = JSON.parse(raw) as ScholarProfile;
    scholar.quizzesCompleted = (scholar.quizzesCompleted ?? 0) + 1;
    localStorage.setItem(SCHOLAR_KEY, JSON.stringify(scholar));
    notifyScholarUpdated();
  } catch {
    // ignore
  }
}

export function useRequireAuth(redirectUrl = "/login") {
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;
    // Use localStorage (not sessionStorage) so auth persists across tabs and page refreshes.
    // sessionStorage is tab-isolated; opening any link in a new tab would wrongly redirect.
    const hasScholar = localStorage.getItem(SCHOLAR_KEY);
    if (!hasScholar) {
      router.replace(redirectUrl);
    }
  }, [router, redirectUrl]);
}
