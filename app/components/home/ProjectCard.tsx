import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react"
import { createPortal } from "react-dom"
import { ArrowUpRight, BookOpen, ExternalLink, X } from "lucide-react"
import { useTranslation } from "react-i18next"
import gsap from "gsap"

import { resolveAppLanguage } from "~/i18n/settings"
import { cn } from "~/lib/utils"
import { GithubIcon } from "~/components/icons"

import {
  getProjectContent,
  type ProjectCardData,
  type ProjectScreenshot,
} from "./home-content"

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

// ApunteX keeps the original composition; other projects can opt into a
// different arrangement so every project preview does not feel duplicated.
const defaultScreenshotSlots: ScreenshotSlot[] = [
  { top: "26%", left: "0%", rotate: -8, zIndex: 1 },
  { top: "1%", right: "0%", rotate: 7, zIndex: 2 },
  { bottom: "2%", right: "4%", rotate: 10, zIndex: 1 },
]

const staggeredScreenshotSlots: ScreenshotSlot[] = [
  { top: "3%", right: "2%", rotate: 6, zIndex: 2 },
  { top: "25%", left: "-2%", rotate: -10, zIndex: 1 },
  { bottom: "1%", left: "17%", rotate: -3, zIndex: 2 },
]

type ScreenshotLightboxState = {
  src: string
  frame: ProjectScreenshot["frame"]
  label: string
  originRect: DOMRect
  originRotation: number
}

function ScreenshotWindow({
  src,
  alt,
  expanded = false,
}: {
  src: string
  alt: string
  expanded?: boolean
}) {
  return (
    <div
      className={cn(
        "flex h-full w-full flex-col overflow-hidden rounded-xl border border-black/10 bg-white shadow-[0_8px_24px_-6px_rgba(15,23,42,0.28)] dark:border-white/12 dark:bg-slate-800 dark:shadow-[0_8px_24px_-6px_rgba(2,6,23,0.55)]",
        expanded && "rounded-2xl shadow-[0_28px_90px_-24px_rgba(2,6,23,0.7)]"
      )}
    >
      <div className="flex h-5 shrink-0 items-center gap-[5px] border-b border-black/8 bg-slate-50 px-2.5 dark:border-white/8 dark:bg-slate-700/60">
        <span className="size-2 rounded-full bg-rose-400" />
        <span className="size-2 rounded-full bg-amber-400" />
        <span className="size-2 rounded-full bg-emerald-400" />
      </div>
      <div
        className={cn(
          "min-h-0 flex-1 overflow-hidden bg-slate-100/90 dark:bg-slate-900/90",
          expanded && "max-h-[calc(85svh-2.5rem)]"
        )}
      >
        <img
          src={src}
          alt={alt}
          draggable={false}
          className="block h-full w-full object-contain object-top"
        />
      </div>
    </div>
  )
}

function ScreenshotPhone({
  src,
  alt,
  expanded = false,
}: {
  src: string
  alt: string
  expanded?: boolean
}) {
  return (
    <div
      className={cn(
        "relative flex h-full w-full overflow-hidden rounded-[2rem] border-[6px] border-white bg-white p-1 shadow-[0_12px_28px_-8px_rgba(15,23,42,0.32)] ring-1 ring-black/10 dark:border-white dark:bg-white dark:shadow-[0_12px_28px_-8px_rgba(2,6,23,0.56)]",
        expanded &&
          "rounded-[2.5rem] border-[8px] shadow-[0_28px_90px_-24px_rgba(2,6,23,0.58)]"
      )}
    >
      <div className="relative min-h-0 flex-1 overflow-hidden rounded-[1.55rem] bg-black">
        <div
          aria-hidden="true"
          className={cn(
            "absolute top-1.5 left-1/2 z-10 h-3 w-14 -translate-x-1/2 rounded-full bg-black/90",
            expanded && "top-2 h-4 w-20"
          )}
        />
        <img
          src={src}
          alt={alt}
          draggable={false}
          className="block h-full w-full object-cover object-top"
        />
      </div>
    </div>
  )
}

