# StudyFlow AI ✦ Revision Dojo

An intelligent study, accessibility, and micro-workflow assistant for students — built with **Next.js (App Router)**, **TypeScript**, **Google Gemini AI**, and **Tailwind CSS v4**, styled with the **Editorial Notebook** design system.

---

## 🌟 Core Features & Modules

### 1. 🥋 Scholar Onboarding & Registration (`/login`)
- RPG-style scholar profile selection (Alex Rivera - Warrior Scholar / Maya Chen - Arcane Scholar) or custom avatar.
- Class, curriculum board (CBSE, ICSE, IB, State Board, Cambridge), and school metadata tracking.
- Distraction-free entry experience with zero external dependencies (persisted locally with reactive client state sync).

### 2. ⚡ AI Study Transformation Hub (`/`)
- Multi-format input hub: **Notes**, **Assignment Breakdown**, and **Exam Study Guide**.
- Powered by **Google Gemini 1.5 Pro / Flash** with server-side structured output validation via **Zod**.
- **Resilient Offline Fallback Engine**: Generates high-yield study flows even during network downtime or without an API key.
- Structured Results: Concise Executive Summary, ELI5 (Explain Like I'm 5) Analogy, Key Takeaway Cards, and Deep-Dive Conceptual FAQ Accordions.

### 3. 📋 Micro-Tasks Vertical Timeline (`/micro-tasks`)
- Granular breakdown of complex materials into 15–25 minute manageable learning milestones.
- Priority badges (`High`, `Medium`, `Low`), time estimates, and step-by-step progress tracking.
- Direct synchronization with the **Dojo Focus Lounge** pomodoro timer.

### 4. 🎴 3D Flashcard Revision Arena (`/flashcards`)
- Interactive realistic 3D perspective flip card deck.
- Spaced review states: *"Need practice"* vs *"I knew this"* with mastery progress tracking.
- Audio sound effects, flip hotkeys (`Space`, Arrow keys), and shuffle mode.

### 5. 🏆 Exam Arena & AI Quiz Generator (`/quiz`)
- Full multiple-choice exam simulator across Physics, Computer Science, Mathematics, Biology, Chemistry, and History.
- **AI Custom Exam Generation**: Takes study notes and generates exam questions on demand.
- Timed exam mode, instant feedback with detailed rationales, score ranking, XP leveling, and confetti celebration.

### 6. 🥋 24/7 Sensei AI Academic Tutor (Floating Dock)
- Embedded academic study companion available from every screen.
- Grounded directly in the active study notes context.
- Quick prompts for ELI5 explanations, memory mnemonics, concept drills, and text-to-speech audio readouts.

### 7. ⏳ Dojo Focus Lounge (Pomodoro & Soundscapes)
- Built-in customizable focus timers: 25m Pomodoro, 50m Deep Work, 5m Short Break, 10m Rest.
- **Real-Time WebAudio Sound Synthesizer**: Generates 40Hz Gamma binaural focus waves, rain soundscapes, and calming white noise offline directly in the browser.
- Session completion XP rewards (`+50 XP`).

### 8. 📊 Progress & Mastery Dashboard (`/progress`)
- 16-Week GitHub-style interactive study activity heatmap.
- Scholar Rank & XP Leveling system (Novice → Apprentice → Adept → Master → Grand Sensei).
- Multi-tier achievement badges, streak counter, and weekly milestone tracking.

### 9. ♿ Universal Accessibility & Study Comfort (`/accessibility`)
- **Dyslexia-Friendly Typography**: Enhanced character distinction and bottom-weighted letter spacing.
- **Focus Reading Ruler**: Movable line highlighter with surrounding dimming for ADHD/visual tracking.
- **Text-to-Speech (TTS) Suite**: Voice selection, speed rate slider (0.7x–1.6x), pitch controls, and live audio testing.
- **Reduced Motion & High-Contrast**: Disables 3D flip animations and optimizes readability.
- **Keyboard Shortcuts Reference**: Complete hotkey guide for mouse-free power study.

### 10. 👥 Study Buddies & Virtual Study Rooms (`/buddies`)
- Buddy matching, presence indicators (Online / In Session / Offline), and 1-click Gmail study session invites.

### 11. 📖 Study Reflection Journal (`/journal`)
- Daily learning logs, mood tracking (🚀, 💡, 📚, 🎯, 🤝), and tag filters.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16 (App Router with Turbopack) |
| **Language** | TypeScript 5 (Strict mode) |
| **UI & Styling** | Tailwind CSS v4, Vanilla CSS Design Tokens, Motion 13 |
| **Icons & Components** | Lucide React, Radix UI Primitives |
| **AI Integration** | Google Generative AI (`@google/generative-ai`) |
| **Validation** | Zod Schema Validation |
| **Audio & FX** | Web Audio API Synthesizer & HTML5 SpeechSynthesis |

---

## 🚀 Getting Started

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/your-username/studyflow-ai.git
cd studyflow-ai
npm install
```

### 2. Configure Environment Variables

Copy the example environment file:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your Google Gemini API Key:

```env
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-1.5-pro
```

*(Note: If no API key is provided, the application automatically uses the resilient offline fallback generator for all study transformations.)*

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production & Lint

```bash
npm run lint    # ESLint check (0 errors, 0 warnings)
npm run build   # Next.js production build & typecheck
npm run start   # Start production server
```

---

## 📁 Project Directory Structure

```
studyflow-ai/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root HTML & Global Provider Layout
│   │   ├── page.tsx                # Step 1: AI Transformation Workspace
│   │   ├── login/page.tsx          # Scholar Registration & Onboarding
│   │   ├── micro-tasks/page.tsx    # Step 2: Micro-Tasks Vertical Timeline
│   │   ├── flashcards/page.tsx     # Step 3: 3D Flashcard Revision Deck
│   │   ├── quiz/page.tsx           # Step 4: Exam Arena & AI Quiz Generator
│   │   ├── progress/page.tsx       # Progress Dashboard & Activity Heatmap
│   │   ├── accessibility/page.tsx  # Universal Accessibility Suite
│   │   ├── buddies/page.tsx        # Study Buddies & Invitations
│   │   ├── journal/page.tsx        # Study Reflection Journal
│   │   ├── demo/page.tsx           # Pre-seeded Demo Loader
│   │   └── api/
│   │       ├── transform/route.ts  # Gemini AI Material Transform Endpoint
│   │       ├── chat/route.ts       # Sensei AI Tutor Chat Endpoint
│   │       └── quiz/route.ts       # AI Exam Generator Endpoint
│   ├── components/
│   │   ├── navigation/             # AppShell, Header, Footer, Step Tracker
│   │   ├── workspace/              # InputHub, ResultPanel, ProcessingState
│   │   ├── micro-tasks/            # TaskTimeline, TaskCard
│   │   ├── flashcards/             # FlashcardArena, Card3D
│   │   ├── chat/                   # StudyMentor Floating Dock
│   │   ├── focus/                  # FocusTimerModal with Sound Synthesizer
│   │   ├── watermelon/             # Journal Navigation Component
│   │   └── ui/ / base-ui/          # Button, Card, Avatar, ProgressBar
│   ├── lib/
│   │   ├── ai/                     # System Prompts & User Prompt Builders
│   │   ├── schemas/                # Zod Schemas for AI Structured Outputs
│   │   ├── hooks/                  # useScholar Safe Storage Hook
│   │   ├── state/                  # AppStateContext
│   │   ├── audioEffects.ts         # Audio Chimes & Sound FX
│   │   ├── confetti.ts             # Celebration Confetti Particles
│   │   ├── quizBank.ts             # Curated Exam Questions
│   │   └── demoContent.ts          # Pre-seeded Biology & History Notes
│   └── types/                      # TypeScript Interfaces & Definitions
├── public/                         # Static Assets & Icons
├── package.json
└── tsconfig.json
```

---

## 🛡️ Resilience & Error Handling

- **Zero-Failure Fallback**: If the AI API is unreachable or times out, the system generates relevant structured tasks, summaries, and flashcards so students are never blocked.
- **Strict Zod Parsing**: Model responses are parsed and validated on the server boundary before being transmitted to the client.
- **Client-Side Persistence**: Uses `useSyncExternalStore` and `localStorage` to safeguard scholar progress, XP, completed tasks, and review states across reloads without SSR hydration mismatches.

---

## 📄 License

MIT License. Designed with care for students and lifelong learners worldwide.
