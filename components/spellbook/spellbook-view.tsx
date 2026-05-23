"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { useForgeStore } from "@/lib/stores/forge-store"
import { useLibraryStore } from "@/lib/stores/library-store"

import { ChapterPage } from "./chapter-page"
import { ExitModal } from "./exit-modal"
import { LibraryModal } from "./library-modal"
import { PlanPage } from "./plan-page"

export function SpellbookView() {
  const router = useRouter()
  const topic = useForgeStore((s) => s.topic)
  const purpose = useForgeStore((s) => s.purpose)
  const difficulty = useForgeStore((s) => s.difficulty)
  const chapters = useForgeStore((s) => s.chapters)
  const currentChapterIndex = useForgeStore((s) => s.currentChapterIndex)
  const completedIds = useForgeStore((s) => s.completedChapterIds)
  const completedTaskIds = useForgeStore((s) => s.completedTaskIds)
  const isReadOnly = useForgeStore((s) => s.isReadOnly)
  const reset = useForgeStore((s) => s.reset)
  const addBook = useLibraryStore((s) => s.addBook)
  const [masteryDismissed, setMasteryDismissed] = useState(false)
  const [showExitModal, setShowExitModal] = useState(false)

  if (!chapters?.length) return null

  const currentChapter = chapters[currentChapterIndex] ?? chapters[0]
  if (!currentChapter) return null

  const allComplete =
    completedIds.length >= chapters.length &&
    chapters.every((ch) => completedIds.includes(ch.id))

  const handleBackLinkClick = (e: React.MouseEvent) => {
    if (isReadOnly) {
      reset()
      return
    }
    e.preventDefault()
    setShowExitModal(true)
  }

  const handleSave = () => {
    if (!topic || !difficulty || !chapters?.length) return
    addBook({
      topic,
      purpose,
      difficulty,
      chapters,
      state: allComplete ? "mastered" : "in_progress",
      currentChapterIndex,
      completedChapterIds: completedIds,
      completedTaskIds,
    })
    reset()
    router.push("/")
  }

  const handleBurn = () => {
    reset()
    router.push("/")
  }

  const showSaveCta = allComplete && !isReadOnly

  return (
    <main className="relative min-h-svh overflow-x-hidden bg-background py-10 text-foreground">
      <div className="relative mx-auto flex max-w-6xl flex-col gap-8 px-6">
        <header className="flex items-center justify-between gap-3">
          <Link
            href="/"
            onClick={handleBackLinkClick}
            className="shrink-0 font-sans text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            ← library
          </Link>
          <div className="flex min-w-0 flex-col items-center text-center">
            <p className="font-mono text-xs tracking-[0.08em] text-muted-foreground uppercase">
              {isReadOnly ? "reading from the shelf" : "spellbook of"}
            </p>
            <h1 className="mt-1 truncate font-display text-2xl tracking-tight text-foreground sm:text-3xl">
              « {topic} »
            </h1>
            {isReadOnly && (
              <p className="mt-1 font-mono text-xs tracking-[0.08em] text-muted-foreground uppercase">
                viewing only
              </p>
            )}
          </div>
          {showSaveCta ? (
            <button
              type="button"
              onClick={handleSave}
              className="shrink-0 rounded-full bg-primary px-4 py-2 font-sans text-sm font-medium tracking-tight text-primary-foreground transition-all duration-150 hover:-translate-y-0.5 hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none active:scale-[0.98]"
            >
              ✦ Save to library
            </button>
          ) : (
            <div className="w-14 shrink-0" aria-hidden />
          )}
        </header>

        {/* the open book — two pages meet at a hairline binding */}
        <div className="relative grid gap-4 md:grid-cols-2 md:gap-1">
          <div
            aria-hidden
            className="pointer-events-none absolute top-4 bottom-4 left-1/2 hidden w-px -translate-x-1/2 bg-foreground/30 md:block"
          />
          <PlanPage chapters={chapters} currentIndex={currentChapterIndex} />
          <ChapterPage
            chapter={currentChapter}
            totalChapters={chapters.length}
          />
        </div>
      </div>

      {allComplete && !masteryDismissed && !showExitModal && !isReadOnly && (
        <LibraryModal onDismiss={() => setMasteryDismissed(true)} />
      )}

      {showExitModal && topic && !isReadOnly && (
        <ExitModal
          state={allComplete ? "mastered" : "in_progress"}
          completedCount={completedIds.length}
          totalCount={chapters.length}
          topic={topic}
          onSave={handleSave}
          onBurn={handleBurn}
          onClose={() => setShowExitModal(false)}
        />
      )}
    </main>
  )
}
