"use client"

import { useEffect } from "react"

import { PaperNoise } from "@/components/effects/paper-noise"
import { useHasMounted } from "@/hooks/use-has-mounted"
import { WIZARD_AVATARS } from "@/lib/data/wizard-avatars"
import { WIZARD_RACES } from "@/lib/data/wizard-races"
import { useLibraryStore } from "@/lib/stores/library-store"
import { useWizardStore } from "@/lib/stores/wizard-store"
import { computeWizardStats, describeWizard } from "@/lib/wizard-stats"

function essenceFingerprint(
  name: string,
  race: string,
  topics: string[]
): string {
  return [name, race, ...[...topics].sort()].join("|")
}

export function WizardCard() {
  const mounted = useHasMounted()
  const wizard = useWizardStore((s) => s.wizard)
  const resetWizard = useWizardStore((s) => s.resetWizard)
  const essence = useWizardStore((s) => s.essence)
  const essenceKey = useWizardStore((s) => s.essenceKey)
  const setEssence = useWizardStore((s) => s.setEssence)
  const books = useLibraryStore((s) => s.books)

  const stats = wizard ? computeWizardStats(books) : null
  const race = wizard
    ? WIZARD_RACES.find((r) => r.id === wizard.race)
    : undefined
  // Fall back to the first avatar if the saved id no longer exists (the set
  // shrank from 6 emoji to 4 illustrated portraits).
  const avatar = wizard
    ? (WIZARD_AVATARS.find((a) => a.id === wizard.avatarId) ??
      WIZARD_AVATARS[0])
    : undefined

  const currentKey =
    wizard && stats && stats.masteredBookCount > 0
      ? essenceFingerprint(wizard.name, wizard.race, stats.topicsMastered)
      : null

  useEffect(() => {
    if (!currentKey || !wizard || !race || !stats) return
    if (currentKey === essenceKey) return
    let cancelled = false
    const run = async () => {
      try {
        const res = await fetch("/api/wizard-essence", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: wizard.name,
            raceLabel: race.label,
            raceTitle: race.title,
            raceEssence: race.essence,
            rank: stats.rank,
            topics: stats.topicsMastered,
          }),
        })
        if (!res.ok) throw new Error(`Essence route returned ${res.status}`)
        const data = (await res.json()) as { description?: string }
        if (!data.description) throw new Error("No description in response")
        if (!cancelled) setEssence(data.description, currentKey)
      } catch (err) {
        console.error("Wizard essence failed, keeping static fallback:", err)
      }
    }
    run()
    return () => {
      cancelled = true
    }
  }, [currentKey, essenceKey, wizard, race, stats, setEssence])

  if (!mounted || !wizard || !race || !avatar || !stats) return null

  const xpPct = (stats.xpInLevel / stats.xpToNext) * 100
  const description =
    essence && essenceKey === currentKey
      ? essence
      : describeWizard(wizard.name, race.label, stats)

  const handleRetire = () => {
    if (typeof window !== "undefined") {
      const ok = window.confirm(
        "Retire this wizard and start fresh? Your library books stay on the shelf."
      )
      if (!ok) return
    }
    resetWizard()
  }

  return (
    <article className="relative overflow-hidden rounded-md border border-foreground/15 bg-[oklch(1_0_0)] text-foreground">
      <PaperNoise opacity={0.07} />

      <div className="relative flex items-center justify-between border-b border-foreground/15 px-5 pt-3.5 pb-3">
        <span className="font-mono text-xs tracking-[0.08em] text-foreground/55 uppercase">
          the chronicle
        </span>
        <button
          type="button"
          onClick={handleRetire}
          className="font-mono text-xs tracking-[0.08em] text-foreground/45 uppercase transition-colors hover:text-destructive"
        >
          retire
        </button>
      </div>

      <div className="relative flex gap-5 px-5 py-5 sm:gap-6 sm:px-6">
        <div className="shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={avatar.src}
            alt={avatar.label}
            className="h-24 w-24 rounded-md border border-foreground/15 bg-card object-cover sm:h-28 sm:w-28"
          />
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <div>
            <h2 className="font-display text-2xl leading-tight tracking-tight text-foreground sm:text-3xl">
              {wizard.name}
            </h2>
            <p className="mt-1 font-mono text-xs tracking-[0.08em] text-foreground/60 uppercase">
              {race.title} · {race.label} · {stats.rank}
            </p>
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            <Stat
              label={`Magic Lv ${stats.level}`}
              value={`${stats.xpInLevel}/${stats.xpToNext} ch.`}
              pct={xpPct}
            />
            <Stat
              label="Profession"
              value={`${stats.masteredBookCount} tomes`}
              pct={stats.professionalismPct}
            />
          </div>

          <p className="font-sans text-base leading-relaxed text-foreground/85">
            {description}
          </p>
        </div>
      </div>
    </article>
  )
}

function Stat({
  label,
  value,
  pct,
}: {
  label: string
  value: string
  pct: number
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between font-mono text-xs tracking-[0.1em] uppercase">
        <span className="text-foreground/75">{label}</span>
        <span className="text-foreground/50">{value}</span>
      </div>
      <div className="mt-1 h-[2px] w-full bg-foreground/12">
        <div
          className="h-full bg-foreground/70 transition-[width] duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
