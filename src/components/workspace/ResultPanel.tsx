"use client";

import Link from "next/link";
import { useState } from "react";
import { MaterialType, StudyFlow } from "@/types";
import { Button } from "@/components/ui/Button";
import { Printer, Trophy, Share2, Check, Sparkles } from "lucide-react";
import { playSound } from "@/lib/audioEffects";
import { SenseiMascot } from "@/components/workspace/SenseiMascot";
import { DailyBooster } from "@/components/workspace/DailyBooster";
import { QuickTopicPacks } from "@/components/workspace/QuickTopicPacks";

const PRIORITY_LABEL: Record<string, string> = { low: "Low", medium: "Medium", high: "High" };

interface EmptyStateProps {
  scholarName?: string;
  onUseDemo?: () => void;
  onSelectTopic?: (type: MaterialType, text: string) => void;
}

export function EmptyState({ scholarName, onUseDemo, onSelectTopic }: EmptyStateProps) {
  return (
    <div className="flex flex-col gap-6">
      {/* 1. Mascot Companion with Interactive Wisdom & XP */}
      <SenseiMascot scholarName={scholarName} />

      {/* 2. Quick-Launch Topic Packs */}
      {onSelectTopic && <QuickTopicPacks onSelectTopic={onSelectTopic} />}

      {/* 3. 10-Second Daily Brain Booster Quiz */}
      <DailyBooster />

      {/* 4. Revision Dojo Workflow Guide */}
      <div className="p-6 bg-surface rounded-2xl border border-outline-variant shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-primary text-base">✦</span>
            <h2 className="text-xs font-label font-bold text-on-surface-variant uppercase tracking-wider">
              The 4-Step Dojo Learning Cycle
            </h2>
          </div>
          <span className="text-[11px] font-label text-secondary font-bold">
            Scientifically Proven
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant flex items-start gap-3">
            <span className="w-6 h-6 rounded-lg bg-primary text-on-primary text-xs font-bold flex items-center justify-center shrink-0 shadow-xs">
              1
            </span>
            <div>
              <p className="text-xs font-label font-bold text-on-surface">Input &amp; Transform</p>
              <p className="text-[11px] text-on-surface-variant font-label">
                Paste raw notes, essay prompts, or textbook excerpts on the left.
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant flex items-start gap-3">
            <span className="w-6 h-6 rounded-lg bg-surface-container text-on-surface-variant text-xs font-bold flex items-center justify-center shrink-0">
              2
            </span>
            <div>
              <p className="text-xs font-label font-bold text-on-surface">Micro-Task Missions</p>
              <p className="text-[11px] text-on-surface-variant font-label">
                Tackle bite-sized 10–15 min study missions to defeat cognitive overload.
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant flex items-start gap-3">
            <span className="w-6 h-6 rounded-lg bg-surface-container text-on-surface-variant text-xs font-bold flex items-center justify-center shrink-0">
              3
            </span>
            <div>
              <p className="text-xs font-label font-bold text-on-surface">3D Active Recall</p>
              <p className="text-[11px] text-on-surface-variant font-label">
                Flip 3D interactive flashcards with confidence-based spaced repetition.
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant flex items-start gap-3">
            <span className="w-6 h-6 rounded-lg bg-surface-container text-on-surface-variant text-xs font-bold flex items-center justify-center shrink-0">
              4
            </span>
            <div>
              <p className="text-xs font-label font-bold text-on-surface">Exam Arena Battles</p>
              <p className="text-[11px] text-on-surface-variant font-label">
                Compete against the timer with AI hints, instant scorecards, and XP!
              </p>
            </div>
          </div>
        </div>

        {/* Quick Sample Action Pill */}
        {onUseDemo && (
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-outline-variant">
            <p className="text-xs text-on-surface-variant font-label text-center sm:text-left">
              Want to see a ready-to-study system?
            </p>
            <button
              type="button"
              id="empty-state-load-demo-btn"
              onClick={onUseDemo}
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-primary-container text-on-primary-container text-xs font-label font-bold hover:bg-primary hover:text-on-primary transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Sparkles size={13} />
              <span>Load Cellular Respiration Demo</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export function ResultPanel({ flow, onReset }: { flow: StudyFlow; onReset: () => void }) {
  const [copied, setCopied] = useState(false);

  function handlePrint() {
    playSound("click");
    window.print();
  }

  function handleShare() {
    playSound("click");
    const summaryText = `📚 ${flow.title}\n\nSummary:\n${flow.summary}\n\nELI5:\n${flow.eli5}\n\nGenerated via StudyFlow AI ✦`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(summaryText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-surface p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 border border-outline-variant shadow-xs">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="bg-secondary-container text-on-secondary-container text-xs font-label font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
              AI-generated study flow
            </span>
          </div>
          <h2 className="font-headline text-2xl text-on-surface font-bold">{flow.title}</h2>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handlePrint}
            title="Print or export cheat-sheet"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-outline-variant text-xs font-label font-semibold text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
          >
            <Printer size={13} />
            <span>Print Sheet</span>
          </button>
          <button
            onClick={handleShare}
            title="Copy summary text"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-outline-variant text-xs font-label font-semibold text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
          >
            {copied ? <><Check size={13} className="text-secondary" /> Copied</> : <><Share2 size={13} /> Share</>}
          </button>
          <Button variant="secondary" onClick={onReset}>
            Start over
          </Button>
        </div>
      </div>

      <div className="bg-surface p-6 rounded-2xl flex flex-col gap-2 border border-outline-variant shadow-xs">
        <div className="flex items-center gap-2 text-primary">
          <span aria-hidden>⚡</span>
          <span className="font-headline text-lg font-bold text-on-surface">Quick Summary</span>
        </div>
        <p className="text-on-surface-variant leading-relaxed font-body study-body-text">{flow.summary}</p>
      </div>

      <div className="bg-surface-container p-6 rounded-2xl flex flex-col gap-2 border border-outline-variant shadow-xs">
        <div className="flex items-center gap-2 text-tertiary">
          <span aria-hidden>🧠</span>
          <span className="font-headline text-lg font-bold text-on-surface">Explain Like I&apos;m 5</span>
        </div>
        <p className="text-on-surface-variant leading-relaxed font-body study-body-text">{flow.eli5}</p>
      </div>

      <div className="flex flex-col gap-3">
        <h3 className="font-headline text-lg font-bold text-on-surface">Key Takeaways</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {flow.keyTakeaways.map((item, i) => (
            <div
              key={i}
              className="bg-surface p-4 rounded-xl flex flex-col gap-1 border border-outline-variant shadow-xs"
            >
              <span className="text-xs font-label text-primary font-bold tracking-wider">
                {String(i + 1).padStart(2, "0")} / {item.label.toUpperCase()}
              </span>
              <h4 className="font-headline text-base font-bold text-on-surface">{item.title}</h4>
              <p className="text-sm text-on-surface-variant font-label">{item.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <h3 className="font-headline text-lg font-bold text-on-surface">Deep Dive Topics</h3>
        <div className="flex flex-col gap-2">
          {flow.deepDive.map((section, i) => (
            <details
              key={i}
              className="group bg-surface rounded-xl p-4 border border-outline-variant shadow-xs"
            >
              <summary className="flex items-center justify-between cursor-pointer font-label font-semibold text-on-surface">
                <span>{section.question}</span>
                <span className="transition-transform group-open:rotate-180" aria-hidden>
                  ⌄
                </span>
              </summary>
              <p className="text-sm text-on-surface-variant font-body mt-2 pt-2 border-t border-outline-variant study-body-text">
                {section.answer}
              </p>
            </details>
          ))}
        </div>
      </div>

      <div className="bg-surface p-6 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-outline-variant shadow-xs">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-label text-secondary font-bold uppercase tracking-wider">
            Ready to practice &amp; test?
          </span>
          <h4 className="font-headline text-lg font-bold text-on-surface">
            {flow.tasks.length} micro-tasks &amp; {flow.flashcards.length} flashcards generated
          </h4>
          <p className="text-sm text-on-surface-variant font-label">
            Priority mix: {PRIORITY_LABEL[flow.tasks[0]?.priority] ?? "—"} first ·{" "}
            {flow.tasks.reduce((sum, t) => sum + t.estimatedMinutes, 0)} min estimated
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <Link href="/quiz">
            <button
              onClick={() => playSound("click")}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-outline-variant bg-surface-container text-xs font-label font-bold text-on-surface hover:bg-surface-container-high transition-colors cursor-pointer"
            >
              <Trophy size={14} className="text-primary" />
              <span>Mock Exam</span>
            </button>
          </Link>
          <Link href="/micro-tasks">
            <Button onClick={() => playSound("click")}>
              <span>Start Flow</span>
              <span aria-hidden>→</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
