"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

import { ForgingAnimation } from "@/components/forge/forging-animation"
import { useHasMounted } from "@/hooks/use-has-mounted"
import { useForgeStore } from "@/lib/stores/forge-store"

export default function ForgingPage() {
  const router = useRouter()
  const topic = useForgeStore((s) => s.topic)
  const difficulty = useForgeStore((s) => s.difficulty)
  const mounted = useHasMounted()

  // Guard: bounce back to customize (or home) if user deep-links here without picks.
  useEffect(() => {
    if (!mounted) return
    if (!topic) {
      router.replace("/")
    } else if (!difficulty) {
      router.replace("/forge/customize")
    }
  }, [mounted, topic, difficulty, router])

  if (!mounted || !topic || !difficulty) {
    return <main className="min-h-svh bg-arcane-ink" />
  }

  return <ForgingAnimation />
}
