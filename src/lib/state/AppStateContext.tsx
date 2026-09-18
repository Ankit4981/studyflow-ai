"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";
import { AccessibilityPrefs, ReviewState, StudyFlow } from "@/types";
import { loadPersisted, savePersisted } from "@/lib/storage/persist";

const DEFAULT_ACCESSIBILITY: AccessibilityPrefs = {
  theme: "light",
  dyslexiaFont: false,
  reducedMotion: false,
  focusReading: false,
};

interface AppState {
  studyFlow: StudyFlow | null;
  setStudyFlow: (flow: StudyFlow | null) => void;

  taskCompletion: Record<string, boolean>;
  toggleTask: (taskId: string) => void;

  flashcardReview: Record<string, ReviewState>;
  setFlashcardReview: (cardId: string, state: ReviewState) => void;

  accessibility: AccessibilityPrefs;
  updateAccessibility: (patch: Partial<AccessibilityPrefs>) => void;

  progress: {
    tasksCompleted: number;
    tasksTotal: number;
    flashcardsReviewed: number;
    flashcardsMastered: number;
    flashcardsTotal: number;
    overallPercent: number;
  };

  hydrated: boolean;
}

const AppStateContext = createContext<AppState | null>(null);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [studyFlow, setStudyFlowState] = useState<StudyFlow | null>(null);
  const [taskCompletion, setTaskCompletion] = useState<Record<string, boolean>>({});
  const [flashcardReview, setFlashcardReviewState] = useState<Record<string, ReviewState>>({});
  const [accessibility, setAccessibility] = useState<AccessibilityPrefs>(DEFAULT_ACCESSIBILITY);
  const [hydrated, setHydrated] = useState(false);

  // One-time hydration from localStorage on mount (client-only external storage read).
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const persisted = loadPersisted();
    if (persisted) {
      if (persisted.studyFlow) setStudyFlowState(persisted.studyFlow as StudyFlow);
      if (persisted.taskCompletion) setTaskCompletion(persisted.taskCompletion);
      if (persisted.flashcardReview) setFlashcardReviewState(persisted.flashcardReview);
      if (persisted.accessibility) {
        setAccessibility({ ...DEFAULT_ACCESSIBILITY, ...persisted.accessibility });
      } else {
        const prefersReducedMotion =
          typeof window !== "undefined" &&
          window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
        if (prefersReducedMotion) {
          setAccessibility((prev) => ({ ...prev, reducedMotion: true }));
        }
      }
    }
    setHydrated(true);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  // Persist on every change (after hydration, to avoid clobbering with defaults).
  useEffect(() => {
    if (!hydrated) return;
    savePersisted({
      studyFlow,
      taskCompletion,
      flashcardReview,
      accessibility,
    });
  }, [hydrated, studyFlow, taskCompletion, flashcardReview, accessibility]);

  // Apply accessibility state to <html> so CSS in globals.css can react to it.
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", accessibility.theme === "dark");
    root.classList.toggle("dyslexia-friendly", accessibility.dyslexiaFont);
    root.classList.toggle("reduce-motion", accessibility.reducedMotion);
    root.classList.toggle("focus-reading", accessibility.focusReading);
  }, [accessibility]);

  const setStudyFlow = useCallback((flow: StudyFlow | null) => {
    setStudyFlowState(flow);
    // A fresh study flow starts with a clean slate for tasks/flashcards.
    setTaskCompletion({});
    setFlashcardReviewState({});
  }, []);

  const toggleTask = useCallback((taskId: string) => {
    setTaskCompletion((prev) => ({ ...prev, [taskId]: !prev[taskId] }));
  }, []);

  const setFlashcardReview = useCallback((cardId: string, state: ReviewState) => {
    setFlashcardReviewState((prev) => ({ ...prev, [cardId]: state }));
  }, []);

  const updateAccessibility = useCallback((patch: Partial<AccessibilityPrefs>) => {
    setAccessibility((prev) => ({ ...prev, ...patch }));
  }, []);

  const progress = useMemo(() => {
    const tasksTotal = studyFlow?.tasks.length ?? 0;
    const tasksCompleted = studyFlow
      ? studyFlow.tasks.filter((t) => taskCompletion[t.id]).length
      : 0;

    const flashcardsTotal = studyFlow?.flashcards.length ?? 0;
    const reviewValues = studyFlow
      ? studyFlow.flashcards.map((c) => flashcardReview[c.id] ?? "unseen")
      : [];
    const flashcardsReviewed = reviewValues.filter((v) => v !== "unseen").length;
    const flashcardsMastered = reviewValues.filter((v) => v === "correct").length;

    const totalUnits = tasksTotal + flashcardsTotal;
    const doneUnits = tasksCompleted + flashcardsMastered;
    const overallPercent = totalUnits > 0 ? Math.round((doneUnits / totalUnits) * 100) : 0;

    return {
      tasksCompleted,
      tasksTotal,
      flashcardsReviewed,
      flashcardsMastered,
      flashcardsTotal,
      overallPercent,
    };
  }, [studyFlow, taskCompletion, flashcardReview]);

  const value: AppState = {
    studyFlow,
    setStudyFlow,
    taskCompletion,
    toggleTask,
    flashcardReview,
    setFlashcardReview,
    accessibility,
    updateAccessibility,
    progress,
    hydrated,
  };

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error("useAppState must be used within AppStateProvider");
  return ctx;
}
