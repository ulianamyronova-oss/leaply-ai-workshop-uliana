"use client"

import { useRouter } from "next/navigation"

import { hashToIndex, paletteForTopic } from "@/lib/book-palette"
import { DIFFICULTY_LABELS, type Difficulty } from "@/lib/schemas/forge-schema"
import { useForgeStore } from "@/lib/stores/forge-store"
import { useLibraryStore, type LibraryBook } from "@/lib/stores/library-store"
import { cn } from "@/lib/utils"

const WIDTHS: Record<Difficulty, number> = {
  apprentice: 76,
  adept: 98,
  archmage: 122,
}

const HEIGHTS: Record<Difficulty, number> = {
  apprentice: 240,
  adept: 290,
  archmage: 340,
}

const TILTS = [-2.5, -1, 0, 0.5, 1.5, 2.5, -0.5] as const

type Props = {
  book: LibraryBook
}

export function LibraryBookCard({ book }: Props) {
  const router = useRouter()
  const loadSnapshot = useForgeStore((s) => s.loadSnapshot)
  const removeBook = useLibraryStore((s) => s.removeBook)

  const width = WIDTHS[book.difficulty]
  const height = HEIGHTS[book.difficulty]
  // Hash on `topic` so the same skill always shows the same colour — matches
  // the spellbook interior tint when the book is opened.
  const palette = paletteForTopic(book.topic)
  const tilt = TILTS[hashToIndex(book.id, TILTS.length)]

  const isInProgress = book.state === "in_progress"
  const completedCount =
    book.completedChapterIds?.length ?? book.chapters.length
  const totalCount = book.chapters.length
  const progressPct = totalCount > 0 ? (completedCount / totalCount) * 100 : 0

  const handleOpen = () => {
    loadSnapshot(
      {
        topic: book.topic,
        purpose: book.purpose,
        difficulty: book.difficulty,
        chapters: book.chapters,
        currentChapterIndex: book.currentChapterIndex ?? 0,
        completedChapterIds: book.completedChapterIds ?? [],
        completedTaskIds: book.completedTaskIds ?? [],
      },
      !isInProgress
    )
    if (isInProgress) removeBook(book.id)
    router.push("/forge/spellbook")
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (typeof window === "undefined") {
      removeBook(book.id)
      return
    }
    const ok = window.confirm(
      `Remove « ${book.topic} » from your library? This can't be undone.`
    )
    if (!ok) return
    removeBook(book.id)
  }

  const tooltip = isInProgress
    ? `${book.topic} · ${DIFFICULTY_LABELS[book.difficulty]} · ${completedCount}/${totalCount} chapters — click to resume`
    : `${book.topic} · ${DIFFICULTY_LABELS[book.difficulty]} · ${totalCount} chapters · click to re-read`

  return (
    <div className="group relative shrink-0" style={{ width, height }}>
      {/* in-progress bookmark ribbon — small accent strip pokes out the top */}
      {isInProgress && (
        <div
          aria-hidden
          className="absolute -top-1 right-5 z-20 h-6 w-2 origin-top rounded-b-sm transition-transform duration-300 ease-out group-hover:h-8 group-hover:translate-y-1"
          style={{ background: palette.accent }}
        />
      )}

      <button
        type="button"
        onClick={handleOpen}
        title={tooltip}
        className={cn(
          "relative block h-full w-full",
          "transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
          "hover:-translate-y-3 hover:rotate-0 active:-translate-y-1 active:scale-[0.99]",
          "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 focus-visible:ring-offset-card focus-visible:outline-none"
        )}
        style={{
          transform: `rotate(${tilt}deg)`,
          transformOrigin: "50% 95%",
        }}
      >
        <div
          className="relative h-full w-full overflow-hidden rounded-[3px]"
          style={{ background: palette.main }}
        >
          {/* head band */}
          <div
            aria-hidden
            className="absolute inset-x-0 top-0 h-[5px]"
            style={{ background: palette.accent }}
          />
          {/* page-stack ridges */}
          <div className="absolute top-2 right-2 left-2 flex flex-col gap-[1px]">
            <div
              className="h-px"
              style={{ background: palette.accent, opacity: 0.3 }}
            />
            <div
              className="h-px"
              style={{ background: palette.accent, opacity: 0.2 }}
            />
            <div
              className="h-px"
              style={{ background: palette.accent, opacity: 0.12 }}
            />
          </div>

          {/* title plate */}
          <div
            className="absolute top-9 right-2 bottom-12 left-2 flex items-center justify-center rounded-sm border bg-white"
            style={{ borderColor: palette.accent }}
          >
            <span
              className="px-1 font-display text-sm leading-tight tracking-tight text-foreground/90"
              style={{ writingMode: "vertical-rl" }}
            >
              {book.topic}
            </span>
          </div>

          {/* state-aware foot */}
          {isInProgress ? (
            <>
              <div className="absolute right-3 bottom-5 left-3 h-1 overflow-hidden rounded-full bg-white/60">
                <div
                  className="h-full rounded-full transition-[width] duration-500 ease-out"
                  style={{
                    width: `${progressPct}%`,
                    background: palette.accent,
                  }}
                />
              </div>
              <div
                aria-hidden
                className="absolute right-0 bottom-1 left-0 text-center font-mono text-xs tracking-wider"
                style={{ color: palette.accent }}
              >
                {completedCount}/{totalCount}
              </div>
            </>
          ) : (
            <>
              <div
                aria-hidden
                className="absolute inset-x-0 bottom-0 h-[5px]"
                style={{ background: palette.accent }}
              />
              <div
                aria-hidden
                className="absolute right-0 bottom-1.5 left-0 text-center font-mono text-sm leading-none"
                style={{ color: palette.accent }}
              >
                ✦
              </div>
            </>
          )}
        </div>
      </button>

      <button
        type="button"
        onClick={handleDelete}
        aria-label={`Remove ${book.topic} from the library`}
        title="Remove from library"
        className={cn(
          "absolute -top-2 -right-2 z-30 flex h-7 w-7 items-center justify-center rounded-full border border-border bg-card text-xs text-muted-foreground/70 opacity-0 transition-all duration-200",
          "group-hover:opacity-100 hover:scale-110 hover:border-destructive/70 hover:text-destructive",
          "focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-destructive/50 focus-visible:outline-none"
        )}
      >
        ✕
      </button>
    </div>
  )
}
