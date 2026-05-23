"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

import { SpellbookView } from "@/components/spellbook/spellbook-view"
import { useHasMounted } from "@/hooks/use-has-mounted"
import { useForgeStore } from "@/lib/stores/forge-store"

export default function SpellbookPage() {
  const router = useRouter()
  const topic = useForgeStore((s) => s.topic)
  const difficulty = useForgeStore((s) => s.difficulty)
  const chapters = useForgeStore((s) => s.chapters)
  const mounted = useHasMounted()

  // Guard: deep-link without a completed forge bounces to the right place
  // along the flow (home → customize → forging → spellbook). If forge picks
  // exist but chapters were never generated (e.g. user opened this URL
  // directly), kick over to /forge/forging which will run Gemini and land
  // back here with real content.
  useEffect(() => {
    if (!mounted) return
    if (!topic) {
      router.replace("/")
    } else if (!difficulty) {
      router.replace("/forge/customize")
    } else if (!chapters?.length) {
      router.replace("/forge/forging")
    }
  }, [mounted, topic, difficulty, chapters, router])

  if (!mounted || !topic || !difficulty || !chapters?.length) {
    return <main className="min-h-svh bg-arcane-ink" />
  }

  return <SpellbookView />
}
