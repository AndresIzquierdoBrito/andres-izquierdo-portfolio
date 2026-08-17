import { cn } from "~/lib/utils"

type SiteBrandMarkProps = {
  inverted?: boolean
  compact?: boolean
  showCopyright?: boolean
  className?: string
}

export default function SiteBrandMark({
  inverted = false,
  compact = false,
  showCopyright = false,
  className,
}: SiteBrandMarkProps) {
  return (
    <div
      className={cn(
        "flex w-fit flex-col items-start",
        inverted ? "text-white" : "text-slate-950 dark:text-white",
        className
      )}
      aria-label={showCopyright ? "izbri.com, copyright 2026" : "izbri.com"}
    >
      <span
        className={cn(
          "font-heading leading-none font-[750] tracking-[-0.075em] lowercase",
          compact ? "text-xl" : "text-2xl sm:text-[1.7rem]"
        )}
      >
        izbri.com
      </span>
      {showCopyright ? (
        <span
          className={cn(
            "mt-2 font-mono font-medium tracking-[0.08em]",
            inverted ? "text-white/58" : "text-slate-950/58 dark:text-white/58",
            compact ? "text-[0.62rem]" : "text-[0.68rem]"
          )}
        >
          © 2026
        </span>
      ) : null}
    </div>
  )
}
