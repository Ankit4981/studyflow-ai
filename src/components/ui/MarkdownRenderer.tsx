"use client";

import React from "react";

interface MarkdownRendererProps {
  content: string;
  isUser?: boolean;
  className?: string;
}

/**
 * Parses inline markdown tokens (bold, italic, code, links) into React elements
 * without leaving raw markdown stars (**) or backticks in the rendered output.
 */
export function renderInlineMarkdown(text: string, isUser = false): React.ReactNode[] {
  if (!text) return [];

  // Match: `inline code` | **bold** | __bold__ | *italic* | _italic_ | [link text](url)
  const tokenRegex = /(`[^`]+`|\*\*[^*]+\*\*|__[^_]+__|(?<!\*)\*[^*]+\*(?!\*)|(?<!_)_[^_]+_(?!_)|\[[^\]]+\]\([^)]+\))/g;
  const parts = text.split(tokenRegex);

  return parts.map((part, index) => {
    if (!part) return null;

    // 1. Inline Code: `code`
    if (part.startsWith("`") && part.endsWith("`") && part.length >= 2) {
      const code = part.slice(1, -1);
      return (
        <code
          key={index}
          className={`px-1.5 py-0.5 rounded text-[11px] font-mono font-semibold ${
            isUser
              ? "bg-white/20 text-white"
              : "bg-surface-container font-mono text-primary border border-outline-variant/60"
          }`}
        >
          {code}
        </code>
      );
    }

    // 2. Bold: **text** or __text__
    if (
      (part.startsWith("**") && part.endsWith("**") && part.length >= 4) ||
      (part.startsWith("__") && part.endsWith("__") && part.length >= 4)
    ) {
      const inner = part.slice(2, -2);
      return (
        <strong
          key={index}
          className={`font-bold ${isUser ? "text-white font-extrabold" : "text-on-surface"}`}
        >
          {inner}
        </strong>
      );
    }

    // 3. Italic: *text* or _text_
    if (
      (part.startsWith("*") && part.endsWith("*") && part.length >= 2) ||
      (part.startsWith("_") && part.endsWith("_") && part.length >= 2)
    ) {
      const inner = part.slice(1, -1);
      return (
        <em key={index} className="italic opacity-90">
          {inner}
        </em>
      );
    }

    // 4. Links: [text](url)
    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch) {
      const [, label, url] = linkMatch;
      return (
        <a
          key={index}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className={`underline font-medium hover:opacity-80 transition-opacity ${
            isUser ? "text-white" : "text-primary"
          }`}
        >
          {label}
        </a>
      );
    }

    // 5. Plain text fallback (clean up any residual unclosed asterisks)
    const cleanText = part.replace(/\*\*/g, "");
    return <span key={index}>{cleanText}</span>;
  });
}

/**
 * Full Markdown Renderer for Chat Messages, AI Responses & Notes
 * Handles: Headers, Blockquotes, Bullet Lists, Numbered Lists, Code Blocks, and Paragraphs
 */
export function MarkdownRenderer({ content, isUser = false, className = "" }: MarkdownRendererProps) {
  if (!content) return null;

  // Pre-process code blocks (```lang ... ```)
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];

  let inCodeBlock = false;
  let codeBlockContent: string[] = [];
  let codeBlockLang = "";

  let currentListItems: string[] = [];
  let currentListType: "bullet" | "number" | null = null;

  function flushList() {
    if (currentListItems.length > 0 && currentListType) {
      const listKey = `list-${elements.length}`;
      if (currentListType === "bullet") {
        elements.push(
          <ul key={listKey} className="space-y-1.5 my-1.5 pl-1">
            {currentListItems.map((item, i) => (
              <li key={i} className="flex items-start gap-2 leading-relaxed">
                <span
                  className={`mt-1 text-[8px] shrink-0 select-none ${
                    isUser ? "text-white/80" : "text-primary"
                  }`}
                >
                  ●
                </span>
                <span className="flex-1">{renderInlineMarkdown(item, isUser)}</span>
              </li>
            ))}
          </ul>
        );
      } else {
        elements.push(
          <ol key={listKey} className="space-y-1.5 my-1.5 pl-1">
            {currentListItems.map((item, i) => (
              <li key={i} className="flex items-start gap-2 leading-relaxed">
                <span
                  className={`font-mono text-[11px] font-bold shrink-0 select-none ${
                    isUser ? "text-white/90" : "text-primary"
                  }`}
                >
                  {i + 1}.
                </span>
                <span className="flex-1">{renderInlineMarkdown(item, isUser)}</span>
              </li>
            ))}
          </ol>
        );
      }
      currentListItems = [];
      currentListType = null;
    }
  }

  lines.forEach((rawLine, lineIndex) => {
    const trimmed = rawLine.trim();

    // 1. Code block fence
    if (trimmed.startsWith("```")) {
      flushList();
      if (inCodeBlock) {
        // Close code block
        elements.push(
          <div
            key={`code-${lineIndex}`}
            className="my-2 rounded-xl bg-surface-container-highest/90 border border-outline-variant p-3 overflow-x-auto text-[11px] font-mono leading-relaxed"
          >
            {codeBlockLang && (
              <div className="text-[10px] font-label font-bold text-on-surface-variant uppercase tracking-wider mb-1.5 opacity-70">
                {codeBlockLang}
              </div>
            )}
            <pre className="text-on-surface whitespace-pre">
              <code>{codeBlockContent.join("\n")}</code>
            </pre>
          </div>
        );
        inCodeBlock = false;
        codeBlockContent = [];
        codeBlockLang = "";
      } else {
        // Open code block
        inCodeBlock = true;
        codeBlockLang = trimmed.slice(3).trim();
        codeBlockContent = [];
      }
      return;
    }

    if (inCodeBlock) {
      codeBlockContent.push(rawLine);
      return;
    }

    // 2. Empty line
    if (!trimmed) {
      flushList();
      return;
    }

    // 3. Bullet list item (- , * , • )
    const bulletMatch = trimmed.match(/^[-*•]\s+(.*)$/);
    if (bulletMatch) {
      if (currentListType && currentListType !== "bullet") {
        flushList();
      }
      currentListType = "bullet";
      currentListItems.push(bulletMatch[1]);
      return;
    }

    // 4. Numbered list item (1. , 2. etc.)
    const numberMatch = trimmed.match(/^\d+[.)]\s+(.*)$/);
    if (numberMatch) {
      if (currentListType && currentListType !== "number") {
        flushList();
      }
      currentListType = "number";
      currentListItems.push(numberMatch[1]);
      return;
    }

    // Not a list item — flush any active list
    flushList();

    // 5. Blockquote (> ...)
    if (trimmed.startsWith(">")) {
      const quoteText = trimmed.replace(/^>\s*/, "");
      elements.push(
        <blockquote
          key={`quote-${lineIndex}`}
          className={`border-l-3 pl-3 py-1 my-1.5 rounded-r-lg text-xs leading-relaxed italic ${
            isUser
              ? "border-white/60 bg-white/10 text-white"
              : "border-primary bg-primary/5 text-on-surface-variant"
          }`}
        >
          {renderInlineMarkdown(quoteText, isUser)}
        </blockquote>
      );
      return;
    }

    // 6. Headers (### , ## , # )
    if (trimmed.startsWith("### ")) {
      elements.push(
        <h4
          key={`h4-${lineIndex}`}
          className={`font-headline font-bold text-xs mt-2 mb-1 ${
            isUser ? "text-white" : "text-primary"
          }`}
        >
          {renderInlineMarkdown(trimmed.slice(4), isUser)}
        </h4>
      );
      return;
    }

    if (trimmed.startsWith("## ")) {
      elements.push(
        <h3
          key={`h3-${lineIndex}`}
          className={`font-headline font-bold text-sm mt-2 mb-1 ${
            isUser ? "text-white" : "text-primary"
          }`}
        >
          {renderInlineMarkdown(trimmed.slice(3), isUser)}
        </h3>
      );
      return;
    }

    if (trimmed.startsWith("# ")) {
      elements.push(
        <h2
          key={`h2-${lineIndex}`}
          className={`font-headline font-extrabold text-sm mt-2.5 mb-1 ${
            isUser ? "text-white" : "text-primary"
          }`}
        >
          {renderInlineMarkdown(trimmed.slice(2), isUser)}
        </h2>
      );
      return;
    }

    // 7. Standard Paragraph
    elements.push(
      <p key={`p-${lineIndex}`} className="leading-relaxed my-1">
        {renderInlineMarkdown(rawLine, isUser)}
      </p>
    );
  });

  // Flush any dangling list
  flushList();

  return (
    <div className={`space-y-1 ${className}`}>
      {elements}
    </div>
  );
}
