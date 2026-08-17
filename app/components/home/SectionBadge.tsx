import type { ReactNode } from "react"

import { cn } from "~/lib/utils"

type SectionBadgeProps = {
  children: ReactNode
  size?: "default" | "compact"
  className?: string
}

export default function SectionBadge({
  children,
  size = "default",
  className,
}: SectionBadgeProps) {
  return (
    <div
      className={cn(
        "relative isolate inline-flex w-fit text-slate-950 dark:text-white",
        size === "default"
          ? "text-2xl font-medium tracking-[-0.035em] sm:text-3xl"
          : "text-xl font-medium tracking-[-0.03em]",
        className
      )}
    >
      <span className="relative z-10">{children}</span>
      <span
        aria-hidden="true"
        className={cn(
          "absolute right-[-0.14em] bottom-0 left-[-0.06em] -z-0 bg-emerald-300/65 dark:bg-cyan-300/45",
          size === "default" ? "h-[0.42em]" : "h-[0.36em]"
        )}
      />
    </div>
  )
}
