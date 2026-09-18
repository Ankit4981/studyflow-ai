"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, ChevronRight, Zap, Smile } from "lucide-react";
import { playSound } from "@/lib/audioEffects";
import { awardScholarXP } from "@/lib/hooks/useScholar";

const STUDY_WISDOMS = [
  {
    tag: "Feynman Technique",
    quote: "Explain the concept in simple words as if teaching a 10-year-old. Wherever you get stuck, that is your exact learning gap!",
    icon: "🧠",
  },
  {
    tag: "Active Recall",
    quote: "Close your notes and write everything you remember from memory. Retrieval practice beats passive re-reading 3 to 1!",
    icon: "🎯",
  },
  {
    tag: "Pomodoro Rhythm",
    quote: "Study with 100% focus for 25 minutes, then take 5 minutes of real rest. Your brain consolidates memories during breaks.",
    icon: "🍅",
  },
  {
    tag: "Spaced Repetition",
    quote: "Review these flashcards in 24 hours, then 3 days, then 7 days. This resets the Ebbinghaus forgetting curve permanently!",
    icon: "📈",
  },
  {
    tag: "Dual Coding Effect",
    quote: "Combine diagrams and bullet points. Visual pathways and verbal pathways in the brain reinforce each other exponentially.",
    icon: "🎨",
  },
  {
    tag: "Interleaving Practice",
    quote: "Mix 2 related topics in one study block (e.g., Biology + Chemistry). It trains your brain to differentiate concepts under exam pressure.",
    icon: "🧩",
  },
  {
    tag: "Cognitive Hydration",
    quote: "A 2% drop in hydration cuts mental endurance by 20%. Grab a glass of cool water right now to keep your synapses sharp!",
    icon: "💧",
  },
];

