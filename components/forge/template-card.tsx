"use client"

import { useRouter } from "next/navigation"

import type { Template } from "@/lib/data/templates"
import { useForgeStore } from "@/lib/stores/forge-store"

type Props = {
  template: Template
}

export function TemplateCard({ template }: Props) {
  const router = useRouter()
  const setTopic = useForgeStore((s) => s.setTopic)

  const handleClick = () => {
    setTopic(template.name, "template")
    router.push("/forge/customize")
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="group inline-flex shrink-0 items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1.5 font-sans text-sm font-medium tracking-tight text-foreground transition-all duration-200 hover:-translate-y-0.5 hover:border-foreground/30 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none active:scale-[0.98]"
    >
      <span
        aria-hidden
        className="text-base leading-none transition-transform duration-200 group-hover:scale-110"
      >
        {template.emoji}
      </span>
      <span>{template.name}</span>
    </button>
  )
}
