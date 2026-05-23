"use client"

import { useRouter } from "next/navigation"

import { useForgeStore } from "@/lib/stores/forge-store"
import { useLibraryStore } from "@/lib/stores/library-store"
import { cn } from "@/lib/utils"

type Props = {
  onDismiss: () => void
}

export function LibraryModal({ onDismiss }: Props) {
  const router = useRouter()
  const topic = useForgeStore((s) => s.topic)
  const purpose = useForgeStore((s) => s.purpose)
  const difficulty = useForgeStore((s) => s.difficulty)
  const chapters = useForgeStore((s) => s.chapters)
  const currentChapterIndex = useForgeStore((s) => s.currentChapterIndex)
  const completedIds = useForgeStore((s) => s.completedChapterIds)
  const completedTaskIds = useForgeStore((s) => s.completedTaskIds)
  const reset = useForgeStore((s) => s.reset)
  const addBook = useLibraryStore((s) => s.addBook)

  if (!topic || !difficulty || !chapters?.length) return null

  const handleSave = () => {
    addBook({
      topic,
      purpose,
      difficulty,
      chapters,
      state: "mastered",
      currentChapterIndex,
      completedChapterIds: completedIds,
      completedTaskIds,
    })
    reset()
    router.push("/")
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="library-modal-title"
    >
      <button
        type="button"
        aria-label="Close"
        onClick={onDismiss}
        className="absolute inset-0 cursor-default bg-foreground/30 backdrop-blur-md"
      />

      <div className="relative w-full max-w-md rounded-2xl border border-border bg-card p-8">
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Close without saving"
          className={cn(
            "absolute top-3 right-3 flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          )}
        >
          ✕
        </button>

        <div className="flex flex-col items-center gap-4 text-center">
          <p className="font-mono text-xs tracking-[0.08em] text-muted-foreground uppercase">
            ✦ mastery achieved
          </p>
          <h2
            id="library-modal-title"
            className="font-display text-3xl tracking-tight text-foreground sm:text-4xl"
          >
            All chapters sealed.
          </h2>
          <p className="font-sans text-base leading-relaxed text-foreground/80">
            Your spellbook of « {topic} » is complete. The {chapters.length}{" "}
            chapters glow with your craft.
          </p>

          <div className="mt-3 flex w-full flex-col gap-2.5">
            <button
              type="button"
              onClick={handleSave}
              className={cn(
                "w-full rounded-xl bg-primary px-6 py-3 font-sans text-sm font-medium tracking-tight text-primary-foreground transition-all duration-150 hover:bg-primary/90 active:scale-[0.99]",
                "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-card focus-visible:outline-none"
              )}
            >
              Add to library as mastered
            </button>
            <button
              type="button"
              onClick={onDismiss}
              className="font-sans text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              stay &amp; savour
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