function ScreenshotFrame({
  screenshot,
  alt,
  expanded = false,
}: {
  screenshot: ProjectScreenshot
  alt: string
  expanded?: boolean
}) {
  if (screenshot.frame === "phone") {
    return (
      <ScreenshotPhone src={screenshot.src} alt={alt} expanded={expanded} />
    )
  }

  return <ScreenshotWindow src={screenshot.src} alt={alt} expanded={expanded} />
}

function ScreenshotLightbox({
  screenshot,
  closing,
  onRequestClose,
  onClosed,
}: {
  screenshot: ScreenshotLightboxState
  closing: boolean
  onRequestClose: () => void
  onClosed: () => void
}) {
  const backdropRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const timelineRef = useRef<gsap.core.Timeline | null>(null)
  const hasAnimatedRef = useRef(false)
  const reducedMotionRef = useRef(false)

  const animateIn = useCallback(() => {
    const backdrop = backdropRef.current
    const frame = frameRef.current
    if (!backdrop || !frame || hasAnimatedRef.current) return

    hasAnimatedRef.current = true
    reducedMotionRef.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches

    const targetRect = frame.getBoundingClientRect()
    const originCenterX =
      screenshot.originRect.left + screenshot.originRect.width / 2
    const originCenterY =
      screenshot.originRect.top + screenshot.originRect.height / 2
    const targetCenterX = targetRect.left + targetRect.width / 2
    const targetCenterY = targetRect.top + targetRect.height / 2
    const originScale = Math.min(
      1,
      screenshot.originRect.width / Math.max(targetRect.width, 1)
    )

    const timeline = gsap.timeline({ paused: true })
    timeline.fromTo(
      backdrop,
      { opacity: 0 },
      {
        opacity: 1,
        duration: reducedMotionRef.current ? 0 : 0.32,
        ease: "power2.out",
      },
      0
    )
    timeline.fromTo(
      frame,
      {
        x: originCenterX - targetCenterX,
        y: originCenterY - targetCenterY,
        scale: originScale,
        rotation: screenshot.originRotation,
      },
      {
        x: 0,
        y: 0,
        scale: 1,
        rotation: 0,
        duration: reducedMotionRef.current ? 0 : 0.72,
        ease: "elastic.out(1, 0.62)",
      },
      0
    )

    timelineRef.current = timeline
    if (reducedMotionRef.current) {
      timeline.progress(1)
    } else {
      timeline.play()
    }

    requestAnimationFrame(() => closeButtonRef.current?.focus())
  }, [screenshot])

  useLayoutEffect(() => {
    animateIn()
    return () => {
      timelineRef.current?.kill()
      timelineRef.current = null
      hasAnimatedRef.current = false
    }
  }, [animateIn])

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault()
        if (!closing) onRequestClose()
        return
      }

      if (event.key === "Tab") {
        event.preventDefault()
        closeButtonRef.current?.focus()
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [closing, onRequestClose])

  useEffect(() => {
    if (!closing) return

    // Close immediately. The lightbox's opening animation is intentional, but
    // reversing it on dismissal makes the viewer feel slow to exit.
    onClosed()
  }, [closing, onClosed])

  if (typeof document === "undefined") return null

  return createPortal(
    <div
      ref={backdropRef}
      role="dialog"
      aria-modal="true"
      aria-label={screenshot.label}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/58 p-4 backdrop-blur-md sm:p-8"
      onClick={(event) => {
        if (event.target === event.currentTarget) onRequestClose()
      }}
    >
      <div
        ref={frameRef}
        data-screenshot-frame={screenshot.frame}
        className={cn(
          "relative max-h-[85svh] origin-center",
          screenshot.frame === "phone"
            ? "w-[min(82vw,39svh,420px)]"
            : "w-[min(90vw,1100px)]"
        )}
        style={
          screenshot.frame === "phone"
            ? { aspectRatio: "650 / 1396" }
            : undefined
        }
      >
        <ScreenshotFrame
          screenshot={{ src: screenshot.src, frame: screenshot.frame }}
          alt={screenshot.label}
          expanded
        />
        <button
          ref={closeButtonRef}
          type="button"
          aria-label="Close screenshot viewer"
          onClick={onRequestClose}
          className="absolute top-2 right-2 inline-flex size-9 items-center justify-center rounded-full border border-white/20 bg-slate-950/75 text-white shadow-lg backdrop-blur transition-transform hover:scale-105 focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:outline-none"
        >
          <X className="size-4" />
        </button>
      </div>
    </div>,
    document.body
  )
}

