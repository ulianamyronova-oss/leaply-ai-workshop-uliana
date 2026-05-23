"use client"

import { CustomTopicInput } from "@/components/forge/custom-topic-input"
import { TemplateGrid } from "@/components/forge/template-grid"
import { StickyNote } from "@/components/home/sticky-note"
import { LandingHero } from "@/components/landing/landing-hero"
import { LibraryShelf } from "@/components/library/library-shelf"
import { CreateWizardFlow } from "@/components/wizard/create-wizard-flow"
import { WizardCard } from "@/components/wizard/wizard-card"
import { useHasMounted } from "@/hooks/use-has-mounted"
import { useLibraryStore } from "@/lib/stores/library-store"
import { useWizardStore } from "@/lib/stores/wizard-store"

export function HomeContent() {
  const mounted = useHasMounted()
  const wizard = useWizardStore((s) => s.wizard)
  const hasSeenLanding = useWizardStore((s) => s.hasSeenLanding)

  if (!mounted) {
    return <div className="min-h-[400px]" aria-hidden />
  }

  if (!wizard && !hasSeenLanding) {
    return (
      <div className="mx-auto w-full max-w-3xl">
        <LandingHero />
      </div>
    )
  }

  if (!wizard) {
    return (
      <div className="mx-auto w-full max-w-2xl">
        <CreateWizardFlow />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-12">
      <WizardCard />

      <StickyNote />

      <section className="flex flex-col gap-5">
        <header className="flex flex-col items-center gap-1 text-center">
          <h2 className="font-display text-3xl tracking-tight text-foreground sm:text-4xl">
            Forge a new tome
          </h2>
          <span className="font-mono text-xs tracking-[0.08em] text-muted-foreground uppercase">
            pick a spell
          </span>
        </header>
        <TemplateGrid />
        <CustomTopicInput />
      </section>

      <section className="flex flex-col gap-6">
        <header className="flex flex-col items-center gap-1 text-center">
          <h2 className="font-display text-3xl tracking-tight text-foreground sm:text-4xl">
            Your library
          </h2>
          <LibraryCount />
        </header>
        <LibraryShelf />
      </section>
    </div>
  )
}

function LibraryCount() {
  const mounted = useHasMounted()
  const books = useLibraryStore((s) => s.books)
  if (!mounted || books.length === 0) {
    return (
      <span className="font-mono text-xs tracking-[0.08em] text-muted-foreground uppercase">
        the shelf waits
      </span>
    )
  }
  return (
    <span className="font-mono text-xs tracking-[0.08em] text-muted-foreground uppercase">
      {books.length} {books.length === 1 ? "tome" : "tomes"}
    </span>
  )
}
