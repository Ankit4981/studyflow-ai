"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { BookOpen, Plus, Trash2, Pencil, Check, X, CalendarDays, Sparkles } from "lucide-react";
import { JournalNavigation, JournalEntry } from "@/components/watermelon/journal-navigation";
import { useRequireAuth } from "@/lib/hooks/useScholar";

// ─── helpers ───────────────────────────────────────────────────────────────

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

function today(): { day: number; month: string; year: number } {
  const d = new Date();
  return { day: d.getDate(), month: MONTHS[d.getMonth()], year: d.getFullYear() };
}

function makeId() {
  return `entry-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

// ─── default seed entries (current month) ──────────────────────────────────

const { month: currentMonth, year: currentYear } = today();

const SEED_ENTRIES: StudyJournalEntry[] = [
  {
    id: "seed-1",
    day: 1,
    month: currentMonth,
    year: currentYear,
    title: "Started the semester",
    content: "Set up my study schedule and organized all course materials. Feeling motivated and ready to tackle everything head-on!",
    mood: "🚀",
    tags: ["planning", "motivation"],
  },
  {
    id: "seed-2",
    day: 5,
    month: currentMonth,
    year: currentYear,
    title: "Deep dive into algorithms",
    content: "Spent 3 hours on graph traversal — BFS vs DFS finally clicked. The queue/stack mental model is a game-changer.",
    mood: "💡",
    tags: ["algorithms", "cs"],
  },
  {
    id: "seed-3",
    day: 10,
    month: currentMonth,
    year: currentYear,
    title: "Mid-week review",
    content: "Reviewed flashcards for 45 minutes and knocked out 3 micro-tasks. Progress feels real and consistent.",
    mood: "📚",
    tags: ["review", "flashcards"],
  },
  {
    id: "seed-4",
    day: 15,
    month: currentMonth,
    year: currentYear,
    title: "Breakthrough on calculus",
    content: "Integration by parts suddenly makes sense. It's just the product rule in reverse — why didn't anyone say that earlier?",
    mood: "🎯",
    tags: ["math", "calculus"],
  },
  {
    id: "seed-5",
    day: 20,
    month: currentMonth,
    year: currentYear,
    title: "Group study session",
    content: "Collaborated with classmates on the project proposal. Explaining concepts to others solidified my own understanding.",
    mood: "🤝",
    tags: ["collaboration", "project"],
  },
];

// ─── types ─────────────────────────────────────────────────────────────────

interface StudyJournalEntry {
  id: string;
  day: number;
  month: string;
  year: number;
  title: string;
  content: string;
  mood: string;
  tags: string[];
}

const MOOD_OPTIONS = ["🚀", "💡", "📚", "🎯", "🤝", "😤", "😊", "🔥", "😴", "✅"];

// ─── sub-components ────────────────────────────────────────────────────────

function TagBadge({ tag }: { tag: string }) {
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-label font-medium bg-primary-container text-on-primary-container">
      #{tag}
    </span>
  );
}

interface EntryEditorProps {
  entry: Partial<StudyJournalEntry>;
  onSave: (e: Partial<StudyJournalEntry>) => void;
  onCancel: () => void;
}

function EntryEditor({ entry, onSave, onCancel }: EntryEditorProps) {
  const [draft, setDraft] = useState(entry);
  const [tagInput, setTagInput] = useState("");

  function addTag() {
    const t = tagInput.trim().toLowerCase().replace(/\s+/g, "-");
    if (!t) return;
    setDraft((d) => ({ ...d, tags: [...(d.tags ?? []), t] }));
    setTagInput("");
  }

  function removeTag(t: string) {
    setDraft((d) => ({ ...d, tags: (d.tags ?? []).filter((x) => x !== t) }));
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      className="rounded-2xl border border-outline-variant bg-surface-container-low p-5 space-y-4"
    >
      {/* Day / Month */}
      <div className="flex gap-3">
        <div className="flex-1">
          <label className="block text-xs font-label font-semibold text-on-surface-variant mb-1">Day</label>
          <input
            type="number"
            min={1}
            max={31}
            value={draft.day ?? ""}
            onChange={(e) => setDraft((d) => ({ ...d, day: +e.target.value }))}
            className="w-full rounded-lg border border-outline-variant bg-surface px-3 py-2 text-sm font-label text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="flex-1">
          <label className="block text-xs font-label font-semibold text-on-surface-variant mb-1">Month</label>
          <select
            value={draft.month ?? currentMonth}
            onChange={(e) => setDraft((d) => ({ ...d, month: e.target.value }))}
            className="w-full rounded-lg border border-outline-variant bg-surface px-3 py-2 text-sm font-label text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {MONTHS.map((m) => <option key={m}>{m}</option>)}
          </select>
        </div>
        <div className="flex-1">
          <label className="block text-xs font-label font-semibold text-on-surface-variant mb-1">Mood</label>
          <select
            value={draft.mood ?? "📚"}
            onChange={(e) => setDraft((d) => ({ ...d, mood: e.target.value }))}
            className="w-full rounded-lg border border-outline-variant bg-surface px-3 py-2 text-sm font-label text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {MOOD_OPTIONS.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
      </div>

      {/* Title */}
      <div>
        <label className="block text-xs font-label font-semibold text-on-surface-variant mb-1">Title</label>
        <input
          type="text"
          placeholder="What did you study today?"
          value={draft.title ?? ""}
          onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
          className="w-full rounded-lg border border-outline-variant bg-surface px-3 py-2 text-sm font-label text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Content */}
      <div>
        <label className="block text-xs font-label font-semibold text-on-surface-variant mb-1">Journal Entry</label>
        <textarea
          rows={4}
          placeholder="Write your study notes, reflections, breakthroughs…"
          value={draft.content ?? ""}
          onChange={(e) => setDraft((d) => ({ ...d, content: e.target.value }))}
          className="w-full rounded-lg border border-outline-variant bg-surface px-3 py-2 text-sm font-label text-on-surface focus:outline-none focus:ring-2 focus:ring-primary resize-none"
        />
      </div>

      {/* Tags */}
      <div>
        <label className="block text-xs font-label font-semibold text-on-surface-variant mb-1">Tags</label>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Add a tag…"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
            className="flex-1 rounded-lg border border-outline-variant bg-surface px-3 py-2 text-sm font-label text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            onClick={addTag}
            className="px-3 py-2 rounded-lg bg-primary-container text-on-primary-container text-sm font-label font-semibold hover:opacity-80 transition-opacity"
          >
            Add
          </button>
        </div>
        {(draft.tags ?? []).length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {(draft.tags ?? []).map((t) => (
              <button
                key={t}
                onClick={() => removeTag(t)}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-label font-medium bg-primary-container text-on-primary-container hover:bg-error-container hover:text-on-error-container transition-colors"
              >
                #{t} <X size={10} />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2 justify-end pt-1">
        <button
          onClick={onCancel}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-label font-semibold text-on-surface-variant hover:bg-surface-container transition-colors"
        >
          <X size={14} /> Cancel
        </button>
        <button
          onClick={() => onSave(draft)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-on-primary text-sm font-label font-semibold hover:opacity-90 transition-opacity"
        >
          <Check size={14} /> Save Entry
        </button>
      </div>
    </motion.div>
  );
}

// ─── stats banner ──────────────────────────────────────────────────────────

function StatsBanner({ entries }: { entries: StudyJournalEntry[] }) {
  const totalEntries = entries.length;
  const uniqueTags = new Set(entries.flatMap((e) => e.tags)).size;
  const streak = entries.length > 0
    ? Math.min(entries.length, 7)  // simplified streak for demo
    : 0;

  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      {[
        { label: "Entries", value: totalEntries, icon: "📝" },
        { label: "Topics", value: uniqueTags, icon: "🏷️" },
        { label: "Day Streak", value: streak, icon: "🔥" },
      ].map((stat) => (
        <div
          key={stat.label}
          className="rounded-2xl border border-outline-variant bg-surface-container-low p-4 flex flex-col items-center gap-1"
        >
          <span className="text-2xl">{stat.icon}</span>
          <span className="text-2xl font-headline font-bold text-on-surface">{stat.value}</span>
          <span className="text-xs font-label text-on-surface-variant">{stat.label}</span>
        </div>
      ))}
    </div>
  );
}

// ─── main page ─────────────────────────────────────────────────────────────

export default function JournalPage() {
  useRequireAuth("/login");

  const [entries, setEntries] = useState<StudyJournalEntry[]>(SEED_ENTRIES);
  const [showEditor, setShowEditor] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [activeEntry, setActiveEntry] = useState<StudyJournalEntry | null>(
    SEED_ENTRIES[0] ?? null
  );

  // Sort entries by day ascending
  const sorted = [...entries].sort((a, b) => a.day - b.day);

  // Map to JournalEntry format for the nav widget
  const journalEntries: JournalEntry[] = sorted.map((e) => ({
    id: e.id,
    day: e.day,
    month: e.month,
    year: e.year,
    content: e.content,
  }));

  const handleEntryChange = useCallback(
    (entry: JournalEntry) => {
      const found = entries.find((e) => e.id === entry.id);
      if (found) setActiveEntry(found);
    },
    [entries]
  );

  function saveEntry(draft: Partial<StudyJournalEntry>) {
    if (!draft.day || !draft.title || !draft.content) return;

    if (editingId) {
      setEntries((es) =>
        es.map((e) =>
          e.id === editingId
            ? {
                ...e,
                ...draft,
                day: draft.day!,
                title: draft.title!,
                content: draft.content!,
                mood: draft.mood ?? e.mood,
                tags: draft.tags ?? e.tags,
              }
            : e
        )
      );
      setEditingId(null);
    } else {
      const newEntry: StudyJournalEntry = {
        id: makeId(),
        day: draft.day,
        month: draft.month ?? currentMonth,
        year: draft.year ?? currentYear,
        title: draft.title,
        content: draft.content,
        mood: draft.mood ?? "📚",
        tags: draft.tags ?? [],
      };
      setEntries((es) => [...es, newEntry]);
      setActiveEntry(newEntry);
    }
    setShowEditor(false);
  }

  function deleteEntry(id: string) {
    setEntries((es) => {
      const next = es.filter((e) => e.id !== id);
      if (activeEntry?.id === id) setActiveEntry(next[0] ?? null);
      return next;
    });
  }

  const editingEntry = editingId ? entries.find((e) => e.id === editingId) : null;

  return (
    <main className="flex flex-col w-full px-6 md:px-10 py-10 max-w-7xl mx-auto">
      {/* Page header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <BookOpen size={20} className="text-primary" />
            <span className="text-xs font-label font-semibold text-primary uppercase tracking-widest">
              Study Journal
            </span>
          </div>
          <h1 className="font-headline text-3xl font-bold text-on-surface">
            Monthly Journal
          </h1>
          <p className="text-on-surface-variant font-label text-sm mt-1">
            Track your daily study sessions, reflections &amp; breakthroughs.
          </p>
        </div>
        <button
          id="add-journal-entry-btn"
          onClick={() => { setEditingId(null); setShowEditor(true); }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-on-primary font-label text-sm font-semibold hover:opacity-90 transition-all shadow-sm"
        >
          <Plus size={16} /> New Entry
        </button>
      </div>

      {/* Stats */}
      <StatsBanner entries={entries} />

      {/* New / Edit entry editor */}
      <AnimatePresence>
        {showEditor && (
          <div className="mb-6">
            <EntryEditor
              entry={
                editingEntry ?? {
                  day: today().day,
                  month: today().month,
                  year: today().year,
                  mood: "📚",
                  tags: [],
                }
              }
              onSave={saveEntry}
              onCancel={() => { setShowEditor(false); setEditingId(null); }}
            />
          </div>
        )}
      </AnimatePresence>

      {entries.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-24 gap-4 text-center"
        >
          <CalendarDays size={48} className="text-outline" />
          <p className="font-headline text-xl text-on-surface">No journal entries yet</p>
          <p className="text-sm font-label text-on-surface-variant max-w-sm">
            Start documenting your study sessions. Each entry is a small win worth remembering.
          </p>
          <button
            onClick={() => setShowEditor(true)}
            className="mt-2 flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-on-primary font-label text-sm font-semibold hover:opacity-90 transition-all"
          >
            <Plus size={16} /> Write First Entry
          </button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Journal Navigation widget */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="rounded-2xl border border-outline-variant bg-surface-container-low overflow-hidden">
              <div className="px-5 pt-4 pb-2 flex items-center gap-2 border-b border-outline-variant">
                <CalendarDays size={15} className="text-on-surface-variant" />
                <span className="text-xs font-label font-semibold text-on-surface-variant uppercase tracking-wider">
                  {currentMonth} {currentYear}
                </span>
                <span className="ml-auto text-xs font-label text-on-surface-variant">
                  {sorted.length} {sorted.length === 1 ? "entry" : "entries"}
                </span>
              </div>
              {journalEntries.length > 0 && (
                <JournalNavigation
                  entries={journalEntries}
                  onEntryChange={handleEntryChange}
                />
              )}
            </div>
          </div>

          {/* Right: Active entry detail */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              {activeEntry ? (
                <motion.div
                  key={activeEntry.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.25 }}
                  className="rounded-2xl border border-outline-variant bg-surface p-6 space-y-5"
                >
                  {/* Entry header */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{activeEntry.mood}</span>
                      <div>
                        <p className="text-xs font-label font-semibold text-on-surface-variant">
                          {activeEntry.month} {activeEntry.day}, {activeEntry.year}
                        </p>
                        <h2 className="font-headline text-xl font-bold text-on-surface mt-0.5">
                          {activeEntry.title}
                        </h2>
                      </div>
                    </div>
                    <div className="flex gap-1.5 shrink-0">
                      <button
                        id={`edit-entry-${activeEntry.id}`}
                        title="Edit entry"
                        onClick={() => { setEditingId(activeEntry.id); setShowEditor(true); }}
                        className="p-2 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        id={`delete-entry-${activeEntry.id}`}
                        title="Delete entry"
                        onClick={() => deleteEntry(activeEntry.id)}
                        className="p-2 rounded-lg text-on-surface-variant hover:bg-error-container hover:text-on-error-container transition-colors"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-outline-variant" />

                  {/* Content */}
                  <p className="font-body text-on-surface leading-relaxed study-body-text">
                    {activeEntry.content}
                  </p>

                  {/* Tags */}
                  {activeEntry.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {activeEntry.tags.map((t) => <TagBadge key={t} tag={t} />)}
                    </div>
                  )}

                  {/* AI insight hint */}
                  <div className="flex items-start gap-2.5 rounded-xl bg-secondary-container p-3.5">
                    <Sparkles size={15} className="text-secondary mt-0.5 shrink-0" />
                    <p className="text-xs font-label text-on-secondary-container leading-relaxed">
                      <span className="font-semibold">StudyFlow Tip:</span> Paste key takeaways from this entry into the Workspace to generate flashcards and micro-tasks automatically.
                    </p>
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>

            {/* All entries list */}
            <div className="mt-5 space-y-2">
              <p className="text-xs font-label font-semibold text-on-surface-variant uppercase tracking-wider mb-3">
                All Entries
              </p>
              <AnimatePresence>
                {sorted.map((entry) => (
                  <motion.button
                    key={entry.id}
                    id={`entry-list-${entry.id}`}
                    layout
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    onClick={() => setActiveEntry(entry)}
                    className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl border transition-all ${
                      activeEntry?.id === entry.id
                        ? "border-primary bg-primary-container"
                        : "border-outline-variant bg-surface-container-low hover:bg-surface-container"
                    }`}
                  >
                    <span className="text-xl shrink-0">{entry.mood}</span>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-label font-semibold truncate ${activeEntry?.id === entry.id ? "text-on-primary-container" : "text-on-surface"}`}>
                        {entry.title}
                      </p>
                      <p className="text-xs font-label text-on-surface-variant">
                        {entry.month} {entry.day}
                      </p>
                    </div>
                    {entry.tags.length > 0 && (
                      <span className="text-xs font-label text-on-surface-variant shrink-0">
                        {entry.tags.length} tag{entry.tags.length > 1 ? "s" : ""}
                      </span>
                    )}
                  </motion.button>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
