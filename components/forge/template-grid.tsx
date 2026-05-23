"use client"

import { useState } from "react"

import { useHasMounted } from "@/hooks/use-has-mounted"
import { templates, type Template } from "@/lib/data/templates"

import { SurpriseCard } from "./surprise-card"
import { TemplateCard } from "./template-card"

// Linear-congruential shuffle so the picks are stable across re-renders
// (the seed is decided once at mount) but vary between full reloads.
function shuffleWithSeed<T>(arr: readonly T[], seed: number): T[] {
  const out = [...arr]
  let s = seed >>> 0 || 1
  for (let i = out.length - 1; i > 0; i -= 1) {
    s = (s * 1664525 + 1013904223) >>> 0
    const j = s % (i + 1)
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

const SHOW_COUNT = 7

export function TemplateGrid() {
  const mounted = useHasMounted()
  // Lazy useState seed — Math.random in the initializer runs once on mount.
  const [seed] = useState(() => Math.floor(Math.random() * 1_000_000_000))

  if (!mounted) {
    return <div aria-hidden className="min-h-[44px]" />
  }

  const picks = shuffleWithSeed<Template>(templates, seed).slice(0, SHOW_COUNT)

  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      {picks.map((template) => (
        <TemplateCard key={template.id} template={template} />
      ))}
      <SurpriseCard />
    </div>
  )
}
