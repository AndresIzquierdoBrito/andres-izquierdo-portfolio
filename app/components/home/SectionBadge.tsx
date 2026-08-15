import type { ReactNode } from "react"

import { type LucideIcon, Sparkles } from "lucide-react"

import { Badge } from "~/components/ui/badge"
import { cn } from "~/lib/utils"

type SectionBadgeProps = {
  children: ReactNode
  icon?: LucideIcon
  size?: "default" | "compact"
  className?: string
}

export default function SectionBadge({
  children,
  icon,
  size = "default",
  className,
}: SectionBadgeProps) {
  const BadgeIcon = icon ?? Sparkles

  return (
    <Badge
      variant="secondary"
      className={cn(
        "w-fit rounded-full border border-black/12 bg-[linear-gradient(135deg,rgba(234,179,8,0.28),rgba(39,255,195,0.34))] font-semibold uppercase shadow-[0_12px_32px_-12px_rgba(39,255,195,0.45)] backdrop-blur-md dark:border-white/16 dark:bg-[linear-gradient(135deg,rgba(34,211,238,0.28),rgba(99,102,241,0.32))] dark:text-white dark:shadow-[0_12px_32px_-12px_rgba(34,211,238,0.35)]",
        size === "default"
          ? "h-11 gap-2 px-5 text-[0.75rem] tracking-[0.28em] text-slate-950"
          : "h-9 gap-1.5 px-3.5 text-[0.65rem] tracking-[0.24em] text-slate-950",
        className
      )}
    >
      <BadgeIcon
        className={cn(
          "shrink-0 text-slate-950/75 dark:text-white/85",
          size === "default" ? "size-3.5" : "size-3"
        )}
      />
      <span>{children}</span>
    </Badge>
  )
}
