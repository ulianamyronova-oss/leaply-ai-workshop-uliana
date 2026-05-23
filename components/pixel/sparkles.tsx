"use client"

import { useMemo } from "react"

import { useHasMounted } from "@/hooks/use-has-mounted"
import { cn } from "@/lib/utils"

type SparkleDot = {
  left: number
  top: number
  delay: number
  size: number
}

type SparklesProps = {
  count?: number
  className?: string
}

// Deterministic pseudo-random scatter (no Math.random — React 19's purity rule
// forbids impure calls during render). Prime-modulo math spreads dots
// uniformly enough to read as "random sparkles" without true randomness.
function spreadDots(count: number): SparkleDot[] {
  return Array.from({ length: count }, (_, i) => ({
    left: (i * 37 + 11) % 100,
    top: (i * 71 + 17) % 100,
    delay: ((i * 53 + 3) % 19) / 10,
    size: 2 + (i % 3),
  }))
}

export function Sparkles({ count = 18, className }: SparklesProps) {
  // Mount gate keeps SSR markup empty so there's no hydration concern about
  // pixel-perfect dot positions; client paint reveals the field after mount.
  const mounted = useHasMounted()
  const dots = useMemo(
    () => (mounted ? spreadDots(count) : []),
    [mounted, count]
  )

  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className
      )}
    >
      {dots.map((dot, i) => (
        <span
          key={i}
          className="absolute animate-pulse bg-arcane-gold"
          style={{
            left: `${dot.left}%`,
            top: `${dot.top}%`,
            width: `${dot.size}px`,
            height: `${dot.size}px`,
            animationDelay: `${dot.delay}s`,
            animationDuration: "1.6s",
          }}
        />
      ))}
    </div>
  )
}
