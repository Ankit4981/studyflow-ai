"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { BrainCircuit, CheckCircle2, XCircle, RotateCcw, Zap, Sparkles } from "lucide-react";
import { playSound } from "@/lib/audioEffects";
import { awardScholarXP } from "@/lib/hooks/useScholar";

interface BoosterQuestion {
  id: string;
  category: string;
  icon: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const BOOSTER_QUESTIONS: BoosterQuestion[] = [
  {
    id: "bq-1",
    category: "Cellular Biology",
    icon: "🧬",
    question: "Where in a eukaryotic cell does the Krebs (Citric Acid) cycle take place?",
    options: [
      "Cytoplasm",
      "Mitochondrial Matrix",
      "Inner Membrane Cristae",
      "Endoplasmic Reticulum",
    ],
    correctIndex: 1,
    explanation: "The Krebs cycle takes place in the mitochondrial matrix, while glycolysis takes place in the cytoplasm.",
  },
  {
    id: "bq-2",
    category: "Computer Science",
    icon: "💻",
    question: "What is the worst-case time complexity of Binary Search on a sorted array of size n?",
    options: ["O(1)", "O(n)", "O(log n)", "O(n log n)"],
    correctIndex: 2,
    explanation: "Binary search cuts the search space in half each iteration, giving logarithmic O(log n) time complexity.",
  },
  {
    id: "bq-3",
    category: "Physics & Energy",
    icon: "⚡",
    question: "Which of the following is the unit of electric potential difference?",
    options: ["Ampere", "Joule", "Volt", "Watt"],
    correctIndex: 2,
    explanation: "One Volt represents one Joule of electric energy per Coulomb of charge (1 V = 1 J/C).",
  },
  {
    id: "bq-4",
    category: "Cognitive Science",
    icon: "🧠",
    question: "What is the phenomenon where testing yourself enhances long-term retention called?",
    options: [
      "The Testing Effect (Active Recall)",
      "The Halo Effect",
      "The Priming Effect",
      "Cognitive Dissonance",
    ],
    correctIndex: 0,
    explanation: "The Testing Effect proves that active retrieval strengthens memory traces far more than passive review.",
  },
];

export function DailyBooster() {
  const [qIndex, setQIndex] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [streak, setStreak] = useState(0);

  const currentQ = BOOSTER_QUESTIONS[qIndex];

  function handleSelect(index: number) {
    if (isAnswered) return;
    setSelectedOpt(index);
    setIsAnswered(true);

    if (index === currentQ.correctIndex) {
      playSound("success");
      setStreak((s) => s + 1);
      awardScholarXP(15);
    } else {
      playSound("error");
      setStreak(0);
    }
  }

  function handleNextQuestion() {
    playSound("click");
    setSelectedOpt(null);
    setIsAnswered(false);
    setQIndex((prev) => (prev + 1) % BOOSTER_QUESTIONS.length);
  }

  const isCorrect = selectedOpt === currentQ.correctIndex;

  return (
    <div className="rounded-2xl border border-outline-variant bg-surface p-5 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-outline-variant pb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-sm">
            <BrainCircuit size={16} />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-label font-bold text-on-surface">10-Second Daily Brain Booster</span>
              <span className="px-2 py-0.2 rounded-full bg-primary/10 text-primary text-[10px] font-label font-bold">
                +15 XP
              </span>
            </div>
            <p className="text-[11px] font-label text-on-surface-variant">
              {currentQ.icon} {currentQ.category}
            </p>
          </div>
        </div>

        {streak > 0 && (
          <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300 text-xs font-label font-bold">
            🔥 {streak} Streak
          </div>
        )}
      </div>

      {/* Question Text */}
      <p className="font-headline text-sm font-bold text-on-surface">
        {currentQ.question}
      </p>

      {/* Options Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {currentQ.options.map((opt, idx) => {
          let btnClass = "border-outline-variant bg-surface-container-low hover:bg-surface-container text-on-surface";

          if (isAnswered) {
            if (idx === currentQ.correctIndex) {
              btnClass = "border-emerald-500 bg-emerald-500/15 text-emerald-900 dark:text-emerald-100 font-bold shadow-xs";
            } else if (idx === selectedOpt) {
              btnClass = "border-rose-500 bg-rose-500/15 text-rose-900 dark:text-rose-100";
            } else {
              btnClass = "border-outline-variant opacity-40";
            }
          }

          return (
            <button
              key={idx}
              type="button"
              disabled={isAnswered}
              onClick={() => handleSelect(idx)}
              className={`p-3 rounded-xl border text-left text-xs font-label transition-all flex items-center justify-between gap-2 cursor-pointer ${btnClass}`}
            >
              <span>{opt}</span>
              {isAnswered && idx === currentQ.correctIndex && (
                <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
              )}
              {isAnswered && idx === selectedOpt && idx !== currentQ.correctIndex && (
                <XCircle size={14} className="text-rose-600 shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {/* Answer Explanation & Next Question */}
      <AnimatePresence>
        {isAnswered && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="pt-2 border-t border-outline-variant space-y-3"
          >
            <div className={`p-3 rounded-xl text-xs font-label ${isCorrect ? "bg-emerald-500/10 text-emerald-800 dark:text-emerald-200" : "bg-surface-container text-on-surface-variant"}`}>
              <div className="flex items-center gap-1.5 font-bold mb-1">
                {isCorrect ? (
                  <>
                    <Sparkles size={13} className="text-emerald-500" />
                    <span>Brilliant! +15 Scholar XP Awarded</span>
                  </>
                ) : (
                  <>
                    <Zap size={13} className="text-amber-500" />
                    <span>Learning Opportunity:</span>
                  </>
                )}
              </div>
              <p className="leading-relaxed">{currentQ.explanation}</p>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleNextQuestion}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-primary text-on-primary text-xs font-label font-bold hover:opacity-90 transition-all cursor-pointer shadow-xs"
              >
                <RotateCcw size={12} />
                <span>Try Another Question</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
