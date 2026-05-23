"use client"

import { useEffect } from "react"

import { PaperNoise } from "@/components/effects/paper-noise"
import { paletteForTopic } from "@/lib/book-palette"
import type { SpellbookChapter } from "@/lib/data/spellbook-stubs"
import { useForgeStore } from "@/lib/stores/forge-store"
import { cn } from "@/lib/utils"

import { TaskItem } from "./task-item"

type Props = {
  chapter: SpellbookChapter
  totalChapters: number
}

export function ChapterPage({ chapter, totalChapters }: Props) {
  const topic = useForgeStore((s) => s.topic) ?? ""
  const completedIds = useForgeStore((s) => s.completedChapterIds)
  const completeChapter = useForgeStore((s) => s.completeChapter)
  const setCurrentChapter = useForgeStore((s) => s.setCurrentChapter)
  const isReadOnly = useForgeStore((s) => s.isReadOnly)
  const palette = paletteForTopic(topic)

  const isComplete = completedIds.includes(chapter.id)
  const prevIndex = chapter.index > 0 ? chapter.index - 1 : null
  const nextIndex = chapter.index + 1 < totalChapters ? chapter.index + 1 : null

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
    const scroller = document.getElementById("chapter-scroller")
    if (scroller) scroller.scrollTop = 0
  }, [chapter.id])

  const handleComplete = () => {
    if (isComplete) return
    completeChapter(chapter.id, nextIndex)
  }

  return (
    <article
      className="relative flex flex-col overflow-hidden rounded-2xl rounded-l-md border border-border text-foreground md:h-[820px]"
      style={{ background: palette.tint }}
    >
      <PaperNoise opacity={0.06} />

      {/* spine shadow — the left edge curls into the binding */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-foreground/20 via-foreground/5 to-transparent"
      />

      <div className="relative flex flex-1 flex-col p-7 sm:p-9">
        <header className="text-center">
          <p className="font-mono text-xs tracking-[0.1em] text-foreground/55 uppercase">
            {chapter.dayLabel}
          </p>
          <h2 className="mt-2 font-display text-3xl tracking-tight text-foreground sm:text-4xl">
            {chapter.title}
          </h2>
          <div
            aria-hidden
            className="mx-auto mt-3 font-display text-xl text-foreground/35"
          >
            ❦
          </div>
        </header>

        <section
          id="chapter-scroller"
          className="mt-6 flex-1 overflow-y-auto pr-1"
        >
          <h3 className="font-mono text-xs tracking-[0.08em] text-foreground/55 uppercase">
            Tasks
          </h3>
          <ul className="mt-2 flex flex-col gap-0.5">
            {chapter.tasks.map((task) => (
              <TaskItem key={task.id} task={task} />
            ))}
          </ul>

          <h3 className="mt-7 font-mono text-xs tracking-[0.08em] text-foreground/55 uppercase">
            Resources
          </h3>
          <ul className="mt-2 flex flex-col gap-1.5">
            {chapter.resources.map((res) => (
              <li
                key={res.id}
                className="flex gap-2.5 font-display text-base leading-relaxed text-foreground/85"
              >
                <span aria-hidden className="text-foreground/40">
                  ❧
                </span>
                <span>{res.label}</span>
              </li>
            ))}
          </ul>
        </section>

        <footer className="mt-6 flex flex-col gap-2.5">
          {isReadOnly ? (
            <>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() =>
                    prevIndex !== null && setCurrentChapter(prevIndex)
                  }
                  disabled={prevIndex === null}
                  className={cn(
                    "rounded-xl border px-3 py-2 font-display text-sm transition-all duration-150",
                    prevIndex === null
                      ? "cursor-not-allowed border-foreground/15 text-foreground/30"
                      : "border-foreground/25 bg-transparent text-foreground/85 hover:bg-foreground/5"
                  )}
                >
                  ← prev page
                </button>
                <button
                  type="button"
                  onClick={() =>
                    nextIndex !== null && setCurrentChapter(nextIndex)
                  }
                  disabled={nextIndex === null}
                  className={cn(
                    "rounded-xl border px-3 py-2 font-display text-sm transition-all duration-150",
                    nextIndex === null
                      ? "cursor-not-allowed border-foreground/15 text-foreground/30"
                      : "border-foreground/25 bg-transparent text-foreground/85 hover:bg-foreground/5"
                  )}
                >
                  next page →
                </button>
              </div>
              <div
                className={cn(
                  "w-full rounded-xl border px-4 py-2.5 text-center font-mono text-xs tracking-[0.08em] uppercase",
                  isComplete
                    ? "border-foreground/40 bg-foreground/5 text-foreground/85"
                    : "border-foreground/15 text-foreground/45"
                )}
              >
                {isComplete ? "chapter sealed" : "unfinished page"}
              </div>
            </>
          ) : (
            <button
              type="button"
              onClick={handleComplete}
              disabled={isComplete}
              className={cn(
                "w-full rounded-xl px-4 py-3 font-sans text-sm font-medium tracking-tight transition-all duration-150",
                "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-card focus-visible:outline-none",
                isComplete
                  ? "cursor-default bg-foreground/10 text-foreground/55"
                  : "bg-primary text-primary-foreground hover:bg-primary/90 active:scale-[0.99]"
              )}
            >
              {isComplete
                ? "Chapter sealed"
                : nextIndex !== null
                  ? "Complete & turn page"
                  : "Complete & seal the tome"}
            </button>
          )}
        </footer>
      </div>

      {/* page number — tucked in outer corner */}
      <span
        aria-hidden
        className="absolute right-5 bottom-3 font-mono text-xs tracking-[0.1em] text-foreground/40 uppercase"
      >
        p. {chapter.index + 1}
      </span>
    </article>
  )
}
