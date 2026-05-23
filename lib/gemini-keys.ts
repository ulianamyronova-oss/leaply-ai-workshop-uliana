import { env } from "./env"

// Pre-split + trim once at module load. Filter blanks so an extra comma in
// the env file doesn't add an empty key.
const KEYS = env.GEMINI_API_KEYS.split(",")
  .map((k) => k.trim())
  .filter(Boolean)

if (KEYS.length === 0) {
  throw new Error(
    "GEMINI_API_KEYS must contain at least one comma-separated key"
  )
}

export function geminiKeyCount(): number {
  return KEYS.length
}

// Calls Gemini through every key in turn until one returns a 2xx response.
// `buildUrl(key)` produces the request URL (the API key goes in the
// querystring `?key=…`). If every key fails the helper returns the LAST
// failed Response so the caller can still inspect status + body.
export async function callGeminiWithRotation(
  buildUrl: (key: string) => string,
  init: RequestInit
): Promise<Response> {
  let last: Response | null = null
  for (const key of KEYS) {
    let res: Response
    try {
      res = await fetch(buildUrl(key), init)
    } catch (err) {
      console.warn(
        `Gemini key …${key.slice(-4)} threw on fetch — trying next.`,
        err
      )
      continue
    }
    if (res.ok) return res
    console.warn(
      `Gemini key …${key.slice(-4)} → HTTP ${res.status}, trying next…`
    )
    last = res
  }
  // Every key failed. Return the last failure so the caller can read
  // its status + body and decide whether to fall back to a stub.
  if (last) return last
  // No response at all — every fetch threw. Synthesise a 502 so callers
  // get a uniform Response shape.
  return new Response(
    JSON.stringify({ error: "All Gemini keys failed to connect" }),
    { status: 502, headers: { "Content-Type": "application/json" } }
  )
}
