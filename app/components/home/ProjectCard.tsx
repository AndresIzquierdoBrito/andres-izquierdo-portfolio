import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { BookOpen, ExternalLink, X } from "lucide-react"
import { useTranslation } from "react-i18next"
import gsap from "gsap"

import { resolveAppLanguage } from "~/i18n/settings"
import { cn } from "~/lib/utils"

import { getProjectContent, type ProjectCardData } from "./home-content"

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
  { top: "26%",   left: "0%",   rotate: -8,  zIndex: 1 },
  { top: "1%",    right: "0%",  rotate:  7,  zIndex: 2 },
  { bottom: "2%", right: "4%",  rotate:  10, zIndex: 1 },
]

type ScreenshotLightboxState = {
  src: string
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
        expanded && "rounded-2xl shadow-[0_28px_90px_-24px_rgba(2,6,23,0.7)]",
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
          expanded && "max-h-[calc(85svh-2.5rem)]",
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
      "(prefers-reduced-motion: reduce)",
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
      screenshot.originRect.width / Math.max(targetRect.width, 1),
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
      0,
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
      0,
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
        className="relative max-h-[85svh] w-[min(90vw,1100px)] origin-center"
      >
        <ScreenshotWindow
          src={screenshot.src}
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
    document.body,
  )
}

