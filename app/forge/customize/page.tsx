"use client"

import { useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { DifficultySelector } from "@/components/forge/difficulty-selector"
import { PurposeInput } from "@/components/forge/purpose-input"
import { SpellbookPreview } from "@/components/forge/spellbook-preview"
import { WriteButton } from "@/components/forge/write-button"
import { useHasMounted } from "@/hooks/use-has-mounted"
import { useForgeStore } from "@/lib/stores/forge-store"

export default function CustomizePage() {
  const router = useRouter()
  const topic = useForgeStore((s) => s.topic)
  const mounted = useHasMounted()

  useEffect(() => {
    if (mounted && !topic) {
      router.replace("/")
    }
  }, [mounted, topic, router])

  if (!mounted || !topic) {
    return <main className="min-h-svh bg-background" />
  }

  return (
    <main className="relative min-h-svh overflow-x-hidden bg-background text-foreground">
      <div className="relative mx-auto flex max-w-5xl flex-col gap-10 px-6 py-12 sm:py-16">
        <header className="flex flex-col gap-3">
          <Link
            href="/"
            className="self-start font-sans text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            ← library
          </Link>
          <div className="flex flex-col gap-1">
            <p className="font-mono text-xs tracking-[0.08em] text-muted-foreground uppercase">
              forging
            </p>
            <h1 className="font-display text-3xl tracking-tight text-foreground sm:text-4xl">
              « {topic} »
            </h1>
          </div>
        </header>

        <div className="grid gap-10 md:grid-cols-[1fr_320px] md:gap-12">
          <div className="flex flex-col gap-7">
            <PurposeInput />
            <DifficultySelector />
            <WriteButton />
          </div>

          <aside className="flex flex-col items-center gap-6 md:sticky md:top-12 md:self-start">
            <div className="font-mono text-xs tracking-[0.08em] text-muted-foreground uppercase">
              your tome
            </div>
            <SpellbookPreview />
            <p className="max-w-[260px] text-center font-sans text-xs text-muted-foreground">
              Hover a pace to feel the weight of the pages.
            </p>
          </aside>
        </div>
      </div>
    </main>
  )
}
