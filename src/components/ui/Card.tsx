import { HTMLAttributes, ReactNode } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  tone?: "surface" | "container" | "dashed";
}

export function Card({ children, tone = "surface", className = "", ...rest }: CardProps) {
  const toneClasses =
    tone === "container"
      ? "bg-surface-container border-outline-variant"
      : tone === "dashed"
        ? "bg-surface border-outline-variant border-dashed"
        : "bg-surface border-outline-variant";

  return (
    <div
      className={`rounded-xl border p-6 ${toneClasses} ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}
