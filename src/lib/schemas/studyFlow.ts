import { z } from "zod";

export const taskSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1).max(120),
  description: z.string().min(1).max(400),
  estimatedMinutes: z.number().int().positive().max(240),
  priority: z.enum(["low", "medium", "high"]),
  order: z.number().int().nonnegative(),
});

export const flashcardSchema = z.object({
  id: z.string().min(1),
  question: z.string().min(1).max(300),
  answer: z.string().min(1).max(600),
  difficulty: z.enum(["easy", "medium", "hard"]),
});

export const keyTakeawaySchema = z.object({
  label: z.string().min(1).max(40),
  title: z.string().min(1).max(80),
  description: z.string().min(1).max(220),
});

export const deepDiveSchema = z.object({
  question: z.string().min(1).max(140),
  answer: z.string().min(1).max(600),
});

export const studyFlowGenerationSchema = z.object({
  title: z.string().min(1).max(100),
  summary: z.string().min(1).max(700),
  eli5: z.string().min(1).max(500),
  keyTakeaways: z.array(keyTakeawaySchema).min(2).max(6),
  deepDive: z.array(deepDiveSchema).min(1).max(5),
  tasks: z.array(taskSchema).min(2).max(8),
  flashcards: z.array(flashcardSchema).min(4).max(15),
});

export type StudyFlowGeneration = z.infer<typeof studyFlowGenerationSchema>;

export const transformRequestSchema = z.object({
  material: z.string().min(20, "Please provide a bit more material to work with.").max(20000),
  materialType: z.enum(["notes", "assignment", "guide"]),
});
