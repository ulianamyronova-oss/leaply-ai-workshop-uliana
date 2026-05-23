"use client"

import {
  DIFFICULTY_CHAPTERS,
  DIFFICULTY_LABELS,
  type Difficulty,
} from "@/lib/schemas/forge-schema"
import { useForgeStore } from "@/lib/stores/forge-store"
import { cn } from "@/lib/utils"

const ORDER: Difficulty[] = ["apprentice", "adept", "archmage"]

const SUBLABELS: Record<Difficulty, string> = {
  apprentice: "a week",
  adept: "a month",
  archmage: "your own time",
}

export function DifficultySelector() {
  const difficulty = useForgeStore((s) => s.difficulty)
  const setDifficulty = useForgeStore((s) => s.setDifficulty)
  const setHovered = useForgeStore((s) => s.setHoveredDifficulty)

  return (
    <div className="flex flex-col gap-2">
      <h3 className="font-mono text-xs tracking-[0.08em] text-muted-foreground uppercase">
        Pace
      </h3>
      <div className="grid gap-2 sm:grid-cols-3">
        {ORDER.map((option) => {
          const isActive = difficulty === option
          return (
            <button
              key={option}
              type="button"
              onClick={() => setDifficulty(option)}
              onMouseEnter={() => setHovered(option)}
              onMouseLeave={() => setHovered(null)}
              onFocus={() => setHovered(option)}
              onBlur={() => setHovered(null)}
              className={cn(
                "flex flex-col items-start gap-0.5 rounded-xl border p-4 text-left transition-all duration-200",
                "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none",
                isActive
                  ? "border-primary bg-primary/5 ring-1 ring-primary"
                  : "border-border bg-card hover:border-foreground/20 hover:bg-secondary/50"
              )}
            >
              <span className="font-display text-lg leading-tight tracking-tight text-foreground">
                {DIFFICULTY_LABELS[option]}
              </span>
              <span className="font-sans text-xs text-muted-foreground">
                {SUBLABELS[option]} · {DIFFICULTY_CHAPTERS[option]} chapters
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
