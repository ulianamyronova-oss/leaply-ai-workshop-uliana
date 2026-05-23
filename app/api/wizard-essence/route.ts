import { NextResponse } from "next/server"

import { callGeminiWithRotation } from "@/lib/gemini-keys"
import {
  WizardEssenceRequestSchema,
  WizardEssenceResponseSchema,
} from "@/lib/schemas/wizard-essence"

const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent"

const GEMINI_RESPONSE_SCHEMA = {
  type: "object",
  properties: {
    description: { type: "string" },
  },
  required: ["description"],
} as const

function buildPrompt(input: {
  name: string
  raceLabel: string
  raceTitle: string
  raceEssence: string
  rank: string
  topics: string[]
}) {
  return `You are the chronicler of the Wizard's Library. Write a 2-3 sentence identity portrait of an apprentice in the wizard / scribe voice — warm, formal, lightly mystical.

Apprentice:
- Name: ${input.name}
- Calling: ${input.raceLabel} (${input.raceTitle} — "${input.raceEssence}")
- Rank: ${input.rank}
- Mastered tomes: ${input.topics.map((t) => `"${t}"`).join(", ")}

The portrait MUST:
1. Treat them as a single, distinct mage with a unique sensibility.
2. Weave the mastered topics into ONE identity — show what unexpected things this COMBINATION conjures. Don't just list the skills; reveal how they merge into a singular craft. If only one topic is mastered, show how it has reshaped them.
3. Show the magic that this specific blend creates that no single tome could — a fingerprint of practices.
4. Use third person ("She…", "He…", "They…"). Pick a pronoun that matches the name's vibe or default to "they".
5. 2 to 3 sentences. Tight. Each sentence earns its keep.
6. Mention at least 2 of the actual topic names by name (or all of them if there are 2 or fewer), but braided into the prose, not bulleted.
7. NO list of skills. NO "and N more". No bullet points. Just prose.

Voice guide — examples (do not copy, just feel the tone):

Designer who mastered Watercolor, Italian Pasta, Tarot:
"Mira moves between studio and kitchen like a single ritual — her plating draws from wet-on-wet washes, her menus echo the Hanged Man's pause. Where others see ingredients, she sees pigment."

Developer who mastered React hooks, Habit Running:
"Aldric debugs in stanzas — every dawn run leaves traces in his commit messages. His useEffects fire at the cadence of footfalls; his code rests as carefully as his calves."

Language: respond in the same language as the majority of the topics. If the topics are in English, write English. If they are in Ukrainian or Russian (e.g. "італійська паста"), write in that language.

Return JSON only, matching the schema. No prose outside the JSON.`
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null)
    const parsed = WizardEssenceRequestSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Bad request", issues: parsed.error.issues },
        { status: 400 }
      )
    }

    const prompt = buildPrompt(parsed.data)

    const geminiRes = await callGeminiWithRotation(
      (key) => `${GEMINI_URL}?key=${key}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: "application/json",
            responseSchema: GEMINI_RESPONSE_SCHEMA,
            temperature: 0.95,
          },
        }),
      }
    )

    if (!geminiRes.ok) {
      const errText = await geminiRes.text()
      console.error("Wizard essence Gemini failed:", geminiRes.status, errText)
      return NextResponse.json({ error: "Gemini API failed" }, { status: 502 })
    }

    const geminiBody = (await geminiRes.json()) as unknown
    const rawText = extractTextFromGeminiResponse(geminiBody)
    if (!rawText) {
      console.error("Wizard essence: empty response", geminiBody)
      return NextResponse.json({ error: "Empty response" }, { status: 502 })
    }

    let rawJson: unknown
    try {
      rawJson = JSON.parse(rawText)
    } catch (parseErr) {
      console.error("Wizard essence: not JSON", rawText, parseErr)
      return NextResponse.json({ error: "Malformed JSON" }, { status: 502 })
    }

    const validated = WizardEssenceResponseSchema.safeParse(rawJson)
    if (!validated.success) {
      console.error("Wizard essence: schema mismatch", validated.error.issues)
      return NextResponse.json({ error: "Schema mismatch" }, { status: 502 })
    }

    return NextResponse.json({ description: validated.data.description })
  } catch (err) {
    console.error("Wizard essence route error:", err)
    return NextResponse.json({ error: "Internal error" }, { status: 500 })
  }
}

function extractTextFromGeminiResponse(body: unknown): string | null {
  if (!body || typeof body !== "object") return null
  const candidates = (body as { candidates?: unknown }).candidates
  if (!Array.isArray(candidates) || candidates.length === 0) return null
  const first = candidates[0] as { content?: unknown }
  const content = first?.content
  if (!content || typeof content !== "object") return null
  const parts = (content as { parts?: unknown }).parts
  if (!Array.isArray(parts) || parts.length === 0) return null
  const text = (parts[0] as { text?: unknown }).text
  return typeof text === "string" ? text : null
}
