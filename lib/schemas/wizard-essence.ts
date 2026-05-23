import { z } from "zod"

// Sent by the wizard card whenever the mastered-topics list changes.
export const WizardEssenceRequestSchema = z.object({
  name: z.string().trim().min(1).max(60),
  raceLabel: z.string().trim().min(1).max(40),
  raceTitle: z.string().trim().min(1).max(60),
  raceEssence: z.string().trim().min(1).max(160),
  rank: z.string().trim().min(1).max(40),
  topics: z.array(z.string().trim().min(1).max(120)).min(1).max(20),
})

export type WizardEssenceRequest = z.infer<typeof WizardEssenceRequestSchema>

export const WizardEssenceResponseSchema = z.object({
  description: z.string().trim().min(10).max(700),
})

export type WizardEssenceResponse = z.infer<typeof WizardEssenceResponseSchema>
