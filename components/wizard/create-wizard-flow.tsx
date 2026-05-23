"use client"

import { useState } from "react"

import { WIZARD_AVATARS, type WizardAvatarId } from "@/lib/data/wizard-avatars"
import { WIZARD_RACES, type WizardRaceId } from "@/lib/data/wizard-races"
import { useWizardStore } from "@/lib/stores/wizard-store"
import { cn } from "@/lib/utils"

type Step = "race" | "avatar" | "name"
const STEPS: Step[] = ["race", "avatar", "name"]

export function CreateWizardFlow() {
  const createWizard = useWizardStore((s) => s.createWizard)
  const [step, setStep] = useState<Step>("race")
  const [race, setRace] = useState<WizardRaceId | null>(null)
  const [avatarId, setAvatarId] = useState<WizardAvatarId | null>(null)
  const [name, setName] = useState("")

  const stepIndex = STEPS.indexOf(step)
  const canFinish = race && avatarId && name.trim().length > 0

  const handleFinish = () => {
    if (!canFinish) return
    createWizard({ race, avatarId, name: name.trim() })
  }

  return (
    <article className="rounded-2xl border border-border bg-card p-8 sm:p-10">
      <header className="mb-8 text-center">
        <p className="font-mono text-xs tracking-[0.08em] text-muted-foreground uppercase">
          a new initiate
        </p>
        <h2 className="mt-2 font-display text-3xl tracking-tight text-foreground sm:text-4xl">
          The library awaits.
        </h2>
        <div className="mt-5 flex items-center justify-center gap-2">
          {STEPS.map((s, i) => (
            <span
              key={s}
              aria-hidden
              className={cn(
                "h-1 w-8 rounded-full transition-colors",
                i <= stepIndex ? "bg-primary" : "bg-border"
              )}
            />
          ))}
        </div>
      </header>

      {step === "race" && (
        <StepShell title="Choose your calling">
          <div className="grid gap-2 sm:grid-cols-2">
            {WIZARD_RACES.map((r) => {
              const active = race === r.id
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setRace(r.id)}
                  className={cn(
                    "flex flex-col items-start gap-1 rounded-xl border p-4 text-left transition-all duration-200",
                    "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-card focus-visible:outline-none",
                    active
                      ? "border-primary bg-primary/5 ring-1 ring-primary"
                      : "border-border bg-card hover:border-foreground/20 hover:bg-secondary/50"
                  )}
                >
                  <span className="font-display text-lg leading-tight tracking-tight text-foreground">
                    {r.title}
                  </span>
                  <span className="font-mono text-xs tracking-[0.1em] text-muted-foreground uppercase">
                    {r.label}
                  </span>
                  <span className="mt-1 font-sans text-sm leading-snug text-foreground/70">
                    {r.essence}
                  </span>
                </button>
              )
            })}
          </div>
          <FooterNav onNext={() => setStep("avatar")} nextDisabled={!race} />
        </StepShell>
      )}

      {step === "avatar" && (
        <StepShell title="Choose your form">
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">
            {WIZARD_AVATARS.map((a) => {
              const active = avatarId === a.id
              return (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => setAvatarId(a.id)}
                  title={a.label}
                  className={cn(
                    "group relative flex aspect-square items-center justify-center overflow-hidden rounded-full border-2 bg-secondary transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
                    "hover:scale-105 active:scale-[0.98]",
                    "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-card focus-visible:outline-none",
                    active
                      ? "border-primary ring-4 ring-primary/30"
                      : "border-border hover:border-foreground/30"
                  )}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={a.src}
                    alt={a.label}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </button>
              )
            })}
          </div>
          <FooterNav
            onBack={() => setStep("race")}
            onNext={() => setStep("name")}
            nextDisabled={!avatarId}
          />
        </StepShell>
      )}

      {step === "name" && (
        <StepShell title="And your name?">
          <div className="flex flex-col gap-2">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value.slice(0, 30))}
              placeholder="Mira, Aldric, Sorrel…"
              maxLength={30}
              autoFocus
              className="w-full rounded-xl border border-border bg-card px-4 py-3.5 font-display text-2xl tracking-tight text-foreground placeholder:font-sans placeholder:text-base placeholder:font-normal placeholder:text-muted-foreground focus:border-primary focus:outline-none"
            />
            <p className="font-sans text-xs text-muted-foreground">
              up to 30 characters · whatever sounds right
            </p>
          </div>
          <FooterNav
            onBack={() => setStep("avatar")}
            onNext={handleFinish}
            nextDisabled={!canFinish}
            nextLabel="Step into the library →"
          />
        </StepShell>
      )}
    </article>
  )
}

function StepShell({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-6">
      <h3 className="text-center font-mono text-xs tracking-[0.08em] text-muted-foreground uppercase">
        {title}
      </h3>
      {children}
    </div>
  )
}

function FooterNav({
  onBack,
  onNext,
  nextDisabled,
  nextLabel = "Next →",
}: {
  onBack?: () => void
  onNext: () => void
  nextDisabled?: boolean
  nextLabel?: string
}) {
  return (
    <div className="mt-4 flex items-center justify-between gap-3">
      <button
        type="button"
        onClick={onBack}
        disabled={!onBack}
        className="font-sans text-sm text-muted-foreground transition-colors hover:text-foreground disabled:opacity-30"
      >
        ← back
      </button>
      <button
        type="button"
        onClick={onNext}
        disabled={nextDisabled}
        className={cn(
          "rounded-xl px-5 py-2.5 font-sans text-sm font-medium tracking-tight transition-all duration-150",
          "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-card focus-visible:outline-none",
          nextDisabled
            ? "cursor-not-allowed bg-secondary text-muted-foreground"
            : "bg-primary text-primary-foreground hover:bg-primary/90 active:scale-[0.98]"
        )}
      >
        {nextLabel}
      </button>
    </div>
  )
}
