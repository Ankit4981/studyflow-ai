"use client";

import Link from "next/link";
import { useAppState } from "@/lib/state/AppStateContext";
import { TaskTimeline } from "@/components/micro-tasks/TaskTimeline";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useRequireAuth } from "@/lib/hooks/useScholar";
import { DojoStepTracker } from "@/components/navigation/DojoStepTracker";
import { DEFAULT_SAMPLE_FLOW } from "@/lib/demoContent";
import { Sparkles } from "lucide-react";

export default function MicroTasksPage() {
  useRequireAuth("/login");
  const { studyFlow, taskCompletion, toggleTask, hydrated } = useAppState();

  if (!hydrated) return null;

  const activeFlow = studyFlow ?? DEFAULT_SAMPLE_FLOW;
  const isSample = !studyFlow;

  const totalTasks = activeFlow.tasks.length;
  const completedTasks = activeFlow.tasks.filter((t) => taskCompletion[t.id]).length;
  const remainingMinutes = activeFlow.tasks
    .filter((t) => !taskCompletion[t.id])
    .reduce((sum, t) => sum + t.estimatedMinutes, 0);

  return (
    <div className="flex flex-col w-full px-6 md:px-10 py-8 max-w-4xl mx-auto gap-6">
      <DojoStepTracker currentStep={2} />

      {/* Info notice if viewing sample flow */}
      {isSample && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-2xl bg-secondary-container/60 border border-secondary/20">
          <div className="flex items-center gap-2.5">
            <Sparkles size={16} className="text-secondary shrink-0" />
            <p className="text-xs font-label text-on-secondary-container">
              <span className="font-bold">Active Sample Breakdown:</span> &ldquo;{activeFlow.title}&rdquo;. You can also generate custom micro-tasks from your own notes anytime.
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
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-label text-secondary font-bold uppercase tracking-wider flex items-center gap-1">
            ⚡ AI Task Breakdown
          </span>
          <h1 className="font-headline text-2xl text-on-surface">Your next steps</h1>
          <p className="text-on-surface-variant text-sm font-label">
            We broke &quot;{activeFlow.title}&quot; into manageable pieces.
          </p>
        </div>
        <Card className="w-full md:w-72 p-4!">
          <div className="flex items-center justify-between text-sm font-label mb-2">
            <span className="text-on-surface-variant">Session Progress</span>
            <span className="font-semibold text-on-surface">
              {completedTasks} / {totalTasks} completed
            </span>
          </div>
          <ProgressBar percent={(completedTasks / Math.max(totalTasks, 1)) * 100} />
          <div className="flex items-center justify-between text-xs font-label text-on-surface-variant mt-2">
            <span>Estimated time left: {remainingMinutes} min</span>
            <span>
              {Math.round((completedTasks / Math.max(totalTasks, 1)) * 100)}% done
            </span>
          </div>
        </Card>
      </div>

      <TaskTimeline tasks={activeFlow.tasks} completion={taskCompletion} onToggle={toggleTask} />

      <Card className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h4 className="font-headline text-lg text-on-surface">Ready to test what you know?</h4>
          <p className="text-sm text-on-surface-variant font-label">
            {activeFlow.flashcards.length} flashcards are waiting for active recall practice.
          </p>
        </div>
        <Link href="/flashcards">
          <Button>
            <span>Open Flashcards</span>
            <span aria-hidden>→</span>
          </Button>
        </Link>
      </Card>
    </div>
  );
}
