import type { Metadata } from "next";
import { Newsreader, Source_Serif_4, Work_Sans } from "next/font/google";
import "./globals.css";
import { AppStateProvider } from "@/lib/state/AppStateContext";
import { AppShell } from "@/components/navigation/AppShell";

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-headline",
  display: "swap",
});

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const workSans = Work_Sans({
  subsets: ["latin"],
  variable: "--font-label",
  display: "swap",
});

export const metadata: Metadata = {
  title: "StudyFlow AI — Study, accessibility & micro-workflow assistant",
  description:
    "StudyFlow AI turns overwhelming academic material into simple explanations, key takeaways, micro-tasks, and flashcards.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${newsreader.variable} ${sourceSerif.variable} ${workSans.variable} font-label antialiased bg-background text-on-surface`}
      >
        <AppStateProvider>
          <AppShell>{children}</AppShell>
        </AppStateProvider>
      </body>
    </html>
  );
}
