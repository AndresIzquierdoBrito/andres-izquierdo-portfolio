import type { ReactNode } from "react"

import { Sparkles } from "lucide-react"

import { Badge } from "~/components/ui/badge"
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
    <Badge
      variant="secondary"
      className={cn(
        "w-fit rounded-full border border-black/8 bg-[linear-gradient(135deg,rgba(234,179,8,0.18),rgba(39,255,195,0.22))] font-semibold uppercase shadow-[0_16px_40px_-24px_rgba(15,23,42,0.32)] backdrop-blur-md dark:border-white/12 dark:bg-[linear-gradient(135deg,rgba(34,211,238,0.18),rgba(99,102,241,0.22))] dark:text-white",
        size === "default"
          ? "h-10 gap-2 px-4 text-[0.72rem] tracking-[0.24em] text-slate-950"
          : "h-8 gap-1.5 px-3 text-[0.62rem] tracking-[0.22em] text-slate-950",
        className
      )}
    >
      <Sparkles
        className={cn(
          "shrink-0 text-slate-950/75 dark:text-white/85",
          size === "default" ? "size-3.5" : "size-3"
        )}
      />
      <span>{children}</span>
    </Badge>
  )
}
