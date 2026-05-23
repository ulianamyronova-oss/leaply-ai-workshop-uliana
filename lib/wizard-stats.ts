import type { LibraryBook } from "@/lib/stores/library-store"

export type WizardRank =
  | "Novice"
  | "Apprentice"
  | "Adept"
  | "Master"
  | "Archmage"

export type WizardStats = {
  level: number
  xpInLevel: number
  xpToNext: number
  rank: WizardRank
  professionalismPct: number
  masteredBookCount: number
  topicsMastered: string[]
}

// Tuning knobs — every 5 mastered chapters bumps Magic Level by one, and
// the Professionalism bar fills as you stack mastered tomes (caps at 10).
const XP_PER_LEVEL = 5
const PROFESSIONALISM_CAP_BOOKS = 10

function computeRank(masteredBooks: number): WizardRank {
  if (masteredBooks >= 10) return "Archmage"
  if (masteredBooks >= 6) return "Master"
  if (masteredBooks >= 3) return "Adept"
  if (masteredBooks >= 1) return "Apprentice"
  return "Novice"
}

export function computeWizardStats(books: LibraryBook[]): WizardStats {
  // Only mastered (fully sealed) books contribute. Books with a missing
  // `state` predate the in_progress concept — they are mastered.
  const mastered = books.filter((b) => b.state !== "in_progress")
  const xp = mastered.reduce((sum, b) => sum + b.chapters.length, 0)
  const level = Math.floor(xp / XP_PER_LEVEL) + 1
  const xpInLevel = xp % XP_PER_LEVEL
  const masteredBookCount = mastered.length
  const topicsMastered = mastered.map((b) => b.topic)
  const rank = computeRank(masteredBookCount)
  const professionalismPct = Math.min(
    100,
    Math.round((masteredBookCount / PROFESSIONALISM_CAP_BOOKS) * 100)
  )
  return {
    level,
    xpInLevel,
    xpToNext: XP_PER_LEVEL,
    rank,
    professionalismPct,
    masteredBookCount,
    topicsMastered,
  }
}

function formatList(items: string[]): string {
  if (items.length === 0) return ""
  if (items.length === 1) return items[0]
  return items.slice(0, -1).join(", ") + " and " + items[items.length - 1]
}

// Description that visibly grows with each mastered tome. Workshop voters
// should see it change between demo runs as more books land on the shelf.
export function describeWizard(
  name: string,
  raceLabel: string,
  stats: WizardStats
): string {
  const role = raceLabel.toLowerCase()
  if (stats.masteredBookCount === 0) {
    return `${name}, freshly arrived. The Library opens its doors — no tome has been touched yet.`
  }
  if (stats.masteredBookCount === 1) {
    return `${name} the ${stats.rank} ${role}. Has tasted ${stats.topicsMastered[0]}.`
  }
  if (stats.masteredBookCount <= 3) {
    return `${name} the ${stats.rank} ${role}. Walks paths of ${formatList(stats.topicsMastered)}.`
  }
  const first = stats.topicsMastered.slice(0, 3)
  const more = stats.topicsMastered.length - 3
  return `${name} the ${stats.rank} ${role}. Carries the marks of ${formatList(first)}, and ${more} more.`
}
