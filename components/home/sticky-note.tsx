"use client"

import { useState } from "react"

import { useHasMounted } from "@/hooks/use-has-mounted"
import { cn } from "@/lib/utils"

const PREDICTIONS: string[] = [
  "Today, the first chapter is the hardest. Begin anyway.",
  "A small daily ritual outweighs a single heroic session.",
  "Curiosity beats discipline. Follow what tugs at you.",
  "The spellbook that calls to you today knows something you don't.",
  "Five minutes counts. Ten minutes is a gift. Three hours is a luxury.",
  "Skip a day. Do not skip two. The chain forgives once, never twice.",
  "Read the task aloud before doing it. The mouth wakes the hands.",
  "Today's reluctance becomes tomorrow's pride.",
  "The shelf doesn't shame you. It simply waits.",
  "A finished apprentice tome outweighs three abandoned archmages.",
  "Pick the easiest task in the chapter. Start there.",
  "Slowness is a feature, not a bug.",
  "If the practice feels heavy, the practice is working.",
  "Trust the cadence over the mood.",
  "Borrow yesterday's discipline. Pay it back tomorrow.",
]

// Picks a prediction stable for the current day so it feels intentional —
// not refreshing every render. New day = new omen.
function getDailyPrediction(): string {
  const dayBucket = Math.floor(Date.now() / (1000 * 60 * 60 * 24))
  return PREDICTIONS[dayBucket % PREDICTIONS.length]
}

export function StickyNote() {
  const mounted = useHasMounted()
  const [prediction] = useState(() => getDailyPrediction())

  if (!mounted) return null

  return (
    <div className="flex justify-center">
      <aside
        className={cn(
          "relative max-w-md -rotate-[1.2deg] rounded-[2px] border border-amber-300/60 bg-[oklch(0.94_0.08_95)] px-5 py-4",
          "transition-transform duration-300 ease-out hover:-translate-y-0.5 hover:rotate-0"
        )}
      >
        {/* a tiny piece of "tape" at the top to sell the sticky-note conceit */}
        <span
          aria-hidden
          className="absolute -top-2 left-1/2 h-2 w-12 -translate-x-1/2 rounded-sm bg-amber-200/70"
        />
        <p className="font-mono text-xs tracking-[0.06em] text-amber-900/70 uppercase">
          today&apos;s omen
        </p>
        <p className="mt-2 font-mono text-sm leading-relaxed text-amber-950">
          {prediction}
        </p>
      </aside>
    </div>
  )
}
