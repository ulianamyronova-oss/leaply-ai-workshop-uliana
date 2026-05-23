"use client"

import { PaperNoise } from "@/components/effects/paper-noise"
import { paletteForTopic } from "@/lib/book-palette"
import type { SpellbookChapter } from "@/lib/data/spellbook-stubs"
import { useForgeStore } from "@/lib/stores/forge-store"
import { cn } from "@/lib/utils"

type Props = {
  chapters: SpellbookChapter[]
  currentIndex: number
}

export function PlanPage({ chapters, currentIndex }: Props) {
  const topic = useForgeStore((s) => s.topic) ?? ""
  const completedIds = useForgeStore((s) => s.completedChapterIds)
  const setCurrentChapter = useForgeStore((s) => s.setCurrentChapter)
  const isReadOnly = useForgeStore((s) => s.isReadOnly)
  const totalDone = completedIds.length
  const totalChapters = chapters.length
  const progress = totalChapters
    ? Math.round((totalDone / totalChapters) * 100)
    : 0
  const palette = paletteForTopic(topic)

  return (
    <article
      className="relative flex flex-col overflow-hidden rounded-2xl rounded-r-md border border-border text-foreground sm:p-0 md:h-[820px]"
      style={{ background: palette.tint }}
    >
      <PaperNoise opacity={0.06} />

      {/* spine shadow — the right edge curls into the binding */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-foreground/20 via-foreground/5 to-transparent"
      />

      <div className="relative flex flex-1 flex-col p-7 sm:p-9">
        <header className="mb-5 text-center">
          <p className="font-mono text-xs tracking-[0.08em] text-foreground/55 uppercase">
            the plan
          </p>
          <h2 className="mt-1 font-display text-2xl tracking-tight text-foreground">
            {totalChapters} chapters
          </h2>
          <div
            aria-hidden
            className="mx-auto mt-3 font-display text-base text-foreground/35"
          >
            ❦
          </div>
        </header>

        <ol className="flex flex-1 flex-col gap-0.5 overflow-y-auto pr-2">
          {chapters.map((ch) => {
            const isDone = completedIds.includes(ch.id)
            const isCurrent = ch.index === currentIndex
            const isLocked = !isReadOnly && ch.index > currentIndex && !isDone

            return (
              <li key={ch.id}>
                <button
                  type="button"
                  onClick={() => {
                    if (!isLocked) setCurrentChapter(ch.index)
                  }}
                  disabled={isLocked}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-md px-2.5 py-2 text-left transition-colors",
                    isCurrent && "bg-foreground/8",
                    !isLocked && !isCurrent && "hover:bg-foreground/5",
                    isLocked && "cursor-not-allowed opacity-40"
                  )}
                >
                  <span
                    aria-hidden
                    className={cn(
                      "flex h-5 w-5 shrink-0 items-center justify-center rounded-full font-mono text-xs",
                      isDone
                        ? "bg-foreground text-[oklch(0.97_0_0)]"
                        : isCurrent
                          ? "border border-foreground text-foreground"
                          : "border border-foreground/30 text-foreground/50"
                    )}
                  >
                    {isDone ? "✓" : ch.index + 1}
                  </span>
                  <span className="flex-1 font-display text-base leading-snug text-foreground/85">
                    <span className="font-mono text-xs tracking-[0.1em] text-foreground/50 uppercase">
                      {ch.dayLabel}
                    </span>{" "}
                    <span
                      className={cn(
                        "ml-1",
                        isDone &&
                          !isCurrent &&
                          "text-foreground/55 line-through decoration-foreground/30",
                        isCurrent && "font-medium"
                      )}
                    >
                      {ch.title}
                    </span>
                  </span>
                </button>
              </li>
            )
          })}
        </ol>

        <footer className="mt-5 border-t border-foreground/20 pt-4">
          <h3 className="font-mono text-xs tracking-[0.08em] text-foreground/55 uppercase">
            Goals traction
          </h3>
          <div className="mt-2 flex items-center gap-3">
            <div className="h-[3px] flex-1 overflow-hidden rounded-full bg-foreground/15">
              <div
                className="h-full bg-foreground/70 transition-[width] duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="font-mono text-xs tracking-[0.1em] text-foreground/80 uppercase">
              {totalDone}/{totalChapters}
            </span>
          </div>
        </footer>
      </div>
    </article>
  )
}
