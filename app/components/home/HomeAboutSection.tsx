import type { PointerEvent } from "react"

import { useTranslation } from "react-i18next"

import ExperienceSection from "~/components/ExperienceSection"

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
  const { t } = useTranslation("common", { keyPrefix: "sections.about" })

  return (
    <section
      id="background"
      className="resume-dot-pattern relative scroll-mt-6 overflow-hidden bg-background px-6 pt-16 pb-12 sm:px-12 sm:pb-20 xl:pr-28 xl:pl-44"
      onPointerLeave={handleResumePatternPointerLeave}
      onPointerMove={handleResumePatternPointerMove}
      style={getResumePatternStyle()}
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

      <div className="relative z-10 mx-auto flex max-w-7xl flex-col gap-12 lg:gap-14">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(18rem,0.85fr)] lg:items-start">
          <div className="flex flex-col gap-4">
            <SectionBadge>{t("eyebrow")}</SectionBadge>
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

          <div className="grid gap-4 rounded-[1.5rem] border border-emerald-300/55 bg-white/85 p-5 dark:border-cyan-400/30 dark:bg-slate-950/72">
            <p className="font-mono text-[0.65rem] font-semibold tracking-[0.22em] text-foreground/45 uppercase">
              {t("currentFocus")}
            </p>
            <div className="relative grid grid-cols-2 sm:grid-cols-3">
              <span
                aria-hidden="true"
                className="absolute inset-y-0 left-1/2 w-px bg-black/8 sm:left-[33.333%] dark:bg-white/10"
              />
              <span
                aria-hidden="true"
                className="absolute inset-y-0 left-[66.666%] hidden w-px bg-black/8 sm:block dark:bg-white/10"
              />
              <span
                aria-hidden="true"
                className="absolute inset-x-0 top-[33.333%] h-px bg-black/8 sm:hidden dark:bg-white/10"
              />
              <span
                aria-hidden="true"
                className="absolute inset-x-0 top-[66.666%] h-px bg-black/8 sm:hidden dark:bg-white/10"
              />
              <span
                aria-hidden="true"
                className="absolute inset-x-0 top-1/2 hidden h-px bg-black/8 sm:block dark:bg-white/10"
              />
              {currentFocusTools.map((tool) => {
                const Icon = tool.icon

                return (
                  <div
                    key={tool.label}
                    className="relative z-10 flex min-h-32 flex-col items-center justify-center gap-3 px-2 py-5 text-center sm:min-h-32 sm:gap-3 sm:px-2 sm:py-5"
                  >
                    <Icon className="size-14 text-foreground/85 sm:size-16 dark:text-white" />
                    <span className="font-mono text-[0.55rem] font-semibold tracking-[0.1em] text-foreground/70 uppercase sm:text-[0.62rem] dark:text-white/78">
                      {tool.label}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <div className="relative z-10 mx-auto w-full max-w-7xl">
          <ExperienceSection />
        </div>
      </div>
    </section>
  )
}
