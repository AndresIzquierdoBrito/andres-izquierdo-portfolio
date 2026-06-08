import { useRef } from "react"
import { BookOpen, ExternalLink } from "lucide-react"
import { useTranslation } from "react-i18next"

import { cn } from "~/lib/utils"

import type { ProjectCardData } from "./home-content"

// Re-export so callers don't need two imports
export type { ProjectCardData }

const toneClasses = [
  "from-amber-300/22 via-white/0 to-emerald-300/20 dark:from-amber-300/10 dark:via-transparent dark:to-cyan-300/14",
  "from-cyan-300/20 via-white/0 to-indigo-300/18 dark:from-cyan-300/10 dark:via-transparent dark:to-indigo-300/16",
  "from-emerald-300/20 via-white/0 to-amber-300/18 dark:from-emerald-300/10 dark:via-transparent dark:to-amber-300/14",
  "from-violet-300/22 via-white/0 to-rose-300/20 dark:from-violet-300/10 dark:via-transparent dark:to-rose-300/14",
  "from-rose-300/20 via-white/0 to-sky-300/18 dark:from-rose-300/10 dark:via-transparent dark:to-sky-300/16",
] as const

type ScreenshotSlot = {
  top?: string
  left?: string
  right?: string
  bottom?: string
  rotate: number
  zIndex: number
}

// Three fixed slots that orbit the central icon
const screenshotSlots: ScreenshotSlot[] = [
  { top: "4%",    left: "3%",   rotate: -9,  zIndex: 1 },
  { top: "2%",    right: "3%",  rotate:  8,  zIndex: 2 },
  { bottom: "3%", right: "7%",  rotate:  12, zIndex: 1 },
]

function ScreenshotItem({
  slot,
  src,
  toneClass,
}: {
  slot: ScreenshotSlot
  src?: string
  toneClass: string
}) {
  const ref = useRef<HTMLDivElement>(null)

  return (
    <div
      ref={ref}
      className="absolute w-[46%] cursor-pointer"
      style={{
        top: slot.top,
        left: slot.left,
        right: slot.right,
        bottom: slot.bottom,
        aspectRatio: "16 / 10",
        transform: `rotate(${slot.rotate}deg)`,
        zIndex: slot.zIndex,
        transition: "transform 0.35s cubic-bezier(0.34,1.56,0.64,1)",
        transformOrigin: "center center",
      }}
      onMouseEnter={() => {
        if (!ref.current) return
        ref.current.style.transform = `rotate(0deg) scale(1.07)`
        ref.current.style.zIndex = "20"
      }}
      onMouseLeave={() => {
        if (!ref.current) return
        ref.current.style.transform = `rotate(${slot.rotate}deg) scale(1)`
        ref.current.style.zIndex = String(slot.zIndex)
      }}
    >
      {src ? (
        <img
          src={src}
          alt=""
          draggable={false}
          className="h-full w-full rounded-xl object-cover shadow-[0_8px_24px_-6px_rgba(15,23,42,0.28)] dark:shadow-[0_8px_24px_-6px_rgba(2,6,23,0.55)]"
        />
      ) : (
        // Placeholder: macOS-style window chrome + tone gradient
        <div className="h-full w-full overflow-hidden rounded-xl border border-black/10 bg-white shadow-[0_8px_24px_-6px_rgba(15,23,42,0.18)] dark:border-white/12 dark:bg-slate-800">
          <div className="flex items-center gap-[5px] border-b border-black/8 bg-slate-50 px-2.5 py-2 dark:border-white/8 dark:bg-slate-700/60">
            <span className="size-2 rounded-full bg-rose-400" />
            <span className="size-2 rounded-full bg-amber-400" />
            <span className="size-2 rounded-full bg-emerald-400" />
          </div>
          <div
            className={cn(
              "h-full w-full bg-[linear-gradient(135deg,var(--tw-gradient-stops))] opacity-40",
              toneClass,
            )}
          />
        </div>
      )}
    </div>
  )
}

