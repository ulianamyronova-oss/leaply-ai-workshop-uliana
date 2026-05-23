"use client"

import { useRouter } from "next/navigation"

import { useForgeStore } from "@/lib/stores/forge-store"
import { cn } from "@/lib/utils"

export function WriteButton() {
  const router = useRouter()
  const topic = useForgeStore((s) => s.topic)
  const difficulty = useForgeStore((s) => s.difficulty)

  const isReady = Boolean(topic && difficulty)

  const handleClick = () => {
    if (!isReady) return
    router.push("/forge/forging")
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={!isReady}
      className={cn(
        "w-full rounded-xl px-6 py-4 font-sans text-base font-medium tracking-tight transition-all duration-150",
        "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none",
        isReady
          ? "bg-primary text-primary-foreground hover:bg-primary/90 active:scale-[0.99]"
          : "cursor-not-allowed bg-secondary text-muted-foreground"
      )}
    >
      {isReady ? "Write the spellbook" : "Pick a pace first"}
    </button>
  )
}
