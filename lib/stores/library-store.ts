import { create } from "zustand"
import { persist } from "zustand/middleware"

import type { SpellbookChapter } from "@/lib/data/spellbook-stubs"
import type { Difficulty } from "@/lib/schemas/forge-schema"

export type LibraryBookState = "in_progress" | "mastered"

// A snapshot of a spellbook on the user's shelf. Books can be saved at any
// point — partly read (in_progress) or fully sealed (mastered). The snapshot
// of completion state lets us resume an in_progress book exactly where the
// user left off.
//
// `state` is optional on the type so books saved before this slice (when
// every saved book was implicitly mastered) still load — read-side code
// must treat a missing `state` as "mastered".
export type LibraryBook = {
  id: string
  topic: string
  purpose: string
  difficulty: Difficulty
  chapters: SpellbookChapter[]
  state?: LibraryBookState
  currentChapterIndex?: number
  completedChapterIds?: string[]
  completedTaskIds?: string[]
  completedAt: number
}

type LibraryState = {
  books: LibraryBook[]
  addBook: (book: Omit<LibraryBook, "id" | "completedAt">) => void
  removeBook: (id: string) => void
  clear: () => void
}

export const useLibraryStore = create<LibraryState>()(
  persist(
    (set) => ({
      books: [],
      addBook: (book) =>
        set((s) => ({
          books: [
            ...s.books,
            { ...book, id: `book-${Date.now()}`, completedAt: Date.now() },
          ],
        })),
      removeBook: (id) =>
        set((s) => ({ books: s.books.filter((b) => b.id !== id) })),
      clear: () => set({ books: [] }),
    }),
    { name: "leaply-spellbook-library" }
  )
)
