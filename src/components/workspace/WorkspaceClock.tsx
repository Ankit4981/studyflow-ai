"use client";

import { useEffect, useState, useMemo } from "react";
import {
  Clock as ClockIcon,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Sun,
  Moon,
  Compass,
  Zap,
} from "lucide-react";
import { playSound } from "@/lib/audioEffects";
import { awardScholarXP } from "@/lib/hooks/useScholar";

interface WorkspaceClockProps {
  scholarName?: string;
}

type ClockMode = "digital" | "analog";

export function WorkspaceClock({ scholarName = "Scholar" }: WorkspaceClockProps) {
  const [time, setTime] = useState<Date>(() => new Date());
  const [is24Hour, setIs24Hour] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    try {
      return localStorage.getItem("studyflow_clock_24h") === "true";
    } catch {
      return false;
    }
  });
  const [mode, setMode] = useState<ClockMode>(() => {
    if (typeof window === "undefined") return "digital";
    try {
      const stored = localStorage.getItem("studyflow_clock_mode") as ClockMode | null;
      if (stored === "digital" || stored === "analog") return stored;
    } catch {
      /* ignore */
    }
    return "digital";
  });

  // Focus Stopwatch state
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [sessionXPClaimed, setSessionXPClaimed] = useState(false);

  // Live timer interval (updates asynchronously in callback)
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Focus stopwatch interval
  useEffect(() => {
    if (!isTimerRunning) return;
    const interval = setInterval(() => {
      setElapsedSeconds((s) => {
        const next = s + 1;
        // Award +10 XP at 25 minutes (1500 seconds) milestone
        if (next === 1500 && !sessionXPClaimed) {
          awardScholarXP(10);
          setSessionXPClaimed(true);
          playSound("levelup");
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isTimerRunning, sessionXPClaimed]);

  function toggle24Hour() {
    playSound("click");
    setIs24Hour((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("studyflow_clock_24h", String(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  }

  function toggleMode(newMode: ClockMode) {
    playSound("click");
    setMode(newMode);
    try {
      localStorage.setItem("studyflow_clock_mode", newMode);
    } catch {
      /* ignore */
    }
  }

  function toggleStopwatch() {
    playSound("click");
    setIsTimerRunning((prev) => !prev);
  }

  function resetStopwatch() {
    playSound("click");
    setIsTimerRunning(false);
    setElapsedSeconds(0);
    setSessionXPClaimed(false);
  }

  // Formatting helpers
  const hours = time ? time.getHours() : 12;
  const minutes = time ? time.getMinutes() : 0;
  const seconds = time ? time.getSeconds() : 0;

  const displayHours = useMemo(() => {
    if (is24Hour) {
      return String(hours).padStart(2, "0");
    }
    const h = hours % 12 || 12;
    return String(h).padStart(2, "0");
  }, [hours, is24Hour]);

  const displayMinutes = String(minutes).padStart(2, "0");
  const displaySeconds = String(seconds).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";

  // Circadian Study Insights & Greeting
  const { greeting, insight, icon: TimeIcon } = useMemo(() => {
    if (hours >= 5 && hours < 12) {
      return {
        greeting: `Good morning, ${scholarName}`,
        insight: "🌅 Morning Clarity — Prime cognitive window for active recall & difficult concepts.",
        icon: Sun,
      };
    } else if (hours >= 12 && hours < 17) {
      return {
        greeting: `Good afternoon, ${scholarName}`,
        insight: "☀️ Solar Focus — High analytical energy for problem solving & micro-tasks.",
        icon: Zap,
      };
    } else if (hours >= 17 && hours < 22) {
      return {
        greeting: `Good evening, ${scholarName}`,
        insight: "🌆 Sunset Synthesis — Ideal for note revision, memory consolidation & quiz drills.",
        icon: Sparkles,
      };
    } else {
      return {
        greeting: `Midnight Dojo, ${scholarName}`,
        insight: "🌙 Night Owl Flow — Distraction-free deep work. Keep your mind calm & stay hydrated.",
        icon: Moon,
      };
    }
  }, [hours, scholarName]);

  const formattedDate = useMemo(() => {
    if (!time) return "Loading date...";
    return time.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }, [time]);

  // Stopwatch formatted string
  const swMinutes = Math.floor(elapsedSeconds / 60);
  const swSeconds = elapsedSeconds % 60;
  const formattedStopwatch = `${String(swMinutes).padStart(2, "0")}:${String(swSeconds).padStart(2, "0")}`;

  // Analog angles
  const secAngle = seconds * 6;
  const minAngle = minutes * 6 + seconds * 0.1;
  const hrAngle = (hours % 12) * 30 + minutes * 0.5;

  return (
    <div className="w-full bg-surface/95 backdrop-blur-md border border-outline-variant rounded-2xl p-5 md:p-6 mb-8 shadow-xs relative overflow-hidden transition-all">
      {/* Subtle ambient gradient highlights */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/5 rounded-full blur-3xl pointer-events-none -ml-16 -mb-16" />

      <div className="relative z-10 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-6">
        {/* Left: Greeting, Date & Circadian Insight */}
        <div className="flex flex-col gap-2 min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-primary-container text-on-primary-container">
              <TimeIcon size={14} className="animate-pulse" />
            </span>
            <span className="text-xs font-label font-bold text-primary uppercase tracking-wider">
              {greeting}
            </span>
          </div>

          <h2 className="font-headline text-xl sm:text-2xl font-bold text-on-surface tracking-tight">
            {formattedDate}
          </h2>

          <p className="text-xs font-label text-on-surface-variant flex items-center gap-1.5 line-clamp-1">
            <Compass size={13} className="text-secondary shrink-0" />
            <span>{insight}</span>
          </p>
        </div>

        {/* Center/Right: Clock View */}
        <div className="flex flex-col sm:flex-row items-center gap-5 lg:gap-8 justify-end">
          {/* Main Clock Display */}
          {mode === "digital" ? (
            <div className="flex items-baseline gap-2 bg-surface-container-low px-4 py-3 rounded-2xl border border-outline-variant shadow-xs">
              <div className="font-headline text-3xl sm:text-4xl font-extrabold text-on-surface tracking-wider select-none tabular-nums flex items-baseline">
                <span>{displayHours}</span>
                <span className="text-primary animate-pulse mx-0.5">:</span>
                <span>{displayMinutes}</span>
              </div>
              <div className="flex flex-col items-start leading-none gap-0.5">
                <span className="text-xs font-mono font-bold text-primary tabular-nums">
                  .{displaySeconds}
                </span>
                {!is24Hour && (
                  <span className="text-[10px] font-label font-bold uppercase tracking-widest text-on-surface-variant">
                    {ampm}
                  </span>
                )}
              </div>
            </div>
          ) : (
            /* Analog Radial Dial Clock */
            <div className="relative w-20 h-20 bg-surface-container-low rounded-full border-2 border-outline-variant shadow-xs flex items-center justify-center shrink-0">
              {/* Dial tick marks */}
              <div className="absolute inset-1 rounded-full border border-dashed border-outline-variant/50" />

              {/* Hour Hand */}
              <div
                className="absolute w-1 bg-on-surface rounded-full origin-bottom"
                style={{
                  height: "22px",
                  bottom: "50%",
                  transform: `rotate(${hrAngle}deg)`,
                  transformOrigin: "50% 100%",
                }}
              />

              {/* Minute Hand */}
              <div
                className="absolute w-0.5 bg-on-surface-variant rounded-full origin-bottom"
                style={{
                  height: "28px",
                  bottom: "50%",
                  transform: `rotate(${minAngle}deg)`,
                  transformOrigin: "50% 100%",
                }}
              />

              {/* Second Hand (Terracotta Primary) */}
              <div
                className="absolute w-0.5 bg-primary rounded-full origin-bottom shadow-xs"
                style={{
                  height: "32px",
                  bottom: "50%",
                  transform: `rotate(${secAngle}deg)`,
                  transformOrigin: "50% 100%",
                }}
              />

              {/* Center Pivot Jewel */}
              <div className="w-2.5 h-2.5 rounded-full bg-primary border-2 border-surface z-10 shadow-xs" />
            </div>
          )}

          {/* Quick Focus Stopwatch & Mode Controls */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 sm:border-l border-outline-variant/60 pt-3 sm:pt-0 sm:pl-6">
            {/* Stopwatch pill */}
            <div className="flex items-center gap-2 bg-surface-container-low px-3 py-1.5 rounded-xl border border-outline-variant">
              <div className="flex flex-col">
                <span className="text-[10px] font-label font-bold text-on-surface-variant uppercase tracking-wider">
                  Session Timer
                </span>
                <span
                  className={`font-mono text-xs font-bold tabular-nums ${
                    isTimerRunning ? "text-primary animate-pulse" : "text-on-surface"
                  }`}
                >
                  {formattedStopwatch}
                </span>
              </div>

              <div className="flex items-center gap-1 ml-1">
                <button
                  type="button"
                  onClick={toggleStopwatch}
                  title={isTimerRunning ? "Pause Session" : "Start Session"}
                  className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                    isTimerRunning
                      ? "bg-primary text-on-primary shadow-xs"
                      : "bg-surface text-on-surface hover:bg-surface-container border border-outline-variant"
                  }`}
                >
                  {isTimerRunning ? <Pause size={12} /> : <Play size={12} className="ml-0.5" />}
                </button>
                {elapsedSeconds > 0 && (
                  <button
                    type="button"
                    onClick={resetStopwatch}
                    title="Reset Session Timer"
                    className="w-7 h-7 rounded-lg flex items-center justify-center bg-surface text-on-surface-variant hover:text-error hover:bg-error-container/40 border border-outline-variant transition-all cursor-pointer"
                  >
                    <RotateCcw size={11} />
                  </button>
                )}
              </div>
            </div>

            {/* Mode & 24h Toggles */}
            <div className="flex items-center gap-1 bg-surface-container-low p-1 rounded-xl border border-outline-variant">
              <button
                type="button"
                onClick={() => toggleMode(mode === "digital" ? "analog" : "digital")}
                title={`Switch to ${mode === "digital" ? "Analog Dial" : "Digital"} View`}
                className="px-2.5 py-1.5 rounded-lg text-xs font-label font-semibold text-on-surface-variant hover:text-on-surface hover:bg-surface transition-all flex items-center gap-1 cursor-pointer"
              >
                <ClockIcon size={12} />
                <span className="capitalize">{mode === "digital" ? "Analog" : "Digital"}</span>
              </button>
              <button
                type="button"
                onClick={toggle24Hour}
                title="Toggle 12h / 24h format"
                className={`px-2 py-1.5 rounded-lg text-[11px] font-mono font-bold transition-all cursor-pointer ${
                  is24Hour
                    ? "bg-primary text-on-primary shadow-xs"
                    : "text-on-surface-variant hover:bg-surface hover:text-on-surface"
                }`}
              >
                {is24Hour ? "24H" : "12H"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
