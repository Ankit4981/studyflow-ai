"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Timer, X, Play, Pause, RotateCcw, Award } from "lucide-react";
import { playSound } from "@/lib/audioEffects";
import { triggerConfetti } from "@/lib/confetti";
import { SCHOLAR_KEY } from "@/app/login/page";
import { notifyScholarUpdated } from "@/lib/hooks/useScholar";

interface FocusTimerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type TimerMode = "pomodoro" | "deep" | "shortBreak" | "longBreak";
type AmbientSound = "none" | "binaural" | "whitenoise" | "rain";

const MODE_DURATIONS: Record<TimerMode, number> = {
  pomodoro: 25 * 60,
  deep: 50 * 60,
  shortBreak: 5 * 60,
  longBreak: 10 * 60,
};

function createAmbientAudio(ctx: AudioContext, track: AmbientSound): { stop: () => void } | null {
  if (track === "binaural") {
    // Binaural beat: 200 Hz left, 240 Hz right (40Hz Gamma focus wave)
    const oscL = ctx.createOscillator();
    const oscR = ctx.createOscillator();
    const merger = ctx.createChannelMerger(2);
    const gain = ctx.createGain();

    oscL.type = "sine";
    oscR.type = "sine";
    oscL.frequency.value = 200;
    oscR.frequency.value = 240;

    gain.gain.value = 0.08;

    oscL.connect(merger, 0, 0);
    oscR.connect(merger, 0, 1);
    merger.connect(gain);
    gain.connect(ctx.destination);

    oscL.start();
    oscR.start();

    return {
      stop: () => {
        try {
          oscL.stop();
          oscR.stop();
        } catch { /* ignore */ }
      },
    };
  }

  if (track === "whitenoise" || track === "rain") {
    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * (track === "rain" ? 0.3 : 0.15);
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = track === "rain" ? "lowpass" : "bandpass";
    filter.frequency.value = track === "rain" ? 800 : 1200;

    const gain = ctx.createGain();
    gain.gain.value = 0.06;

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start();

    return {
      stop: () => {
        try {
          noise.stop();
        } catch { /* ignore */ }
      },
    };
  }

  return null;
}

