import * as React from "react"

import { cn } from "@/lib/utils"

type PixelFrameProps = React.ComponentProps<"div"> & {
  tone?: "default" | "highlight" | "muted"
}

// Reusable wrapper that gives any container a chunky pixel-art border + drop shadow.
// The shadow is offset down-right so it reads as a 3D stamped tile, not a soft glow.
export function PixelFrame({
  className,
  tone = "default",
  ...props
}: PixelFrameProps) {
  return (
    <div
      className={cn(
        "relative border-[3px]",
        tone === "default" && "border-arcane-purple/70 bg-arcane-ink-light/80",
        tone === "highlight" && "border-arcane-gold bg-arcane-ink-light",
        tone === "muted" && "border-arcane-purple/30 bg-arcane-ink/60",
        className
      )}
      {...props}
    />
  )
}
