"use client";

import { useRef } from "react";
import { MaterialType } from "@/types";
import { Button } from "@/components/ui/Button";
import { Sparkles, Upload, Trash2 } from "lucide-react";

const TABS: { id: MaterialType; label: string }[] = [
  { id: "notes", label: "Lecture Notes" },
  { id: "assignment", label: "Assignment / Essay" },
  { id: "guide", label: "Study Guide / Syllabus" },
];

interface InputHubProps {
  activeTab: MaterialType;
  onTabChange: (tab: MaterialType) => void;
  material: string;
  onMaterialChange: (value: string) => void;
  onUseDemo: () => void;
  onTransform: () => void;
  isLoading: boolean;
  error: string | null;
}

export function InputHub({
  activeTab,
  onTabChange,
  material,
  onMaterialChange,
  onUseDemo,
  onTransform,
  isLoading,
  error,
}: InputHubProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("text/") && !file.name.endsWith(".txt")) {
      onMaterialChange(material);
      alert("We can only read plain text (.txt) files right now. Try pasting the content instead.");
      e.target.value = "";
      return;
    }
    const text = await file.text();
    onMaterialChange(text);
    e.target.value = "";
  }

  return (
    <div className="flex flex-col gap-5 bg-surface p-6 rounded-2xl border border-outline-variant relative overflow-hidden shadow-xs">
      <div className="flex flex-col gap-1">
        <span className="text-xs font-label text-primary font-bold uppercase tracking-wider flex items-center gap-1">
          <Sparkles size={12} /> Step 1: Input Hub
        </span>
        <h1 className="font-headline text-2xl font-bold text-on-surface">What are you studying?</h1>
        <p className="text-on-surface-variant text-xs font-label">
          Paste textbook notes, syllabus, or lecture transcripts below.
        </p>
      </div>

      <div className="flex items-center bg-surface-container-low p-1 rounded-xl gap-1 border border-outline-variant">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex-1 py-1.5 text-center rounded-lg text-xs font-label font-semibold transition-all truncate ${
              activeTab === tab.id
                ? "bg-surface text-on-surface shadow-xs"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-2">
        <textarea
          value={material}
          onChange={(e) => onMaterialChange(e.target.value)}
          className="w-full bg-surface-container-low border border-outline-variant text-on-surface placeholder:text-outline p-4 rounded-xl text-xs font-body resize-none focus:outline-none focus:ring-2 focus:ring-primary transition-all study-body-text"
          rows={8}
          placeholder="Paste your notes, syllabus points, or assignment prompt here..."
        />
        <div className="flex items-center justify-between text-xs text-on-surface-variant font-label pt-0.5">
          <div className="flex items-center gap-2">
            <button
              type="button"
              id="inputhub-load-demo-btn"
              onClick={onUseDemo}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-primary-container text-on-primary-container font-semibold hover:opacity-90 transition-all text-xs"
            >
              <Sparkles size={11} />
              <span>Sample Notes</span>
            </button>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-outline-variant bg-surface text-on-surface-variant hover:text-on-surface transition-colors text-xs"
            >
              <Upload size={11} />
              <span>Upload .txt</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".txt,text/plain"
              className="hidden"
              onChange={handleFileSelect}
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-on-surface-variant/70">
              {material.length} chars
            </span>
            {material.length > 0 && (
              <button
                type="button"
                onClick={() => onMaterialChange("")}
                className="flex items-center gap-1 text-on-surface-variant hover:text-error transition-colors text-[11px]"
              >
                <Trash2 size={11} /> Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-xl border border-error-container bg-error-container/40 px-3.5 py-2.5 text-xs font-label text-on-error-container"
        >
          {error}
        </div>
      )}

      <Button
        id="transform-material-btn"
        onClick={onTransform}
        disabled={isLoading || material.trim().length < 20}
        size="lg"
        className="w-full rounded-xl"
      >
        <span>{isLoading ? "Synthesizing study flow…" : "Transform with AI"}</span>
        <span aria-hidden>✦</span>
      </Button>
    </div>
  );
}
