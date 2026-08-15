import type { PointerEvent } from "react"

import { Route } from "lucide-react"
import { useTranslation } from "react-i18next"

import ExperienceSection from "~/components/ExperienceSection"
import { useThemeMode } from "~/lib/useThemeMode"

import { currentFocusTools, getResumePatternStyle } from "./home-content"
import SectionBadge from "./SectionBadge"

function handleResumePatternPointerMove(event: PointerEvent<HTMLElement>) {
  if (event.pointerType === "touch") {
    return
  }

  const bounds = event.currentTarget.getBoundingClientRect()

  event.currentTarget.style.setProperty(
    "--resume-mouse-x",
    `${event.clientX - bounds.left}px`
  )
  event.currentTarget.style.setProperty(
    "--resume-mouse-y",
    `${event.clientY - bounds.top}px`
  )
  event.currentTarget.style.setProperty(
    "--resume-trace-x",
    `${event.clientX - bounds.left}px`
  )
  event.currentTarget.style.setProperty(
    "--resume-trace-y",
    `${event.clientY - bounds.top}px`
  )
  event.currentTarget.style.setProperty("--resume-hover-opacity", "1")
  event.currentTarget.style.setProperty("--resume-trace-opacity", "1")
}

function handleResumePatternPointerLeave(event: PointerEvent<HTMLElement>) {
  event.currentTarget.style.setProperty("--resume-hover-opacity", "0")
  event.currentTarget.style.setProperty("--resume-trace-opacity", "0")
}

export default function HomeAboutSection() {
  const { themeMode } = useThemeMode()
  const { t } = useTranslation("common", { keyPrefix: "sections.about" })

  return (
    <section
      id="background"
      className="resume-dot-pattern relative scroll-mt-6 overflow-hidden bg-background px-6 pt-16 pb-12 sm:px-12 sm:pb-24 xl:pr-28 xl:pl-44"
      onPointerLeave={handleResumePatternPointerLeave}
      onPointerMove={handleResumePatternPointerMove}
      style={getResumePatternStyle(themeMode)}
    >
      <div aria-hidden="true" className="resume-dot-pattern__trace">
        <div className="resume-dot-pattern__layer resume-dot-pattern__layer--outer" />
        <div className="resume-dot-pattern__layer resume-dot-pattern__layer--mid" />
        <div className="resume-dot-pattern__layer resume-dot-pattern__layer--inner" />
      </div>
      <div aria-hidden="true" className="resume-dot-pattern__hover">
        <div className="resume-dot-pattern__layer resume-dot-pattern__layer--outer" />
        <div className="resume-dot-pattern__layer resume-dot-pattern__layer--mid" />
        <div className="resume-dot-pattern__layer resume-dot-pattern__layer--inner" />
      </div>

      <div className="relative z-10 mx-auto flex max-w-6xl flex-col gap-14">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(18rem,0.85fr)] lg:items-start">
          <div className="flex flex-col gap-4">
            <SectionBadge icon={Route}>{t("eyebrow")}</SectionBadge>
            <h2 className="font-heading text-5xl font-light tracking-tight text-foreground sm:text-6xl">
              {t("title")}
            </h2>
            <p className="max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg dark:text-white/78">
              {t("body")}
            </p>
            <p className="max-w-2xl text-base leading-8 text-muted-foreground dark:text-white/68">
              {t("body2")}
            </p>
          </div>

          <div className="grid gap-4 rounded-[2rem] border border-white/55 bg-white/45 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.42)] backdrop-blur-xl dark:border-white/20 dark:bg-white/8">
            <p className="text-[0.65rem] font-semibold tracking-[0.28em] text-foreground/45 uppercase">
              {t("currentFocus")}
            </p>
            <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-[repeat(auto-fit,minmax(8.5rem,1fr))] sm:gap-3">
              {currentFocusTools.map((tool) => {
                const Icon = tool.icon

                return (
                  <div
                    key={tool.label}
                    className="flex min-h-22 flex-col items-center justify-center gap-2 rounded-[1.1rem] border border-white/60 bg-white/70 px-2 py-3 text-center shadow-sm sm:min-h-32 sm:gap-4 sm:rounded-[1.35rem] sm:px-4 sm:py-5 dark:border-white/18 dark:bg-white/10"
                  >
                    <Icon className="size-7 text-foreground/85 sm:size-12 dark:text-white" />
                    <span className="text-[0.55rem] font-semibold tracking-[0.14em] text-foreground/80 uppercase sm:text-[0.68rem] sm:tracking-[0.18em] dark:text-white/88">
                      {tool.label}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <div className="relative z-10 mx-auto max-w-6xl">
          <ExperienceSection />
        </div>
      </div>
    </section>
  )
}
