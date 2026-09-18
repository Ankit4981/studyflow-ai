export function ProgressBar({
  percent,
  tone = "primary",
}: {
  percent: number;
  tone?: "primary" | "secondary";
}) {
  const clamped = Math.max(0, Math.min(100, percent));
  const barColor = tone === "secondary" ? "bg-secondary" : "bg-primary";
  return (
    <div className="w-full h-2 rounded-full bg-surface-container-high overflow-hidden">
      <div
        className={`h-full ${barColor} transition-all duration-500`}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
