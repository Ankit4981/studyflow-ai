"use client";

import { useState, useEffect } from "react";
import { StudyFlashcard, ReviewState } from "@/types";
import { Button } from "@/components/ui/Button";
import { playSound } from "@/lib/audioEffects";
import { triggerConfetti } from "@/lib/confetti";
import { awardScholarXP } from "@/lib/hooks/useScholar";

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
  // "missed" mode: practice only incorrect cards after deck is complete
  const [missedMode, setMissedMode] = useState(false);
  const [missedCards, setMissedCards] = useState<StudyFlashcard[]>([]);

  const activeDeck = missedMode ? missedCards : cards;
  const card = activeDeck[index];

  // ── Keyboard shortcuts ──────────────────────────────────────────────────
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Guard: don't fire when user is typing in an input/textarea
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      if (!card) return;

      switch (e.code) {
        case "Space":
        case "Enter":
          e.preventDefault();
          handleFlip();
          break;
        case "ArrowRight":
          e.preventDefault();
          goTo(index + 1);
          break;
        case "ArrowLeft":
          e.preventDefault();
          goTo(index - 1);
          break;
        case "Digit1":
        case "Numpad1":
          e.preventDefault();
          mark("incorrect");
          break;
        case "Digit2":
        case "Numpad2":
          e.preventDefault();
          mark("correct");
          break;
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, flipped, card]);

  if (!card) {
    // Deck is exhausted — show completion screen
    const incorrectCards = cards.filter((c) => review[c.id] === "incorrect");
    return (
      <div className="flex flex-col items-center justify-center gap-6 py-16 text-center">
        <span className="text-6xl">🎉</span>
        <h2 className="font-headline text-2xl font-bold text-on-surface">
          {missedMode ? "Missed Cards Practice Complete!" : "Deck Complete!"}
        </h2>
        <p className="text-sm font-label text-on-surface-variant max-w-sm">
          {missedMode
            ? "You've reviewed all your missed cards. Keep practicing to achieve full mastery."
            : `You reviewed all ${cards.length} cards. Great job reinforcing your active recall!`}
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={() => {
              setMissedMode(false);
              setIndex(0);
              setFlipped(false);
            }}
          >
            ↩ Restart Full Deck
          </Button>
          {incorrectCards.length > 0 && !missedMode && (
            <Button
              variant="secondary"
              onClick={() => {
                setMissedCards(incorrectCards);
                setMissedMode(true);
                setIndex(0);
                setFlipped(false);
              }}
            >
              🔁 Review {incorrectCards.length} Missed Card{incorrectCards.length > 1 ? "s" : ""}
            </Button>
          )}
        </div>
      </div>
    );
  }

  function goTo(next: number) {
    playSound("click");
    setIndex(Math.max(0, Math.min(activeDeck.length - 1, next)));
    setFlipped(false);
  }

  function handleFlip() {
    playSound("flip");
    setFlipped((f) => !f);
  }

  function mark(state: ReviewState) {
    if (state === "correct") {
      playSound("success");
      // Award +5 XP for each correctly recalled flashcard
      awardScholarXP(5);
    } else {
      playSound("click");
    }

    onReview(card.id, state);

    if (index === activeDeck.length - 1) {
      triggerConfetti();
      playSound("levelup");
      // Move index past end to show completion screen
      setIndex(activeDeck.length);
    } else {
      goTo(index + 1);
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-1">
        <span className="text-xs font-label text-primary font-bold uppercase tracking-wider bg-primary-container inline-block w-fit px-2.5 py-1 rounded-full">
          {missedMode ? "Missed Cards Review" : "Active Recall"}
        </span>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h1 className="font-headline text-2xl text-on-surface">Practice what you learned.</h1>
          <span className="text-sm font-label text-on-surface-variant">
            Card {index + 1} of {activeDeck.length}
          </span>
        </div>
        <p className="text-on-surface-variant text-sm font-label">
          Test your understanding with active recall.{" "}
          <span className="text-xs opacity-70">
            [Space] Flip · [1] Missed · [2] Knew it · [←/→] Navigate
          </span>
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
          disabled={index === activeDeck.length - 1}
        >
          Next →
        </Button>
      </div>

      <div className="flex items-center justify-center gap-3 flex-wrap">
        <Button variant="danger" onClick={() => mark("incorrect")} className="flex-1 max-w-xs">
          [1] ↻ Need practice
        </Button>
        <Button variant="success" onClick={() => mark("correct")} className="flex-1 max-w-xs">
          [2] ✓ I knew this (+5 XP)
        </Button>
      </div>

      <div className="border-t border-outline-variant pt-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-headline text-lg text-on-surface">Deck Overview</h3>
          <span className="text-sm font-label text-on-surface-variant">
            {activeDeck.length} cards in session
          </span>
        </div>
        <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
          {activeDeck.map((c, i) => {
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
