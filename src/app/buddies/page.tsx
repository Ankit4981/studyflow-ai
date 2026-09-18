"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  CircleFadingPlusIcon, Users, Mail, X, Send,
  BookOpen, Clock, Trophy, MessageSquare, Check,
  GraduationCap, Sparkles, UserCheck, Copy, Trash2,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/base-ui/avatar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/base-ui/card";
import { useRequireAuth } from "@/lib/hooks/useScholar";

// ─── types ──────────────────────────────────────────────────────────────────

interface Buddy {
  id: string;
  fallback: string;
  name: string;
  role: string;  // subject focus
  src: string;
  school: string;
  studentClass: string;
  status: "online" | "studying" | "offline";
  sessions: number;
  lastSeen: string;
  connected: boolean;
}

// ─── seed data ───────────────────────────────────────────────────────────────

const INITIAL_BUDDIES: Buddy[] = [
  {
    id: "b1",
    fallback: "MC",
    name: "Maya Chen",
    role: "Science & Math",
    src: "https://i.pravatar.cc/160?img=28",
    school: "Delhi Public School",
    studentClass: "Class 11 (Science)",
    status: "studying",
    sessions: 12,
    lastSeen: "Now",
    connected: true,
  },
  {
    id: "b2",
    fallback: "EL",
    name: "Ethan Lewis",
    role: "History & Literature",
    src: "https://i.pravatar.cc/160?img=36",
    school: "Delhi Public School",
    studentClass: "Class 11 (Science)",
    status: "online",
    sessions: 8,
    lastSeen: "5 min ago",
    connected: true,
  },
  {
    id: "b3",
    fallback: "AP",
    name: "Ava Patel",
    role: "Chemistry & Biology",
    src: "https://i.pravatar.cc/160?img=52",
    school: "Ryan International",
    studentClass: "Class 11 (Science)",
    status: "offline",
    sessions: 5,
    lastSeen: "2 hrs ago",
    connected: true,
  },
];

// ─── helpers ─────────────────────────────────────────────────────────────────

const STATUS_DOT: Record<Buddy["status"], string> = {
  online: "bg-green-400",
  studying: "bg-yellow-400",
  offline: "bg-gray-300 dark:bg-neutral-600",
};

const STATUS_LABEL: Record<Buddy["status"], string> = {
  online: "Online",
  studying: "📚 Studying",
  offline: "Offline",
};

function buildGmailLink(to: string, inviterName: string) {
  const origin = typeof window !== "undefined" ? window.location.origin : "https://studyflow-ai.vercel.app";
  const subject = encodeURIComponent(`${inviterName} invited you to study on StudyFlow AI 🎓`);
  const body = encodeURIComponent(
    `Hey!\n\n${inviterName} thinks you'd make great study buddies on StudyFlow AI — a tool that turns study material into flashcards, micro-tasks, and more.\n\n👉 Join here: ${origin}/login\n\nLook forward to studying together!\n\n– ${inviterName} via StudyFlow AI ✦`
  );
  return `https://mail.google.com/mail/?view=cm&to=${encodeURIComponent(to)}&su=${subject}&body=${body}`;
}

// ─── Invite Modal ────────────────────────────────────────────────────────────

