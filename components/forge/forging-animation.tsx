"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import {
  buildSpellbook,
  type SpellbookChapter,
} from "@/lib/data/spellbook-stubs"
import { useForgeStore } from "@/lib/stores/forge-store"

const DOTS = ["", ".", "..", "..."] as const
const MIN_ANIMATION_MS = 2200

export function ForgingAnimation() {
  const router = useRouter()
  const topic = useForgeStore((s) => s.topic)
  const purpose = useForgeStore((s) => s.purpose)
  const difficulty = useForgeStore((s) => s.difficulty)
  const setChapters = useForgeStore((s) => s.setChapters)
  const [tick, setTick] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 380)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (!topic || !difficulty) return
    const startedAt = Date.now()
    let cancelled = false

    const settle = async (chapters: SpellbookChapter[]) => {
      const elapsed = Date.now() - startedAt
      const wait = Math.max(0, MIN_ANIMATION_MS - elapsed)
      if (wait > 0) {
        await new Promise((resolve) => setTimeout(resolve, wait))
      }
      if (cancelled) return
      setChapters(chapters)
      router.push("/forge/spellbook")
    }

    const run = async () => {
      try {
        const res = await fetch("/api/forge", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ topic, purpose, difficulty }),
        })
        if (!res.ok) throw new Error(`Forge route returned ${res.status}`)
        const data = (await res.json()) as { chapters?: SpellbookChapter[] }
        if (!data.chapters?.length) throw new Error("No chapters in response")
        await settle(data.chapters)
      } catch (err) {
        console.error("Gemini failed, falling back to stub:", err)
        await settle(buildSpellbook(difficulty))
      }
    }

    run()
    return () => {
      cancelled = true
    }
  }, [topic, purpose, difficulty, setChapters, router])

  const dots = DOTS[tick % DOTS.length]

  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center gap-10 bg-background px-6">
      <div className="relative flex flex-col items-center gap-2">
        <div className="relative">
          <div className="absolute inset-0 -m-6 animate-ping rounded-full bg-primary/10" />
          <div
            className="relative text-7xl"
            style={{ animation: "floatBook 2.4s ease-in-out infinite" }}
            aria-hidden
          >
            📖
          </div>
        </div>
        <div
          className="text-3xl"
          style={{ animation: "scratchQuill 2.4s ease-in-out infinite" }}
          aria-hidden
        >
          🪶
        </div>
      </div>

      <div className="flex flex-col items-center gap-3 text-center">
        <p className="font-mono text-xs tracking-[0.08em] text-muted-foreground uppercase">
          forging
        </p>
        <h1 className="font-display text-3xl tracking-tight text-foreground sm:text-4xl">
          A spellbook for « {topic} »{dots}
        </h1>
        <p className="max-w-md font-sans text-sm text-muted-foreground">
          binding pages, whispering glyphs, summoning chapters
        </p>
      </div>

      <style>{`
        @keyframes floatBook {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        @keyframes scratchQuill {
          0%, 100% { transform: translate(0, 0) rotate(-8deg); opacity: 0.8; }
          50% { transform: translate(8px, -4px) rotate(12deg); opacity: 1; }
        }
      `}</style>
    </div>
  )
}
