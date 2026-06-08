import { useLayoutEffect, useRef, useState } from "react"
import { ArrowLeft, ArrowRight } from "lucide-react"
import gsap from "gsap"
import { useTranslation } from "react-i18next"

import { useThemeMode } from "~/lib/useThemeMode"

import { getHomeGradientPalette, projectPreviewCards } from "./home-content"
import ProjectCarousel from "./ProjectCarousel"
import SectionBadge from "./SectionBadge"

const CAROUSEL_ANIMATION_MS = 1700

export default function HomeProjectsSection() {
  const { themeMode } = useThemeMode()
  const { t } = useTranslation("common", { keyPrefix: "sections.projects" })
  const [activeIndex, setActiveIndex] = useState(() =>
    Math.floor(projectPreviewCards.length / 2)
  )
  const [animating, setAnimating] = useState(false)
  const animatingTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined)
  const taglineRef = useRef<HTMLHeadingElement>(null)
  const palette = getHomeGradientPalette(themeMode)

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
      className="relative z-0 scroll-mt-6 overflow-hidden px-6 pt-14 pb-10 sm:px-12 sm:pt-24 sm:pb-20 xl:pr-28 xl:pl-44"
      style={{
        backgroundImage: `linear-gradient(180deg, ${palette.projects.backgroundFrom}, ${palette.projects.backgroundTo})`,
      }}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage: `radial-gradient(circle at top right, ${palette.projects.orbTopRight}, transparent 28%), radial-gradient(circle at bottom left, ${palette.projects.orbBottomLeft}, transparent 32%)`,
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

      <div className="mx-auto flex max-w-7xl flex-col gap-1 lg:gap-2">
        <div className="relative mx-auto flex w-full max-w-7xl flex-col items-center gap-4 px-16 text-center sm:px-24 lg:px-32">
          <button
            type="button"
            disabled={animating}
            aria-label="Show previous project"
            onClick={() => navigateCarousel(-1)}
            className="absolute top-1/2 -left-6 flex h-24 w-12 -translate-y-1/2 items-center justify-center rounded-r-full rounded-l-none text-slate-900 shadow-[0_4px_20px_-4px_rgba(39,255,195,0.55)] transition-[transform,box-shadow,filter] duration-200 hover:translate-x-0.5 hover:shadow-[0_6px_28px_-4px_rgba(39,255,195,0.7)] hover:brightness-105 disabled:pointer-events-none disabled:opacity-40 sm:left-0 sm:size-16 sm:translate-x-0 sm:rounded-full sm:hover:scale-[1.07] sm:hover:translate-x-0 lg:size-20 dark:text-white dark:shadow-[0_4px_20px_-4px_rgba(34,211,238,0.4)] dark:hover:shadow-[0_6px_28px_-4px_rgba(34,211,238,0.55)]"
            style={{
              background:
                themeMode === "dark"
                  ? "linear-gradient(120deg,#22d3ee,#818cf8,#22d3ee)"
                  : "linear-gradient(120deg,#27ffc3,#EAB308,#27ffc3)",
              backgroundSize: "250% 250%",
              animation: "flow-gradient 4s ease-in-out infinite",
            }}
          >
            <ArrowLeft className="size-6 -translate-x-1 sm:size-6 sm:translate-x-0 lg:size-8" />
          </button>

          <button
            type="button"
            disabled={animating}
            aria-label="Show next project"
            onClick={() => navigateCarousel(1)}
            className="absolute top-1/2 -right-6 flex h-24 w-12 -translate-y-1/2 items-center justify-center rounded-l-full rounded-r-none text-slate-900 shadow-[0_4px_20px_-4px_rgba(39,255,195,0.55)] transition-[transform,box-shadow,filter] duration-200 hover:-translate-x-0.5 hover:shadow-[0_6px_28px_-4px_rgba(39,255,195,0.7)] hover:brightness-105 disabled:pointer-events-none disabled:opacity-40 sm:right-0 sm:size-16 sm:translate-x-0 sm:rounded-full sm:hover:scale-[1.07] sm:hover:translate-x-0 lg:size-20 dark:text-white dark:shadow-[0_4px_20px_-4px_rgba(34,211,238,0.4)] dark:hover:shadow-[0_6px_28px_-4px_rgba(34,211,238,0.55)]"
            style={{
              background:
                themeMode === "dark"
                  ? "linear-gradient(120deg,#22d3ee,#818cf8,#22d3ee)"
                  : "linear-gradient(120deg,#27ffc3,#EAB308,#27ffc3)",
              backgroundSize: "250% 250%",
              animation: "flow-gradient 4s ease-in-out infinite",
            }}
          >
            <ArrowRight className="size-6 translate-x-1 sm:size-6 sm:translate-x-0 lg:size-8" />
          </button>

          <SectionBadge>{t("eyebrow")}</SectionBadge>
          <div className="flex min-h-24 w-full items-center justify-center sm:min-h-40">
            <h2
              ref={taglineRef}
              className="font-heading text-3xl leading-tight font-light tracking-tight text-slate-950 sm:text-6xl dark:text-white"
            >
              {projectPreviewCards[activeIndex].tagline}
            </h2>
          </div>
          <p className="max-w-2xl text-base leading-8 text-slate-600 sm:text-lg dark:text-white/70">
            This section is wired into the rail alread.
          </p>
        </div>

        <div className="lg:-mt-8">
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
