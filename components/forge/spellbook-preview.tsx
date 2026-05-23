"use client"

import type { Difficulty } from "@/lib/schemas/forge-schema"
import { useForgeStore } from "@/lib/stores/forge-store"
import { cn } from "@/lib/utils"

// Each pace level renders a different book thickness — the visible weight of
// the commitment. CSS-only so the designer can tune dimensions without sprites.
const SHAPES: Record<
  Difficulty,
  { coverHeight: number; spineWidth: number; pageLines: number; label: string }
> = {
  apprentice: { coverHeight: 90, spineWidth: 80, pageLines: 3, label: "thin" },
  adept: { coverHeight: 140, spineWidth: 80, pageLines: 7, label: "steady" },
  archmage: {
    coverHeight: 200,
    spineWidth: 80,
    pageLines: 14,
    label: "deep dive",
  },
}

const ALL: Difficulty[] = ["apprentice", "adept", "archmage"]

export function SpellbookPreview() {
  const difficulty = useForgeStore((s) => s.difficulty)
  const hovered = useForgeStore((s) => s.hoveredDifficulty)

  const active: Difficulty = hovered ?? difficulty ?? "apprentice"

  return (
    <div className="relative flex h-[260px] w-full items-end justify-center">
      {ALL.map((d) => {
        const isActive = d === active
        const shape = SHAPES[d]
        return (
          <div
            key={d}
            aria-hidden={!isActive}
            className={cn(
              "absolute bottom-0 transition-opacity duration-300 ease-out",
              isActive ? "opacity-100" : "opacity-0"
            )}
          >
            <Book
              coverHeight={shape.coverHeight}
              spineWidth={shape.spineWidth}
              pageLines={shape.pageLines}
            />
          </div>
        )
      })}
      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 font-mono text-xs tracking-[0.08em] text-muted-foreground uppercase">
        {SHAPES[active].label}
      </div>
    </div>
  )
}

function Book({
  coverHeight,
  spineWidth,
  pageLines,
}: {
  coverHeight: number
  spineWidth: number
  pageLines: number
}) {
  return (
    <div
      className="relative"
      style={{ width: spineWidth * 2 + 8, height: coverHeight + 24 }}
    >
      {/* book body — viewed from above-front, two halves like an opening tome */}
      <div
        className="absolute right-0 bottom-3 left-0 flex overflow-hidden rounded-md"
        style={{ height: coverHeight }}
      >
        {/* left half cover */}
        <div className="relative flex-1 bg-[oklch(0.32_0.1_278)]">
          <div className="absolute inset-2 rounded-sm border border-white/15" />
          <div className="absolute inset-x-0 top-1/2 flex -translate-y-1/2 justify-center">
            <div className="h-px w-6 bg-white/40" />
          </div>
        </div>
        {/* spine seam */}
        <div className="w-px bg-foreground/15" />
        {/* right half cover */}
        <div className="relative flex-1 bg-[oklch(0.35_0.11_280)]">
          <div className="absolute inset-2 rounded-sm border border-white/15" />
        </div>
      </div>
      {/* page edges visible just under the cover — count grows with thickness */}
      <div
        aria-hidden
        className="absolute right-1.5 bottom-1 left-1.5"
        style={{
          height: pageLines + 4,
          backgroundImage:
            "repeating-linear-gradient(to bottom, var(--color-card), var(--color-card) 1px, var(--color-border) 1px, var(--color-border) 2px)",
        }}
      />
    </div>
  )
}
