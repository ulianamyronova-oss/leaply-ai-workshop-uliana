import { env } from "./env"

// Pre-split + trim once at module load. Filter blanks so an extra comma in
// the env file doesn't add an empty key. May be empty during a deploy
// where the env var hasn't been configured yet — `callGeminiWithRotation`
// handles that case at request time.
const KEYS = env.GEMINI_API_KEYS.split(",")
  .map((k) => k.trim())
  .filter(Boolean)

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
  if (KEYS.length === 0) {
    // No keys configured (e.g. fresh Vercel deploy without env vars).
    // Return a uniform 502 so the client-side fallback to stub chapters fires.
    return new Response(
      JSON.stringify({
        error:
          "No Gemini API keys configured. Set GEMINI_API_KEYS in environment variables.",
      }),
      { status: 502, headers: { "Content-Type": "application/json" } }
    )
  }

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
  if (last) return last
  return new Response(
    JSON.stringify({ error: "All Gemini keys failed to connect" }),
    { status: 502, headers: { "Content-Type": "application/json" } }
  )
}
