"use client";

import { useState, useEffect } from "react";
import {
  Eye, Volume2, Sparkles, Moon, Sun,
  Sliders, Keyboard, Play, Square, Move
} from "lucide-react";
import { useAppState } from "@/lib/state/AppStateContext";
import { playSound } from "@/lib/audioEffects";

export default function AccessibilityPage() {
  const { accessibility, updateAccessibility } = useAppState();

  // Local TTS state
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceIndex, setSelectedVoiceIndex] = useState(0);
  const [speechRate, setSpeechRate] = useState(1.0);
  const [speechPitch, setSpeechPitch] = useState(1.0);
  const [isPlayingTest, setIsPlayingTest] = useState(false);

  // Local visual tweaks
  const [largeText, setLargeText] = useState(false);
  const [extraLineHeight, setExtraLineHeight] = useState(false);
  const [readingRulerY, setReadingRulerY] = useState(120);
  const [isRulerActive, setIsRulerActive] = useState(false);

  // Load available speech voices
  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    function loadVoices() {
      const available = window.speechSynthesis.getVoices();
      setVoices(available);
    }

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  function handleTestSpeech(text: string) {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    if (isPlayingTest) {
      window.speechSynthesis.cancel();
      setIsPlayingTest(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    if (voices[selectedVoiceIndex]) {
      utterance.voice = voices[selectedVoiceIndex];
    }
    utterance.rate = speechRate;
    utterance.pitch = speechPitch;
    utterance.onend = () => setIsPlayingTest(false);
    utterance.onerror = () => setIsPlayingTest(false);

    window.speechSynthesis.speak(utterance);
    setIsPlayingTest(true);
    playSound("click");
  }

  const isDark = accessibility.theme === "dark";

  return (
    <div className="flex flex-col w-full px-6 md:px-10 py-8 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-outline-variant pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-label font-bold text-primary uppercase tracking-wider mb-1">
            <Sliders size={14} /> Universal Design
          </div>
          <h1 className="font-headline text-2xl md:text-3xl font-bold text-on-surface">
            Accessibility & Study Comfort
          </h1>
          <p className="text-sm font-label text-on-surface-variant mt-1">
            Customize typography, motion, text-to-speech audio, and focus reading tools tailored to your unique learning style.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              playSound("click");
              updateAccessibility({
                dyslexiaFont: false,
                reducedMotion: false,
                focusReading: false,
                theme: "light",
              });
              setLargeText(false);
              setExtraLineHeight(false);
              setIsRulerActive(false);
            }}
            className="px-4 py-2 rounded-xl border border-outline-variant bg-surface hover:bg-surface-container text-xs font-label font-semibold text-on-surface-variant transition-colors"
          >
            Reset to Defaults
          </button>
        </div>
      </div>

      {/* Grid: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Visual & Reading Controls */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Visual Comfort Card */}
          <div className="rounded-3xl border border-outline-variant bg-surface p-6 space-y-5 shadow-xs">
            <div className="flex items-center gap-2.5 pb-2 border-b border-outline-variant/60">
              <Eye size={18} className="text-primary" />
              <h2 className="font-headline font-bold text-base text-on-surface">Visual & Typography</h2>
            </div>

            {/* Theme Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-label font-semibold text-on-surface">Theme Mode</p>
                <p className="text-xs font-label text-on-surface-variant">Switch between daylight and high-contrast night palette</p>
              </div>
              <button
                onClick={() => {
                  playSound("click");
                  updateAccessibility({ theme: isDark ? "light" : "dark" });
                }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-label text-xs font-bold transition-all ${
                  isDark
                    ? "bg-primary-container text-on-primary-container border border-primary/30"
                    : "bg-surface-container text-on-surface border border-outline-variant"
                }`}
              >
                {isDark ? <><Moon size={14} /> Dark</> : <><Sun size={14} /> Light</>}
              </button>
            </div>

            {/* Dyslexia-Friendly Font */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-label font-semibold text-on-surface">Dyslexia-Friendly Reading</p>
                <p className="text-xs font-label text-on-surface-variant">Enhanced character distinction and bottom-weighted letter shapes</p>
              </div>
              <button
                onClick={() => {
                  playSound("click");
                  updateAccessibility({ dyslexiaFont: !accessibility.dyslexiaFont });
                }}
                className={`relative w-12 h-6.5 rounded-full transition-colors ${
                  accessibility.dyslexiaFont ? "bg-primary" : "bg-surface-container-high"
                }`}
              >
                <span
                  className={`absolute top-1 left-1 w-4.5 h-4.5 rounded-full bg-white transition-transform ${
                    accessibility.dyslexiaFont ? "translate-x-5.5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* Larger Text */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-label font-semibold text-on-surface">Comfort Text Sizing (+15%)</p>
                <p className="text-xs font-label text-on-surface-variant">Increases reading scale across summary and explanations</p>
              </div>
              <button
                onClick={() => {
                  playSound("click");
                  setLargeText((v) => !v);
                }}
                className={`relative w-12 h-6.5 rounded-full transition-colors ${
                  largeText ? "bg-primary" : "bg-surface-container-high"
                }`}
              >
                <span
                  className={`absolute top-1 left-1 w-4.5 h-4.5 rounded-full bg-white transition-transform ${
                    largeText ? "translate-x-5.5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* Extra Line Spacing */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-label font-semibold text-on-surface">Relaxed Line Spacing</p>
                <p className="text-xs font-label text-on-surface-variant">Adds vertical space between lines to prevent eye fatigue</p>
              </div>
              <button
                onClick={() => {
                  playSound("click");
                  setExtraLineHeight((v) => !v);
                }}
                className={`relative w-12 h-6.5 rounded-full transition-colors ${
                  extraLineHeight ? "bg-primary" : "bg-surface-container-high"
                }`}
              >
                <span
                  className={`absolute top-1 left-1 w-4.5 h-4.5 rounded-full bg-white transition-transform ${
                    extraLineHeight ? "translate-x-5.5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* Reduced Motion */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-label font-semibold text-on-surface">Reduced Motion</p>
                <p className="text-xs font-label text-on-surface-variant">Minimizes screen transitions and 3D card flips</p>
              </div>
              <button
                onClick={() => {
                  playSound("click");
                  updateAccessibility({ reducedMotion: !accessibility.reducedMotion });
                }}
                className={`relative w-12 h-6.5 rounded-full transition-colors ${
                  accessibility.reducedMotion ? "bg-primary" : "bg-surface-container-high"
                }`}
              >
                <span
                  className={`absolute top-1 left-1 w-4.5 h-4.5 rounded-full bg-white transition-transform ${
                    accessibility.reducedMotion ? "translate-x-5.5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Reading Focus Ruler Card */}
          <div className="rounded-3xl border border-outline-variant bg-surface p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between pb-2 border-b border-outline-variant/60">
              <div className="flex items-center gap-2.5">
                <Move size={18} className="text-primary" />
                <h2 className="font-headline font-bold text-base text-on-surface">Focus Reading Ruler</h2>
              </div>
              <button
                onClick={() => {
                  playSound("click");
                  setIsRulerActive((v) => !v);
                  updateAccessibility({ focusReading: !isRulerActive });
                }}
                className={`px-3 py-1.5 rounded-xl font-label text-xs font-bold transition-all ${
                  isRulerActive
                    ? "bg-primary text-on-primary"
                    : "bg-surface-container text-on-surface-variant hover:text-on-surface"
                }`}
              >
                {isRulerActive ? "Active" : "Turn On"}
              </button>
            </div>

            <p className="text-xs font-label text-on-surface-variant">
              The Focus Ruler highlights a single horizontal line of text while dimming the surroundings to assist students with ADHD or visual tracking difficulties.
            </p>

            {isRulerActive && (
              <div className="space-y-2 pt-2">
                <div className="flex justify-between text-xs font-label font-semibold text-on-surface">
                  <span>Ruler Position</span>
                  <span>{readingRulerY}px</span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="240"
                  value={readingRulerY}
                  onChange={(e) => setReadingRulerY(Number(e.target.value))}
                  className="w-full accent-primary cursor-pointer"
                />
              </div>
            )}
          </div>
        </div>

        {/* Right Column: TTS Voice Suite & Live Preview */}
        <div className="lg:col-span-6 space-y-6">

          {/* Text-To-Speech Suite Card */}
          <div className="rounded-3xl border border-outline-variant bg-surface p-6 space-y-5 shadow-xs">
            <div className="flex items-center gap-2.5 pb-2 border-b border-outline-variant/60">
              <Volume2 size={18} className="text-primary" />
              <h2 className="font-headline font-bold text-base text-on-surface">Text-To-Speech (TTS) Engine</h2>
            </div>

            {/* Voice selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-label font-semibold text-on-surface-variant uppercase tracking-wider">
                Auditory Voice
              </label>
              {voices.length > 0 ? (
                <select
                  value={selectedVoiceIndex}
                  onChange={(e) => setSelectedVoiceIndex(Number(e.target.value))}
                  className="w-full rounded-xl border border-outline-variant bg-surface px-3.5 py-2.5 text-xs font-label text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {voices.map((v, idx) => (
                    <option key={`${v.name}-${idx}`} value={idx}>
                      {v.name} ({v.lang})
                    </option>
                  ))}
                </select>
              ) : (
                <p className="text-xs font-label text-on-surface-variant bg-surface-container p-2.5 rounded-xl">
                  Standard system voice active.
                </p>
              )}
            </div>

            {/* Speech Rate Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-label font-semibold">
                <span className="text-on-surface">Pacing & Speech Rate</span>
                <span className="text-primary font-bold">{speechRate.toFixed(2)}x</span>
              </div>
              <input
                type="range"
                min="0.7"
                max="1.6"
                step="0.05"
                value={speechRate}
                onChange={(e) => setSpeechRate(Number(e.target.value))}
                className="w-full accent-primary cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-label text-on-surface-variant">
                <span>0.7x (Deliberate)</span>
                <span>1.0x (Normal)</span>
                <span>1.6x (Rapid)</span>
              </div>
            </div>

            {/* Speech Pitch Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-label font-semibold">
                <span className="text-on-surface">Voice Pitch</span>
                <span className="text-primary font-bold">{speechPitch.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.8"
                max="1.3"
                step="0.05"
                value={speechPitch}
                onChange={(e) => setSpeechPitch(Number(e.target.value))}
                className="w-full accent-primary cursor-pointer"
              />
            </div>

            {/* Test Voice Button */}
            <div className="pt-2">
              <button
                onClick={() =>
                  handleTestSpeech(
                    "Hello Scholar! This is StudyFlow AI. When you activate text-to-speech, your summaries, key takeaways, and flashcards will be spoken in this exact tone and pacing."
                  )
                }
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-primary-container text-on-primary-container font-label font-bold text-xs hover:opacity-90 transition-all shadow-xs"
              >
                {isPlayingTest ? (
                  <>
                    <Square size={14} className="text-primary" /> Stop Voice Test
                  </>
                ) : (
                  <>
                    <Play size={14} className="text-primary" /> Test TTS Voice Sample
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Interactive Live Sandbox Preview */}
          <div className="rounded-3xl border border-outline-variant bg-surface p-6 space-y-4 shadow-xs relative overflow-hidden">
            <div className="flex items-center justify-between pb-2 border-b border-outline-variant/60">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-primary" />
                <h3 className="font-headline font-bold text-sm text-on-surface">Live Typography Sandbox</h3>
              </div>
              <span className="text-[10px] font-label font-bold px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container">
                Real-Time Preview
              </span>
            </div>

            {/* Simulated Content Box with Ruler */}
            <div
              className={`relative rounded-2xl border border-outline-variant bg-surface-container-low p-5 transition-all ${
                accessibility.dyslexiaFont ? "font-sans tracking-wide" : "font-body"
              } ${largeText ? "text-base" : "text-sm"} ${extraLineHeight ? "leading-loose" : "leading-relaxed"}`}
            >
              {/* Reading Ruler Overlay */}
              {isRulerActive && (
                <div
                  className="pointer-events-none absolute left-0 right-0 h-9 bg-primary/15 border-y-2 border-primary/50 backdrop-contrast-125 transition-all duration-150"
                  style={{ top: `${readingRulerY}px` }}
                />
              )}

              <p className="font-headline font-bold text-on-surface text-base mb-2">
                Photosynthesis & Energy Conservation
              </p>
              <p className="text-on-surface-variant">
                Light-dependent reactions occur within the thylakoid membrane where chlorophyll absorbs solar photons. This generates adenosine triphosphate (ATP) to drive carbohydrate synthesis.
              </p>
              <p className="text-on-surface-variant mt-3 text-xs opacity-90">
                Notice how changing font style, line height, or text sizing updates this text preview immediately!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Keyboard Shortcuts Reference Sheet */}
      <div className="rounded-3xl border border-outline-variant bg-surface p-6 sm:p-8 space-y-5 shadow-xs">
        <div className="flex items-center gap-2.5 pb-2 border-b border-outline-variant/60">
          <Keyboard size={18} className="text-primary" />
          <h2 className="font-headline font-bold text-lg text-on-surface">Keyboard Navigation & Shortcuts</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { key: "Space / Enter", desc: "Flip active flashcard in 3D arena", section: "Flashcards" },
            { key: "← / → Arrows", desc: "Navigate previous / next flashcard", section: "Flashcards" },
            { key: "1, 2, 3, 4 Keys", desc: "Select options A, B, C, D instantly", section: "Exam Arena" },
            { key: "Esc Key", desc: "Dismiss Focus Timer & Sensei chat modal", section: "Global" },
            { key: "Tab / Shift+Tab", desc: "Focus cycle through interactive buttons", section: "Navigation" },
            { key: "Cmd/Ctrl + Enter", desc: "Quick-trigger AI Study Flow transform", section: "Workspace" },
          ].map((item) => (
            <div key={item.key} className="rounded-2xl border border-outline-variant bg-surface-container-low p-3.5 space-y-1.5">
              <div className="flex items-center justify-between">
                <kbd className="px-2 py-0.5 rounded-lg bg-surface border border-outline-variant text-xs font-mono font-bold text-primary shadow-xs">
                  {item.key}
                </kbd>
                <span className="text-[10px] font-label font-bold text-on-surface-variant/70 uppercase">
                  {item.section}
                </span>
              </div>
              <p className="text-xs font-label text-on-surface-variant font-medium">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
