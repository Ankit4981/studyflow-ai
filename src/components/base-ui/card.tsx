"use client";

import { forwardRef } from "react";

// ─── Card ───────────────────────────────────────────────────────────────────

const Card = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className = "", ...props }, ref) => (
  <div
    ref={ref}
    className={`rounded-2xl border border-outline-variant bg-surface text-on-surface shadow-sm ${className}`}
    {...props}
  />
));
Card.displayName = "Card";

// ─── CardHeader ─────────────────────────────────────────────────────────────

const CardHeader = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className = "", ...props }, ref) => (
  <div
    ref={ref}
    className={`flex flex-col space-y-1.5 p-6 ${className}`}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

// ─── CardTitle ──────────────────────────────────────────────────────────────

const CardTitle = forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className = "", ...props }, ref) => (
  <h3
    ref={ref}
    className={`font-headline text-lg font-bold leading-none tracking-tight text-on-surface ${className}`}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

// ─── CardDescription ────────────────────────────────────────────────────────

const CardDescription = forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className = "", ...props }, ref) => (
  <p
    ref={ref}
    className={`text-sm font-label text-on-surface-variant ${className}`}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

// ─── CardContent ────────────────────────────────────────────────────────────

const CardContent = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className = "", ...props }, ref) => (
  <div ref={ref} className={`p-6 pt-0 ${className}`} {...props} />
));
CardContent.displayName = "CardContent";

// ─── CardFooter ─────────────────────────────────────────────────────────────

const CardFooter = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className = "", ...props }, ref) => (
  <div
    ref={ref}
    className={`flex items-center p-6 pt-0 ${className}`}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