function ScreenshotItem({
  slot,
  screenshot,
  projectName,
  screenshotIndex,
  onOpen,
  interactive = true,
}: {
  slot: ScreenshotSlot
  screenshot?: ProjectScreenshot
  projectName: string
  screenshotIndex: number
  onOpen?: (
    screenshot: ProjectScreenshot,
    label: string,
    origin: HTMLButtonElement,
    rotation: number
  ) => void
  interactive?: boolean
}) {
  const ref = useRef<HTMLButtonElement>(null)
  const label = `${projectName} screenshot ${screenshotIndex + 1}`
  const frame = screenshot?.frame ?? "browser"

  const setHovered = (hovered: boolean) => {
    if (!ref.current) return
    ref.current.style.transform = hovered
      ? "rotate(0deg) scale(1.07)"
      : `rotate(${slot.rotate}deg) scale(1)`
    ref.current.style.zIndex = hovered ? "20" : String(slot.zIndex)
  }

  if (!screenshot) {
    return null
  }

  const frameStyle = {
    top: slot.top,
    left: slot.left,
    right: slot.right,
    bottom: slot.bottom,
    width: frame === "phone" ? "30%" : "52%",
    aspectRatio: frame === "phone" ? "650 / 1396" : "16 / 10",
    transform: `rotate(${slot.rotate}deg)`,
    zIndex: slot.zIndex,
    transformOrigin: "center center",
  }

  if (!interactive) {
    return (
      <div
        aria-hidden="true"
        data-screenshot-frame={frame}
        className="pointer-events-none absolute"
        style={frameStyle}
      >
        <ScreenshotFrame screenshot={screenshot} alt="" />
      </div>
    )
  }

  return (
    <button
      type="button"
      ref={ref}
      aria-label={`Open ${label}`}
      data-screenshot-frame={frame}
      className="absolute cursor-pointer appearance-none border-0 bg-transparent p-0 text-left focus-visible:z-20 focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:outline-none dark:focus-visible:ring-indigo-300 dark:focus-visible:ring-offset-slate-950"
      style={{
        ...frameStyle,
        transition: "transform 0.35s cubic-bezier(0.34,1.56,0.64,1)",
      }}
      onMouseEnter={() => {
        setHovered(true)
      }}
      onMouseLeave={() => {
        setHovered(false)
      }}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      onClick={(event) => {
        event.stopPropagation()
        onOpen?.(screenshot, label, event.currentTarget, slot.rotate)
      }}
    >
      <ScreenshotFrame screenshot={screenshot} alt={label} />
    </button>
  )
}

