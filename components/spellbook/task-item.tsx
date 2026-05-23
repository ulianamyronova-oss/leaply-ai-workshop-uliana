"use client"

import type { SpellbookTask } from "@/lib/data/spellbook-stubs"
import { useForgeStore } from "@/lib/stores/forge-store"
import { cn } from "@/lib/utils"

type Props = {
  task: SpellbookTask
}

export function TaskItem({ task }: Props) {
  const completedTaskIds = useForgeStore((s) => s.completedTaskIds)
  const toggleTask = useForgeStore((s) => s.toggleTask)
  const isDone = completedTaskIds.includes(task.id)

  return (
    <li>
      <button
        type="button"
        onClick={() => toggleTask(task.id)}
        className="group flex w-full items-start gap-3 rounded-md px-1 py-1.5 text-left transition-colors hover:bg-foreground/5 focus-visible:bg-foreground/5 focus-visible:outline-none"
      >
        <span
          aria-hidden
          className={cn(
            "mt-[3px] flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-md border transition-colors",
            isDone
              ? "border-primary bg-primary text-primary-foreground"
              : "border-foreground/30 bg-card group-hover:border-foreground/60"
          )}
        >
          {isDone && (
            <svg
              viewBox="0 0 12 12"
              className="h-[10px] w-[10px]"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M2 6.5 5 9.5 10 3" />
            </svg>
          )}
        </span>
        <span
          className={cn(
            "flex-1 font-sans text-base leading-relaxed transition-colors",
            isDone ? "text-foreground/45 line-through" : "text-foreground/90"
          )}
        >
          {task.text}
        </span>
      </button>
    </li>
  )
}
