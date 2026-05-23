"use client"

import { useId } from "react"

import { cn } from "@/lib/utils"

type Props = {
  opacity?: number
  baseFrequency?: number
  className?: string
}

// SVG turbulence noise overlay. Lays over a card to give it the speckled
// texture of newsprint or aged paper. Each instance generates its own
// filter id so multiple overlays don't collide on the same page.
export function PaperNoise({
  opacity = 0.07,
  baseFrequency = 0.85,
  className,
}: Props) {
  const filterId = useId()
  return (
    <svg
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 h-full w-full mix-blend-multiply",
        className
      )}
      style={{ opacity }}
    >
      <filter id={filterId}>
        <feTurbulence
          type="fractalNoise"
          baseFrequency={baseFrequency}
          numOctaves="2"
          stitchTiles="stitch"
        />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter={`url(#${filterId})`} />
    </svg>
  )
}