export default function ProjectCard({
  card,
  index,
  className,
}: {
  card: ProjectCardData
  index: number
  className?: string
}) {
  const { t } = useTranslation("common", { keyPrefix: "sections.projects" })
  const toneClass = toneClasses[index % toneClasses.length]

  return (
    <article
      className={cn(
        "relative flex h-full w-full flex-col overflow-hidden rounded-[2.25rem] border border-black/8 bg-white/55 text-left shadow-[0_34px_80px_-42px_rgba(15,23,42,0.45)] backdrop-blur-xl dark:border-white/14 dark:bg-slate-950/56 dark:shadow-[0_34px_80px_-42px_rgba(2,6,23,0.75)]",
        className,
      )}
    >
      {/* Tone gradient */}
      <div
        aria-hidden="true"
        className={cn(
          "absolute inset-0 bg-[linear-gradient(145deg,var(--tw-gradient-stops))] opacity-90",
          toneClass,
        )}
      />
      {/* Glass sheen */}
      <div
        aria-hidden="true"
        className="absolute inset-px rounded-[calc(2rem-1px)] bg-[linear-gradient(180deg,rgba(255,255,255,0.76),rgba(255,255,255,0.18))] dark:bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))]"
      />
      {/* Paper grain */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[2.25rem] opacity-[0.13] mix-blend-multiply dark:opacity-[0.22] dark:mix-blend-screen"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'%3E%3Cfilter id='a'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23a)'/%3E%3C/svg%3E\")",
          backgroundRepeat: "repeat",
          backgroundSize: "182px",
        }}
      />

      <div className="relative z-10 flex h-full flex-col p-6 sm:p-7 lg:p-8">
        {/* Header row */}
        <div className="flex items-start justify-between gap-4">
          <p className="text-[0.68rem] font-semibold tracking-[0.28em] text-slate-500 uppercase dark:text-white/45">
            {card.eyebrow}
          </p>

          {card.stack?.length ? (
            <div className="flex items-center gap-1.5">
              {card.stack.slice(0, 3).map((Icon, si) => (
                <span
                  key={si}
                  className="flex size-9 items-center justify-center rounded-full border border-black/10 bg-white text-slate-500 shadow-sm dark:border-white/14 dark:bg-slate-900 dark:text-white/70"
                >
                  <Icon className="size-5" />
                </span>
              ))}
            </div>
          ) : null}
        </div>

        {/* Name + description */}
        <div className="mt-4 space-y-2">
          <h3 className="text-2xl font-semibold tracking-tight text-slate-950 dark:text-white lg:text-[1.55rem]">
            {card.name}
          </h3>
          <p className="line-clamp-2 text-[0.82rem] leading-6 text-slate-600 dark:text-white/65">
            {card.description}
          </p>
        </div>

        {/* Screenshot cluster — grows to fill remaining space */}
        <div className="relative mt-5 flex-1">
          {screenshotSlots.map((slot, si) => (
            <ScreenshotItem
              key={si}
              slot={slot}
              src={card.screenshots?.[si]}
              toneClass={toneClass}
            />
          ))}

          {/* Central app icon — pointer-events-none so it doesn't block screenshot hover */}
          <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
            <div className="flex size-14 items-center justify-center rounded-2xl border border-black/10 bg-white shadow-[0_8px_28px_-6px_rgba(15,23,42,0.28)] ring-4 ring-[rgba(39,255,195,0.32)] sm:size-16 dark:border-white/16 dark:bg-slate-900 dark:ring-[rgba(99,102,241,0.38)]">
              {card.iconSrc ? (
                <img
                  src={card.iconSrc}
                  alt={card.name}
                  className="size-9 rounded-xl object-contain sm:size-10"
                />
              ) : (
                <span className="select-none text-xl font-bold text-slate-400 dark:text-white/35">
                  {card.name.charAt(0)}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Footer links */}
        <div className="mt-5 flex items-center gap-2.5">
          {card.projectUrl ? (
            <a
              href={card.projectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full bg-[linear-gradient(135deg,#27ffc3,#EAB308)] px-4 py-2 text-[0.7rem] font-semibold text-slate-900 transition-all duration-200 hover:-translate-y-px hover:brightness-[1.06] hover:shadow-md dark:bg-[linear-gradient(135deg,#22d3ee,#6366f1)] dark:text-white"
            >
              <ExternalLink className="size-3" />
              {t("viewProject")}
            </a>
          ) : (
            <span className="inline-flex cursor-not-allowed items-center gap-1.5 rounded-full border border-black/10 px-4 py-2 text-[0.7rem] font-semibold text-slate-400 dark:border-white/10 dark:text-white/30">
              <ExternalLink className="size-3" />
              {t("comingSoon")}
            </span>
          )}
          {card.caseStudyUrl ? (
            <a
              href={card.caseStudyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(39,255,195,0.42)] bg-[linear-gradient(135deg,rgba(39,255,195,0.10),rgba(234,179,8,0.08))] px-4 py-2 text-[0.7rem] font-semibold text-slate-800 transition-all duration-200 hover:-translate-y-px hover:brightness-105 dark:border-[rgba(99,102,241,0.44)] dark:bg-[linear-gradient(135deg,rgba(34,211,238,0.12),rgba(99,102,241,0.10))] dark:text-white/85"
            >
              <BookOpen className="size-3" />
              {t("caseStudy")}
            </a>
          ) : (
            <span className="inline-flex cursor-not-allowed items-center gap-1.5 rounded-full border border-black/8 px-4 py-2 text-[0.7rem] font-semibold text-slate-400 dark:border-white/8 dark:text-white/30">
              <BookOpen className="size-3" />
              {t("caseStudy")}
            </span>
          )}
        </div>
      </div>
    </article>
  )
}
