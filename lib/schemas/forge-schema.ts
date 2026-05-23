import { z } from "zod"

// Internal value names stay as `apprentice/adept/archmage` so that already-
// persisted library books and store state continue to work. The user-facing
// language switches from "Difficulty" to "Pace" — apprentice now reads as
// "Fast", adept as "Normal", archmage as "No deadline".
export const difficultySchema = z.enum(["apprentice", "adept", "archmage"])
export type Difficulty = z.infer<typeof difficultySchema>

// Custom topic input — user typed their own skill on screen 1.
// .trim() before length check handles whitespace-only entries cleanly.
// No regex — accept Ukrainian / Russian / any unicode without surprises.
export const customTopicSchema = z
  .string()
  .trim()
  .min(1, "Type at least one character")
  .max(80, "Keep it short — under 80 characters")

export const purposeSchema = z
  .string()
  .trim()
  .max(120, "Keep it short — under 120 characters")

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  apprentice: "Fast",
  adept: "Normal",
  archmage: "No deadline",
}

export const DIFFICULTY_CHAPTERS: Record<Difficulty, number> = {
  apprentice: 5,
  adept: 10,
  archmage: 15,
}

// Human-readable pace hint, passed to the AI prompt so chapter cadence and
// task density match what the user signed up for.
export const PACE_DESCRIPTORS: Record<Difficulty, string> = {
  apprentice:
    "Fast — a week of focused practice, daily 5-minute rituals, short punchy tasks.",
  adept:
    "Normal — about a month, weekly deep dives, mid-length tasks with room to think between them.",
  archmage:
    "No deadline — your own cadence, longer richer chapters that invite real exploration.",
}
