import { useRef, useState } from "react"
import { ArrowLeft, ArrowRight } from "lucide-react"

import { useThemeMode } from "~/lib/useThemeMode"

import { getHomeGradientPalette, projectPreviewCards } from "./home-content"
import ProjectCarousel from "./ProjectCarousel"
import SectionBadge from "./SectionBadge"

const CAROUSEL_ANIMATION_MS = 1700

export default function HomeProjectsSection() {
  const { themeMode } = useThemeMode()
  const [activeIndex, setActiveIndex] = useState(() =>
    Math.floor(projectPreviewCards.length / 2)
  )
  const [animating, setAnimating] = useState(false)
  const animatingTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined)
  const palette = getHomeGradientPalette(themeMode)

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
      className="relative scroll-mt-6 overflow-hidden px-6 pt-24 pb-24 sm:px-12 lg:pr-28 lg:pl-44"
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
            className="absolute top-1/2 left-0 flex size-14 -translate-y-1/2 items-center justify-center rounded-full text-slate-900 shadow-[0_4px_20px_-4px_rgba(39,255,195,0.55)] transition-[transform,box-shadow,filter] duration-200 hover:scale-[1.07] hover:shadow-[0_6px_28px_-4px_rgba(39,255,195,0.7)] hover:brightness-105 disabled:pointer-events-none disabled:opacity-40 sm:size-16 lg:size-20 dark:text-white dark:shadow-[0_4px_20px_-4px_rgba(34,211,238,0.4)] dark:hover:shadow-[0_6px_28px_-4px_rgba(34,211,238,0.55)]"
            style={{
              background:
                themeMode === "dark"
                  ? "linear-gradient(120deg,#22d3ee,#818cf8,#22d3ee)"
                  : "linear-gradient(120deg,#27ffc3,#EAB308,#27ffc3)",
              backgroundSize: "250% 250%",
              animation: "flow-gradient 4s ease-in-out infinite",
            }}
          >
            <ArrowLeft className="size-5 sm:size-6 lg:size-8" />
          </button>

          <button
            type="button"
            disabled={animating}
            aria-label="Show next project"
            onClick={() => navigateCarousel(1)}
            className="absolute top-1/2 right-0 flex size-14 -translate-y-1/2 items-center justify-center rounded-full text-slate-900 shadow-[0_4px_20px_-4px_rgba(39,255,195,0.55)] transition-[transform,box-shadow,filter] duration-200 hover:scale-[1.07] hover:shadow-[0_6px_28px_-4px_rgba(39,255,195,0.7)] hover:brightness-105 disabled:pointer-events-none disabled:opacity-40 sm:size-16 lg:size-20 dark:text-white dark:shadow-[0_4px_20px_-4px_rgba(34,211,238,0.4)] dark:hover:shadow-[0_6px_28px_-4px_rgba(34,211,238,0.55)]"
            style={{
              background:
                themeMode === "dark"
                  ? "linear-gradient(120deg,#22d3ee,#818cf8,#22d3ee)"
                  : "linear-gradient(120deg,#27ffc3,#EAB308,#27ffc3)",
              backgroundSize: "250% 250%",
              animation: "flow-gradient 4s ease-in-out infinite",
            }}
          >
            <ArrowRight className="size-5 sm:size-6 lg:size-8" />
          </button>

          <SectionBadge>Projects</SectionBadge>
          <h2 className="font-heading text-5xl font-light tracking-tight text-slate-950 sm:text-6xl dark:text-white">
            Case studies are the next layer to land here.
          </h2>
          <p className="max-w-2xl text-base leading-8 text-slate-600 sm:text-lg dark:text-white/70">
            This section is wired into the rail alread.
            This section is wired into the rail alread.
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
