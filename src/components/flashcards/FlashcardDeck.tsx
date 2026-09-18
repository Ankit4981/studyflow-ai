"use client";

import { useState } from "react";
import { StudyFlashcard, ReviewState } from "@/types";
import { Button } from "@/components/ui/Button";
import { playSound } from "@/lib/audioEffects";
import { triggerConfetti } from "@/lib/confetti";

const DIFFICULTY_STYLES: Record<StudyFlashcard["difficulty"], string> = {
  easy: "bg-secondary-container text-on-secondary-container",
  medium: "bg-warning-container text-on-surface",
  hard: "bg-error-container text-on-error-container",
};

export function FlashcardDeck({
  cards,
  sourceLabel,
  review,
  onReview,
}: {
  cards: StudyFlashcard[];
  sourceLabel: string;
  review: Record<string, ReviewState>;
  onReview: (cardId: string, state: ReviewState) => void;
}) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const card = cards[index];
  if (!card) return null;

  function goTo(next: number) {
    playSound("click");
    setIndex(Math.max(0, Math.min(cards.length - 1, next)));
    setFlipped(false);
  }

  function handleFlip() {
    playSound("flip");
    setFlipped((f) => !f);
  }

  function mark(state: ReviewState) {
    if (state === "correct") playSound("success");
    else playSound("click");

    onReview(card.id, state);

    if (index === cards.length - 1) {
      triggerConfetti();
      playSound("levelup");
    } else {
      goTo(index + 1);
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-1">
        <span className="text-xs font-label text-primary font-bold uppercase tracking-wider bg-primary-container inline-block w-fit px-2.5 py-1 rounded-full">
          Active Recall
        </span>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h1 className="font-headline text-2xl text-on-surface">Practice what you learned.</h1>
          <span className="text-sm font-label text-on-surface-variant">
            Card {index + 1} of {cards.length}
          </span>
        </div>
        <p className="text-on-surface-variant text-sm font-label">
          Test your understanding with active recall.
        </p>
      </div>

      <div className="flip-card-scene w-full max-w-2xl mx-auto h-80 sm:h-96">
        <div className={`flip-card-inner w-full h-full ${flipped ? "is-flipped" : ""}`}>
          <button
            onClick={handleFlip}
            aria-label="Flip card"
            className="flip-card-face flex flex-col items-center justify-center text-center p-8 bg-surface rounded-xl border border-outline-variant w-full h-full"
          >
            <div className="flex items-center justify-between w-full absolute top-6 left-0 px-8 text-sm font-label text-on-surface-variant">
              <span>Question</span>
              <span className="text-primary font-semibold">{sourceLabel}</span>
            </div>
            <p className="font-headline text-2xl sm:text-3xl text-on-surface px-4">{card.question}</p>
            <span className="absolute bottom-6 text-xs font-label text-on-surface-variant">
              Tap or click to reveal answer
            </span>
          </button>

          <button
            onClick={handleFlip}
            aria-label="Flip card"
            className="flip-card-face flip-card-face--back flex flex-col items-center justify-center text-center p-8 bg-surface-container rounded-xl border border-outline-variant w-full h-full"
          >
            <div className="flex items-center justify-between w-full absolute top-6 left-0 px-8 text-sm font-label text-on-surface-variant">
              <span>Answer</span>
              <span
                className={`text-xs font-label px-2.5 py-1 rounded-full ${DIFFICULTY_STYLES[card.difficulty]}`}
              >
                {card.difficulty}
              </span>
            </div>
            <p className="font-body text-lg sm:text-xl text-on-surface px-4 study-body-text">
              {card.answer}
            </p>
          </button>
        </div>
      </div>

      <div className="flex items-center justify-center gap-3 flex-wrap">
        <Button variant="secondary" onClick={() => goTo(index - 1)} disabled={index === 0}>
          ← Previous
        </Button>
        <Button onClick={handleFlip}>Flip Card</Button>
        <Button
          variant="secondary"
          onClick={() => goTo(index + 1)}
          disabled={index === cards.length - 1}
        >
          Next →
        </Button>
      </div>

      <div className="flex items-center justify-center gap-3 flex-wrap">
        <Button variant="danger" onClick={() => mark("incorrect")} className="flex-1 max-w-xs">
          ↻ Need practice
        </Button>
        <Button variant="success" onClick={() => mark("correct")} className="flex-1 max-w-xs">
          ✓ I knew this
        </Button>
      </div>

      <div className="border-t border-outline-variant pt-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-headline text-lg text-on-surface">Deck Overview</h3>
          <span className="text-sm font-label text-on-surface-variant">
            {cards.length} cards in session
          </span>
        </div>
        <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
          {cards.map((c, i) => {
            const state = review[c.id] ?? "unseen";
            const active = i === index;
            return (
              <button
                key={c.id}
                onClick={() => goTo(i)}
                aria-label={`Go to card ${i + 1}`}
                className={`py-2 rounded-lg text-sm font-label border transition-colors ${
                  active
                    ? "border-primary text-primary font-semibold"
                    : state === "correct"
                      ? "border-outline-variant bg-secondary-container text-on-secondary-container"
                      : state === "incorrect"
                        ? "border-outline-variant bg-error-container text-on-error-container"
                        : "border-outline-variant bg-surface-container text-on-surface-variant"
                }`}
              >
                {i + 1}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