export function SenseiMascot({ scholarName }: { scholarName?: string }) {
  const [tipIndex, setTipIndex] = useState(0);
  const [isWiggling, setIsWiggling] = useState(false);
  const [xpAwarded, setXpAwarded] = useState(false);

  const currentTip = STUDY_WISDOMS[tipIndex];

  function handleNextTip() {
    playSound("click");
    setTipIndex((prev) => (prev + 1) % STUDY_WISDOMS.length);
  }

  function handlePetMascot() {
    playSound("chime");
    setIsWiggling(true);
    setTimeout(() => setIsWiggling(false), 800);

    if (!xpAwarded) {
      awardScholarXP(5);
      setXpAwarded(true);
      setTimeout(() => setXpAwarded(false), 6000);
    }
  }

  return (
    <div className="relative rounded-2xl border border-primary/20 bg-linear-to-br from-primary/5 via-surface to-secondary/5 p-5 sm:p-6 shadow-xs overflow-hidden">
      {/* Background ambient glow */}
      <div className="pointer-events-none absolute -right-12 -bottom-12 w-48 h-48 rounded-full bg-primary/10 blur-2xl" />
      <div className="pointer-events-none absolute -left-12 -top-12 w-48 h-48 rounded-full bg-secondary/10 blur-2xl" />

      <div className="relative flex flex-col sm:flex-row items-center sm:items-start gap-5">
        {/* Mascot Character Avatar (Interactive) */}
        <div className="flex flex-col items-center shrink-0">
          <motion.div
            onClick={handlePetMascot}
            animate={
              isWiggling
                ? { rotate: [0, -14, 14, -10, 10, 0], scale: [1, 1.15, 1] }
                : { y: [-3, 3, -3] }
            }
            transition={
              isWiggling
                ? { duration: 0.6 }
                : { repeat: Infinity, duration: 3.5, ease: "easeInOut" }
            }
            className="relative cursor-pointer group select-none"
            title="Click Sensei Kiko to say hi and earn +5 XP!"
          >
            {/* Mascot SVG Drawing */}
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-linear-to-tr from-amber-400 via-orange-400 to-amber-300 p-2 shadow-lg shadow-amber-500/20 flex items-center justify-center border-2 border-white/60 dark:border-white/20">
              <svg
                viewBox="0 0 100 100"
                className="w-full h-full drop-shadow-sm"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Fox / Owl Ears */}
                <path d="M22 36 L15 15 L38 25 Z" fill="#D97706" />
                <path d="M25 32 L20 19 L35 25 Z" fill="#FDE68A" />
                <path d="M78 36 L85 15 L62 25 Z" fill="#D97706" />
                <path d="M75 32 L80 19 L65 25 Z" fill="#FDE68A" />

                {/* Head / Body */}
                <ellipse cx="50" cy="56" rx="34" ry="32" fill="#F59E0B" />
                <path
                  d="M26 56 C26 72 37 84 50 84 C63 84 74 72 74 56 C74 46 64 42 50 42 C36 42 26 46 26 56 Z"
                  fill="#FFFBEB"
                />

                {/* Scholar Glasses */}
                <circle cx="38" cy="52" r="9" stroke="#1E293B" strokeWidth="2.5" fill="#E0F2FE" fillOpacity="0.4" />
                <circle cx="62" cy="52" r="9" stroke="#1E293B" strokeWidth="2.5" fill="#E0F2FE" fillOpacity="0.4" />
                <line x1="47" y1="52" x2="53" y2="52" stroke="#1E293B" strokeWidth="2.5" />

                {/* Eyes */}
                <circle cx="39" cy="52" r="3.5" fill="#0F172A" />
                <circle cx="61" cy="52" r="3.5" fill="#0F172A" />
                <circle cx="37.5" cy="50.5" r="1.2" fill="#FFFFFF" />
                <circle cx="59.5" cy="50.5" r="1.2" fill="#FFFFFF" />

                {/* Cute Cheeks */}
                <circle cx="28" cy="62" r="4.5" fill="#F87171" fillOpacity="0.6" />
                <circle cx="72" cy="62" r="4.5" fill="#F87171" fillOpacity="0.6" />

                {/* Nose & Smile */}
                <polygon points="50,59 47,56 53,56" fill="#78350F" />
                <path d="M47 62 Q50 65 53 62" stroke="#78350F" strokeWidth="2" strokeLinecap="round" fill="none" />

                {/* Scholar Graduation Hat */}
                <polygon points="50,14 18,25 50,34 82,25" fill="#1E1B4B" />
                <rect x="42" y="27" width="16" height="7" rx="2" fill="#312E81" />
                <circle cx="50" cy="24" r="2.5" fill="#FBBF24" />
                <path d="M50 24 Q68 28 68 38" stroke="#F59E0B" strokeWidth="2" fill="none" />
                <circle cx="68" cy="38" r="2" fill="#F59E0B" />
              </svg>
            </div>

            {/* Click-me Pill */}
            <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-surface border border-primary/30 text-[10px] font-label font-bold text-primary shadow-xs whitespace-nowrap group-hover:bg-primary group-hover:text-on-primary transition-all">
              <Smile size={10} className="inline mr-1" /> Tap Me
            </div>
          </motion.div>

          <span className="text-xs font-headline font-bold text-on-surface mt-3">Sensei Kiko</span>
          <span className="text-[10px] font-label text-on-surface-variant">Dojo Study Mascot</span>

          <AnimatePresence>
            {xpAwarded && (
              <motion.div
                initial={{ opacity: 0, y: 5, scale: 0.8 }}
                animate={{ opacity: 1, y: -4, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="mt-1 px-2 py-0.5 rounded-full bg-amber-400 text-amber-950 text-[10px] font-bold shadow flex items-center gap-1"
              >
                <Zap size={10} fill="currentColor" /> +5 XP Gained!
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Speech Bubble & Wisdom Content */}
        <div className="flex-1 w-full min-w-0">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-1.5">
              <span className="text-lg">{currentTip.icon}</span>
              <span className="text-xs font-label font-bold text-primary uppercase tracking-wider">
                Sensei&apos;s Wisdom · {currentTip.tag}
              </span>
            </div>
            <button
              type="button"
              onClick={handleNextTip}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface hover:bg-surface-container border border-outline-variant text-[11px] font-label font-bold text-on-surface transition-colors cursor-pointer"
            >
              <span>Next Tip</span>
              <ChevronRight size={12} />
            </button>
          </div>

          {/* Dialog Bubble */}
          <div className="relative rounded-2xl bg-surface border border-outline-variant p-4 shadow-xs">
            <p className="text-xs sm:text-sm font-body text-on-surface leading-relaxed study-body-text">
              &ldquo;{scholarName ? `${scholarName}, ` : ""}{currentTip.quote}&rdquo;
            </p>

            <div className="mt-3 pt-2.5 border-t border-outline-variant flex items-center justify-between text-[11px] font-label text-on-surface-variant">
              <span className="flex items-center gap-1">
                <Sparkles size={11} className="text-secondary" /> Master this during your study flow
              </span>
              <span className="font-semibold text-primary">
                Tip {tipIndex + 1} of {STUDY_WISDOMS.length}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
