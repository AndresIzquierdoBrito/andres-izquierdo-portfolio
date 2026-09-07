import { useLayoutEffect, useRef, useState } from "react"
import { ArrowLeft, ArrowRight } from "lucide-react"
import gsap from "gsap"
import { useTranslation } from "react-i18next"

import { projectPreviewCards } from "./home-content"
import ProjectCarousel from "./ProjectCarousel"
import SectionBadge from "./SectionBadge"

const CAROUSEL_ANIMATION_MS = 1700

export default function HomeProjectsSection() {
  const { t } = useTranslation("common", { keyPrefix: "sections.projects" })
  const [activeIndex, setActiveIndex] = useState(() =>
    0
  )
  const [animating, setAnimating] = useState(false)
  const animatingTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined)
  const taglineRef = useRef<HTMLHeadingElement>(null)
  useLayoutEffect(() => {
    const el = taglineRef.current
    if (!el) return

    gsap.killTweensOf(el)
    gsap.fromTo(
      el,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" }
    )
  }, [activeIndex])

  const navigateCarousel = (direction: 1 | -1) => {
    if (animating) return
    setAnimating(true)
    clearTimeout(animatingTimerRef.current)
    animatingTimerRef.current = setTimeout(
      () => setAnimating(false),
      CAROUSEL_ANIMATION_MS
    )
    setActiveIndex((current) => {
      if (direction === 1) {
        return (current + 1) % projectPreviewCards.length
      }
      return current === 0 ? projectPreviewCards.length - 1 : current - 1
    })
  }

  return (
    <section
      id="projects"
      className="relative z-0 scroll-mt-6 overflow-hidden px-6 pt-14 pb-20 sm:px-12 sm:pt-20 sm:pb-24 xl:pr-28 xl:pl-44"
      style={{
        backgroundImage:
          "linear-gradient(180deg, var(--home-projects-background-from), var(--home-projects-background-to))",
      }}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage:
            "radial-gradient(circle at top right, var(--home-projects-orb-top-right), transparent 28%), radial-gradient(circle at bottom left, var(--home-projects-orb-bottom-left), transparent 32%)",
        }}
      />

      {/* Paper grain — coarse fractal noise, multiply on light / screen on dark */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-multiply dark:opacity-[0.10] dark:mix-blend-screen"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.50' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          backgroundRepeat: "repeat",
          backgroundSize: "182px",
        }}
      />

      <div className="mx-auto flex max-w-7xl flex-col gap-1">
        <div className="relative mx-auto flex w-full max-w-7xl flex-col items-center gap-3 px-16 text-center sm:px-24 lg:px-28">
          <button
            type="button"
            disabled={animating}
            aria-label="Show previous project"
            onClick={() => navigateCarousel(-1)}
            className="absolute top-1/2 -left-6 flex h-24 w-12 -translate-y-1/2 items-center justify-center rounded-l-none rounded-r-full border border-black/10 bg-white text-slate-900 shadow-[0_12px_36px_-24px_rgba(15,23,42,0.55)] transition-[transform,background-color,border-color] duration-200 hover:translate-x-0.5 hover:border-black/20 hover:bg-slate-50 disabled:pointer-events-none disabled:opacity-40 sm:left-0 sm:size-16 sm:translate-x-0 sm:rounded-full sm:hover:translate-x-0 sm:hover:scale-[1.05] lg:size-14 dark:border-white/16 dark:bg-slate-950 dark:text-white dark:hover:border-white/28 dark:hover:bg-slate-900"
          >
            <ArrowLeft className="size-6 -translate-x-1 sm:size-6 sm:translate-x-0 lg:size-8" />
          </button>

          <button
            type="button"
            disabled={animating}
            aria-label="Show next project"
            onClick={() => navigateCarousel(1)}
            className="absolute top-1/2 -right-6 flex h-24 w-12 -translate-y-1/2 items-center justify-center rounded-l-full rounded-r-none border border-black/10 bg-white text-slate-900 shadow-[0_12px_36px_-24px_rgba(15,23,42,0.55)] transition-[transform,background-color,border-color] duration-200 hover:-translate-x-0.5 hover:border-black/20 hover:bg-slate-50 disabled:pointer-events-none disabled:opacity-40 sm:right-0 sm:size-16 sm:translate-x-0 sm:rounded-full sm:hover:translate-x-0 sm:hover:scale-[1.05] lg:size-14 dark:border-white/16 dark:bg-slate-950 dark:text-white dark:hover:border-white/28 dark:hover:bg-slate-900"
          >
            <ArrowRight className="size-6 translate-x-1 sm:size-6 sm:translate-x-0 lg:size-8" />
          </button>

          <SectionBadge>{t("eyebrow")}</SectionBadge>
          <div className="flex min-h-24 w-full items-center justify-center sm:min-h-32 lg:min-h-28">
            <h2
              ref={taglineRef}
              className="font-heading text-3xl leading-tight font-light tracking-[-0.035em] text-slate-950 sm:text-5xl lg:text-[3.35rem] dark:text-white"
            >
              {projectPreviewCards[activeIndex].tagline}
            </h2>
          </div>
          <p className="max-w-2xl text-base leading-8 text-slate-600 sm:text-lg dark:text-white/70">
            {projectPreviewCards[activeIndex].description}
          </p>
        </div>

        <div className="mt-8 sm:mt-10 lg:mt-12">
          <ProjectCarousel
            cards={projectPreviewCards}
            activeIndex={activeIndex}
            onNavigate={navigateCarousel}
          />
        </div>
      </div>
    </section>
  )
}