export function FocusTimerModal({ isOpen, onClose }: FocusTimerModalProps) {
  const [mode, setMode] = useState<TimerMode>("pomodoro");
  const [timeLeft, setTimeLeft] = useState(MODE_DURATIONS.pomodoro);
  const [isRunning, setIsRunning] = useState(false);
  const [ambient, setAmbient] = useState<AmbientSound>("none");
  const [completedSessions, setCompletedSessions] = useState(0);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const ambientNodeRef = useRef<{ stop: () => void } | null>(null);

  // Switch mode
  function selectMode(newMode: TimerMode) {
    playSound("click");
    setIsRunning(false);
    setMode(newMode);
    setTimeLeft(MODE_DURATIONS[newMode]);
  }

  const handleSessionComplete = useCallback(() => {
    setIsRunning(false);
    playSound("levelup");
    triggerConfetti();
    setCompletedSessions((s) => s + 1);

    // Award +50 XP
    if (mode === "pomodoro" || mode === "deep") {
      try {
        const raw = localStorage.getItem(SCHOLAR_KEY);
        if (raw) {
          const scholar = JSON.parse(raw);
          scholar.xp = (scholar.xp || 350) + 50;
          scholar.focusSessions = (scholar.focusSessions || 0) + 1;
          localStorage.setItem(SCHOLAR_KEY, JSON.stringify(scholar));
          notifyScholarUpdated();
        }
      } catch { /* ignore */ }
    }
  }, [mode]);

  // Timer tick
  useEffect(() => {
    if (isRunning && isOpen) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleSessionComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, isOpen, handleSessionComplete]);

  // Ambient sound synthesizer
  function setAmbientTrack(track: AmbientSound) {
    playSound("click");
    if (ambientNodeRef.current) {
      ambientNodeRef.current.stop();
      ambientNodeRef.current = null;
    }

    if (track === "none") {
      setAmbient("none");
      return;
    }

    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      if (!audioCtxRef.current) audioCtxRef.current = new AudioCtx();
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") ctx.resume();

      const node = createAmbientAudio(ctx, track);
      ambientNodeRef.current = node;
      setAmbient(track);
    } catch {
      setAmbient("none");
    }
  }

  // Clean up ambient audio on modal close
  useEffect(() => {
    if (!isOpen && ambientNodeRef.current) {
      ambientNodeRef.current.stop();
      ambientNodeRef.current = null;
      setAmbient("none");
    }
  }, [isOpen]);

  const totalDuration = MODE_DURATIONS[mode];
  const progressPercent = ((totalDuration - timeLeft) / totalDuration) * 100;
  const strokeDashoffset = 283 - (283 * progressPercent) / 100;

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const formattedTime = `${mins}:${secs < 10 ? "0" : ""}${secs}`;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-md"
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            initial={{ scale: 0.92, y: 16, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.94, y: 8, opacity: 0 }}
            className="w-full max-w-md rounded-3xl border border-outline-variant bg-surface p-6 sm:p-8 shadow-2xl space-y-6 text-center"
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Timer size={18} className="text-primary" />
                <span className="text-xs font-label font-bold text-on-surface uppercase tracking-wider">
                  Dojo Focus Lounge
                </span>
                {completedSessions > 0 && (
                  <span className="text-[10px] font-label font-bold px-2 py-0.5 rounded-full bg-primary-container text-on-primary-container">
                    {completedSessions} done
                  </span>
                )}
              </div>
              <button
                id="close-focus-timer-btn"
                onClick={onClose}
                className="p-1.5 rounded-full text-on-surface-variant hover:bg-surface-container transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Mode Tabs */}
            <div className="flex rounded-2xl border border-outline-variant bg-surface-container-low p-1 text-xs font-label font-bold">
              {[
                { id: "pomodoro", label: "25m Focus" },
                { id: "deep", label: "50m Deep" },
                { id: "shortBreak", label: "5m Break" },
                { id: "longBreak", label: "10m Rest" },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => selectMode(m.id as TimerMode)}
                  className={`flex-1 py-2 rounded-xl transition-all ${
                    mode === m.id
                      ? "bg-surface text-on-surface shadow-xs"
                      : "text-on-surface-variant hover:text-on-surface"
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>

            {/* Circular Timer Visual */}
            <div className="relative w-52 h-52 mx-auto flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  className="stroke-surface-container"
                  strokeWidth="6"
                  fill="transparent"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  className="stroke-primary transition-all duration-500"
                  strokeWidth="6"
                  fill="transparent"
                  strokeDasharray="283"
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-headline text-4xl sm:text-5xl font-bold text-on-surface tracking-tight">
                  {formattedTime}
                </span>
                <span className="text-[11px] font-label font-semibold text-primary uppercase tracking-widest mt-1">
                  {isRunning ? "Focusing..." : "Ready"}
                </span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => {
                  playSound("click");
                  setIsRunning((r) => !r);
                }}
                className={`flex items-center gap-2 px-8 py-3 rounded-2xl font-label font-bold text-sm shadow-md transition-all ${
                  isRunning
                    ? "bg-surface-container text-on-surface hover:bg-surface-container-high"
                    : "bg-primary text-on-primary hover:opacity-90 active:scale-98"
                }`}
              >
                {isRunning ? <><Pause size={16} /> Pause</> : <><Play size={16} /> Start Focus</>}
              </button>
              <button
                onClick={() => {
                  playSound("click");
                  setIsRunning(false);
                  setTimeLeft(MODE_DURATIONS[mode]);
                }}
                title="Reset timer"
                className="p-3 rounded-2xl border border-outline-variant text-on-surface-variant hover:bg-surface-container transition-colors"
              >
                <RotateCcw size={16} />
              </button>
            </div>

            {/* Ambient Sound Synthesizer Chips */}
            <div className="space-y-2 pt-2 border-t border-outline-variant">
              <div className="flex items-center justify-between text-xs font-label">
                <span className="text-on-surface-variant font-semibold">Synthesized Ambience</span>
                <span className="text-[11px] text-primary font-bold">{ambient !== "none" ? "Playing" : "Muted"}</span>
              </div>

              <div className="grid grid-cols-4 gap-1.5 text-[11px] font-label font-semibold">
                {[
                  { id: "none", label: "Off" },
                  { id: "binaural", label: "🧠 40Hz" },
                  { id: "rain", label: "🌧️ Rain" },
                  { id: "whitenoise", label: "📻 Noise" },
                ].map((track) => (
                  <button
                    key={track.id}
                    onClick={() => setAmbientTrack(track.id as AmbientSound)}
                    className={`py-1.5 px-2 rounded-xl border transition-all ${
                      ambient === track.id
                        ? "border-primary bg-primary-container text-on-primary-container"
                        : "border-outline-variant bg-surface-container-low text-on-surface-variant hover:bg-surface-container"
                    }`}
                  >
                    {track.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Scholar XP Banner */}
            <div className="flex items-center justify-between px-4 py-2.5 rounded-2xl bg-secondary-container/60 text-on-secondary-container text-xs font-label font-bold">
              <div className="flex items-center gap-1.5">
                <Award size={14} className="text-secondary" />
                <span>Session Reward</span>
              </div>
              <span>+50 Scholar XP</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
