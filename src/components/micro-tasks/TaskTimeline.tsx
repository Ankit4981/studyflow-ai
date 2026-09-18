"use client";

import { StudyTask } from "@/types";
import { playSound } from "@/lib/audioEffects";
import { triggerConfetti } from "@/lib/confetti";

const PRIORITY_STYLES: Record<StudyTask["priority"], string> = {
  high: "bg-error-container text-on-error-container",
  medium: "bg-warning-container text-on-surface",
  low: "bg-secondary-container text-on-secondary-container",
};

export function TaskTimeline({
  tasks,
  completion,
  onToggle,
}: {
  tasks: StudyTask[];
  completion: Record<string, boolean>;
  onToggle: (taskId: string) => void;
}) {
  const sorted = [...tasks].sort((a, b) => a.order - b.order);
  // Index of the first not-yet-completed task — treated as "in progress".
  const firstOpenIndex = sorted.findIndex((t) => !completion[t.id]);

  function handleToggle(taskId: string) {
    const willBeDone = !completion[taskId];
    if (willBeDone) {
      playSound("success");
      // Check if all will be done
      const completedCount = sorted.filter((t) => completion[t.id] || t.id === taskId).length;
      if (completedCount === sorted.length) {
        triggerConfetti();
        playSound("levelup");
      }
    } else {
      playSound("click");
    }
    onToggle(taskId);
  }

  return (
    <div className="flex flex-col">
      {sorted.map((task, i) => {
        const done = !!completion[task.id];
        const isInProgress = !done && i === firstOpenIndex;
        const isLast = i === sorted.length - 1;

        return (
          <div key={task.id} className="flex gap-4">
            <div className="flex flex-col items-center">
              <button
                onClick={() => handleToggle(task.id)}
                aria-pressed={done}
                aria-label={done ? `Mark "${task.title}" incomplete` : `Mark "${task.title}" complete`}
                className={`w-7 h-7 shrink-0 rounded-full flex items-center justify-center text-xs font-label font-bold transition-colors ${
                  done
                    ? "bg-tertiary text-on-tertiary"
                    : "bg-surface border-2 border-outline-variant text-on-surface-variant hover:border-primary"
                }`}
              >
                {done ? "✓" : String(i + 1).padStart(2, "0")}
              </button>
              {!isLast && <div className="w-px flex-1 bg-outline-variant my-1" />}
            </div>

            <div
              className={`flex-1 mb-4 bg-surface p-5 rounded-xl border border-outline-variant flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                done ? "opacity-70" : ""
              }`}
            >
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-label text-on-surface-variant">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3
                    className={`font-label font-semibold text-on-surface ${
                      done ? "line-through decoration-outline" : ""
                    }`}
                  >
                    {task.title}
                  </h3>
                </div>
                <p className="text-sm text-on-surface-variant font-body study-body-text">
                  {task.description}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span
                  className={`text-xs font-label px-2.5 py-1 rounded-full ${PRIORITY_STYLES[task.priority]}`}
                >
                  {task.priority}
                </span>
                <span className="text-xs font-label px-2.5 py-1 rounded-full bg-surface-container text-on-surface-variant">
                  {task.estimatedMinutes} min
                </span>
                <span
                  className={`text-xs font-label px-2.5 py-1 rounded-full ${
                    done
                      ? "bg-secondary-container text-on-secondary-container"
                      : isInProgress
                        ? "bg-warning-container text-on-surface"
                        : "bg-surface-container text-on-surface-variant"
                  }`}
                >
                  {done ? "Completed" : isInProgress ? "In progress" : "Upcoming"}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
