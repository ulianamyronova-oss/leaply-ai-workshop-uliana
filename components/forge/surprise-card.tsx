"use client"

import { useRouter } from "next/navigation"

import { templates } from "@/lib/data/templates"
import { useForgeStore } from "@/lib/stores/forge-store"

export function SurpriseCard() {
  const router = useRouter()
  const setTopic = useForgeStore((s) => s.setTopic)

  const handleClick = () => {
    const pick = templates[Math.floor(Math.random() * templates.length)]
    if (!pick) return
    setTopic(pick.name, "template")
    router.push("/forge/customize")
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      title="Pick a topic for me"
      className="group inline-flex shrink-0 items-center gap-2 rounded-full border border-primary/30 bg-primary/8 px-3.5 py-1.5 font-sans text-sm font-medium tracking-tight text-primary transition-all duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-0.5 hover:border-primary hover:bg-primary/15 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none active:scale-[0.97]"
    >
      <span
        aria-hidden
        className="text-base leading-none transition-transform duration-500 group-hover:rotate-180"
      >
        🎲
      </span>
      <span>Surprise me</span>
    </button>
  )
}
