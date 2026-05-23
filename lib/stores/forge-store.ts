import { create } from "zustand"
import { persist } from "zustand/middleware"

import type { SpellbookChapter } from "@/lib/data/spellbook-stubs"
import type { Difficulty } from "@/lib/schemas/forge-schema"

type TopicSource = "template" | "custom"

type Snapshot = {
  topic: string
  purpose: string
  difficulty: Difficulty
  chapters: SpellbookChapter[]
  currentChapterIndex: number
  completedChapterIds: string[]
  completedTaskIds: string[]
}

type ForgeState = {
  // Forge selection
  topic: string | null
  topicSource: TopicSource | null
  purpose: string
  difficulty: Difficulty | null

  // Transient — not persisted, only drives the live preview
  hoveredDifficulty: Difficulty | null

  // Generated spellbook contents (from /api/forge, fallback to stub on error)
  chapters: SpellbookChapter[] | null

  // Spellbook progress (populated after the user forges)
  currentChapterIndex: number
  completedChapterIds: string[]
  completedTaskIds: string[]

  // When true, the spellbook view is in review mode: tasks aren't toggleable,
  // the Complete button is hidden, and exiting just goes home without prompts.
  // Set by `loadSnapshot(snapshot, true)` when opening a mastered book.
  isReadOnly: boolean

  setTopic: (topic: string, source: TopicSource) => void
  setPurpose: (purpose: string) => void
  setDifficulty: (difficulty: Difficulty) => void
  setHoveredDifficulty: (difficulty: Difficulty | null) => void
  setChapters: (chapters: SpellbookChapter[]) => void
  setCurrentChapter: (index: number) => void
  toggleTask: (taskId: string) => void
  completeChapter: (chapterId: string, nextIndex: number | null) => void
  loadSnapshot: (snapshot: Snapshot, readonly?: boolean) => void
  reset: () => void
}

// v2 graft surface (do not implement now):
// wizardLevel?: number
// cats?: CatId[]
// currentSpellbookId?: string

const initialState = {
  topic: null,
  topicSource: null,
  purpose: "",
  difficulty: null,
  hoveredDifficulty: null,
  chapters: null,
  currentChapterIndex: 0,
  completedChapterIds: [],
  completedTaskIds: [],
  isReadOnly: false,
}

export const useForgeStore = create<ForgeState>()(
  persist(
    (set) => ({
      ...initialState,
      // Picking a new topic restarts everything — old chapters + completions
      // belong to the previous book and must not bleed into this one.
      setTopic: (topic, source) =>
        set({
          topic,
          topicSource: source,
          chapters: null,
          currentChapterIndex: 0,
          completedChapterIds: [],
          completedTaskIds: [],
          isReadOnly: false,
        }),
      setPurpose: (purpose) => set({ purpose }),
      setDifficulty: (difficulty) => set({ difficulty }),
      setHoveredDifficulty: (difficulty) =>
        set({ hoveredDifficulty: difficulty }),
      setChapters: (chapters) => set({ chapters }),
      setCurrentChapter: (index) => set({ currentChapterIndex: index }),
      toggleTask: (taskId) =>
        set((s) => ({
          completedTaskIds: s.completedTaskIds.includes(taskId)
            ? s.completedTaskIds.filter((id) => id !== taskId)
            : [...s.completedTaskIds, taskId],
        })),
      completeChapter: (chapterId, nextIndex) =>
        set((s) => ({
          completedChapterIds: s.completedChapterIds.includes(chapterId)
            ? s.completedChapterIds
            : [...s.completedChapterIds, chapterId],
          currentChapterIndex: nextIndex ?? s.currentChapterIndex,
        })),
      // Restores an entire spellbook from a library snapshot. `readonly` makes
      // the view a frozen exhibit — useful for re-reading a mastered book.
      loadSnapshot: (snapshot, readonly = false) =>
        set({
          topic: snapshot.topic,
          topicSource: "custom",
          purpose: snapshot.purpose,
          difficulty: snapshot.difficulty,
          chapters: snapshot.chapters,
          currentChapterIndex: snapshot.currentChapterIndex,
          completedChapterIds: snapshot.completedChapterIds,
          completedTaskIds: snapshot.completedTaskIds,
          isReadOnly: readonly,
        }),
      reset: () => set(initialState),
    }),
    {
      name: "leaply-spellbook-forge",
      partialize: (state) => ({
        topic: state.topic,
        topicSource: state.topicSource,
        purpose: state.purpose,
        difficulty: state.difficulty,
        chapters: state.chapters,
        currentChapterIndex: state.currentChapterIndex,
        completedChapterIds: state.completedChapterIds,
        completedTaskIds: state.completedTaskIds,
        isReadOnly: state.isReadOnly,
      }),
    }
  )
)
