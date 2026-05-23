import { z } from "zod"

import { difficultySchema } from "@/lib/schemas/forge-schema"

// Request body the /api/forge route accepts from the client.
export const ForgeRequestSchema = z.object({
  topic: z.string().trim().min(1).max(120),
  purpose: z.string().trim().max(200),
  difficulty: difficultySchema,
})

export type ForgeRequest = z.infer<typeof ForgeRequestSchema>

// Shape Gemini returns inside the `chapters` array. Per-field limits keep
// runaway tokens from breaking the UI layout if the model decides to wax poetic.
export const GeneratedChapterSchema = z.object({
  title: z.string().trim().min(1).max(120),
  dayLabel: z.string().trim().min(1).max(20),
  tasks: z.array(z.string().trim().min(1).max(240)).min(1).max(6),
  resources: z.array(z.string().trim().min(1).max(240)).max(6),
})

export type GeneratedChapter = z.infer<typeof GeneratedChapterSchema>

export const GeneratedSpellbookSchema = z.object({
  chapters: z.array(GeneratedChapterSchema).min(1).max(20),
})

export type GeneratedSpellbook = z.infer<typeof GeneratedSpellbookSchema>
