"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/base-ui/avatar";
import {
  BookOpen, GraduationCap, School, ChevronDown,
  Swords, Shield, Zap, Star, ArrowRight, Sparkles,
  UserCheck, RotateCcw
} from "lucide-react";
import {
  SCHOLAR_KEY,
  ScholarProfile,
  activateScholarSession,
  getStoredScholar,
} from "@/lib/hooks/useScholar";
import { playSound } from "@/lib/audioEffects";

// ─── constants ──────────────────────────────────────────────────────────────

const BOY_PROFILE = {
  name: "Alex Rivera",
  avatar: "https://assets.watermelon.sh/wm_alex.png",
  tagline: "The Warrior Scholar",
  color: "from-blue-500/20 to-indigo-500/20",
  ring: "ring-blue-400",
  badge: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  glow: "shadow-blue-200 dark:shadow-blue-900/50",
  icon: <Swords size={16} />,
};

const GIRL_PROFILE = {
  name: "Maya Chen",
  avatar: "https://assets.watermelon.sh/wm_olivia.png",
  tagline: "The Arcane Scholar",
  color: "from-purple-500/20 to-pink-500/20",
  ring: "ring-purple-400",
  badge: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
  glow: "shadow-purple-200 dark:shadow-purple-900/50",
  icon: <Star size={16} />,
};

const CLASSES = [
  "Class 1", "Class 2", "Class 3", "Class 4", "Class 5",
  "Class 6", "Class 7", "Class 8", "Class 9", "Class 10",
  "Class 11 (Science)", "Class 11 (Commerce)", "Class 11 (Arts)",
  "Class 12 (Science)", "Class 12 (Commerce)", "Class 12 (Arts)",
  "College – Year 1", "College – Year 2", "College – Year 3", "College – Year 4",
];

const BOARDS = ["CBSE", "ICSE / ISC", "State Board", "IB", "Cambridge (IGCSE)", "Other"];

// ─── helpers ────────────────────────────────────────────────────────────────

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

function XPBar({ value }: { value: number }) {
  return (
    <div className="w-full h-2 rounded-full bg-surface-container overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(100, Math.max(5, value))}%` }}
        transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
        className="h-full rounded-full bg-linear-to-r from-primary to-secondary"
      />
    </div>
  );
}

interface GenderCardProps {
  type: "boy" | "girl";
  selected: boolean;
  onSelect: () => void;
}

function GenderCard({ type, selected, onSelect }: GenderCardProps) {
  const profile = type === "boy" ? BOY_PROFILE : GIRL_PROFILE;

  return (
    <motion.button
      type="button"
      id={`gender-${type}`}
      onClick={() => {
        playSound("click");
        onSelect();
      }}
      whileHover={{ scale: 1.03, y: -2 }}
      whileTap={{ scale: 0.97 }}
      className={`relative flex flex-col items-center gap-3 p-5 rounded-2xl border-2 transition-all duration-200 cursor-pointer w-full
        ${selected
          ? `border-primary bg-linear-to-b ${profile.color} shadow-lg ${profile.glow}`
          : "border-outline-variant bg-surface-container-low hover:border-outline hover:bg-surface-container"
        }`}
    >
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary text-on-primary flex items-center justify-center text-xs font-bold shadow"
          >
            ✓
          </motion.div>
        )}
      </AnimatePresence>

      <div className={`relative ${selected ? "scale-110" : ""} transition-transform duration-200`}>
        <div className={`absolute inset-0 rounded-full blur-xl opacity-40 ${type === "boy" ? "bg-blue-400" : "bg-purple-400"} ${selected ? "opacity-60" : "opacity-0"} transition-opacity`} />
        <Avatar className={`w-20 h-20 ${selected ? `ring-4 ${profile.ring} ring-offset-2 ring-offset-background` : ""} transition-all duration-200 shadow-md`}>
          <AvatarImage src={profile.avatar} alt={profile.name} />
          <AvatarFallback className="text-lg font-bold">{getInitials(profile.name)}</AvatarFallback>
        </Avatar>
      </div>

      <div className="text-center">
        <p className="font-headline text-base font-bold text-on-surface">{profile.name}</p>
        <div className={`inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full text-xs font-label font-semibold ${profile.badge}`}>
          {profile.icon} {profile.tagline}
        </div>
      </div>
    </motion.button>
  );
}

