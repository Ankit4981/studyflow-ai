"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "motion/react";
import {
  Trophy, Sparkles, Clock, CheckCircle2, XCircle, RotateCcw,
  ChevronRight, Award, Flame,
  Share2, ArrowRight, Play, Check
} from "lucide-react";
import { QUIZ_BANK, QuizQuestion, SUBJECT_ICONS } from "@/lib/quizBank";
import { useAppState } from "@/lib/state/AppStateContext";
import { playSound } from "@/lib/audioEffects";
import { triggerConfetti } from "@/lib/confetti";
import { SCHOLAR_KEY } from "@/app/login/page";
import { useScholar, notifyScholarUpdated, useRequireAuth } from "@/lib/hooks/useScholar";

import Link from "next/link";
import { DojoStepTracker } from "@/components/navigation/DojoStepTracker";

type SubjectFilter = "All" | QuizQuestion["subject"];
type DifficultyFilter = "all" | "easy" | "medium" | "hard";

export default function QuizArenaPage() {
  useRequireAuth("/login");
  const { studyFlow } = useAppState();
  const { scholar } = useScholar();
  const scholarName = scholar?.name ?? "Scholar";

  // Setup state
  const [mode, setMode] = useState<"setup" | "active" | "results">("setup");
  const [subject, setSubject] = useState<SubjectFilter>("All");
  const [difficulty, setDifficulty] = useState<DifficultyFilter>("all");
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  // Active Quiz State
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [timeLeft, setTimeLeft] = useState<number>(600); // 10 min default
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [showInstantFeedback, setShowInstantFeedback] = useState(true);
  const [xpEarned, setXpEarned] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const finishQuizRef = useRef<() => void>(() => {});

  // Timer effect
  useEffect(() => {
    if (mode === "active" && isTimerRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            finishQuizRef.current();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [mode, isTimerRunning]);

  function startBankQuiz() {
    let pool = [...QUIZ_BANK];
    if (subject !== "All") {
      pool = pool.filter((q) => q.subject === subject);
    }
    if (difficulty !== "all") {
      pool = pool.filter((q) => q.difficulty === difficulty);
    }

    // Shuffle pool
    const shuffled = pool.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, Math.min(questionCount, shuffled.length));

    if (selected.length === 0) {
      alert("No questions match this filter combination. Try selecting 'All'.");
      return;
    }

    setQuestions(selected);
    setCurrentIndex(0);
    setSelectedAnswers({});
    setTimeLeft(selected.length * 60); // 1 min per question
    setIsTimerRunning(true);
    setMode("active");
    playSound("chime");
  }

  async function startAiQuiz() {
    if (!studyFlow) {
      setAiError("No study flow found. Paste notes in the Workspace first or use our 100+ Question Bank!");
      return;
    }

    setIsAiGenerating(true);
    setAiError(null);

    try {
      const res = await fetch("/api/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          material: `${studyFlow.title}\n\n${studyFlow.summary}\n\n${studyFlow.eli5}\n\nKey Takeaways:\n${studyFlow.keyTakeaways.map((k) => k.title + ": " + k.description).join("\n")}`,
          count: questionCount,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate AI quiz");

      if (data.questions && data.questions.length > 0) {
        setQuestions(data.questions);
        setCurrentIndex(0);
        setSelectedAnswers({});
        setTimeLeft(data.questions.length * 60);
        setIsTimerRunning(true);
        setMode("active");
        playSound("chime");
      } else {
        throw new Error("AI could not generate questions for this material.");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error generating AI quiz";
      setAiError(msg);
    } finally {
      setIsAiGenerating(false);
    }
  }

  function handleSelectOption(optionIndex: number) {
    if (selectedAnswers[currentIndex] !== undefined && showInstantFeedback) return;

    playSound("click");
    const nextAnswers = { ...selectedAnswers, [currentIndex]: optionIndex };
    setSelectedAnswers(nextAnswers);

    if (showInstantFeedback) {
      const isCorrect = optionIndex === questions[currentIndex].correctIndex;
      if (isCorrect) playSound("success");
      else playSound("error");
    }
  }

  const finishQuiz = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);

    // Calculate score & XP
    let correctCount = 0;
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctIndex) {
        correctCount++;
      }
    });

    const earned = correctCount * 25;
    setXpEarned(earned);

    // Persist XP to scholar
    try {
      const raw = localStorage.getItem(SCHOLAR_KEY);
      if (raw) {
        const scholar = JSON.parse(raw);
        scholar.xp = (scholar.xp || 350) + earned;
        scholar.quizzesCompleted = (scholar.quizzesCompleted || 0) + 1;
        localStorage.setItem(SCHOLAR_KEY, JSON.stringify(scholar));
        notifyScholarUpdated();
      }
    } catch { /* ignore */ }

    setMode("results");
    if (correctCount >= Math.ceil(questions.length * 0.6)) {
      triggerConfetti();
      playSound("levelup");
    } else {
      playSound("chime");
    }
  }, [questions, selectedAnswers]);

  useEffect(() => {
    finishQuizRef.current = finishQuiz;
  }, [finishQuiz]);

  function formatTime(seconds: number) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  }

  const scoreCount = questions.filter((q, idx) => selectedAnswers[idx] === q.correctIndex).length;
  const scorePercent = questions.length > 0 ? Math.round((scoreCount / questions.length) * 100) : 0;

  function getGrade(percent: number) {
    if (percent >= 90) return { grade: "A*", title: "Grandmaster Scholar", color: "text-amber-600 dark:text-amber-400" };
    if (percent >= 80) return { grade: "A", title: "Master Scholar", color: "text-green-600 dark:text-green-400" };
    if (percent >= 70) return { grade: "B", title: "Adept Scholar", color: "text-blue-600 dark:text-blue-400" };
    if (percent >= 50) return { grade: "C", title: "Apprentice", color: "text-purple-600 dark:text-purple-400" };
    return { grade: "D", title: "Revision Recommended", color: "text-orange-600 dark:text-orange-400" };
  }

  function handleShareResult() {
    const text = `🏆 I just scored ${scorePercent}% (${scoreCount}/${questions.length}) on StudyFlow AI Exam Arena! #StudyFlow #Dojo`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  }

  return (
    <main className="flex flex-col w-full px-6 md:px-10 py-8 max-w-6xl mx-auto min-h-[85vh] gap-6">
      <DojoStepTracker currentStep={4} />

      {/* ─── SETUP MODE ─── */}
      {mode === "setup" && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-8"
        >
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Trophy size={20} className="text-primary" />
                <span className="text-xs font-label font-bold text-primary uppercase tracking-widest">
                  100+ Question Exam Arena
                </span>
              </div>
              <h1 className="font-headline text-3xl md:text-4xl font-bold text-on-surface">
                Test Your Knowledge &amp; Earn XP
              </h1>
              <p className="text-sm font-label text-on-surface-variant mt-1 max-w-2xl">
                Simulate high-yield timed exams across STEM &amp; Humanities or generate a custom AI exam directly from your study notes.
              </p>
            </div>

            <div className="flex items-center gap-3 bg-surface border border-outline-variant p-3.5 rounded-2xl shrink-0">
              <div className="w-10 h-10 rounded-xl bg-primary-container flex items-center justify-center text-primary">
                <Flame size={20} />
              </div>
              <div>
                <p className="text-xs font-label text-on-surface-variant font-medium">Reward Rate</p>
                <p className="text-sm font-label font-bold text-on-surface">+25 XP / Correct</p>
              </div>
            </div>
          </div>

          {/* Setup Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Col: Pre-Built Question Bank (100+ Questions) */}
            <div className="lg:col-span-7 bg-surface border border-outline-variant rounded-3xl p-6 md:p-8 space-y-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">📚</span>
                  <div>
                    <h2 className="font-headline text-xl font-bold text-on-surface">
                      Curated 100+ Question Bank
                    </h2>
                    <p className="text-xs font-label text-on-surface-variant">
                      Physics, Mathematics, Computer Science, Chemistry, Biology &amp; History
                    </p>
                  </div>
                </div>
                <span className="text-xs font-label font-bold px-2.5 py-1 rounded-full bg-secondary-container text-on-secondary-container">
                  {QUIZ_BANK.length} Questions Ready
                </span>
              </div>

              {/* Subject Selector */}
              <div className="space-y-2">
                <label className="text-xs font-label font-bold text-on-surface-variant uppercase tracking-wider">
                  Select Subject
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {(["All", "Physics", "Mathematics", "Computer Science", "Chemistry", "Biology", "World History"] as SubjectFilter[]).map((subj) => (
                    <button
                      key={subj}
                      onClick={() => setSubject(subj)}
                      className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl border text-left text-xs font-label font-semibold transition-all ${
                        subject === subj
                          ? "border-primary bg-primary-container text-on-primary-container shadow-sm"
                          : "border-outline-variant bg-surface-container-low hover:bg-surface-container text-on-surface"
                      }`}
                    >
                      <span>{subj === "All" ? "🌐" : SUBJECT_ICONS[subj]}</span>
                      <span className="truncate">{subj}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Difficulty & Count */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-label font-bold text-on-surface-variant uppercase tracking-wider">
                    Difficulty Level
                  </label>
                  <div className="flex rounded-xl border border-outline-variant bg-surface-container-low p-1">
                    {(["all", "easy", "medium", "hard"] as DifficultyFilter[]).map((d) => (
                      <button
                        key={d}
                        onClick={() => setDifficulty(d)}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-label font-semibold capitalize transition-all ${
                          difficulty === d
                            ? "bg-surface text-on-surface shadow-xs"
                            : "text-on-surface-variant hover:text-on-surface"
                        }`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-label font-bold text-on-surface-variant uppercase tracking-wider">
                    Number of Questions
                  </label>
                  <div className="flex rounded-xl border border-outline-variant bg-surface-container-low p-1">
                    {[5, 10, 15, 20].map((count) => (
                      <button
                        key={count}
                        onClick={() => setQuestionCount(count)}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-label font-semibold transition-all ${
                          questionCount === count
                            ? "bg-surface text-on-surface shadow-xs"
                            : "text-on-surface-variant hover:text-on-surface"
                        }`}
                      >
                        {count} Qs
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Start Bank Button */}
              <button
                id="start-bank-quiz-btn"
                onClick={startBankQuiz}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-primary text-on-primary font-label font-bold text-sm hover:opacity-90 transition-all shadow-md active:scale-[0.99]"
              >
                <Play size={16} /> Start Question Bank Exam ({questionCount} Questions)
              </button>
            </div>

            {/* Right Col: AI Custom Exam Generator */}
            <div className="lg:col-span-5 bg-linear-to-b from-primary-container/40 to-surface border border-outline-variant rounded-3xl p-6 md:p-8 flex flex-col justify-between gap-6 shadow-sm">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-primary">
                  <Sparkles size={20} />
                  <span className="text-xs font-label font-bold uppercase tracking-wider">
                    Gemini Pro 1.5 Powered
                  </span>
                </div>

                <div>
                  <h2 className="font-headline text-xl font-bold text-on-surface">
                    AI Custom Exam Generator
                  </h2>
                  <p className="text-xs font-label text-on-surface-variant mt-1 leading-relaxed">
                    Transform your currently active study flow notes into a customized mock exam with instant intelligent grading and detailed answer rationales.
                  </p>
                </div>

                {studyFlow ? (
                  <div className="rounded-2xl border border-outline-variant bg-surface p-4 space-y-2">
                    <span className="text-[10px] font-label font-bold text-secondary uppercase tracking-wider">
                      Active Study Flow Loaded
                    </span>
                    <p className="text-sm font-label font-bold text-on-surface truncate">
                      {studyFlow.title}
                    </p>
                    <p className="text-xs font-label text-on-surface-variant line-clamp-2">
                      {studyFlow.summary}
                    </p>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-outline-variant bg-surface/60 p-4 text-center space-y-1">
                    <p className="text-xs font-label font-semibold text-on-surface">
                      No active notes in Workspace
                    </p>
                    <p className="text-[11px] font-label text-on-surface-variant">
                      Paste notes in the Workspace first to generate tailored AI exam questions.
                    </p>
                  </div>
                )}

                {aiError && (
                  <div className="p-3 rounded-xl bg-error-container text-on-error-container text-xs font-label">
                    {aiError}
                  </div>
                )}
              </div>

              <button
                id="start-ai-quiz-btn"
                onClick={startAiQuiz}
                disabled={isAiGenerating || !studyFlow}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-secondary text-on-secondary font-label font-bold text-sm hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md active:scale-[0.99]"
              >
                {isAiGenerating ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-on-secondary border-t-transparent rounded-full animate-spin" />
                    Generating Exam with AI…
                  </span>
                ) : (
                  <>
                    <Sparkles size={16} /> Generate AI Exam from Notes
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* ─── ACTIVE EXAM MODE ─── */}
      {mode === "active" && questions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col gap-6 max-w-3xl mx-auto w-full"
        >
          {/* Top Bar: Progress + Timer */}
          <div className="flex items-center justify-between bg-surface border border-outline-variant p-4 rounded-2xl">
            <div className="flex items-center gap-3">
              <span className="text-xs font-label font-bold text-on-surface-variant uppercase tracking-wider">
                Question {currentIndex + 1} of {questions.length}
              </span>
              <span className="text-xs font-label font-semibold px-2 py-0.5 rounded-full bg-primary-container text-on-primary-container">
                {questions[currentIndex].subject}
              </span>
            </div>

            <div className="flex items-center gap-4">
              {/* Feedback toggle */}
              <button
                onClick={() => setShowInstantFeedback((v) => !v)}
                className="text-[11px] font-label font-semibold text-on-surface-variant hover:text-on-surface transition-colors hidden sm:block"
              >
                Instant Feedback: {showInstantFeedback ? "ON" : "OFF"}
              </button>

              {/* Timer */}
              <div className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-label font-bold ${
                timeLeft < 60 ? "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300 animate-pulse" : "bg-surface-container text-on-surface"
              }`}>
                <Clock size={14} />
                <span>{formatTime(timeLeft)}</span>
              </div>
            </div>
          </div>

          {/* Progress Line */}
          <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
            <div
              className="bg-primary h-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            />
          </div>

          {/* Question Card */}
          <div className="bg-surface border border-outline-variant rounded-3xl p-6 md:p-8 space-y-6 shadow-sm">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-label font-bold text-secondary uppercase tracking-wider">
                  {questions[currentIndex].topic}
                </span>
                <span className="text-xs text-on-surface-variant">·</span>
                <span className="text-[11px] font-label capitalize text-on-surface-variant">
                  {questions[currentIndex].difficulty}
                </span>
              </div>

              <h2 className="font-headline text-xl md:text-2xl font-bold text-on-surface leading-snug">
                {questions[currentIndex].question}
              </h2>
            </div>

            {/* Options */}
            <div className="space-y-3">
              {questions[currentIndex].options.map((option, optIdx) => {
                const isSelected = selectedAnswers[currentIndex] === optIdx;
                const isAnswered = selectedAnswers[currentIndex] !== undefined;
                const isCorrect = optIdx === questions[currentIndex].correctIndex;

                let btnStyles = "border-outline-variant bg-surface hover:bg-surface-container text-on-surface";
                if (isAnswered && showInstantFeedback) {
                  if (isCorrect) {
                    btnStyles = "border-green-500 bg-green-50 dark:bg-green-950/40 text-green-900 dark:text-green-100 font-semibold";
                  } else if (isSelected && !isCorrect) {
                    btnStyles = "border-red-500 bg-red-50 dark:bg-red-950/40 text-red-900 dark:text-red-100 font-semibold";
                  }
                } else if (isSelected) {
                  btnStyles = "border-primary bg-primary-container text-on-primary-container font-semibold shadow-xs";
                }

                return (
                  <button
                    key={optIdx}
                    id={`quiz-option-${optIdx}`}
                    onClick={() => handleSelectOption(optIdx)}
                    className={`w-full text-left flex items-center gap-4 p-4 rounded-2xl border transition-all ${btnStyles}`}
                  >
                    <span className="w-7 h-7 rounded-full border border-current/30 flex items-center justify-center text-xs font-bold shrink-0">
                      {String.fromCharCode(65 + optIdx)}
                    </span>
                    <span className="text-sm font-label flex-1 leading-relaxed">{option}</span>
                    {isAnswered && showInstantFeedback && isCorrect && (
                      <CheckCircle2 size={18} className="text-green-600 dark:text-green-400 shrink-0" />
                    )}
                    {isAnswered && showInstantFeedback && isSelected && !isCorrect && (
                      <XCircle size={18} className="text-red-600 dark:text-red-400 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation box (if answered & instant feedback on) */}
            {selectedAnswers[currentIndex] !== undefined && showInstantFeedback && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant space-y-1.5"
              >
                <div className="flex items-center gap-2">
                  <Sparkles size={14} className="text-primary" />
                  <span className="text-xs font-label font-bold text-on-surface uppercase tracking-wider">
                    Pedagogical Explanation
                  </span>
                </div>
                <p className="text-xs font-label text-on-surface-variant leading-relaxed">
                  {questions[currentIndex].explanation}
                </p>
              </motion.div>
            )}

            {/* Navigation buttons */}
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
                disabled={currentIndex === 0}
                className="px-4 py-2 rounded-xl text-xs font-label font-semibold text-on-surface-variant hover:bg-surface-container disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
              >
                Previous
              </button>

              {currentIndex < questions.length - 1 ? (
                <button
                  id="quiz-next-btn"
                  onClick={() => {
                    playSound("click");
                    setCurrentIndex((i) => i + 1);
                  }}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-on-primary text-xs font-label font-bold hover:opacity-90 transition-all shadow-sm"
                >
                  <span>Next Question</span>
                  <ChevronRight size={14} />
                </button>
              ) : (
                <button
                  id="quiz-submit-btn"
                  onClick={finishQuiz}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-secondary text-on-secondary text-xs font-label font-bold hover:opacity-90 transition-all shadow-sm"
                >
                  <Trophy size={14} />
                  <span>Submit Exam</span>
                </button>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* ─── RESULTS & CERTIFICATE MODE ─── */}
      {mode === "results" && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col gap-8 max-w-4xl mx-auto w-full"
        >
          {/* Certificate Card */}
          <div className="relative bg-surface border-2 border-primary/40 rounded-3xl p-8 md:p-12 text-center space-y-6 shadow-xl overflow-hidden">
            {/* Background flourish */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/5 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center justify-center gap-2 text-primary">
              <Award size={36} />
            </div>

            <div>
              <span className="text-xs font-label font-bold tracking-widest text-primary uppercase">
                StudyFlow Revision Dojo · Official Evaluation
              </span>
              <h2 className="font-headline text-3xl md:text-5xl font-bold text-on-surface mt-1">
                Certificate of Exam Mastery
              </h2>
              <p className="text-sm font-label text-on-surface-variant mt-2">
                Conferred upon <span className="font-bold text-on-surface text-base">{scholarName}</span> for demonstrated academic proficiency.
              </p>
            </div>

            {/* Score Pill Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto py-2">
              <div className="p-3.5 rounded-2xl bg-surface-container-low border border-outline-variant">
                <p className="text-[11px] font-label text-on-surface-variant font-medium">Final Score</p>
                <p className="font-headline text-2xl font-bold text-on-surface">{scoreCount} / {questions.length}</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-surface-container-low border border-outline-variant">
                <p className="text-[11px] font-label text-on-surface-variant font-medium">Accuracy</p>
                <p className="font-headline text-2xl font-bold text-on-surface">{scorePercent}%</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-surface-container-low border border-outline-variant">
                <p className="text-[11px] font-label text-on-surface-variant font-medium">Grade Award</p>
                <p className={`font-headline text-2xl font-bold ${getGrade(scorePercent).color}`}>
                  {getGrade(scorePercent).grade}
                </p>
              </div>
              <div className="p-3.5 rounded-2xl bg-primary-container text-on-primary-container border border-primary/20">
                <p className="text-[11px] font-label font-medium">Scholar XP</p>
                <p className="font-headline text-2xl font-bold">+{xpEarned} XP</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                id="share-quiz-score-btn"
                onClick={handleShareResult}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-outline-variant bg-surface text-on-surface font-label text-xs font-semibold hover:bg-surface-container transition-colors"
              >
                {copiedLink ? <><Check size={14} className="text-secondary" /> Copied to Clipboard!</> : <><Share2 size={14} /> Share Score</>}
              </button>
              <button
                onClick={() => {
                  playSound("click");
                  setMode("setup");
                }}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl border border-outline-variant bg-surface text-on-surface font-label text-xs font-bold hover:bg-surface-container transition-all"
              >
                <RotateCcw size={14} /> Retake Exam
              </button>
              <Link
                href="/progress"
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-on-primary font-label text-xs font-bold hover:opacity-90 transition-all shadow-md"
              >
                <span>Step 5: View Scholar Progress</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {/* Detailed Question Review Breakdown */}
          <div className="space-y-4">
            <h3 className="font-headline text-2xl font-bold text-on-surface">
              Comprehensive Exam Breakdown &amp; Analysis
            </h3>

            <div className="space-y-3">
              {questions.map((q, idx) => {
                const userAns = selectedAnswers[idx];
                const isCorrect = userAns === q.correctIndex;

                return (
                  <div
                    key={q.id}
                    className={`p-5 rounded-2xl border transition-all ${
                      isCorrect
                        ? "border-green-300 dark:border-green-900 bg-green-50/50 dark:bg-green-950/20"
                        : "border-red-300 dark:border-red-900 bg-red-50/50 dark:bg-red-950/20"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-label font-bold text-on-surface-variant">
                            Q{idx + 1} · {q.subject}
                          </span>
                          <span className="text-xs font-label text-on-surface-variant">({q.topic})</span>
                        </div>
                        <p className="font-headline text-base font-bold text-on-surface">
                          {q.question}
                        </p>
                      </div>
                      {isCorrect ? (
                        <span className="flex items-center gap-1 text-xs font-label font-bold text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-900/50 px-2.5 py-1 rounded-full shrink-0">
                          <CheckCircle2 size={14} /> Correct (+25 XP)
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-xs font-label font-bold text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-900/50 px-2.5 py-1 rounded-full shrink-0">
                          <XCircle size={14} /> Incorrect
                        </span>
                      )}
                    </div>

                    <div className="mt-3 pt-3 border-t border-current/10 space-y-2 text-xs font-label">
                      <div className="flex flex-col sm:flex-row gap-2">
                        <p className="text-on-surface-variant">
                          <span className="font-semibold text-on-surface">Your answer:</span>{" "}
                          {userAns !== undefined ? q.options[userAns] : "Not answered"}
                        </p>
                        {!isCorrect && (
                          <p className="text-green-800 dark:text-green-300">
                            <span className="font-semibold">Correct answer:</span> {q.options[q.correctIndex]}
                          </p>
                        )}
                      </div>
                      <p className="text-on-surface-variant/80 italic leading-relaxed">
                        💡 {q.explanation}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}
    </main>
  );
}
