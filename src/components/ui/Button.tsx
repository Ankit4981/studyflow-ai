import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "success" | "danger";
  size?: "md" | "lg";
}

const VARIANT_CLASSES: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary: "bg-primary text-on-primary hover:opacity-90 border border-transparent",
  secondary:
    "bg-surface text-on-surface border border-outline-variant hover:bg-surface-container",
  ghost: "bg-transparent text-on-surface-variant hover:text-on-surface border border-transparent",
  success: "bg-secondary-container text-on-secondary-container border border-transparent hover:opacity-90",
  danger: "bg-error-container text-on-error-container border border-transparent hover:opacity-90",
};

export function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...rest
}: ButtonProps) {
  const sizeClasses = size === "lg" ? "px-6 py-4 text-base" : "px-4 py-2.5 text-sm";
  return (
    <button
      className={`rounded-lg font-label font-semibold transition-all active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none inline-flex items-center justify-center gap-2 ${sizeClasses} ${VARIANT_CLASSES[variant]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
