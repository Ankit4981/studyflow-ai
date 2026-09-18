"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAppState } from "@/lib/state/AppStateContext";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/base-ui/avatar";
import { SCHOLAR_KEY } from "@/app/login/page";
import { LogOut, Timer } from "lucide-react";
import { FocusTimerModal } from "@/components/focus/FocusTimerModal";
import { useScholar, notifyScholarUpdated } from "@/lib/hooks/useScholar";

const NAV_ITEMS = [
  { href: "/", label: "Workspace" },
  { href: "/micro-tasks", label: "Micro-Tasks" },
  { href: "/flashcards", label: "Flashcards" },
  { href: "/quiz", label: "Exam Arena" },
  { href: "/progress", label: "Progress" },
  { href: "/journal", label: "Journal" },
  { href: "/buddies", label: "Study Buddies" },
];

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { accessibility, updateAccessibility, setStudyFlow } = useAppState();
  const { scholar } = useScholar();
  const [showMenu, setShowMenu] = useState(false);
  const [showFocusTimer, setShowFocusTimer] = useState(false);

  const isDark = accessibility.theme === "dark";

  function getInitials(name: string) {
    return name.split(/\s+/).map((w) => w[0]).join("").toUpperCase().slice(0, 2);
  }

  function handleLogout() {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("studyflow_session_active");
      localStorage.removeItem(SCHOLAR_KEY);
      localStorage.removeItem("studyflow_persisted_state");
    }
    notifyScholarUpdated();
    setStudyFlow(null);
    router.push("/login");
  }

  return (
    <>
      <FocusTimerModal isOpen={showFocusTimer} onClose={() => setShowFocusTimer(false)} />
      <header className="fixed top-0 w-full z-50 bg-surface/90 backdrop-blur-xl border-b border-outline-variant shadow-[0_1px_8px_rgba(36,35,31,0.04)]">
        <div className="h-16 max-w-7xl mx-auto px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span aria-hidden className="text-primary text-xl">
              ✦
            </span>
            <span className="font-headline text-lg text-on-surface">StudyFlow AI</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1 font-label" aria-label="Primary">
            {NAV_ITEMS.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`px-3.5 py-1.5 rounded-lg text-sm transition-colors ${
                    active
                      ? "bg-primary-container text-on-primary-container font-semibold"
                      : "text-on-surface-variant hover:text-on-surface"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Focus Lounge Button */}
            <button
              id="open-focus-timer-header-btn"
              onClick={() => setShowFocusTimer(true)}
              title="Open Focus Timer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-outline-variant bg-surface text-xs font-label font-bold text-on-surface hover:bg-surface-container transition-all"
            >
              <Timer size={14} className="text-primary" />
              <span className="hidden sm:inline">Focus Timer</span>
            </button>

            <button
              aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
              onClick={() => updateAccessibility({ theme: isDark ? "light" : "dark" })}
              className="p-2 rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors text-lg leading-none"
            >
              {isDark ? "🌙" : "☀️"}
            </button>

            {/* Scholar avatar / profile menu */}
            <div className="relative">
              <button
                id="scholar-avatar-btn"
                onClick={() => setShowMenu((v) => !v)}
                className="flex items-center gap-2 rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
                aria-label="Scholar menu"
              >
                <Avatar className="w-8 h-8 ring-2 ring-primary/40 ring-offset-1 ring-offset-background">
                  {scholar?.avatar
                    ? <AvatarImage src={scholar.avatar} alt={scholar.name} />
                    : null}
                  <AvatarFallback className="text-xs font-bold bg-primary-container text-on-primary-container">
                    {scholar ? getInitials(scholar.name) : "🎓"}
                  </AvatarFallback>
                </Avatar>
                {scholar && (
                  <span className="hidden sm:block text-xs font-label font-semibold text-on-surface max-w-20 truncate">
                    {scholar.name.split(" ")[0]}
                  </span>
                )}
              </button>

              {/* Dropdown */}
              {showMenu && (
                <div
                  className="absolute right-0 top-10 w-52 rounded-xl border border-outline-variant bg-surface shadow-xl shadow-black/10 overflow-hidden z-50"
                  onBlur={() => setShowMenu(false)}
                >
                  {scholar && (
                    <div className="px-4 py-3 border-b border-outline-variant">
                      <p className="text-sm font-label font-bold text-on-surface truncate">{scholar.name}</p>
                      <p className="text-xs font-label text-on-surface-variant truncate">{scholar.tagline}</p>
                    </div>
                  )}
                  <button
                    id="logout-btn"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-4 py-3 text-sm font-label font-semibold text-on-surface-variant hover:bg-error-container hover:text-on-error-container transition-colors"
                  >
                    <LogOut size={14} /> Log Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile nav */}
        <nav
          className="md:hidden flex items-center gap-1 overflow-x-auto px-3 pb-2 font-label"
          aria-label="Primary"
        >
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`shrink-0 px-3 py-1.5 rounded-lg text-xs transition-colors ${
                  active
                    ? "bg-primary-container text-on-primary-container font-semibold"
                    : "text-on-surface-variant"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </header>
    </>
  );
}
