"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import { useAppState } from "@/lib/state/AppStateContext";

export type DojoStep = 1 | 2 | 3 | 4 | 5;

const STEPS = [
  { step: 1, label: "Notes Transform", href: "/" },
  { step: 2, label: "Micro-Tasks", href: "/micro-tasks" },
  { step: 3, label: "Flashcards", href: "/flashcards" },
  { step: 4, label: "Exam Arena", href: "/quiz" },
  { step: 5, label: "Progress & Mastery", href: "/progress" },
];

export function DojoStepTracker({ currentStep }: { currentStep: DojoStep }) {
  const { studyFlow, progress } = useAppState();

  return (
    <div className="w-full bg-surface border border-outline-variant rounded-2xl p-3.5 mb-6 shadow-xs">
      <div className="flex items-center justify-between gap-2 overflow-x-auto">
        {STEPS.map((s, idx) => {
          const isCompleted =
            s.step === 1
              ? Boolean(studyFlow)
              : s.step === 2
              ? progress.tasksCompleted > 0 && progress.tasksCompleted === progress.tasksTotal
              : s.step === 3
              ? progress.flashcardsReviewed > 0
              : s.step < currentStep;

            const isCurrent = s.step === currentStep;

          return (
            <div key={s.step} className="flex items-center gap-2 shrink-0">
              <Link
                href={s.href}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-label font-semibold transition-all ${
                  isCurrent
                    ? "bg-primary text-on-primary shadow-xs"
                    : isCompleted
                    ? "bg-secondary-container text-on-secondary-container hover:opacity-90"
                    : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    isCurrent
                      ? "bg-white/20 text-white"
                      : isCompleted
                      ? "bg-secondary text-on-secondary"
                      : "bg-surface-container text-on-surface-variant"
                  }`}
                >
                  {isCompleted ? <Check size={11} /> : s.step}
                </span>
                <span className="hidden sm:inline">{s.label}</span>
              </Link>

              {idx < STEPS.length - 1 && (
                <span className="text-outline-variant text-xs hidden md:inline">›</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
