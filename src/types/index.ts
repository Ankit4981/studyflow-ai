export type MaterialType = "notes" | "assignment" | "guide";

export type TaskPriority = "low" | "medium" | "high";
export type FlashcardDifficulty = "easy" | "medium" | "hard";
export type ReviewState = "unseen" | "correct" | "incorrect";

export interface StudyTask {
  id: string;
  title: string;
  description: string;
  estimatedMinutes: number;
  priority: TaskPriority;
  order: number;
}

export interface StudyFlashcard {
  id: string;
  question: string;
  answer: string;
  difficulty: FlashcardDifficulty;
}

export interface KeyTakeaway {
  label: string;
  title: string;
  description: string;
}

export interface DeepDiveSection {
  question: string;
  answer: string;
}

export interface StudyFlow {
  id: string;
  title: string;
  sourceType: MaterialType;
  summary: string;
  eli5: string;
  keyTakeaways: KeyTakeaway[];
  deepDive: DeepDiveSection[];
  tasks: StudyTask[];
  flashcards: StudyFlashcard[];
  createdAt: string;
}

export interface AccessibilityPrefs {
  theme: "light" | "dark";
  dyslexiaFont: boolean;
  reducedMotion: boolean;
  focusReading: boolean;
}

export interface AppPersistedState {
  studyFlow: StudyFlow | null;
  taskCompletion: Record<string, boolean>;
  flashcardReview: Record<string, ReviewState>;
  accessibility: AccessibilityPrefs;
}
