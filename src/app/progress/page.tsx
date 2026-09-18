"use client";

import { useMemo } from "react";
import {
  Trophy, Flame, Clock,
  BookOpen, Award, Target, Calendar, BarChart3,
  Layers
} from "lucide-react";
import { useAppState } from "@/lib/state/AppStateContext";
import { DojoStepTracker } from "@/components/navigation/DojoStepTracker";
import { useScholar, useRequireAuth } from "@/lib/hooks/useScholar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/base-ui/avatar";
import Link from "next/link";

interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  category: "XP" | "Streak" | "Quizzes" | "Tasks" | "Journal";
}

export default function ProgressPage() {
  useRequireAuth("/login");
  const { studyFlow, progress, hydrated } = useAppState();
  const { scholar } = useScholar();

  const totalXp = scholar?.xp ?? (350 + progress.tasksCompleted * 20 + progress.flashcardsMastered * 15);
  const currentLevel = Math.floor(totalXp / 300) + 1;
  const levelXpProgress = totalXp % 300;
  const levelPercent = Math.round((levelXpProgress / 300) * 100);

  function getDojoTitle(lvl: number) {
    if (lvl >= 5) return "🥋 Grand Sensei";
    if (lvl >= 4) return "⚔️ Master Scholar";
    if (lvl >= 3) return "⚡ Adept Scholar";
    if (lvl >= 2) return "📖 Apprentice Scholar";
    return "🌱 Novice Scholar";
  }

  // Generate 16 weeks of heatmap mock + real activity
  const heatmapWeeks = useMemo(() => {
    const weeks: Array<Array<{ date: string; level: number; count: number }>> = [];
    const today = new Date();

    for (let w = 15; w >= 0; w--) {
      const week: Array<{ date: string; level: number; count: number }> = [];
      for (let d = 0; d < 7; d++) {
        const dateObj = new Date(today);
        dateObj.setDate(today.getDate() - (w * 7 + (6 - d)));
        const isToday = w === 0 && d === 6;

        // Base realistic deterministic activity
        const pseudoRand = (dateObj.getDate() * 17 + dateObj.getMonth() * 31) % 10;
        let count = pseudoRand > 4 ? (pseudoRand % 4) + 1 : 0;
        if (isToday) count = Math.max(count, progress.tasksCompleted + progress.flashcardsReviewed + 2);

        let lvl = 0;
        if (count >= 5) lvl = 4;
        else if (count >= 3) lvl = 3;
        else if (count >= 2) lvl = 2;
        else if (count >= 1) lvl = 1;

        week.push({
          date: dateObj.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          level: lvl,
          count,
        });
      }
      weeks.push(week);
    }
    return weeks;
  }, [progress]);

  const badges: Badge[] = [
    {
      id: "b1",
      title: "First Spark",
      description: "Generated your first AI Study Flow",
      icon: "⚡",
      unlocked: Boolean(studyFlow),
      category: "XP",
    },
    {
      id: "b2",
      title: "Task Crusher",
      description: "Completed at least 3 micro-tasks",
      icon: "🎯",
      unlocked: progress.tasksCompleted >= 3,
      category: "Tasks",
    },
    {
      id: "b3",
      title: "Active Recall Ace",
      description: "Mastered 5 or more flashcards",
      icon: "🧠",
      unlocked: progress.flashcardsMastered >= 5,
      category: "XP",
    },
    {
      id: "b4",
      title: "Exam Gladiator",
      description: "Completed a mock exam in Quiz Arena",
      icon: "🏆",
      unlocked: (scholar?.quizzesCompleted ?? 0) > 0,
      category: "Quizzes",
    },
    {
      id: "b5",
      title: "Zen Focus",
      description: "Completed a 25m Pomodoro session",
      icon: "🧘",
      unlocked: (scholar?.focusSessions ?? 0) > 0,
      category: "Streak",
    },
    {
      id: "b6",
      title: "Level 3 Scholar",
      description: "Accumulated 600+ Scholar XP",
      icon: "🌟",
      unlocked: totalXp >= 600,
      category: "XP",
    },
    {
      id: "b7",
      title: "Study Circle",
      description: "Connected with classmates & buddies",
      icon: "🤝",
      unlocked: true,
      category: "Streak",
    },
    {
      id: "b8",
      title: "Daily Chronicler",
      description: "Logged study reflections in Monthly Journal",
      icon: "📜",
      unlocked: true,
      category: "Journal",
    },
  ];

  const unlockedCount = badges.filter((b) => b.unlocked).length;

  if (!hydrated) return null;

  return (
    <main className="flex flex-col w-full px-6 md:px-10 py-8 max-w-7xl mx-auto space-y-6">
      <DojoStepTracker currentStep={5} />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <BarChart3 size={20} className="text-primary" />
            <span className="text-xs font-label font-bold text-primary uppercase tracking-widest">
              Scholar Analytics &amp; Mastery
            </span>
          </div>
          <h1 className="font-headline text-3xl md:text-4xl font-bold text-on-surface">
            {scholar?.name ? `${scholar.name.split(" ")[0]}'s Learning Journey` : "Your Learning Journey"}
          </h1>
          <p className="text-sm font-label text-on-surface-variant mt-1">
            Track daily study consistency, mastery velocity, and unlocked dojo achievements.
          </p>
        </div>

        {/* Quick actions */}
        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/quiz"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-on-primary font-label text-xs font-bold hover:opacity-90 transition-all shadow-sm"
          >
            <Trophy size={14} /> Exam Arena
          </Link>
          <Link
            href="/flashcards"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-outline-variant bg-surface text-on-surface font-label text-xs font-bold hover:bg-surface-container transition-all"
          >
            <Layers size={14} /> Flashcards
          </Link>
        </div>
      </div>

      {/* Top Banner: Scholar Rank & XP Level */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Scholar Rank Card */}
        <div className="lg:col-span-8 bg-surface border border-outline-variant rounded-3xl p-6 md:p-8 space-y-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16 rounded-2xl ring-2 ring-primary/40 ring-offset-2 ring-offset-background shadow-md">
                {scholar?.avatar ? <AvatarImage src={scholar.avatar} alt={scholar.name} className="rounded-2xl object-cover" /> : null}
                <AvatarFallback className="text-2xl font-bold bg-primary-container text-on-primary-container rounded-2xl">
                  {scholar?.name ? scholar.name.slice(0, 2).toUpperCase() : "🥋"}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-label font-bold px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container">
                    Level {currentLevel}
                  </span>
                  <span className="text-xs font-label font-semibold text-primary">
                    {getDojoTitle(currentLevel)}
                  </span>
                </div>
                <h2 className="font-headline text-2xl font-bold text-on-surface mt-1">
                  {scholar?.name ?? "Scholar"}
                </h2>
                <p className="text-xs font-label text-on-surface-variant">
                  {scholar?.studentClass ?? "Class 12 (Science)"} · {scholar?.school ?? "Academic Scholar"}
                </p>
              </div>
            </div>

            <div className="flex sm:flex-col items-center sm:items-end justify-between gap-1 bg-surface-container-low sm:bg-transparent p-3 sm:p-0 rounded-xl border sm:border-0 border-outline-variant">
              <span className="text-xs font-label text-on-surface-variant font-medium">Total Scholar XP</span>
              <span className="font-headline text-2xl sm:text-3xl font-bold text-primary">
                {totalXp} XP
              </span>
            </div>
          </div>

          {/* XP Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-label font-semibold">
              <span className="text-on-surface-variant">Progress to Level {currentLevel + 1}</span>
              <span className="text-on-surface">{levelXpProgress} / 300 XP ({levelPercent}%)</span>
            </div>
            <div className="w-full bg-surface-container h-3 rounded-full overflow-hidden">
              <div
                className="bg-linear-to-r from-primary to-amber-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${levelPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Streak & Focus Strip */}
        <div className="lg:col-span-4 grid grid-cols-2 gap-4">
          <div className="bg-surface border border-outline-variant rounded-3xl p-5 flex flex-col justify-between shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-950/60 text-orange-600 flex items-center justify-center">
              <Flame size={20} />
            </div>
            <div className="mt-4">
              <span className="font-headline text-3xl font-bold text-on-surface">5 Days</span>
              <p className="text-xs font-label text-on-surface-variant mt-0.5">Study Streak 🔥</p>
            </div>
          </div>

          <div className="bg-surface border border-outline-variant rounded-3xl p-5 flex flex-col justify-between shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
              <Clock size={20} />
            </div>
            <div className="mt-4">
              <span className="font-headline text-3xl font-bold text-on-surface">
                {scholar?.focusSessions ? scholar.focusSessions * 25 : 75}m
              </span>
              <p className="text-xs font-label text-on-surface-variant mt-0.5">Focus Time</p>
            </div>
          </div>
        </div>
      </div>

      {/* 365-Day Study Activity Heatmap */}
      <div className="bg-surface border border-outline-variant rounded-3xl p-6 md:p-8 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Calendar size={18} className="text-primary" />
            <h3 className="font-headline text-xl font-bold text-on-surface">
              Study Activity Heatmap
            </h3>
          </div>
          <div className="flex items-center gap-2 text-xs font-label text-on-surface-variant">
            <span>Less</span>
            <div className="flex gap-1">
              <span className="w-3 h-3 rounded-xs bg-surface-container" />
              <span className="w-3 h-3 rounded-xs bg-primary/30" />
              <span className="w-3 h-3 rounded-xs bg-primary/60" />
              <span className="w-3 h-3 rounded-xs bg-primary/85" />
              <span className="w-3 h-3 rounded-xs bg-primary" />
            </div>
            <span>More</span>
          </div>
        </div>

        {/* Heatmap Grid */}
        <div className="overflow-x-auto pb-2">
          <div className="flex gap-1.5 min-w-155">
            {heatmapWeeks.map((week, wIdx) => (
              <div key={wIdx} className="flex flex-col gap-1.5 flex-1">
                {week.map((day, dIdx) => {
                  let bg = "bg-surface-container";
                  if (day.level === 1) bg = "bg-primary/30";
                  if (day.level === 2) bg = "bg-primary/60";
                  if (day.level === 3) bg = "bg-primary/85";
                  if (day.level === 4) bg = "bg-primary";

                  return (
                    <div
                      key={dIdx}
                      title={`${day.date}: ${day.count} study actions`}
                      className={`h-4 rounded-xs transition-colors hover:ring-2 hover:ring-primary ${bg}`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
        <p className="text-[11px] font-label text-on-surface-variant text-right">
          Showing last 16 weeks of learning activity
        </p>
      </div>

      {/* Metrics & Subject Mastery */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Core Learning Metrics */}
        <div className="lg:col-span-6 bg-surface border border-outline-variant rounded-3xl p-6 md:p-8 space-y-5 shadow-sm">
          <div className="flex items-center gap-2">
            <Target size={18} className="text-primary" />
            <h3 className="font-headline text-xl font-bold text-on-surface">Learning Velocity</h3>
          </div>

          <div className="space-y-4">
            {/* Micro tasks */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-label">
                <span className="font-semibold text-on-surface">Micro-Tasks Completed</span>
                <span className="text-on-surface-variant font-bold">
                  {progress.tasksCompleted} / {Math.max(progress.tasksTotal, 1)} ({Math.round((progress.tasksCompleted / Math.max(progress.tasksTotal, 1)) * 100)}%)
                </span>
              </div>
              <div className="w-full bg-surface-container h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-secondary h-full rounded-full transition-all duration-300"
                  style={{ width: `${(progress.tasksCompleted / Math.max(progress.tasksTotal, 1)) * 100}%` }}
                />
              </div>
            </div>

            {/* Flashcards */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-label">
                <span className="font-semibold text-on-surface">Flashcard Active Recall Mastery</span>
                <span className="text-on-surface-variant font-bold">
                  {progress.flashcardsMastered} / {Math.max(progress.flashcardsTotal, 1)} Mastered
                </span>
              </div>
              <div className="w-full bg-surface-container h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-primary h-full rounded-full transition-all duration-300"
                  style={{ width: `${(progress.flashcardsMastered / Math.max(progress.flashcardsTotal, 1)) * 100}%` }}
                />
              </div>
            </div>

            {/* Quizzes */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-label">
                <span className="font-semibold text-on-surface">Exam Arena Accuracy</span>
                <span className="text-on-surface-variant font-bold">85% Average</span>
              </div>
              <div className="w-full bg-surface-container h-2.5 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full" style={{ width: "85%" }} />
              </div>
            </div>
          </div>
        </div>

        {/* Subject Mastery Radar/Bars */}
        <div className="lg:col-span-6 bg-surface border border-outline-variant rounded-3xl p-6 md:p-8 space-y-5 shadow-sm">
          <div className="flex items-center gap-2">
            <BookOpen size={18} className="text-primary" />
            <h3 className="font-headline text-xl font-bold text-on-surface">Subject Mastery</h3>
          </div>

          <div className="space-y-3">
            {[
              { name: "Physics & Mechanics", icon: "⚡", percent: 88, color: "bg-primary" },
              { name: "Mathematics & Calculus", icon: "📐", percent: 74, color: "bg-blue-600" },
              { name: "Computer Science", icon: "💻", percent: 92, color: "bg-emerald-600" },
              { name: "Chemistry & Bonding", icon: "🧪", percent: 65, color: "bg-amber-600" },
              { name: "World History", icon: "🏛️", percent: 80, color: "bg-purple-600" },
            ].map((sub) => (
              <div key={sub.name} className="flex items-center gap-3">
                <span className="text-lg shrink-0">{sub.icon}</span>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between text-xs font-label">
                    <span className="font-semibold text-on-surface">{sub.name}</span>
                    <span className="text-on-surface-variant font-bold">{sub.percent}%</span>
                  </div>
                  <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
                    <div className={`${sub.color} h-full rounded-full`} style={{ width: `${sub.percent}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Achievement Badges Showcase */}
      <div className="bg-surface border border-outline-variant rounded-3xl p-6 md:p-8 space-y-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award size={20} className="text-primary" />
            <div>
              <h3 className="font-headline text-xl font-bold text-on-surface">
                Dojo Achievements
              </h3>
              <p className="text-xs font-label text-on-surface-variant">
                Unlock badges by completing study flows, exams, and focus sessions
              </p>
            </div>
          </div>
          <span className="text-xs font-label font-bold px-3 py-1 rounded-full bg-primary-container text-on-primary-container">
            {unlockedCount} / {badges.length} Unlocked
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className={`p-4 rounded-2xl border flex flex-col items-center text-center gap-2 transition-all ${
                badge.unlocked
                  ? "border-outline-variant bg-surface-container-low shadow-xs"
                  : "border-outline-variant/50 bg-surface/40 opacity-45 grayscale"
              }`}
            >
              <span className="text-3xl">{badge.icon}</span>
              <div>
                <p className="text-xs font-label font-bold text-on-surface">{badge.title}</p>
                <p className="text-[10px] font-label text-on-surface-variant mt-0.5 leading-tight">
                  {badge.description}
                </p>
              </div>
              {badge.unlocked && (
                <span className="text-[9px] font-label font-bold uppercase text-secondary tracking-wider">
                  ✓ Unlocked
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
