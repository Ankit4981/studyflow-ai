import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const runtime = "nodejs";

const CANDIDATE_MODELS = [
  process.env.GEMINI_MODEL,
  "gemini-1.5-flash",
  "gemini-2.0-flash",
  "gemini-1.5-flash-latest",
  "gemini-1.5-pro",
].filter(Boolean) as string[];

const CHAT_SYSTEM_PROMPT = `You are "Sensei AI", the master academic tutor and study companion embedded inside StudyFlow AI.
Your goal is to guide students through any academic concept with crystal clarity, warmth, and high-impact pedagogical techniques.

Guidelines:
1. Be concise, engaging, and structured. Use bolding, bullet points, and clean formatting.
2. If asked to explain something simply, use vivid real-world analogies (ELI5 style).
3. If asked for mnemonics, create clever, sticky memory devices.
4. When relevant, format math with clear notation and code with markdown code blocks.
5. If the user provides context about their active study notes, seamlessly ground your answers in their material.
6. Keep a supportive, encouraging, high-energy academic tone.`;

function generateFallbackChat(userQuery: string, contextNotes?: string): string {
  const queryLower = userQuery.toLowerCase().trim();

  if (queryLower.includes("hi") || queryLower.includes("hello") || queryLower.includes("hey") || queryLower === "hi") {
    return "👋 **Greetings Scholar!** I am **Sensei AI**, your academic study mentor.\n\nI am ready to help you master your material! You can ask me to:\n- 💡 **Explain any concept simpler (ELI5)**\n- 🧠 **Create sticky memory mnemonics**\n- 🎯 **Quiz you on tricky concepts**\n- 🚀 **Provide real-world analogies**\n\nWhat would you like to explore today?";
  }

  if (queryLower.includes("mnemonic") || queryLower.includes("memory")) {
    return "🧠 **Sensei's Mnemonic Vault:**\n\nHere is a sticky memory hook:\n> **P-E-M-D-A-S** (Please Excuse My Dear Aunt Sally) → Parentheses, Exponents, Multiplication, Division, Addition, Subtraction.\n\nTo build a custom mnemonic for your current notes, tell me the exact list of keywords or formulas you want to memorize!";
  }

  if (queryLower.includes("eli5") || queryLower.includes("simple") || queryLower.includes("analogy")) {
    if (contextNotes) {
      return `💡 **ELI5 Conceptual Breakdown:**\n\nThink of this mechanism like building with interlocking LEGO blocks: you first set down the solid foundation baseplates before adding complex towers on top.\n\nWhich specific section of your notes would you like me to simplify next?`;
    }
    return "💡 **ELI5 Principle (Feynman Technique):**\n\nTo truly understand any concept, explain it in plain language without jargon, as if teaching a beginner. Pinpoint where your explanation gets fuzzy — that is your exact learning gap!";
  }

  if (queryLower.includes("quiz") || queryLower.includes("question") || queryLower.includes("test")) {
    return "🎯 **Pop Quiz Challenge!**\n\n**Question:** Which problem-solving strategy explores every branch layer-by-layer using a FIFO queue?\n- **A)** Depth-First Search (DFS)\n- **B)** Breadth-First Search (BFS)\n- **C)** Linear Scan\n- **D)** QuickSort\n\n*(Answer with your choice and I'll explain why it's correct!)*";
  }

  return `🥋 **Sensei AI Guidance:**\n\nGreat question! To master this with maximum retention:\n1. **Active Recall**: Try explaining the principle out loud in your own words.\n2. **Spaced Repetition**: Revisit your 3D flashcards in the Revision Arena.\n\n${
    contextNotes
      ? "Grounded in your active study material: focus especially on the key takeaways and causal definitions."
      : "Feel free to ask for explanations, definitions, or test questions anytime!"
  }`;
}

export async function POST(req: NextRequest) {
  let body: { messages?: Array<{ role: "user" | "assistant"; content: string }>; contextNotes?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request payload." }, { status: 400 });
  }

  const { messages = [], contextNotes } = body;
  const latestUserMsg = [...messages].reverse().find((m) => m.role === "user")?.content || "";

  const apiKey = process.env.GEMINI_API_KEY;
  const isKeyConfigured = apiKey && apiKey !== "your_gemini_api_key_here" && apiKey.startsWith("AIza");

  if (isKeyConfigured) {
    const genAI = new GoogleGenerativeAI(apiKey);

    // Prepare alternating valid contents
    const contents: Array<{ role: "user" | "model"; parts: Array<{ text: string }> }> = [];

    if (contextNotes) {
      contents.push({
        role: "user",
        parts: [{ text: `[ACTIVE STUDY CONTEXT FOR CURRENT SESSION]:\n${contextNotes.slice(0, 2500)}\n\nPlease use this context to assist me.` }],
      });
      contents.push({
        role: "model",
        parts: [{ text: "Got it! I have your current study material in mind. What would you like to explore, clarify, or practice?" }],
      });
    }

    messages.forEach((m) => {
      if (!m.content || !m.content.trim()) return;
      const role: "user" | "model" = m.role === "assistant" ? "model" : "user";

      // Gemini requires the conversation to start with user
      if (contents.length === 0 && role === "model") {
        return;
      }

      // Merge consecutive turns of the same role to prevent API error
      if (contents.length > 0 && contents[contents.length - 1].role === role) {
        contents[contents.length - 1].parts[0].text += `\n\n${m.content}`;
      } else {
        contents.push({
          role,
          parts: [{ text: m.content }],
        });
      }
    });

    // Must have at least one user message
    if (contents.length === 0 && latestUserMsg) {
      contents.push({ role: "user", parts: [{ text: latestUserMsg }] });
    }

    if (contents.length > 0) {
      for (const modelName of CANDIDATE_MODELS) {
        try {
          const geminiModel = genAI.getGenerativeModel({
            model: modelName,
            systemInstruction: CHAT_SYSTEM_PROMPT,
          });

          const result = await geminiModel.generateContent({
            contents,
            generationConfig: {
              maxOutputTokens: 2048,
              temperature: 0.6,
            },
          });

          const reply = result.response.text();
          if (reply && reply.trim().length > 0) {
            return NextResponse.json({ reply });
          }
        } catch (err: unknown) {
          console.warn(`Chat model "${modelName}" failed, attempting fallback candidate:`, err instanceof Error ? err.message : err);
        }
      }
    }
  }

  // Resilient fallback ensures Sensei AI always responds smoothly
  const fallbackReply = generateFallbackChat(latestUserMsg, contextNotes);
  return NextResponse.json({ reply: fallbackReply });
}
