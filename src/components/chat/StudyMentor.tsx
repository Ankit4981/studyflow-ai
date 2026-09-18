"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles, Send, Bot, User, Trash2,
  Volume2, VolumeX, ChevronDown
} from "lucide-react";
import { useAppState } from "@/lib/state/AppStateContext";
import { playSound } from "@/lib/audioEffects";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

const QUICK_PROMPTS = [
  "Explain this concept simpler (ELI5)",
  "Give me a sticky memory mnemonic",
  "Quiz me with a hard question",
  "Give a real-world analogy",
];

let msgSequence = 0;
function createMessageId(prefix: string): string {
  msgSequence += 1;
  return `${prefix}-${msgSequence}`;
}

export function StudyMentor() {
  const { studyFlow } = useAppState();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "👋 Greetings Scholar! I'm **Sensei AI**, your academic study mentor. Ask me to clarify tricky notes, invent memory mnemonics, or test you on any concept!",
      timestamp: "Now",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  async function sendMessage(textToSend?: string) {
    const text = (textToSend || input).trim();
    if (!text || isLoading) return;

    playSound("click");
    const userMsgId = createMessageId("u");
    const userMsg: ChatMessage = {
      id: userMsgId,
      role: "user",
      content: text,
      timestamp: "Just now",
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const contextNotes = studyFlow
        ? `Title: ${studyFlow.title}\nSummary: ${studyFlow.summary}\nELI5: ${studyFlow.eli5}\nKey Takeaways:\n${studyFlow.keyTakeaways.map((k) => `- ${k.title}: ${k.description}`).join("\n")}`
        : undefined;

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg].map((m) => ({ role: m.role, content: m.content })),
          contextNotes,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to reach Sensei");

      const botMsgId = createMessageId("b");
      const botMsg: ChatMessage = {
        id: botMsgId,
        role: "assistant",
        content: data.reply || "I am reflecting on that...",
        timestamp: "Just now",
      };

      setMessages((prev) => [...prev, botMsg]);
      playSound("chime");
    } catch {
      const errMsgId = createMessageId("err");
      setMessages((prev) => [
        ...prev,
        {
          id: errMsgId,
          role: "assistant",
          content: "⚠️ Sensei was momentarily interrupted. Please try asking again.",
          timestamp: "Now",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  function handleSpeak(text: string) {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const clean = text.replace(/[*_`#]/g, "");
    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.rate = 1.05;
    utterance.pitch = 1.0;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  }

  function handleClear() {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    const clearedId = typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : "cleared";
    setMessages([
      {
        id: clearedId,
        role: "assistant",
        content: "Chat history cleared. What would you like to study next?",
        timestamp: "Now",
      },
    ]);
  }

  return (
    <>
      {/* Floating Sensei Trigger Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <motion.button
          id="open-sensei-ai-btn"
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          onClick={() => {
            playSound("click");
            setIsOpen((v) => !v);
          }}
          className="flex items-center gap-2.5 px-4 py-3 rounded-full bg-linear-to-r from-primary to-amber-700 text-white shadow-xl shadow-primary/25 border-2 border-white/20 hover:shadow-2xl transition-all"
        >
          <Sparkles size={18} className="animate-spin" style={{ animationDuration: "6s" }} />
          <span className="font-label font-bold text-xs uppercase tracking-wider">
            Ask Sensei AI
          </span>
          {studyFlow && (
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="Context loaded" />
          )}
        </motion.button>
      </div>

      {/* Floating Chat Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", bounce: 0.2, duration: 0.35 }}
            className="fixed bottom-20 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-105 h-145 max-h-[82vh] rounded-3xl border border-outline-variant bg-surface/95 backdrop-blur-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-outline-variant bg-surface-container-low/80">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center text-primary font-bold text-sm">
                  🥋
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <p className="font-headline font-bold text-on-surface text-sm">Sensei AI</p>
                    <span className="text-[10px] font-label font-bold px-1.5 py-0.2 rounded bg-secondary-container text-on-secondary-container">
                      Pro 1.5
                    </span>
                  </div>
                  <p className="text-[11px] font-label text-on-surface-variant">
                    {studyFlow ? `Grounded in "${studyFlow.title.slice(0, 20)}…"` : "24/7 Academic Study Mentor"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={handleClear}
                  title="Clear chat"
                  className="p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors"
                >
                  <Trash2 size={15} />
                </button>
                <button
                  id="close-sensei-ai-btn"
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors"
                >
                  <ChevronDown size={18} />
                </button>
              </div>
            </div>

            {/* Message Stream */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 font-label text-sm">
              {messages.map((m) => {
                const isUser = m.role === "user";
                return (
                  <div
                    key={m.id}
                    className={`flex items-start gap-2.5 ${isUser ? "flex-row-reverse" : "flex-row"}`}
                  >
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                        isUser
                          ? "bg-secondary-container text-on-secondary-container"
                          : "bg-primary-container text-primary"
                      }`}
                    >
                      {isUser ? <User size={13} /> : <Bot size={13} />}
                    </div>

                    <div
                      className={`max-w-[82%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed space-y-1 ${
                        isUser
                          ? "bg-primary text-on-primary rounded-tr-xs"
                          : "bg-surface-container-low border border-outline-variant text-on-surface rounded-tl-xs"
                      }`}
                    >
                      <div className="whitespace-pre-wrap">{m.content}</div>
                      {!isUser && (
                        <div className="flex items-center justify-between pt-1 opacity-70 text-[10px]">
                          <span>{m.timestamp}</span>
                          <button
                            onClick={() => handleSpeak(m.content)}
                            title="Read aloud"
                            className="hover:opacity-100 flex items-center gap-1 ml-2"
                          >
                            {isSpeaking ? <VolumeX size={11} /> : <Volume2 size={11} />}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {isLoading && (
                <div className="flex items-center gap-2 text-on-surface-variant text-xs py-2">
                  <div className="w-2 h-2 rounded-full bg-primary animate-ping" />
                  <span>Sensei is synthesizing wisdom…</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompt Chips */}
            <div className="px-3 py-1.5 flex gap-1.5 overflow-x-auto border-t border-outline-variant/60 bg-surface-container-low/30">
              {QUICK_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => sendMessage(prompt)}
                  disabled={isLoading}
                  className="shrink-0 px-2.5 py-1 rounded-full border border-outline-variant bg-surface text-[10px] font-label font-semibold text-on-surface-variant hover:text-primary hover:border-primary transition-all truncate max-w-50"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <div className="p-3 border-t border-outline-variant bg-surface">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  sendMessage();
                }}
                className="flex items-center gap-2"
              >
                <input
                  ref={inputRef}
                  id="sensei-chat-input"
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask Sensei anything about your notes…"
                  className="flex-1 rounded-xl border border-outline-variant bg-surface px-3.5 py-2 text-xs font-label text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  id="sensei-chat-send-btn"
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="p-2 rounded-xl bg-primary text-on-primary hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  <Send size={14} />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