export default function ProjectCard({
  card,
  index,
  className,
  isActive = true,
}: {
  card: ProjectCardData
  index: number
  className?: string
  isActive?: boolean
}) {
  const { t, i18n } = useTranslation("common", {
    keyPrefix: "sections.projects",
  })
  const content = getProjectContent(
    card,
    resolveAppLanguage(i18n.resolvedLanguage ?? i18n.language)
  )
  const toneClass = toneClasses[index % toneClasses.length]
  const [lightbox, setLightbox] = useState<ScreenshotLightboxState | null>(null)
  const [closing, setClosing] = useState(false)
  const activeThumbnailRef = useRef<HTMLButtonElement | null>(null)
  const screenshotSlots =
    card.screenshotLayout === "staggered"
      ? staggeredScreenshotSlots
      : defaultScreenshotSlots

  const openLightbox = (
    screenshot: ProjectScreenshot,
    label: string,
    origin: HTMLButtonElement,
    rotation: number
  ) => {
    activeThumbnailRef.current = origin
    setClosing(false)
    setLightbox({
      src: screenshot.src,
      frame: screenshot.frame,
      label,
      originRect: origin.getBoundingClientRect(),
      originRotation: rotation,
    })
  }

  const requestClose = () => {
    if (lightbox) setClosing(true)
  }

  const finishClose = () => {
    setLightbox(null)
    setClosing(false)
    requestAnimationFrame(() => activeThumbnailRef.current?.focus())
  }

  return (
    <article
      className={cn(
        "relative flex h-full w-full flex-col overflow-hidden rounded-[2.25rem] border border-black/8 bg-white/55 text-left shadow-[0_34px_80px_-42px_rgba(15,23,42,0.45)] backdrop-blur-xl dark:border-white/14 dark:bg-slate-950/56 dark:shadow-[0_34px_80px_-42px_rgba(2,6,23,0.75)]",
        className
      )}
    >
      {/* Tone gradient */}
      <div
        aria-hidden="true"
        className={cn(
          "absolute inset-0 bg-[linear-gradient(145deg,var(--tw-gradient-stops))] opacity-90",
          toneClass
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
          <p className="font-mono text-[0.65rem] font-semibold tracking-[0.18em] text-slate-500 uppercase dark:text-white/45">
            {content.eyebrow}
          </p>

          {card.stack?.length ? (
            <div className="flex items-center gap-1.5">
              {card.stack.map(({ icon: Icon, title }) => (
                <span
                  key={title}
                  title={title}
                  aria-label={title}
                  role="img"
                  tabIndex={0}
                  className={cn(
                    "group/stack-icon relative flex size-9 shrink-0 cursor-help items-center justify-center rounded-full border border-black/10 bg-white text-slate-500 shadow-sm transition-transform outline-none hover:scale-105 focus-visible:ring-2 focus-visible:ring-cyan-300 dark:border-white/14 dark:bg-slate-900 dark:text-white/70",
                    title === "Drizzle" &&
                      "border-black/15 bg-slate-950 text-white dark:border-white/20 dark:bg-slate-950"
                  )}
                >
                  <Icon className="size-5" />
                  <span
                    role="tooltip"
                    className="pointer-events-none absolute top-[calc(100%+0.5rem)] right-1/2 z-30 w-max translate-x-1/2 translate-y-1 rounded-md border border-black/10 bg-white/95 px-2.5 py-1.5 font-mono text-[0.6rem] font-semibold tracking-[0.08em] text-slate-800 capitalize opacity-0 shadow-[0_10px_24px_-10px_rgba(15,23,42,0.38)] backdrop-blur transition-all duration-150 group-hover/stack-icon:translate-y-0 group-hover/stack-icon:opacity-100 group-focus-visible/stack-icon:translate-y-0 group-focus-visible/stack-icon:opacity-100 dark:border-white/15 dark:bg-slate-900/95 dark:text-white dark:shadow-[0_10px_24px_-10px_rgba(2,6,23,0.7)]"
                  >
                    {title}
                  </span>
                </span>
              ))}
            </div>
          ) : null}
        </div>

        {/* Name + description */}
        <div className="mt-4 space-y-2">
          {card.projectUrl && isActive ? (
            <a
              href={card.projectUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open ${content.name} website`}
              onClick={(event) => event.stopPropagation()}
              className="group/title inline-block rounded-sm text-slate-950 focus-visible:outline-none dark:text-white"
            >
              <h3 className="text-2xl font-semibold tracking-tight lg:text-[1.55rem]">
                <span className="relative inline-block">
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-[-0.08em] bottom-[0.08em] h-[0.34em] origin-left scale-x-0 rounded-sm bg-gradient-to-r from-emerald-300/80 via-emerald-200/70 to-cyan-200/70 transition-transform duration-300 ease-out group-hover/title:scale-x-100 group-focus-visible/title:scale-x-100 dark:from-cyan-300/70 dark:via-indigo-300/55 dark:to-cyan-200/50"
                  />
                  <span className="relative">{content.name}</span>
                </span>
              </h3>
            </a>
          ) : (
            <h3 className="text-2xl font-semibold tracking-tight text-slate-950 lg:text-[1.55rem] dark:text-white">
              {content.name}
            </h3>
          )}
          <p className="text-[0.82rem] leading-5 text-slate-600 dark:text-white/65">
            {content.description}
          </p>
        </div>

        {/* Screenshot cluster — grows to fill remaining space */}
        <div className="relative mt-5 flex-1">
          {screenshotSlots.map((slot, si) => (
            <ScreenshotItem
              key={si}
              slot={slot}
              screenshot={card.screenshots?.[si]}
              projectName={content.name}
              screenshotIndex={si}
              onOpen={isActive ? openLightbox : undefined}
              interactive={isActive}
            />
          ))}

          {/* Central app icon — pointer-events-none so it doesn't block screenshot hover */}
          <div className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center">
            <div
              className={cn(
                "relative flex items-center justify-center",
                card.iconSrc
                  ? "size-24 rounded-none border-0 bg-transparent shadow-none ring-0 sm:size-32"
                  : "size-14 rounded-2xl border border-black/10 bg-white shadow-[0_8px_28px_-6px_rgba(15,23,42,0.28)] ring-4 ring-[rgba(39,255,195,0.32)] sm:size-16 dark:border-white/16 dark:bg-slate-900 dark:ring-[rgba(99,102,241,0.38)]"
              )}
            >
              {card.iconSrc ? (
                <>
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute size-20 rounded-full sm:size-28",
                      card.iconGlow === "spectrum"
                        ? "opacity-95 blur-xl"
                        : card.iconGlow === "lime"
                          ? "bg-lime-300/70 blur-2xl dark:bg-lime-400/60"
                          : "bg-amber-300/45 blur-2xl dark:bg-cyan-300/35"
                    )}
                    style={
                      card.iconGlow === "spectrum"
                        ? {
                            background:
                              "radial-gradient(circle at 22% 50%, rgba(239,68,68,0.88), transparent 52%), radial-gradient(circle at 78% 50%, rgba(59,130,246,0.88), transparent 52%), radial-gradient(circle at 50% 22%, rgba(234,179,8,0.88), transparent 52%), radial-gradient(circle at 50% 78%, rgba(34,197,94,0.88), transparent 52%)",
                          }
                        : card.iconGlow === "lime"
                          ? {
                              background:
                                "radial-gradient(circle, rgba(190,242,100,0.98) 0%, rgba(163,230,53,0.78) 38%, transparent 74%)",
                            }
                          : undefined
                    }
                  />
                  <img
                    src={card.iconSrc}
                    alt={content.name}
                    className={cn(
                      "relative z-10 size-24 object-contain sm:size-32",
                      card.iconGlow === "spectrum"
                        ? "drop-shadow-[0_0_10px_rgba(255,255,255,0.72)] sm:drop-shadow-[0_0_16px_rgba(255,255,255,0.72)]"
                        : card.iconGlow === "lime"
                          ? "drop-shadow-[0_0_12px_rgba(163,230,53,0.9)] sm:drop-shadow-[0_0_20px_rgba(163,230,53,0.9)] dark:drop-shadow-[0_0_16px_rgba(190,242,100,0.9)] dark:sm:drop-shadow-[0_0_26px_rgba(190,242,100,0.9)]"
                          : "drop-shadow-[0_0_12px_rgba(255,132,97,0.72)] sm:drop-shadow-[0_0_18px_rgba(255,132,97,0.72)] dark:drop-shadow-[0_0_16px_rgba(45,212,191,0.64)] dark:sm:drop-shadow-[0_0_24px_rgba(45,212,191,0.64)]"
                    )}
                  />
                </>
              ) : (
                <span className="text-xl font-bold text-slate-400 select-none dark:text-white/35">
                  {content.name.charAt(0)}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Footer links */}
        <div className="mt-5 flex items-center justify-between gap-2.5">
          <div className="flex min-w-0 items-center gap-2.5">
            {card.projectUrl && isActive ? (
              <a
                href={card.projectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full bg-slate-950 px-4 py-2 text-[0.68rem] font-semibold text-white transition-colors duration-200 hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-white/84"
              >
                <ExternalLink className="size-3" />
                {t("viewProject")}
              </a>
            ) : card.projectUrl ? (
              <span className="inline-flex cursor-default items-center gap-1.5 rounded-full bg-slate-950/45 px-4 py-2 text-[0.68rem] font-semibold text-white/70 dark:bg-white/25 dark:text-white/65">
                <ExternalLink className="size-3" />
                {t("viewProject")}
              </span>
            ) : (
              <span className="inline-flex cursor-not-allowed items-center gap-1.5 rounded-full border border-black/10 px-4 py-2 text-[0.68rem] font-semibold text-slate-400 dark:border-white/10 dark:text-white/30">
                <ExternalLink className="size-3" />
                {t("comingSoon")}
              </span>
            )}
            {card.caseStudyUrl && isActive ? (
              <a
                href={card.caseStudyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300/70 bg-white px-4 py-2 text-[0.68rem] font-semibold text-slate-800 transition-colors duration-200 hover:border-emerald-400 dark:border-cyan-400/35 dark:bg-slate-950 dark:text-white/85 dark:hover:border-cyan-300/60"
              >
                <BookOpen className="size-3" />
                {t("caseStudy")}
              </a>
            ) : card.caseStudyUrl ? (
              <span
                title={t("caseStudyComingSoon")}
                className="inline-flex cursor-default items-center gap-1.5 rounded-full border border-emerald-300/35 bg-white/55 px-4 py-2 text-[0.68rem] font-semibold text-slate-500 dark:border-cyan-400/20 dark:bg-slate-950/35 dark:text-white/45"
              >
                <BookOpen className="size-3" />
                {t("caseStudy")}
              </span>
            ) : (
              <span
                title={t("caseStudyComingSoon")}
                className="inline-flex cursor-not-allowed items-center gap-1.5 rounded-full border border-black/8 px-4 py-2 text-[0.68rem] font-semibold text-slate-400 dark:border-white/8 dark:text-white/30"
              >
                <BookOpen className="size-3" />
                {t("caseStudy")}
              </span>
            )}
          </div>
          {card.githubUrl && isActive ? (
            <a
              href={card.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open ${content.name} source code on GitHub`}
              title={t("github")}
              onClick={(event) => event.stopPropagation()}
              className="group/github inline-flex shrink-0 items-center gap-1.5 rounded-full bg-black px-3 py-2 text-white transition-colors duration-200 hover:bg-slate-900"
            >
              <GithubIcon className="size-3.5" />
              <ArrowUpRight className="size-3 transition-transform duration-200 group-hover/github:translate-x-0.5 group-hover/github:-translate-y-0.5" />
            </a>
          ) : null}
        </div>
      </div>
      {lightbox ? (
        <ScreenshotLightbox
          screenshot={lightbox}
          closing={closing}
          onRequestClose={requestClose}
          onClosed={finishClose}
        />
      ) : null}
    </article>
  )
}
