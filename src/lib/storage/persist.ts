const STORAGE_KEY = "studyflow-ai:v1";

export interface PersistedShape {
  studyFlow: unknown;
  taskCompletion: Record<string, boolean>;
  flashcardReview: Record<string, "unseen" | "correct" | "incorrect">;
  accessibility: {
    theme: "light" | "dark";
    dyslexiaFont: boolean;
    reducedMotion: boolean;
    focusReading: boolean;
  };
}

export function loadPersisted(): Partial<PersistedShape> | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Partial<PersistedShape>;
  } catch {
    return null;
  }
}

export function savePersisted(state: PersistedShape) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage can fail (private browsing, quota). Non-fatal — app still works this session.
  }
}