function ScreenshotItem({
  slot,
  src,
  toneClass,
  projectName,
  screenshotIndex,
  onOpen,
}: {
  slot: ScreenshotSlot
  src?: string
  toneClass: string
  projectName: string
  screenshotIndex: number
  onOpen: (
    src: string,
    label: string,
    origin: HTMLButtonElement,
    rotation: number,
  ) => void
}) {
  const ref = useRef<HTMLButtonElement>(null)
  const label = `${projectName} screenshot ${screenshotIndex + 1}`

  const setHovered = (hovered: boolean) => {
    if (!ref.current) return
    ref.current.style.transform = hovered
      ? "rotate(0deg) scale(1.07)"
      : `rotate(${slot.rotate}deg) scale(1)`
    ref.current.style.zIndex = hovered ? "20" : String(slot.zIndex)
  }

  if (!src) {
    return (
      <div
        className="absolute w-[52%]"
        style={{
          top: slot.top,
          left: slot.left,
          right: slot.right,
          bottom: slot.bottom,
          aspectRatio: "16 / 10",
          transform: `rotate(${slot.rotate}deg)`,
          zIndex: slot.zIndex,
        }}
      >
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
      </div>
    )
  }

  return (
    <button
      type="button"
      ref={ref}
      aria-label={`Open ${label}`}
      className="absolute w-[52%] cursor-pointer appearance-none border-0 bg-transparent p-0 text-left focus-visible:z-20 focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:outline-none dark:focus-visible:ring-indigo-300 dark:focus-visible:ring-offset-slate-950"
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
        setHovered(true)
      }}
      onMouseLeave={() => {
        setHovered(false)
      }}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      onClick={(event) => {
        event.stopPropagation()
        onOpen(src, label, event.currentTarget, slot.rotate)
      }}
    >
      <ScreenshotWindow src={src} alt={label} />
    </button>
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
  const { t, i18n } = useTranslation("common", {
    keyPrefix: "sections.projects",
  })
  const content = getProjectContent(
    card,
    resolveAppLanguage(i18n.resolvedLanguage ?? i18n.language),
  )
  const toneClass = toneClasses[index % toneClasses.length]
  const [lightbox, setLightbox] = useState<ScreenshotLightboxState | null>(null)
  const [closing, setClosing] = useState(false)
  const activeThumbnailRef = useRef<HTMLButtonElement | null>(null)

  const openLightbox = (
    src: string,
    label: string,
    origin: HTMLButtonElement,
    rotation: number,
  ) => {
    activeThumbnailRef.current = origin
    setClosing(false)
    setLightbox({
      src,
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
          <p className="font-mono text-[0.65rem] font-semibold tracking-[0.18em] text-slate-500 uppercase dark:text-white/45">
            {content.eyebrow}
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
          {card.projectUrl ? (
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
            <h3 className="text-2xl font-semibold tracking-tight text-slate-950 dark:text-white lg:text-[1.55rem]">
              {content.name}
            </h3>
          )}
          {content.description ? (
            <p className="line-clamp-2 text-[0.82rem] leading-6 text-slate-600 dark:text-white/65">
              {content.description}
            </p>
          ) : null}
        </div>

        {/* Screenshot cluster — grows to fill remaining space */}
        <div className="relative mt-5 flex-1">
          {screenshotSlots.map((slot, si) => (
            <ScreenshotItem
              key={si}
              slot={slot}
              src={card.screenshots?.[si]}
              toneClass={toneClass}
              projectName={content.name}
              screenshotIndex={si}
              onOpen={openLightbox}
            />
          ))}

          {/* Central app icon — pointer-events-none so it doesn't block screenshot hover */}
          <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
            <div
              className={cn(
                "relative flex items-center justify-center",
                card.iconSrc
                  ? "size-24 rounded-none border-0 bg-transparent shadow-none ring-0 sm:size-32"
                  : "size-14 rounded-2xl border border-black/10 bg-white shadow-[0_8px_28px_-6px_rgba(15,23,42,0.28)] ring-4 ring-[rgba(39,255,195,0.32)] sm:size-16 dark:border-white/16 dark:bg-slate-900 dark:ring-[rgba(99,102,241,0.38)]",
              )}
            >
              {card.iconSrc ? (
                <>
                  <span
                    aria-hidden="true"
                    className="absolute size-20 rounded-full bg-amber-300/45 blur-2xl sm:size-28 dark:bg-cyan-300/35"
                  />
                  <img
                    src={card.iconSrc}
                    alt={content.name}
                    className="relative z-10 size-24 object-contain drop-shadow-[0_0_12px_rgba(255,132,97,0.72)] sm:size-32 sm:drop-shadow-[0_0_18px_rgba(255,132,97,0.72)] dark:drop-shadow-[0_0_16px_rgba(45,212,191,0.64)] dark:sm:drop-shadow-[0_0_24px_rgba(45,212,191,0.64)]"
                  />
                </>
              ) : (
                <span className="select-none text-xl font-bold text-slate-400 dark:text-white/35">
                  {content.name.charAt(0)}
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
              className="inline-flex items-center gap-1.5 rounded-full bg-slate-950 px-4 py-2 text-[0.68rem] font-semibold text-white transition-colors duration-200 hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-white/84"
            >
              <ExternalLink className="size-3" />
              {t("viewProject")}
            </a>
          ) : (
            <span className="inline-flex cursor-not-allowed items-center gap-1.5 rounded-full border border-black/10 px-4 py-2 text-[0.68rem] font-semibold text-slate-400 dark:border-white/10 dark:text-white/30">
              <ExternalLink className="size-3" />
              {t("comingSoon")}
            </span>
          )}
          {card.caseStudyUrl ? (
            <a
              href={card.caseStudyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300/70 bg-white px-4 py-2 text-[0.68rem] font-semibold text-slate-800 transition-colors duration-200 hover:border-emerald-400 dark:border-cyan-400/35 dark:bg-slate-950 dark:text-white/85 dark:hover:border-cyan-300/60"
            >
              <BookOpen className="size-3" />
              {t("caseStudy")}
            </a>
          ) : (
            <span className="inline-flex cursor-not-allowed items-center gap-1.5 rounded-full border border-black/8 px-4 py-2 text-[0.68rem] font-semibold text-slate-400 dark:border-white/8 dark:text-white/30">
              <BookOpen className="size-3" />
              {t("caseStudy")}
            </span>
          )}
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
