import {
  DIFFICULTY_CHAPTERS,
  type Difficulty,
} from "@/lib/schemas/forge-schema"

// Fantasy / wizard-journey chapter titles, evergreen across topics so the
// same set works whether you're learning watercolour or React hooks.
const CHAPTER_TITLES = [
  "Awakening",
  "The First Glyph",
  "Patient Hands",
  "The Daily Rite",
  "The Listening Pause",
  "Whispered Patterns",
  "The Apprentice's Doubt",
  "Crossing the Threshold",
  "The Inner Compass",
  "Shaping the Craft",
  "The Spell Refined",
  "Mentoring Light",
  "The Hidden Chamber",
  "The Master's Mark",
  "Becoming the Source",
]

const TASK_POOL = [
  "Sit with the practice for 5 minutes",
  "Speak the rite aloud, just once",
  "Notice one resistance, name it gently",
  "Try one variation, however small",
  "Pause between attempts and breathe deep",
  "Write a single line of reflection",
  "Repeat the form three times slowly",
  "Reach out to one fellow practitioner",
  "Watch a master at work for 3 minutes",
  "Practice in silence — no music, no notes",
  "Take the practice to a new place",
  "Forgive yourself for one imperfection",
]

const RESOURCE_POOL = [
  "Tome of Stillness, vol. II — chapter 4",
  "Scroll: The Apprentice's Manifesto",
  "Whispered hint from the Inner Sage",
  "The Forbidden Notebook, p. 47",
  "Hand-drawn map by the Old Master",
  "Scroll: Pattern Recognition for Novices",
  "Letter from your future self",
  "Field guide: The Common Pitfalls",
]

export type SpellbookTask = {
  id: string
  text: string
}

export type SpellbookResource = {
  id: string
  label: string
}

export type SpellbookChapter = {
  id: string
  index: number
  dayLabel: string
  title: string
  tasks: SpellbookTask[]
  resources: SpellbookResource[]
}

// Deterministic builder — same difficulty always yields the same chapter set.
// In v2 this is replaced by an LLM call seeded with topic + area + purpose.
export function buildSpellbook(difficulty: Difficulty): SpellbookChapter[] {
  const count = DIFFICULTY_CHAPTERS[difficulty]
  return Array.from({ length: count }, (_, i) => ({
    id: `ch-${i}`,
    index: i,
    dayLabel: `Day ${i + 1}`,
    title: CHAPTER_TITLES[i] ?? `Chapter ${i + 1}`,
    tasks: Array.from({ length: 3 }, (_, j) => ({
      id: `ch-${i}-task-${j}`,
      text: TASK_POOL[(i * 3 + j) % TASK_POOL.length],
    })),
    resources: Array.from({ length: 2 }, (_, j) => ({
      id: `ch-${i}-res-${j}`,
      label: RESOURCE_POOL[(i * 2 + j) % RESOURCE_POOL.length],
    })),
  }))
}
