"use client"

import { cn } from "@/lib/utils"

type Props = {
  state: "mastered" | "in_progress"
  completedCount: number
  totalCount: number
  topic: string
  onSave: () => void
  onBurn: () => void
  onClose: () => void
}

export function ExitModal({
  state,
  completedCount,
  totalCount,
  topic,
  onSave,
  onBurn,
  onClose,
}: Props) {
  const isMastered = state === "mastered"
  const headline = isMastered ? "Sealed and unsigned." : "Tome unfinished."
  const body = isMastered
    ? `You sealed every chapter of « ${topic} » but never placed it on the shelf. Save the mastered tome, or burn it?`
    : `« ${topic} » sits half-read (${completedCount}/${totalCount} chapters). Save it — you can return any time — or burn it and start fresh?`
  const saveLabel = isMastered
    ? "Save as mastered"
    : "Save to shelf (in progress)"

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="exit-modal-title"
    >
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-foreground/30 backdrop-blur-md"
      />

      <div className="relative w-full max-w-md rounded-2xl border border-border bg-card p-8">
        <button
          type="button"
          onClick={onClose}
          aria-label="Stay on spellbook"
          className="absolute top-3 right-3 flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          ✕
        </button>

        <div className="flex flex-col gap-4 text-center">
          <p className="font-mono text-xs tracking-[0.08em] text-muted-foreground uppercase">
            {isMastered ? "mastery unsaved" : "leaving the tome"}
          </p>
          <h2
            id="exit-modal-title"
            className="font-display text-3xl tracking-tight text-foreground sm:text-4xl"
          >
            {headline}
          </h2>
          <p className="font-sans text-base leading-relaxed text-foreground/80">
            {body}
          </p>

          <div className="mt-3 flex w-full flex-col gap-2.5">
            <button
              type="button"
              onClick={onSave}
              className={cn(
                "w-full rounded-xl bg-primary px-6 py-3 font-sans text-sm font-medium tracking-tight text-primary-foreground transition-all duration-150 hover:bg-primary/90 active:scale-[0.99]",
                "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-card focus-visible:outline-none"
              )}
            >
              {saveLabel}
            </button>
            <button
              type="button"
              onClick={onBurn}
              className="w-full rounded-xl border border-border bg-card px-6 py-3 font-sans text-sm text-muted-foreground transition-all duration-150 hover:border-destructive/50 hover:bg-destructive/5 hover:text-destructive"
            >
              Burn the tome
            </button>
            <button
              type="button"
              onClick={onClose}
              className="font-sans text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              stay &amp; keep reading
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
