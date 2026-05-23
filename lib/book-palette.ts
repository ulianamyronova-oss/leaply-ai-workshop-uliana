// Shared book colour palette. Used by both the library spine cards AND the
// spellbook interior pages so a tome's "cover" colour stays consistent
// between shelf view and open view.

export type BookPaletteEntry = {
  id: string
  main: string
  accent: string
  tint: string
}

export const BOOK_PALETTE: BookPaletteEntry[] = [
  {
    id: "peach",
    main: "oklch(0.87 0.07 55)",
    accent: "oklch(0.58 0.13 55)",
    tint: "oklch(0.98 0.018 55)",
  },
  {
    id: "coral",
    main: "oklch(0.84 0.08 25)",
    accent: "oklch(0.55 0.14 25)",
    tint: "oklch(0.98 0.018 25)",
  },
  {
    id: "rose",
    main: "oklch(0.85 0.07 350)",
    accent: "oklch(0.55 0.13 350)",
    tint: "oklch(0.98 0.018 350)",
  },
  {
    id: "lilac",
    main: "oklch(0.82 0.08 320)",
    accent: "oklch(0.5 0.13 320)",
    tint: "oklch(0.98 0.018 320)",
  },
  {
    id: "lavender",
    main: "oklch(0.8 0.08 290)",
    accent: "oklch(0.45 0.135 295)",
    tint: "oklch(0.98 0.018 295)",
  },
  {
    id: "periwinkle",
    main: "oklch(0.83 0.07 260)",
    accent: "oklch(0.5 0.12 260)",
    tint: "oklch(0.98 0.018 260)",
  },
  {
    id: "sky",
    main: "oklch(0.85 0.07 225)",
    accent: "oklch(0.52 0.12 225)",
    tint: "oklch(0.98 0.018 225)",
  },
  {
    id: "mint",
    main: "oklch(0.86 0.07 175)",
    accent: "oklch(0.5 0.1 175)",
    tint: "oklch(0.98 0.018 175)",
  },
  {
    id: "sage",
    main: "oklch(0.85 0.06 145)",
    accent: "oklch(0.52 0.1 145)",
    tint: "oklch(0.98 0.018 145)",
  },
]

export function hashToIndex(input: string, modulo: number): number {
  let hash = 0
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash << 5) - hash + input.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash) % modulo
}

export function paletteForTopic(topic: string): BookPaletteEntry {
  return BOOK_PALETTE[hashToIndex(topic, BOOK_PALETTE.length)]
}
