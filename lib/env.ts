import { z } from "zod"

// Parse and validate environment variables once at startup.
// Add a field here whenever you reference a new process.env.X in code.
// Required vars use .min(1) / .url() etc; optional vars use .optional().
const EnvSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),

  // Example public var (safe to expose to the browser):
  // NEXT_PUBLIC_APP_URL: z.string().url(),

  // Comma-separated list of Google Gemini API keys (server-only). The Gemini
  // routes rotate through them in order: the first key whose call returns 2xx
  // wins; failures (quota, rate limit, etc.) bump to the next key.
  // See lib/gemini-keys.ts for the rotation helper.
  //
  // Allowed to be empty so that the build doesn't crash if the var isn't
  // configured (e.g. on a fresh Vercel deploy before envs are set). At
  // request time, the API route returns a 502 with no-keys-configured
  // and the client falls back to deterministic stub chapters.
  GEMINI_API_KEYS: z.string().default(""),
})

export const env = EnvSchema.parse(process.env)
export type Env = z.infer<typeof EnvSchema>
