import { NextResponse } from "next/server"

import type { SpellbookChapter } from "@/lib/data/spellbook-stubs"
import { callGeminiWithRotation } from "@/lib/gemini-keys"
import {
  DIFFICULTY_CHAPTERS,
  DIFFICULTY_LABELS,
  PACE_DESCRIPTORS,
} from "@/lib/schemas/forge-schema"
import {
  ForgeRequestSchema,
  GeneratedSpellbookSchema,
} from "@/lib/schemas/spellbook-generation"

const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent"

// Gemini's JSON schema (subset of OpenAPI). Tells the model exactly what
// shape to return so we don't need to babysit free-form text.
const GEMINI_RESPONSE_SCHEMA = {
  type: "object",
  properties: {
    chapters: {
      type: "array",
      items: {
        type: "object",
        properties: {
          title: { type: "string" },
          dayLabel: { type: "string" },
          tasks: { type: "array", items: { type: "string" } },
          resources: { type: "array", items: { type: "string" } },
        },
        required: ["title", "dayLabel", "tasks", "resources"],
      },
    },
  },
  required: ["chapters"],
} as const

type PromptInput = {
  topic: string
  purpose: string
  paceLabel: string
  paceDescriptor: string
  chapterCount: number
}

function buildPrompt({
  topic,
  purpose,
  paceLabel,
  paceDescriptor,
  chapterCount,
}: PromptInput) {
  return `You are a wizard-scribe who designs Spellbooks of mastery for apprentices.

A student has come to learn: "${topic}"
Their purpose: ${purpose || "(unstated — assume curious self-development)"}
Their chosen pace: ${paceLabel}
${paceDescriptor}

Craft a Spellbook with EXACTLY ${chapterCount} chapters. Each chapter is one step on the journey to master "${topic}". Chapters must build progressively from beginner foundations to true mastery — the order matters. The CADENCE and DEPTH of each chapter must match the pace above (short punchy daily rituals for Fast; longer, richer chapters for No deadline).

For EACH chapter, return:
- title: 2 to 5 words. Evocative, with mild wizard/fantasy flavour. MUST be specific to "${topic}" and to the content of THIS chapter — never generic ("Awakening", "The First Glyph"). Example for Italian Pasta: "Choosing the Flour", "The Egg-and-Well", "Hand-rolling Tagliatelle".
- dayLabel: "Day 1", "Day 2", … starting from "Day 1"
- tasks: exactly 3 actionable mini-tasks the student can do in the time their pace allows (~5-15 minutes for Fast, ~15-30 minutes for No deadline). Practical and specific to the topic — not abstract advice. Phrase as direct instructions ("Knead the dough for 8 minutes…", not "Get better at kneading").
- resources: 2 short references. Mix REAL (real books / websites / people / techniques) and whimsical-fantasy ("scroll of …", "tome of …"). Specific enough to look up if real.

Tone: a learned scribe — warm, formal, lightly mystical. Don't overdo wizard speak; clarity wins.

Language: respond in the same language as the topic. If the topic is in English, all output is English. If the topic is in Ukrainian or Russian (e.g. "італійська паста"), title/tasks/resources are all in that same language.

Return JSON ONLY, matching the schema. No prose outside the JSON.`
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null)
    const parsed = ForgeRequestSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Bad request", issues: parsed.error.issues },
        { status: 400 }
      )
    }

    const { topic, purpose, difficulty } = parsed.data
    const chapterCount = DIFFICULTY_CHAPTERS[difficulty]

    const prompt = buildPrompt({
      topic,
      purpose,
      paceLabel: DIFFICULTY_LABELS[difficulty],
      paceDescriptor: PACE_DESCRIPTORS[difficulty],
      chapterCount,
    })

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
            temperature: 0.8,
          },
        }),
      }
    )

    if (!geminiRes.ok) {
      const errText = await geminiRes.text()
      console.error("Gemini call failed:", geminiRes.status, errText)
      return NextResponse.json(
        { error: "Gemini API failed", status: geminiRes.status },
        { status: 502 }
      )
    }

    const geminiBody = (await geminiRes.json()) as unknown
    const rawText = extractTextFromGeminiResponse(geminiBody)
    if (!rawText) {
      console.error("Gemini returned no text:", geminiBody)
      return NextResponse.json(
        { error: "Empty Gemini response" },
        { status: 502 }
      )
    }

    let rawJson: unknown
    try {
      rawJson = JSON.parse(rawText)
    } catch (parseErr) {
      console.error("Gemini text was not JSON:", rawText, parseErr)
      return NextResponse.json(
        { error: "Malformed JSON from Gemini" },
        { status: 502 }
      )
    }

    const validated = GeneratedSpellbookSchema.safeParse(rawJson)
    if (!validated.success) {
      console.error("Gemini JSON failed schema:", validated.error.issues)
      return NextResponse.json(
        { error: "Generated chapters did not match schema" },
        { status: 502 }
      )
    }

    // Trim to exactly the requested chapter count (model sometimes overshoots)
    // and assign stable IDs the client can use as React keys + store keys.
    const chapters: SpellbookChapter[] = validated.data.chapters
      .slice(0, chapterCount)
      .map((ch, i) => ({
        id: `ch-${i}`,
        index: i,
        dayLabel: ch.dayLabel || `Day ${i + 1}`,
        title: ch.title,
        tasks: ch.tasks.slice(0, 4).map((text, j) => ({
          id: `ch-${i}-task-${j}`,
          text,
        })),
        resources: ch.resources.slice(0, 3).map((label, j) => ({
          id: `ch-${i}-res-${j}`,
          label,
        })),
      }))

    return NextResponse.json({ chapters })
  } catch (err) {
    console.error("Forge route unexpected error:", err)
    return NextResponse.json({ error: "Internal error" }, { status: 500 })
  }
}

// Gemini's response wraps the actual text inside candidates[0].content.parts[0].text.
// Narrow the unknown shape safely without leaning on `any`.
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
