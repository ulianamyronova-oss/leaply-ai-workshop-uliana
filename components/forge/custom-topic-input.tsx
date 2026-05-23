"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import { customTopicSchema } from "@/lib/schemas/forge-schema"
import { useForgeStore } from "@/lib/stores/forge-store"

export function CustomTopicInput() {
  const router = useRouter()
  const setTopic = useForgeStore((s) => s.setTopic)
  const [value, setValue] = useState("")
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const result = customTopicSchema.safeParse(value)
    if (!result.success) {
      setError(result.error.issues[0]?.message ?? "Invalid input")
      return
    }
    setTopic(result.data, "custom")
    router.push("/forge/customize")
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-2 rounded-2xl border border-dashed border-border bg-card/60 p-1.5"
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <input
          value={value}
          onChange={(e) => {
            setValue(e.target.value)
            if (error) setError(null)
          }}
          placeholder="…or write your own — a skill, habit, anything"
          maxLength={80}
          className="flex-1 rounded-xl bg-transparent px-4 py-3 font-sans text-base text-foreground placeholder:text-muted-foreground focus:outline-none"
        />
        <button
          type="submit"
          className="rounded-xl bg-primary px-5 py-3 font-sans text-sm font-medium tracking-tight text-primary-foreground transition-all duration-150 hover:bg-primary/90 active:scale-[0.98] disabled:opacity-50"
        >
          Pick →
        </button>
      </div>
      {error && (
        <p className="px-4 pb-1 font-sans text-xs text-destructive">{error}</p>
      )}
    </form>
  )
}
