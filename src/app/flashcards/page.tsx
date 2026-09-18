"use client";

import Link from "next/link";
import { useAppState } from "@/lib/state/AppStateContext";
import { FlashcardDeck } from "@/components/flashcards/FlashcardDeck";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useRequireAuth } from "@/lib/hooks/useScholar";
import { DojoStepTracker } from "@/components/navigation/DojoStepTracker";
import { DEFAULT_SAMPLE_FLOW } from "@/lib/demoContent";
import { Sparkles, Trophy } from "lucide-react";

export default function FlashcardsPage() {
  useRequireAuth("/login");
  const { studyFlow, flashcardReview, setFlashcardReview, hydrated } = useAppState();

  if (!hydrated) return null;

  const activeFlow = studyFlow ?? DEFAULT_SAMPLE_FLOW;
  const isSample = !studyFlow;

  return (
    <div className="flex flex-col w-full px-6 md:px-10 py-8 max-w-4xl mx-auto gap-6">
      <DojoStepTracker currentStep={3} />

      {/* Info notice if viewing sample flow */}
      {isSample && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-2xl bg-secondary-container/60 border border-secondary/20">
          <div className="flex items-center gap-2.5">
            <Sparkles size={16} className="text-secondary shrink-0" />
            <p className="text-xs font-label text-on-secondary-container">
              <span className="font-bold">Active Sample Deck:</span> &ldquo;{activeFlow.title}&rdquo;. You can also generate custom flashcards from your notes in Workspace.
            </p>
          </div>
          <Link
            href="/"
            className="shrink-0 px-3 py-1.5 rounded-xl bg-surface border border-outline-variant text-xs font-label font-bold text-on-surface hover:bg-surface-container transition-colors"
          >
            Go to Workspace →
          </Link>
        </div>
      )}

      <FlashcardDeck
        cards={activeFlow.flashcards}
        sourceLabel={activeFlow.title}
        review={flashcardReview}
        onReview={setFlashcardReview}
      />

      {/* Advance to Step 4 Exam Arena */}
      <Card className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-4">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-label text-primary font-bold uppercase tracking-wider">
            Ready for the Ultimate Challenge?
          </span>
          <h4 className="font-headline text-lg text-on-surface">Step 4: 100+ Question Exam Arena</h4>
          <p className="text-sm text-on-surface-variant font-label">
            Take a timed mock exam on this material or challenge the curated question bank to earn +25 XP per question.
          </p>
        </div>
        <Link href="/quiz">
          <Button className="flex items-center gap-2">
            <Trophy size={15} />
            <span>Enter Exam Arena →</span>
          </Button>
        </Link>
      </Card>
    </div>
  );
}