function StyledSelect({
  id, label, icon, options, value, onChange, placeholder,
}: {
  id: string; label: string; icon: React.ReactNode;
  options: string[]; value: string;
  onChange: (v: string) => void; placeholder: string;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="flex items-center gap-1.5 text-xs font-label font-semibold text-on-surface-variant uppercase tracking-wider">
        {icon} {label}
      </label>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none rounded-xl border border-outline-variant bg-surface px-4 py-3 pr-10 text-sm font-label text-on-surface focus:outline-none focus:ring-2 focus:ring-primary transition-shadow"
        >
          <option value="">{placeholder}</option>
          {options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
        <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
      </div>
    </div>
  );
}

function StyledInput({
  id, label, icon, value, onChange, placeholder, type = "text",
}: {
  id: string; label: string; icon: React.ReactNode;
  value: string; onChange: (v: string) => void;
  placeholder: string; type?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="flex items-center gap-1.5 text-xs font-label font-semibold text-on-surface-variant uppercase tracking-wider">
        {icon} {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-outline-variant bg-surface px-4 py-3 text-sm font-label text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary transition-shadow"
      />
    </div>
  );
}

// ─── main page ───────────────────────────────────────────────────────────────

export { SCHOLAR_KEY };

type Step = "identity" | "details" | "ready";

export default function LoginPage() {
  const router = useRouter();
  const [existingScholar, setExistingScholar] = useState<ScholarProfile | null>(null);
  const [showWizard, setShowWizard] = useState(true);
  const [step, setStep] = useState<Step>("identity");
  const [gender, setGender] = useState<"boy" | "girl" | null>(null);
  const [name, setName] = useState("");
  const [studentClass, setStudentClass] = useState("");
  const [board, setBoard] = useState("");
  const [school, setSchool] = useState("");
  const [loading, setLoading] = useState(false);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const saved = getStoredScholar();
    if (saved && saved.name) {
      setExistingScholar(saved);
      setShowWizard(false);
    } else {
      setShowWizard(true);
    }
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  const profile = gender === "boy" ? BOY_PROFILE : gender === "girl" ? GIRL_PROFILE : null;

  function canProceedStep1() {
    return gender !== null && name.trim().length > 0;
  }

  function canProceedStep2() {
    return studentClass !== "" && school.trim().length > 0;
  }

  function handleResumeSession() {
    if (!existingScholar) return;
    playSound("success");
    setLoading(true);
    activateScholarSession(existingScholar);
    setTimeout(() => {
      router.push("/");
    }, 400);
  }

  function handleQuickDemo(type: "alex" | "maya") {
    playSound("success");
    setLoading(true);
    const isBoy = type === "alex";
    const demoProfile: ScholarProfile = {
      name: isBoy ? "Alex Rivera" : "Maya Chen",
      gender: isBoy ? "boy" : "girl",
      studentClass: isBoy ? "Class 10" : "Class 12 (Science)",
      board: isBoy ? "CBSE" : "ICSE / ISC",
      school: isBoy ? "St. Xavier's Academy" : "Modern Science Institute",
      avatar: isBoy ? BOY_PROFILE.avatar : GIRL_PROFILE.avatar,
      tagline: isBoy ? BOY_PROFILE.tagline : GIRL_PROFILE.tagline,
      xp: 45,
      quizzesCompleted: 3,
      focusSessions: 2,
      createdAt: new Date().toISOString(),
    };
    activateScholarSession(demoProfile);
    setTimeout(() => {
      router.push("/");
    }, 500);
  }

  async function handleEnter() {
    playSound("levelup");
    setLoading(true);
    if (typeof window !== "undefined") {
      localStorage.removeItem("studyflow_persisted_state");
    }

    const scholar: ScholarProfile = {
      name: name.trim() || profile?.name || "Scholar",
      gender,
      studentClass,
      board,
      school,
      avatar: profile?.avatar ?? "",
      tagline: profile?.tagline ?? "",
      xp: 15,
      quizzesCompleted: 0,
      focusSessions: 0,
      createdAt: new Date().toISOString(),
    };

    activateScholarSession(scholar);

    await new Promise((r) => setTimeout(r, 600));
    router.push("/");
  }

  const STEP_LABELS: Record<Step, string> = {
    identity: "Choose your Scholar",
    details: "Your Study Arena",
    ready: "Enter the Dojo",
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      {/* Background decoration */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-secondary/10 blur-3xl" />
      </div>

      <div className="relative w-full max-w-lg">
        {/* Logo / Brand Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="text-primary text-3xl">✦</span>
            <span className="font-headline text-3xl font-bold text-on-surface">StudyFlow AI</span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-primary-container text-on-primary-container text-xs font-label font-bold tracking-wide shadow-xs">
            <Zap size={13} className="text-primary" /> Revision Dojo &amp; AI Scholar Portal
          </div>
        </motion.div>

        {/* MODE 1: Welcome Back / Resume Session for existing users */}
        {existingScholar && !showWizard ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-3xl border border-outline-variant bg-surface shadow-xl shadow-black/5 overflow-hidden"
          >
            {/* Header */}
            <div className="px-6 pt-6 pb-4 border-b border-outline-variant bg-surface-container-low flex items-center justify-between">
              <div>
                <span className="text-xs font-label font-bold text-primary uppercase tracking-widest">
                  Authentication Required
                </span>
                <h1 className="font-headline text-xl font-bold text-on-surface mt-0.5">
                  Welcome Back, Scholar!
                </h1>
              </div>
              <div className="w-9 h-9 rounded-xl bg-primary-container text-primary flex items-center justify-center font-bold">
                <UserCheck size={18} />
              </div>
            </div>

            {/* Scholar Card View */}
            <div className="p-6 space-y-6">
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-surface-container-low border border-outline-variant">
                <div className="relative">
                  <Avatar className="w-16 h-16 ring-4 ring-primary/40 ring-offset-2 ring-offset-background shadow-md">
                    <AvatarImage src={existingScholar.avatar} alt={existingScholar.name} />
                    <AvatarFallback className="text-lg font-bold">
                      {getInitials(existingScholar.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-full bg-primary text-on-primary text-[10px] font-bold shadow">
                    Lv. {Math.max(1, Math.floor((existingScholar.xp || 0) / 100) + 1)}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <h2 className="font-headline text-lg font-bold text-on-surface truncate">
                    {existingScholar.name}
                  </h2>
                  <p className="text-xs font-label text-on-surface-variant truncate">
                    {existingScholar.tagline || "Scholar Champion"}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {existingScholar.studentClass && (
                      <span className="px-2 py-0.5 rounded-md bg-surface-container text-[11px] font-label font-medium text-on-surface">
                        {existingScholar.studentClass}
                      </span>
                    )}
                    {existingScholar.board && (
                      <span className="px-2 py-0.5 rounded-md bg-secondary-container text-[11px] font-label font-medium text-on-secondary-container">
                        {existingScholar.board}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Progress Recap */}
              <div className="space-y-1.5 bg-surface-container-lowest p-3.5 rounded-xl border border-outline-variant">
                <div className="flex justify-between text-xs font-label text-on-surface-variant font-medium">
                  <span className="flex items-center gap-1">
                    <Shield size={12} className="text-primary" /> Scholar XP
                  </span>
                  <span className="font-bold text-on-surface">{existingScholar.xp || 0} XP</span>
                </div>
                <XPBar value={((existingScholar.xp || 0) % 100) || 15} />
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  type="button"
                  id="resume-session-btn"
                  onClick={handleResumeSession}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-primary text-on-primary font-label font-bold text-sm shadow-md hover:opacity-95 active:scale-[0.99] transition-all cursor-pointer disabled:opacity-75"
                >
                  {loading ? (
                    <span>Opening Study Dojo…</span>
                  ) : (
                    <>
                      <Zap size={16} /> Resume Study Session
                    </>
                  )}
                </button>

                <button
                  type="button"
                  id="switch-scholar-btn"
                  onClick={() => {
                    playSound("click");
                    setShowWizard(true);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-outline-variant text-on-surface-variant font-label font-semibold text-xs hover:bg-surface-container transition-colors cursor-pointer"
                >
                  <RotateCcw size={13} /> Switch Scholar / Create New Profile
                </button>
              </div>

              {/* Quick 1-Click Demo Profiles */}
              <div className="pt-2 border-t border-outline-variant">
                <p className="text-[11px] font-label font-semibold text-on-surface-variant uppercase tracking-wider mb-2.5 text-center">
                  — Or 1-Click Instant Demo Evaluation —
                </p>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    id="demo-alex-btn"
                    onClick={() => handleQuickDemo("alex")}
                    className="p-3 rounded-xl border border-outline-variant bg-surface-container-low hover:bg-surface-container text-xs font-label font-semibold text-on-surface flex flex-col items-center gap-1 transition-all text-center cursor-pointer"
                  >
                    <span className="text-primary font-bold">⚡ Alex Rivera</span>
                    <span className="text-[10px] text-on-surface-variant">Class 10 · CBSE</span>
                  </button>
                  <button
                    type="button"
                    id="demo-maya-btn"
                    onClick={() => handleQuickDemo("maya")}
                    className="p-3 rounded-xl border border-outline-variant bg-surface-container-low hover:bg-surface-container text-xs font-label font-semibold text-on-surface flex flex-col items-center gap-1 transition-all text-center cursor-pointer"
                  >
                    <span className="text-secondary font-bold">⚡ Maya Chen</span>
                    <span className="text-[10px] text-on-surface-variant">Class 12 · ICSE</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          /* MODE 2: Multi-step Scholar Registration / Setup */
          <div>
            {/* Step progress */}
            <div className="flex items-center gap-2 mb-6">
              {(["identity", "details", "ready"] as Step[]).map((s, i) => (
                <div key={s} className="flex items-center flex-1">
                  <div
                    className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                      ["identity", "details", "ready"].indexOf(step) >= i
                        ? "bg-primary"
                        : "bg-outline-variant"
                    }`}
                  />
                </div>
              ))}
            </div>

            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="rounded-3xl border border-outline-variant bg-surface shadow-xl shadow-black/5 overflow-hidden"
            >
              {/* Card header */}
              <div className="px-6 pt-6 pb-4 border-b border-outline-variant bg-surface-container-low flex items-center justify-between">
                <div>
                  <p className="text-xs font-label font-semibold text-on-surface-variant uppercase tracking-widest mb-0.5">
                    Step {step === "identity" ? 1 : step === "details" ? 2 : 3} of 3
                  </p>
                  <h1 className="font-headline text-xl font-bold text-on-surface">
                    {STEP_LABELS[step]}
                  </h1>
                </div>
                {existingScholar && (
                  <button
                    type="button"
                    onClick={() => {
                      playSound("click");
                      setShowWizard(false);
                    }}
                    className="text-xs font-label text-primary hover:underline font-semibold"
                  >
                    Cancel
                  </button>
                )}
              </div>

              <div className="px-6 py-6 space-y-5">
                {/* ── STEP 1: Identity ─────────────────────── */}
                <AnimatePresence mode="wait">
                  {step === "identity" && (
                    <motion.div
                      key="identity"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-5"
                    >
                      <div>
                        <p className="text-xs font-label font-semibold text-on-surface-variant uppercase tracking-wider mb-3">
                          Select your Avatar
                        </p>
                        <div className="grid grid-cols-2 gap-3">
                          <GenderCard type="boy" selected={gender === "boy"} onSelect={() => setGender("boy")} />
                          <GenderCard type="girl" selected={gender === "girl"} onSelect={() => setGender("girl")} />
                        </div>
                      </div>

                      <StyledInput
                        id="student-name"
                        label="Your Name"
                        icon={<Sparkles size={12} />}
                        value={name}
                        onChange={setName}
                        placeholder={gender === "girl" ? "e.g. Maya, Priya, Ananya…" : "e.g. Alex, Arjun, Rahul…"}
                      />

                      {/* Quick 1-Click Start Pills */}
                      <div className="pt-1">
                        <p className="text-[11px] font-label font-semibold text-on-surface-variant uppercase tracking-wider mb-2 text-center">
                          — or Instant 1-Click Demo —
                        </p>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            id="quick-demo-alex"
                            onClick={() => handleQuickDemo("alex")}
                            className="p-2.5 rounded-xl border border-outline-variant bg-surface-container-low hover:bg-surface-container text-xs font-label font-semibold text-on-surface flex flex-col items-center gap-1 transition-all text-center cursor-pointer"
                          >
                            <span className="text-primary font-bold">⚡ Start as Alex</span>
                            <span className="text-[10px] text-on-surface-variant">Class 10 · CBSE</span>
                          </button>
                          <button
                            type="button"
                            id="quick-demo-maya"
                            onClick={() => handleQuickDemo("maya")}
                            className="p-2.5 rounded-xl border border-outline-variant bg-surface-container-low hover:bg-surface-container text-xs font-label font-semibold text-on-surface flex flex-col items-center gap-1 transition-all text-center cursor-pointer"
                          >
                            <span className="text-secondary font-bold">⚡ Start as Maya</span>
                            <span className="text-[10px] text-on-surface-variant">Class 12 · ICSE</span>
                          </button>
                        </div>
                      </div>

                      <button
                        type="button"
                        id="step1-next-btn"
                        disabled={!canProceedStep1()}
                        onClick={() => {
                          playSound("click");
                          setStep("details");
                        }}
                        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-on-primary font-label font-semibold text-sm transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                      >
                        Continue <ArrowRight size={15} />
                      </button>
                    </motion.div>
                  )}

                  {/* ── STEP 2: Study Details ─────────────────── */}
                  {step === "details" && (
                    <motion.div
                      key="details"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-4"
                    >
                      {profile && (
                        <div className={`flex items-center gap-3 p-3 rounded-xl bg-linear-to-r ${profile.color} border border-outline-variant`}>
                          <Avatar className={`w-10 h-10 ring-2 ${profile.ring} ring-offset-1 ring-offset-background`}>
                            <AvatarImage src={profile.avatar} alt={name || profile.name} />
                            <AvatarFallback className="text-xs font-bold">{getInitials(name || profile.name)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-label font-bold text-on-surface text-sm">{name || profile.name}</p>
                            <p className="text-xs font-label text-on-surface-variant">{profile.tagline}</p>
                          </div>
                        </div>
                      )}

                      <StyledSelect
                        id="student-class"
                        label="Class / Year"
                        icon={<GraduationCap size={12} />}
                        options={CLASSES}
                        value={studentClass}
                        onChange={setStudentClass}
                        placeholder="Select your class…"
                      />

                      <StyledSelect
                        id="student-board"
                        label="Board / Curriculum"
                        icon={<BookOpen size={12} />}
                        options={BOARDS}
                        value={board}
                        onChange={setBoard}
                        placeholder="Select your board…"
                      />

                      <StyledInput
                        id="student-school"
                        label="School / College Name"
                        icon={<School size={12} />}
                        value={school}
                        onChange={setSchool}
                        placeholder="e.g. Delhi Public School, Oxford High…"
                      />

                      <div className="flex gap-3 pt-1">
                        <button
                          type="button"
                          id="step2-back-btn"
                          onClick={() => {
                            playSound("click");
                            setStep("identity");
                          }}
                          className="flex-1 py-3 rounded-xl border border-outline-variant text-on-surface-variant font-label font-semibold text-sm hover:bg-surface-container transition-colors cursor-pointer"
                        >
                          ← Back
                        </button>
                        <button
                          type="button"
                          id="step2-next-btn"
                          disabled={!canProceedStep2()}
                          onClick={() => {
                            playSound("click");
                            setStep("ready");
                          }}
                          className="flex-2 flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-on-primary font-label font-semibold text-sm hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                        >
                          Continue <ArrowRight size={15} />
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* ── STEP 3: Ready ─────────────────────────── */}
                  {step === "ready" && (
                    <motion.div
                      key="ready"
                      initial={{ opacity: 0, scale: 0.97 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-5 text-center"
                    >
                      {profile && (
                        <div className="flex flex-col items-center gap-3">
                          <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: "spring", bounce: 0.4, delay: 0.1 }}
                            className="relative"
                          >
                            <div className={`absolute inset-0 rounded-full blur-2xl opacity-50 scale-110 ${gender === "boy" ? "bg-blue-400" : "bg-purple-400"}`} />
                            <Avatar className={`relative w-24 h-24 ring-4 ${profile.ring} ring-offset-4 ring-offset-background shadow-xl`}>
                              <AvatarImage src={profile.avatar} alt={name || profile.name} />
                              <AvatarFallback className="text-xl font-bold">{getInitials(name || profile.name)}</AvatarFallback>
                            </Avatar>
                            <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center text-xs font-bold shadow-md border-2 border-background">
                              Lv.1
                            </div>
                          </motion.div>

                          <div>
                            <motion.h2
                              initial={{ opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.2 }}
                              className="font-headline text-2xl font-bold text-on-surface"
                            >
                              {name || profile.name}
                            </motion.h2>
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.3 }}
                              className={`inline-flex items-center gap-1 mt-1 px-2.5 py-1 rounded-full text-xs font-label font-semibold ${profile.badge}`}
                            >
                              {profile.icon} {profile.tagline}
                            </motion.div>
                          </div>
                        </div>
                      )}

                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.35 }}
                        className="grid grid-cols-3 gap-2 text-left"
                      >
                        {[
                          { label: "Class", value: studentClass || "—", icon: <GraduationCap size={13} /> },
                          { label: "Board", value: board || "—", icon: <BookOpen size={13} /> },
                          { label: "School", value: school || "—", icon: <School size={13} /> },
                        ].map((stat) => (
                          <div key={stat.label} className="rounded-xl bg-surface-container-low border border-outline-variant p-2.5 space-y-1">
                            <div className="flex items-center gap-1 text-on-surface-variant">{stat.icon}</div>
                            <p className="text-[10px] font-label font-semibold text-on-surface-variant uppercase tracking-wide">{stat.label}</p>
                            <p className="text-xs font-label font-bold text-on-surface truncate" title={stat.value}>{stat.value}</p>
                          </div>
                        ))}
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.45 }}
                        className="space-y-1.5"
                      >
                        <div className="flex justify-between text-xs font-label text-on-surface-variant">
                          <span className="flex items-center gap-1"><Shield size={11} /> Scholar XP</span>
                          <span>15 / 100 XP (Starter Bonus)</span>
                        </div>
                        <XPBar value={15} />
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="flex gap-3"
                      >
                        <button
                          type="button"
                          id="step3-back-btn"
                          onClick={() => {
                            playSound("click");
                            setStep("details");
                          }}
                          className="flex-1 py-3 rounded-xl border border-outline-variant text-on-surface-variant font-label font-semibold text-sm hover:bg-surface-container transition-colors cursor-pointer"
                        >
                          ← Edit
                        </button>
                        <button
                          type="button"
                          id="enter-dojo-btn"
                          onClick={handleEnter}
                          disabled={loading}
                          className="flex-2 relative flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-on-primary font-label font-semibold text-sm hover:opacity-90 transition-all overflow-hidden disabled:opacity-80 cursor-pointer"
                        >
                          {loading ? (
                            <>
                              <motion.span
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                                className="inline-block"
                              >
                                ✦
                              </motion.span>
                              Entering Dojo…
                            </>
                          ) : (
                            <>
                              <Zap size={15} /> Enter the Dojo
                            </>
                          )}
                        </button>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        )}

        {/* Footer note */}
        <p className="text-center text-xs font-label text-on-surface-variant mt-5">
          Privacy First: Your academic notes and profile stay in your browser. ✦
        </p>
      </div>
    </div>
  );
}
