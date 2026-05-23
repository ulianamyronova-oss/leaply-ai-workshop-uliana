"use client"

import { useHasMounted } from "@/hooks/use-has-mounted"
import { useLibraryStore } from "@/lib/stores/library-store"

import { LibraryBookCard } from "./library-book-card"

export function LibraryShelf() {
  const mounted = useHasMounted()
  const books = useLibraryStore((s) => s.books)

  if (!mounted) {
    return <div className="min-h-[160px]" aria-hidden />
  }

  if (books.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-card/40 px-6 py-12 text-center">
        <p className="font-display text-lg text-muted-foreground">
          No tomes mastered yet — the shelf waits.
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-border bg-card px-6 py-10 sm:px-10 sm:py-14">
      <div className="flex flex-wrap items-end justify-center gap-4 pb-3 sm:gap-5">
        {books.map((book) => (
          <LibraryBookCard key={book.id} book={book} />
        ))}
      </div>
      {/* shelf line */}
      <div
        aria-hidden
        className="mx-auto mt-1 h-px w-full max-w-[520px] bg-border"
      />
    </div>
  )
}
