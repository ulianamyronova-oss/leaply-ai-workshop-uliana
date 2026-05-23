"use client"

import { useForgeStore } from "@/lib/stores/forge-store"

export function PurposeInput() {
  const purpose = useForgeStore((s) => s.purpose)
  const setPurpose = useForgeStore((s) => s.setPurpose)

  return (
    <div className="flex flex-col gap-2">
      <h3 className="font-mono text-xs tracking-[0.08em] text-muted-foreground uppercase">
        Purpose
      </h3>
      <input
        value={purpose}
        onChange={(e) => setPurpose(e.target.value.slice(0, 120))}
        placeholder="for a hobby, for work, to impress someone…"
        maxLength={120}
        className="rounded-xl border border-border bg-card px-4 py-3 font-sans text-base text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
      />
    </div>
  )
}