function InviteModal({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [sent, setSent] = useState(false);
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 100);
  }, []);

  const inviterName = "Your StudyFlow Scholar"; // could come from profile context
  const isValid = email.includes("@") && email.includes(".");

  function handleSendGmail() {
    if (!isValid) return;
    const link = buildGmailLink(email, name || inviterName);
    window.open(link, "_blank");
    setSent(true);
  }

  const shareLink = (typeof window !== "undefined" ? window.location.origin : "https://studyflow-ai.vercel.app") + "/login";

  function handleCopyLink() {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.92, y: 16, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.94, y: 8, opacity: 0 }}
        transition={{ type: "spring", bounce: 0.3, duration: 0.4 }}
        className="w-full max-w-md rounded-3xl border border-outline-variant bg-surface shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-outline-variant bg-surface-container-low">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center">
              <Mail size={15} className="text-primary" />
            </div>
            <div>
              <p className="font-label font-bold text-on-surface text-sm">Invite a Study Buddy</p>
              <p className="text-xs font-label text-on-surface-variant">Opens Gmail with a pre-filled invite</p>
            </div>
          </div>
          <button
            id="close-invite-modal"
            onClick={onClose}
            className="p-1.5 rounded-full text-on-surface-variant hover:bg-surface-container transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          <AnimatePresence mode="wait">
            {sent ? (
              <motion.div
                key="sent"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8 space-y-3"
              >
                <div className="w-14 h-14 rounded-full bg-secondary-container flex items-center justify-center mx-auto">
                  <Check size={24} className="text-secondary" />
                </div>
                <p className="font-headline text-lg font-bold text-on-surface">Gmail opened!</p>
                <p className="text-sm font-label text-on-surface-variant">
                  Your invite to <span className="font-semibold text-on-surface">{email}</span> is ready to send in Gmail.
                </p>
                <button
                  onClick={() => { setSent(false); setEmail(""); setName(""); }}
                  className="mt-2 text-xs font-label font-semibold text-primary hover:underline"
                >
                  Invite someone else
                </button>
              </motion.div>
            ) : (
              <motion.div key="form" className="space-y-4">
                {/* Name */}
                <div className="space-y-1.5">
                  <label htmlFor="invite-name" className="text-xs font-label font-semibold text-on-surface-variant uppercase tracking-wider">
                    Their Name (optional)
                  </label>
                  <input
                    id="invite-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Priya, Rahul…"
                    className="w-full rounded-xl border border-outline-variant bg-surface px-4 py-2.5 text-sm font-label text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label htmlFor="invite-email" className="text-xs font-label font-semibold text-on-surface-variant uppercase tracking-wider">
                    Gmail Address <span className="text-primary">*</span>
                  </label>
                  <div className="relative">
                    <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none" />
                    <input
                      ref={inputRef}
                      id="invite-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="classmate@gmail.com"
                      onKeyDown={(e) => e.key === "Enter" && handleSendGmail()}
                      className="w-full rounded-xl border border-outline-variant bg-surface pl-9 pr-4 py-2.5 text-sm font-label text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                {/* Preview */}
                <div className="rounded-xl bg-surface-container-low border border-outline-variant p-3 space-y-1">
                  <p className="text-[11px] font-label font-semibold text-on-surface-variant uppercase tracking-wider">Email Preview</p>
                  <p className="text-xs font-label text-on-surface-variant">
                    <span className="font-semibold text-on-surface">Subject:</span> {inviterName} invited you to study on StudyFlow AI 🎓
                  </p>
                  <p className="text-xs font-label text-on-surface-variant line-clamp-2">
                    <span className="font-semibold text-on-surface">Body:</span> Hey! {inviterName} thinks you&apos;d make great study buddies on StudyFlow AI — a tool that turns study material into flashcards…
                  </p>
                </div>

                {/* Actions */}
                <button
                  id="send-gmail-invite-btn"
                  onClick={handleSendGmail}
                  disabled={!isValid}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-on-primary font-label font-semibold text-sm hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  <Send size={14} /> Open in Gmail
                </button>

                <div className="relative flex items-center gap-2">
                  <div className="flex-1 h-px bg-outline-variant" />
                  <span className="text-xs font-label text-on-surface-variant">or share link</span>
                  <div className="flex-1 h-px bg-outline-variant" />
                </div>

                <button
                  id="copy-invite-link-btn"
                  onClick={handleCopyLink}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-outline-variant text-on-surface-variant font-label font-semibold text-sm hover:bg-surface-container transition-colors"
                >
                  {copied ? <><Check size={14} className="text-secondary" /> Copied!</> : <><Copy size={14} /> Copy Invite Link</>}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Buddy card ──────────────────────────────────────────────────────────────

function BuddyCard({
  buddy,
  onInviteAgain,
  onRemove,
}: {
  buddy: Buddy;
  onInviteAgain: () => void;
  onRemove?: () => void;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="flex items-center gap-4 rounded-xl border border-outline-variant bg-surface px-4 py-3 hover:bg-surface-container-low transition-colors group"
    >
      {/* Avatar with status dot */}
      <div className="relative shrink-0">
        <Avatar>
          <AvatarImage src={buddy.src} alt={buddy.name} />
          <AvatarFallback className="text-xs font-bold">{buddy.fallback}</AvatarFallback>
        </Avatar>
        <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-surface ${STATUS_DOT[buddy.status]}`} />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-label font-semibold text-on-surface truncate">{buddy.name}</span>
          {buddy.connected && <UserCheck size={12} className="text-secondary shrink-0" />}
        </div>
        <p className="text-xs font-label text-on-surface-variant truncate">{buddy.role}</p>
        <p className="text-[10px] font-label text-on-surface-variant/70 mt-0.5">{STATUS_LABEL[buddy.status]} · {buddy.lastSeen}</p>
      </div>

      {/* Stats */}
      <div className="hidden sm:flex flex-col items-end gap-1 text-right shrink-0">
        <span className="text-xs font-label font-bold text-on-surface">{buddy.sessions}</span>
        <span className="text-[10px] font-label text-on-surface-variant">sessions</span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          id={`message-buddy-${buddy.id}`}
          onClick={onInviteAgain}
          title="Invite to study session"
          className="p-1.5 rounded-lg text-on-surface-variant hover:bg-primary-container hover:text-primary transition-all"
        >
          <MessageSquare size={14} />
        </button>
        {onRemove && (
          <button
            id={`remove-buddy-${buddy.id}`}
            onClick={onRemove}
            title="Remove buddy"
            className="p-1.5 rounded-lg text-on-surface-variant hover:bg-error-container hover:text-on-error-container transition-all"
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>
    </motion.div>
  );
}

// ─── Stats strip ─────────────────────────────────────────────────────────────

function StatsStrip({ buddies }: { buddies: Buddy[] }) {
  const online = buddies.filter((b) => b.status !== "offline").length;
  const totalSessions = buddies.reduce((s, b) => s + b.sessions, 0);

  return (
    <div className="grid grid-cols-3 gap-3">
      {[
        { icon: <Users size={16} />, value: buddies.length, label: "Buddies" },
        { icon: <Clock size={16} />, value: online, label: "Active Now" },
        { icon: <Trophy size={16} />, value: totalSessions, label: "Sessions" },
      ].map((s) => (
        <div key={s.label} className="flex flex-col items-center gap-1 py-3 rounded-xl border border-outline-variant bg-surface-container-low">
          <span className="text-primary">{s.icon}</span>
          <span className="font-headline text-xl font-bold text-on-surface">{s.value}</span>
          <span className="text-[10px] font-label text-on-surface-variant uppercase tracking-wide">{s.label}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function BuddiesPage() {
  useRequireAuth("/login");

  const [buddies, setBuddies] = useState<Buddy[]>(INITIAL_BUDDIES);
  const [showInvite, setShowInvite] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = buddies.filter(
    (b) =>
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.role.toLowerCase().includes(search.toLowerCase()) ||
      b.school.toLowerCase().includes(search.toLowerCase())
  );

  function removeBuddy(id: string) {
    setBuddies((bs) => bs.filter((b) => b.id !== id));
  }

  return (
    <>
      {/* Invite Modal */}
      <AnimatePresence>
        {showInvite && <InviteModal onClose={() => setShowInvite(false)} />}
      </AnimatePresence>

      <main className="flex flex-col w-full px-6 md:px-10 py-10 max-w-7xl mx-auto">
        {/* Page header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Users size={18} className="text-primary" />
              <span className="text-xs font-label font-semibold text-primary uppercase tracking-widest">
                Study Buddies
              </span>
            </div>
            <h1 className="font-headline text-3xl font-bold text-on-surface">Your Study Circle</h1>
            <p className="text-sm font-label text-on-surface-variant mt-1">
              Connect with classmates, study together, and grow smarter.
            </p>
          </div>
          <button
            id="open-invite-modal-btn"
            onClick={() => setShowInvite(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-on-primary font-label text-sm font-semibold hover:opacity-90 transition-all shadow-sm"
          >
            <Mail size={15} /> Invite via Gmail
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left col */}
          <div className="lg:col-span-5 space-y-5">

            {/* Stats */}
            <StatsStrip buddies={buddies} />

            {/* Main team card */}
            <Card className="shadow-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Study Circle</CardTitle>
                    <CardDescription className="mt-1">Your connected classmates</CardDescription>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center">
                    <GraduationCap size={15} className="text-secondary" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="grid gap-3 sm:grid-cols-2">
                {/* Invite button — matches user's exact design */}
                <button
                  id="invite-teammate-card-btn"
                  type="button"
                  onClick={() => setShowInvite(true)}
                  className="flex items-center gap-4 rounded-xl border border-dashed border-outline-variant/60 bg-surface-container-low/50 hover:bg-surface-container px-4 py-3 text-left transition-colors group"
                >
                  <CircleFadingPlusIcon className="text-on-surface-variant group-hover:text-primary size-5 transition-colors" />
                  <span className="text-sm font-label font-semibold text-on-surface-variant group-hover:text-on-surface transition-colors">
                    Invite via Gmail
                  </span>
                </button>

                {/* Buddy tiles */}
                {buddies.map((member) => (
                  <div
                    key={member.id}
                    className="relative flex items-center gap-4 rounded-xl border border-outline-variant/50 bg-surface/70 px-4 py-3 group hover:bg-surface-container-low transition-colors"
                  >
                    <div className="relative shrink-0">
                      <Avatar>
                        <AvatarImage src={member.src} alt={member.name} />
                        <AvatarFallback className="text-xs font-bold">{member.fallback}</AvatarFallback>
                      </Avatar>
                      <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-surface ${STATUS_DOT[member.status]}`} />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-label font-semibold text-on-surface truncate">{member.name}</span>
                      <span className="text-xs font-label text-on-surface-variant truncate">{member.role}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* How it works */}
            <div className="rounded-2xl border border-outline-variant bg-secondary-container/50 p-4 space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles size={14} className="text-secondary" />
                <p className="text-xs font-label font-semibold text-on-secondary-container uppercase tracking-wider">How Invites Work</p>
              </div>
              {[
                { step: "1", text: "Click \"Invite via Gmail\" and enter their email" },
                { step: "2", text: "A pre-filled Gmail draft opens — just hit Send!" },
                { step: "3", text: "They join via the link and appear in your circle" },
              ].map((s) => (
                <div key={s.step} className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-secondary text-on-secondary text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {s.step}
                  </span>
                  <p className="text-xs font-label text-on-secondary-container">{s.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right col — full buddy list */}
          <div className="lg:col-span-7 space-y-4">
            {/* Search */}
            <div className="relative">
              <BookOpen size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none" />
              <input
                id="buddy-search"
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, subject or school…"
                className="w-full rounded-xl border border-outline-variant bg-surface pl-9 pr-4 py-2.5 text-sm font-label text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Buddy list header */}
            <div className="flex items-center justify-between">
              <p className="text-xs font-label font-semibold text-on-surface-variant uppercase tracking-wider">
                All Buddies · {filtered.length}
              </p>
              <div className="flex gap-2 text-[10px] font-label text-on-surface-variant">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-400 inline-block" /> Online</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-400 inline-block" /> Studying</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-gray-300 inline-block" /> Offline</span>
              </div>
            </div>

            {/* List */}
            <AnimatePresence>
              {filtered.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-16 space-y-3"
                >
                  <Users size={40} className="text-outline mx-auto" />
                  <p className="font-headline text-lg text-on-surface">No buddies found</p>
                  <p className="text-sm font-label text-on-surface-variant">Try a different search or invite a classmate.</p>
                  <button
                    onClick={() => setShowInvite(true)}
                    className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-on-primary text-sm font-label font-semibold hover:opacity-90 transition-all"
                  >
                    <Mail size={14} /> Invite via Gmail
                  </button>
                </motion.div>
              ) : (
                <div className="space-y-2">
                  {filtered.map((buddy) => (
                    <BuddyCard
                      key={buddy.id}
                      buddy={buddy}
                      onInviteAgain={() => setShowInvite(true)}
                      onRemove={() => removeBuddy(buddy.id)}
                    />
                  ))}
                </div>
              )}
            </AnimatePresence>

            {/* Gmail CTA banner */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-4 flex items-center gap-4 rounded-2xl border border-outline-variant bg-surface p-4"
            >
              <div className="w-10 h-10 rounded-xl bg-primary-container flex items-center justify-center shrink-0">
                <Mail size={18} className="text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-label font-bold text-on-surface">Grow your study circle</p>
                <p className="text-xs font-label text-on-surface-variant">Invite classmates directly via Gmail — no accounts needed for them to join.</p>
              </div>
              <button
                id="banner-invite-btn"
                onClick={() => setShowInvite(true)}
                className="shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-on-primary text-xs font-label font-semibold hover:opacity-90 transition-all"
              >
                <Send size={12} /> Invite
              </button>
            </motion.div>
          </div>
        </div>
      </main>
    </>
  );
}
