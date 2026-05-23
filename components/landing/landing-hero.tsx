"use client"

import { useWizardStore } from "@/lib/stores/wizard-store"

export function LandingHero() {
  const seeLanding = useWizardStore((s) => s.seeLanding)

  return (
    <section className="relative overflow-hidden rounded-3xl border border-border bg-card">
      {/* background image — drop `/public/landing-bg.png` to fill this layer.
          If the file isn't there yet, the layer below shows a soft warm gradient. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[oklch(0.985_0_0)] bg-cover bg-center"
        style={{ backgroundImage: "url(/landing-bg.png)" }}
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-card/40 via-card/55 to-card"
      />

      <div className="relative flex flex-col items-center gap-6 px-6 py-16 text-center sm:px-12 sm:py-24">
        <p className="font-mono text-xs tracking-[0.1em] text-muted-foreground uppercase">
          a study companion for the curious
        </p>
        <h1 className="font-display text-5xl leading-[1.05] tracking-tight text-foreground sm:text-6xl md:text-7xl">
          Wizard&apos;s Library
        </h1>
        <p className="max-w-xl font-sans text-lg leading-relaxed text-foreground/85">
          Forge spellbooks of any skill — from watercolour to React hooks — and
          walk through them chapter by chapter at your own pace. AI weaves the
          path. You walk it.
        </p>

        <ul className="mt-4 grid w-full max-w-2xl gap-3 text-left sm:grid-cols-3">
          <Feature
            label="01"
            title="Forge tomes"
            body="Type a skill or pick a template. AI writes a daily path with real exercises and references."
          />
          <Feature
            label="02"
            title="Walk your pace"
            body="Fast, normal, or no deadline. Each pace shapes a different book to fit your time."
          />
          <Feature
            label="03"
            title="Grow a wizard"
            body="Mastered tomes line up on the shelf. Your wizard levels up — magic, profession, a portrait that evolves."
          />
        </ul>

        <button
          type="button"
          onClick={seeLanding}
          className="mt-6 rounded-full bg-primary px-8 py-3.5 font-sans text-base font-medium tracking-tight text-primary-foreground transition-all duration-150 hover:-translate-y-0.5 hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-card focus-visible:outline-none active:scale-[0.98]"
        >
          Begin your study →
        </button>
        <p className="font-mono text-xs tracking-[0.08em] text-muted-foreground/70 uppercase">
          takes about a minute
        </p>
      </div>
    </section>
  )
}

function Feature({
  label,
  title,
  body,
}: {
  label: string
  title: string
  body: string
}) {
  return (
    <li className="rounded-2xl border border-border/70 bg-card/85 p-4 backdrop-blur-sm">
      <span className="font-mono text-xs tracking-[0.08em] text-muted-foreground uppercase">
        {label}
      </span>
      <h3 className="mt-1 font-display text-lg leading-tight tracking-tight text-foreground">
        {title}
      </h3>
      <p className="mt-1.5 font-sans text-sm leading-relaxed text-muted-foreground">
        {body}
      </p>
    </li>
  )
}
