"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/base-ui/avatar";
import {
  BookOpen, GraduationCap, School, ChevronDown,
  Swords, Shield, Zap, Star, ArrowRight, Sparkles,
  UserCheck, UserPlus, LogIn, CheckCircle2
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
  name: "Ankit Pradhan",
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
    .toUpperCase()
    .slice(0, 2);
}

function XPBar({ value }: { value: number }) {
  const clampedValue = Math.min(100, Math.max(0, value));
  return (
    <div className="w-full h-2 rounded-full bg-surface-container overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${clampedValue}%` }}
        transition={{ duration: 0.8, ease: "easeOut" }}
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
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={`relative flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all duration-200 cursor-pointer w-full
        ${selected
          ? `border-primary bg-linear-to-b ${profile.color} shadow-md ${profile.glow}`
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

      <div className={`relative ${selected ? "scale-105" : ""} transition-transform duration-200`}>
        <div className={`absolute inset-0 rounded-full blur-xl opacity-40 ${type === "boy" ? "bg-blue-400" : "bg-purple-400"} ${selected ? "opacity-60" : "opacity-0"} transition-opacity`} />
        <Avatar className={`w-16 h-16 ${selected ? `ring-4 ${profile.ring} ring-offset-2 ring-offset-background` : ""} transition-all duration-200 shadow-md`}>
          <AvatarImage src={profile.avatar} alt={profile.name} />
          <AvatarFallback className="text-base font-bold">{getInitials(profile.name)}</AvatarFallback>
        </Avatar>
      </div>

      <div className="text-center">
        <p className="font-headline text-sm font-bold text-on-surface">{type === "boy" ? "Warrior Scholar" : "Arcane Scholar"}</p>
        <div className={`inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full text-[11px] font-label font-semibold ${profile.badge}`}>
          {profile.icon} {type === "boy" ? "Champion" : "Mystic"}
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

type AuthMode = "create" | "signin";
type CreateStep = "identity" | "details" | "ready";

export default function LoginPage() {
  const router = useRouter();
  const [authMode, setAuthMode] = useState<AuthMode>("create");
  const [savedScholar, setSavedScholar] = useState<ScholarProfile | null>(null);

  // Sign in state
  const [signInName, setSignInName] = useState("");

  // Create account state
  const [createStep, setCreateStep] = useState<CreateStep>("identity");
  const [gender, setGender] = useState<"boy" | "girl" | null>(null);
  const [name, setName] = useState("");
  const [studentClass, setStudentClass] = useState("");
  const [board, setBoard] = useState("");
  const [school, setSchool] = useState("");
  const [loading, setLoading] = useState(false);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const stored = getStoredScholar();
    if (stored && stored.name) {
      setSavedScholar(stored);
      setSignInName(stored.name);
    }
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  const selectedProfile = gender === "boy" ? BOY_PROFILE : gender === "girl" ? GIRL_PROFILE : null;

  function canProceedStep1() {
    return gender !== null && name.trim().length > 0;
  }

  function canProceedStep2() {
    return studentClass !== "" && school.trim().length > 0;
  }

  // 1-Click Demo Profiles (Ankit Pradhan & Maya Chen)
  function handleQuickDemo(type: "ankit" | "maya") {
    playSound("success");
    setLoading(true);
    const isAnkit = type === "ankit";
    const demoProfile: ScholarProfile = {
      name: isAnkit ? "Ankit Pradhan" : "Maya Chen",
      gender: isAnkit ? "boy" : "girl",
      studentClass: isAnkit ? "Class 12 (Science)" : "Class 12 (Science)",
      board: isAnkit ? "CBSE" : "ICSE / ISC",
      school: isAnkit ? "St. Xavier's Academy" : "Modern Science Institute",
      avatar: isAnkit ? BOY_PROFILE.avatar : GIRL_PROFILE.avatar,
      tagline: isAnkit ? BOY_PROFILE.tagline : GIRL_PROFILE.tagline,
      xp: 45,
      quizzesCompleted: 3,
      focusSessions: 2,
      createdAt: new Date().toISOString(),
    };
    activateScholarSession(demoProfile);
    setTimeout(() => {
      router.push("/");
    }, 450);
  }

  // Returning user Sign In
  function handleSignInSubmit(e?: React.FormEvent) {
    if (e) e.preventDefault();
    if (!signInName.trim()) return;

    playSound("success");
    setLoading(true);

    if (savedScholar && savedScholar.name.toLowerCase() === signInName.trim().toLowerCase()) {
      activateScholarSession(savedScholar);
    } else {
      const returningProfile: ScholarProfile = {
        name: signInName.trim(),
        avatar: BOY_PROFILE.avatar,
        tagline: "The Dedicated Scholar",
        gender: "boy",
        studentClass: "Class 12 (Science)",
        board: "CBSE",
        school: "Scholar Academy",
        xp: 20,
        quizzesCompleted: 1,
        focusSessions: 1,
        createdAt: new Date().toISOString(),
      };
      activateScholarSession(returningProfile);
    }

    setTimeout(() => {
      router.push("/");
    }, 450);
  }

  // Create account final enter
  async function handleCreateAccount() {
    playSound("levelup");
    setLoading(true);
    if (typeof window !== "undefined") {
      localStorage.removeItem("studyflow_persisted_state");
    }

    const newScholar: ScholarProfile = {
      name: name.trim() || selectedProfile?.name || "Scholar",
      gender,
      studentClass,
      board,
      school,
      avatar: selectedProfile?.avatar ?? BOY_PROFILE.avatar,
      tagline: selectedProfile?.tagline ?? "Scholar Champion",
      xp: 15, // Starter bonus
      quizzesCompleted: 0,
      focusSessions: 0,
      createdAt: new Date().toISOString(),
    };

    activateScholarSession(newScholar);

    await new Promise((r) => setTimeout(r, 500));
    router.push("/");
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-10 relative selection:bg-primary selection:text-on-primary">
      {/* Ambient background decoration */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-secondary/10 blur-[120px]" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Brand Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-6"
        >
          <div className="inline-flex items-center gap-2 mb-2">
            <span className="text-primary text-3xl animate-pulse">✦</span>
            <span className="font-headline text-3xl font-bold text-on-surface tracking-tight">StudyFlow AI</span>
          </div>
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-container text-on-primary-container text-xs font-label font-bold tracking-wide shadow-xs">
              <Zap size={13} className="text-primary" /> Revision Dojo &amp; AI Scholar Portal
            </span>
          </div>
        </motion.div>

        {/* Main Authentication Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-3xl border border-outline-variant bg-surface/95 backdrop-blur-xl shadow-2xl shadow-black/5 overflow-hidden"
        >
          {/* Top Auth Mode Tabs */}
          <div className="grid grid-cols-2 p-1.5 bg-surface-container-low border-b border-outline-variant">
            <button
              type="button"
              id="tab-create-account"
              onClick={() => {
                playSound("click");
                setAuthMode("create");
              }}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-2xl text-xs font-label font-bold transition-all cursor-pointer ${
                authMode === "create"
                  ? "bg-surface text-primary shadow-sm border border-outline-variant/60"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              <UserPlus size={15} /> Create Account
            </button>
            <button
              type="button"
              id="tab-sign-in"
              onClick={() => {
                playSound("click");
                setAuthMode("signin");
              }}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-2xl text-xs font-label font-bold transition-all cursor-pointer ${
                authMode === "signin"
                  ? "bg-surface text-primary shadow-sm border border-outline-variant/60"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              <LogIn size={15} /> Sign In
            </button>
          </div>

          <div className="p-6">
            {/* ─────────────────────────────────────────────────────────────
                MODE A: SIGN IN (For returning users)
               ───────────────────────────────────────────────────────────── */}
            {authMode === "signin" && (
              <motion.div
                key="signin-panel"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-5"
              >
                <div>
                  <h2 className="font-headline text-lg font-bold text-on-surface">Welcome Back, Scholar</h2>
                  <p className="text-xs font-label text-on-surface-variant mt-0.5">
                    Sign in to resume your active study sessions, quizzes, and XP.
                  </p>
                </div>

                {/* If there is a remembered scholar on this device, show quick resume card */}
                {savedScholar && (
                  <div className="p-3.5 rounded-2xl bg-surface-container-low border border-outline-variant flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <Avatar className="w-11 h-11 ring-2 ring-primary/30 ring-offset-1 ring-offset-background shrink-0">
                        <AvatarImage src={savedScholar.avatar} alt={savedScholar.name} />
                        <AvatarFallback className="text-xs font-bold bg-primary-container text-on-primary-container">
                          {getInitials(savedScholar.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="text-xs font-label font-bold text-on-surface truncate">{savedScholar.name}</p>
                        <p className="text-[11px] font-label text-on-surface-variant truncate">
                          {savedScholar.studentClass || "Scholar"} · {savedScholar.xp || 0} XP
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setSignInName(savedScholar.name);
                        handleSignInSubmit();
                      }}
                      disabled={loading}
                      className="px-3 py-1.5 rounded-xl bg-primary text-on-primary text-xs font-label font-bold hover:opacity-90 active:scale-95 transition-all shrink-0 cursor-pointer"
                    >
                      Resume
                    </button>
                  </div>
                )}

                <form onSubmit={handleSignInSubmit} className="space-y-4">
                  <StyledInput
                    id="signin-username"
                    label="Scholar Username / Full Name"
                    icon={<Sparkles size={12} />}
                    value={signInName}
                    onChange={setSignInName}
                    placeholder="Enter your registered name..."
                  />

                  <button
                    type="submit"
                    id="signin-submit-btn"
                    disabled={!signInName.trim() || loading}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-on-primary font-label font-bold text-sm shadow-md hover:opacity-95 active:scale-[0.99] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <span>Opening Study Dojo…</span>
                    ) : (
                      <>
                        <Zap size={16} /> Sign In &amp; Open Dojo
                      </>
                    )}
                  </button>
                </form>
              </motion.div>
            )}

            {/* ─────────────────────────────────────────────────────────────
                MODE B: CREATE ACCOUNT (Step-by-Step for new students)
               ───────────────────────────────────────────────────────────── */}
            {authMode === "create" && (
              <motion.div
                key="create-panel"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-5"
              >
                {/* Step indicator */}
                <div className="flex items-center justify-between mb-1">
                  <div>
                    <span className="text-[11px] font-label font-bold text-primary uppercase tracking-widest">
                      Step {createStep === "identity" ? "1" : createStep === "details" ? "2" : "3"} of 3
                    </span>
                    <h2 className="font-headline text-lg font-bold text-on-surface">
                      {createStep === "identity" && "Choose Your Scholar Avatar"}
                      {createStep === "details" && "Your Academic Arena"}
                      {createStep === "ready" && "Ready to Enter Dojo"}
                    </h2>
                  </div>
                  <div className="flex gap-1">
                    {(["identity", "details", "ready"] as CreateStep[]).map((s, idx) => (
                      <div
                        key={s}
                        className={`w-5 h-1.5 rounded-full transition-all duration-300 ${
                          ["identity", "details", "ready"].indexOf(createStep) >= idx
                            ? "bg-primary"
                            : "bg-outline-variant"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* STEP 1: Avatar & Name */}
                {createStep === "identity" && (
                  <motion.div
                    key="step-identity"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-2 gap-3">
                      <GenderCard type="boy" selected={gender === "boy"} onSelect={() => setGender("boy")} />
                      <GenderCard type="girl" selected={gender === "girl"} onSelect={() => setGender("girl")} />
                    </div>

                    <StyledInput
                      id="student-name-input"
                      label="Your Name / Nickname"
                      icon={<Sparkles size={12} />}
                      value={name}
                      onChange={setName}
                      placeholder={gender === "girl" ? "e.g. Maya, Sarah, Ananya…" : "e.g. Ankit, Alex, Arjun…"}
                    />

                    <button
                      type="button"
                      id="step1-continue-btn"
                      disabled={!canProceedStep1()}
                      onClick={() => {
                        playSound("click");
                        setCreateStep("details");
                      }}
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-on-primary font-label font-bold text-sm hover:opacity-95 active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer shadow-md"
                    >
                      Continue <ArrowRight size={15} />
                    </button>
                  </motion.div>
                )}

                {/* STEP 2: Academic Details */}
                {createStep === "details" && (
                  <motion.div
                    key="step-details"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-4"
                  >
                    <StyledSelect
                      id="student-class"
                      label="Class / Grade / Year"
                      icon={<GraduationCap size={12} />}
                      options={CLASSES}
                      value={studentClass}
                      onChange={setStudentClass}
                      placeholder="Select your class / standard…"
                    />

                    <StyledSelect
                      id="student-board"
                      label="Curriculum / Board"
                      icon={<BookOpen size={12} />}
                      options={BOARDS}
                      value={board}
                      onChange={setBoard}
                      placeholder="Select your exam board…"
                    />

                    <StyledInput
                      id="student-school"
                      label="School / Institution Name"
                      icon={<School size={12} />}
                      value={school}
                      onChange={setSchool}
                      placeholder="e.g. St. Xavier's, DPS, City High…"
                    />

                    <div className="flex gap-2.5 pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          playSound("click");
                          setCreateStep("identity");
                        }}
                        className="flex-1 py-3 rounded-xl border border-outline-variant text-on-surface-variant font-label font-bold text-xs hover:bg-surface-container transition-colors cursor-pointer"
                      >
                        ← Back
                      </button>
                      <button
                        type="button"
                        id="step2-continue-btn"
                        disabled={!canProceedStep2()}
                        onClick={() => {
                          playSound("click");
                          setCreateStep("ready");
                        }}
                        className="flex-2 flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-on-primary font-label font-bold text-sm hover:opacity-95 active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer shadow-md"
                      >
                        Review Profile <ArrowRight size={15} />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* STEP 3: Ready to Enter */}
                {createStep === "ready" && (
                  <motion.div
                    key="step-ready"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-4 text-center"
                  >
                    <div className="flex flex-col items-center">
                      <div className="relative">
                        <Avatar className="w-20 h-20 ring-4 ring-primary/40 ring-offset-2 ring-offset-background shadow-lg">
                          <AvatarImage src={selectedProfile?.avatar} alt={name} />
                          <AvatarFallback className="text-lg font-bold">{getInitials(name)}</AvatarFallback>
                        </Avatar>
                        <div className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-full bg-primary text-on-primary text-[10px] font-bold shadow">
                          Lv. 1
                        </div>
                      </div>
                      <h3 className="font-headline text-lg font-bold text-on-surface mt-2">{name}</h3>
                      <p className="text-xs font-label text-on-surface-variant">
                        {studentClass} · {board || "General"} · {school}
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant space-y-1 text-left">
                      <div className="flex justify-between text-xs font-label text-on-surface-variant font-medium">
                        <span className="flex items-center gap-1">
                          <Shield size={12} className="text-primary" /> Starter Bonus XP
                        </span>
                        <span className="font-bold text-primary">15 XP</span>
                      </div>
                      <XPBar value={15} />
                    </div>

                    <div className="flex gap-2.5 pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          playSound("click");
                          setCreateStep("details");
                        }}
                        className="flex-1 py-3 rounded-xl border border-outline-variant text-on-surface-variant font-label font-bold text-xs hover:bg-surface-container transition-colors cursor-pointer"
                      >
                        ← Edit
                      </button>
                      <button
                        type="button"
                        id="create-account-btn"
                        onClick={handleCreateAccount}
                        disabled={loading}
                        className="flex-2 flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-on-primary font-label font-bold text-sm hover:opacity-95 active:scale-[0.99] transition-all cursor-pointer shadow-md disabled:opacity-80"
                      >
                        {loading ? (
                          <span>Entering Dojo…</span>
                        ) : (
                          <>
                            <Zap size={16} /> Enter the Dojo
                          </>
                        )}
                      </button>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* ─────────────────────────────────────────────────────────────
                BOTTOM SECTION: 1-CLICK INSTANT DEMO EVALUATION
               ───────────────────────────────────────────────────────────── */}
            <div className="mt-6 pt-5 border-t border-outline-variant">
              <p className="text-[11px] font-label font-bold text-on-surface-variant uppercase tracking-wider mb-2.5 text-center flex items-center justify-center gap-1">
                <span>⚡</span> 1-Click Instant Demo Evaluation
              </p>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  id="demo-ankit-btn"
                  onClick={() => handleQuickDemo("ankit")}
                  disabled={loading}
                  className="p-3 rounded-2xl border border-outline-variant bg-surface-container-low hover:bg-surface-container hover:border-primary/50 text-xs font-label text-on-surface flex flex-col items-center gap-1 transition-all text-center cursor-pointer active:scale-95 group"
                >
                  <span className="text-primary font-bold group-hover:scale-105 transition-transform flex items-center gap-1">
                    ⚡ Ankit Pradhan
                  </span>
                  <span className="text-[10px] text-on-surface-variant">Class 12 · CBSE (Science)</span>
                </button>

                <button
                  type="button"
                  id="demo-maya-btn"
                  onClick={() => handleQuickDemo("maya")}
                  disabled={loading}
                  className="p-3 rounded-2xl border border-outline-variant bg-surface-container-low hover:bg-surface-container hover:border-secondary/50 text-xs font-label text-on-surface flex flex-col items-center gap-1 transition-all text-center cursor-pointer active:scale-95 group"
                >
                  <span className="text-secondary font-bold group-hover:scale-105 transition-transform flex items-center gap-1">
                    ⚡ Maya Chen
                  </span>
                  <span className="text-[10px] text-on-surface-variant">Class 12 · ICSE / ISC</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Footer Note */}
        <p className="text-center text-xs font-label text-on-surface-variant mt-5 opacity-80">
          Privacy First: Your academic notes and profile stay in your browser. ✦
        </p>
      </div>
    </div>
  );
}
