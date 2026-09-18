export const PROCESSING_STEPS = [
  { title: "Reading your material…", desc: "Analyzing text structure and extracting key ideas." },
  { title: "Finding the important concepts…", desc: "Isolating core definitions, terms, and relationships." },
  { title: "Breaking the work into manageable steps…", desc: "Structuring sequential micro-tasks." },
  { title: "Building your study flow…", desc: "Finalizing flashcards, summaries, and the deep dive." },
];

export function ProcessingState({ stepIndex }: { stepIndex: number }) {
  const step = PROCESSING_STEPS[Math.min(stepIndex, PROCESSING_STEPS.length - 1)];
  const percent = ((Math.min(stepIndex, PROCESSING_STEPS.length - 1) + 1) / PROCESSING_STEPS.length) * 100;

  return (
    <div
      role="status"
      aria-live="polite"
      className="flex flex-col items-center justify-center p-10 bg-surface rounded-xl text-center min-h-[500px] gap-4 border border-outline-variant"
    >
      <div className="w-12 h-12 rounded-full bg-primary-container flex items-center justify-center animate-spin">
        <span className="text-primary text-xl">✦</span>
      </div>
      <div className="flex flex-col gap-1">
        <span className="font-headline text-xl text-on-surface">{step.title}</span>
        <span className="text-sm text-on-surface-variant font-label">{step.desc}</span>
      </div>
      <div className="w-full max-w-xs bg-surface-container-high h-2 rounded-full overflow-hidden mt-2">
        <div
          className="bg-primary h-full transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
