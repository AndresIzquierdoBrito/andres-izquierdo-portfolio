import {
  useEffect,
  useState,
  type CSSProperties,
  type PointerEvent,
} from "react"
import { MoonStar } from "lucide-react"
import { useTranslation } from "react-i18next"

import ExperienceSection from "~/components/ExperienceSection"
import Grainient from "~/components/Grainient"
import HomeSectionNav, {
  homeSections,
  type HomeSectionId,
} from "~/components/HomeSectionNav"
import RotatingGreeting from "~/components/RotatingGreeting"
import { Badge } from "~/components/ui/badge"
import { changeAppLanguage } from "~/i18n/language"
import { languageOptions, resolveAppLanguage } from "~/i18n/settings"
import { cn } from "~/lib/utils"

const aboutFocusAreas = [
  "Fundraising SaaS",
  "Design systems",
  "Telecom tools",
] as const

const projectPreviewCards = [
  {
    eyebrow: "Case study",
    title: "Flagship builds",
    description:
      "Add the projects that best show product judgment, technical decisions, and the outcomes that mattered.",
  },
  {
    eyebrow: "Process",
    title: "From brief to shipped UI",
    description:
      "Use this lane for screenshots, system thinking, iterations, and the tradeoffs behind each release.",
  },
  {
    eyebrow: "Signal",
    title: "Results and metrics",
    description:
      "Reserve space for adoption numbers, performance wins, or the business impact behind each project.",
  },
] as const

const contactCards = [
  {
    title: "Email",
    description:
      "Primary inbox for project inquiries and direct conversations.",
  },
  {
    title: "GitHub",
    description:
      "Code samples, experiments, and the technical side of the portfolio.",
  },
  {
    title: "LinkedIn",
    description:
      "Professional context, network entry point, and quick background validation.",
  },
] as const

const heroPalette = {
  color1: "#EAB308",
  color2: "#27ffc3",
  color3: "#cdfaeb",
}

const heroGreetings = ["Hey there!", "Hola!", "Bonjour!", "Ciao!"] as const

const resumePatternStyle = {
  "--resume-dot-color-1": heroPalette.color1,
  "--resume-dot-color-2": heroPalette.color2,
  "--resume-dot-color-3": heroPalette.color3,
  "--resume-wash-color-1": "rgb(234 179 8 / 0.10)",
  "--resume-wash-color-2": "rgb(39 255 195 / 0.10)",
  "--resume-wash-color-3": "rgb(205 250 235 / 0.35)",
  "--resume-mouse-x": "50%",
  "--resume-mouse-y": "12rem",
  "--resume-trace-x": "50%",
  "--resume-trace-y": "12rem",
  "--resume-hover-opacity": "0",
  "--resume-trace-opacity": "0",
} as CSSProperties

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

export default function Home() {
  const [activeSection, setActiveSection] = useState<HomeSectionId>("home")
  const { i18n, t } = useTranslation("common", { keyPrefix: "hero" })

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") {
      return
    }

    const sectionElements = homeSections
      .map((section) => document.getElementById(section.id))
      .filter((section): section is HTMLElement => section !== null)

    if (sectionElements.length === 0) {
      return
    }

    const visibilityRatios = new Map<HomeSectionId, number>()
    let currentSection: HomeSectionId = "home"

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          visibilityRatios.set(
            entry.target.id as HomeSectionId,
            entry.isIntersecting ? entry.intersectionRatio : 0
          )
        })

        const nextSection = homeSections.reduce<HomeSectionId>(
          (bestSection, section) => {
            const sectionRatio = visibilityRatios.get(section.id) ?? 0
            const bestRatio = visibilityRatios.get(bestSection) ?? 0

            return sectionRatio > bestRatio ? section.id : bestSection
          },
          currentSection
        )

        if ((visibilityRatios.get(nextSection) ?? 0) === 0) {
          return
        }

        if (nextSection !== currentSection) {
          currentSection = nextSection
          setActiveSection(nextSection)
        }
      },
      {
        rootMargin: "-18% 0px -35% 0px",
        threshold: [0.2, 0.4, 0.65],
      }
    )

    sectionElements.forEach((section) => {
      visibilityRatios.set(section.id as HomeSectionId, 0)
      observer.observe(section)
    })

    return () => observer.disconnect()
  }, [])

  const activeLanguage = resolveAppLanguage(
    i18n.resolvedLanguage ?? i18n.language
  )

  return (
    <div className="relative h-full w-full">
      <HomeSectionNav activeSection={activeSection} />

      <main className="relative pb-28 lg:pb-0">
        <div className="relative bg-transparent">
          <div className="absolute inset-0 -z-10 h-[calc(100vh+10rem)] md:h-[calc(100vh+12rem)] lg:h-[calc(100vh+16rem)]">
            <Grainient
              color1={heroPalette.color1}
              color2={heroPalette.color2}
              color3={heroPalette.color3}
              timeSpeed={0.25}
              colorBalance={0}
              warpStrength={1}
              warpFrequency={5}
              warpSpeed={2}
              warpAmplitude={50}
              blendAngle={0}
              blendSoftness={0.05}
              rotationAmount={500}
              noiseScale={2}
              grainAmount={0.1}
              grainScale={2}
              grainAnimated={false}
              contrast={1.5}
              gamma={1}
              saturation={1}
              centerX={0}
              centerY={0}
              zoom={0.9}
            />
          </div>

          <section
            id="home"
            className="relative mx-auto min-h-screen max-w-7xl scroll-mt-6 px-6 sm:px-12 lg:pr-28 lg:pl-44"
          >
            <div className="absolute top-6 right-6 z-10 flex flex-wrap items-center justify-end gap-2 sm:top-8 sm:right-12 lg:right-28">
              <div
                className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/55 p-1 pl-3 shadow-[0_18px_60px_rgba(15,23,42,0.08)] backdrop-blur-md"
                role="group"
                aria-label={t("toolbar.languageHint")}
              >
                <span className="text-[0.68rem] font-semibold tracking-[0.28em] text-black/45 uppercase">
                  {t("toolbar.languageLabel")}
                </span>
                <div className="inline-flex items-center gap-1">
                  {languageOptions.map((option) => {
                    const isActive = option.value === activeLanguage

                    return (
                      <button
                        key={option.value}
                        type="button"
                        className={cn(
                          "rounded-full px-3 py-1.5 text-[0.68rem] font-semibold tracking-[0.28em] uppercase transition-colors duration-200",
                          isActive
                            ? "bg-slate-950 text-white"
                            : "text-black/55 hover:text-black"
                        )}
                        aria-pressed={isActive}
                        aria-label={option.description}
                        onClick={() => {
                          void changeAppLanguage(i18n, option.value)
                        }}
                      >
                        {option.label}
                      </button>
                    )
                  })}
                </div>
              </div>

              <button
                type="button"
                disabled
                className="inline-flex cursor-not-allowed items-center gap-3 rounded-full border border-black/10 bg-white/45 px-4 py-2 text-black/60 shadow-[0_18px_60px_rgba(15,23,42,0.08)] backdrop-blur-md disabled:opacity-100"
                aria-label={t("toolbar.themeHint")}
                title={t("toolbar.themeHint")}
              >
                <MoonStar className="size-4" />
                <span className="text-[0.68rem] font-semibold tracking-[0.28em] uppercase">
                  {t("toolbar.themeLabel")}
                </span>
                <span className="relative h-5 w-9 rounded-full bg-black/10">
                  <span className="absolute top-0.5 left-0.5 size-4 rounded-full bg-white shadow-sm" />
                </span>
                <span className="rounded-full bg-black/6 px-2 py-1 text-[0.62rem] font-semibold tracking-[0.24em] text-black/45 uppercase">
                  {t("toolbar.themeStatus")}
                </span>
              </button>
            </div>

            <div className="flex min-h-screen flex-col justify-center gap-6 py-20">
              <div
                className="flex max-w-5xl flex-col gap-4"
                lang={activeLanguage}
              >
                <h2 className="text-4xl font-light text-black/75 sm:text-5xl lg:text-6xl">
                  <RotatingGreeting greetings={heroGreetings} />
                </h2>
                <h1
                  className="font-heading text-6xl font-normal tracking-tight text-slate-950 sm:text-7xl lg:text-8xl"
                  style={{ fontFamily: "Kinetic, sans-serif" }}
                >
                  {t("title")}
                </h1>
                <p className="max-w-2xl text-lg leading-8 text-black/60 sm:text-xl">
                  {t("description")}
                </p>
              </div>
            </div>
          </section>

          {/* <div
            className="relative -mb-1 flex items-center justify-center overflow-hidden"
            style={{ height: "8rem" }}
          >
            <svg
              className="absolute top-0 left-0 block h-full w-full"
              viewBox="0 0 1920 120"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
              style={{ zIndex: 1 }}
            >
              <path
                d="M0,0 Q960,200 1920,0 L1920,120 L0,120 Z"
                fill="white"
                style={{ filter: "drop-shadow(0 4px 16px rgba(0,0,0,0.04))" }}
              />
            </svg>
            <h2
              className="z-10 w-full text-center font-heading text-4xl font-light tracking-tight"
              style={{ top: "2.5rem", position: "absolute" }}
            >
              About
            </h2>
          </div> */}
        </div>

        <section
          id="about"
          className="resume-dot-pattern relative scroll-mt-6 overflow-hidden bg-background px-6 pt-16 pb-24 sm:px-12 lg:pr-28 lg:pl-44"
          onPointerLeave={handleResumePatternPointerLeave}
          onPointerMove={handleResumePatternPointerMove}
          style={resumePatternStyle}
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
                <Badge variant="secondary" className="w-fit">
                  About
                </Badge>
                <h2 className="font-heading text-5xl font-light tracking-tight text-foreground sm:text-6xl">
                  Building software with a product and design lens.
                </h2>
                <p className="max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
                  Product-minded software engineer with experience across
                  fundraising SaaS, telecom workflows, and internal design
                  systems.
                </p>
                <p className="max-w-2xl text-base leading-8 text-muted-foreground">
                  The timeline below stays as the factual backbone of the
                  portfolio while the projects and contact lanes fill in around
                  it.
                </p>
              </div>

              <div className="grid gap-3 rounded-[2rem] border border-white/55 bg-white/45 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.42)] backdrop-blur-xl">
                <p className="text-[0.65rem] font-semibold tracking-[0.28em] text-foreground/45 uppercase">
                  Current focus
                </p>
                {aboutFocusAreas.map((focusArea) => (
                  <div
                    key={focusArea}
                    className="rounded-[1.35rem] border border-white/60 bg-white/70 px-4 py-3 text-sm font-medium text-foreground/75 shadow-sm"
                  >
                    {focusArea}
                  </div>
                ))}
              </div>
            </div>

            <div className="relative z-10 mx-auto max-w-6xl">
              <ExperienceSection />
            </div>
          </div>
        </section>

        <section
          id="projects"
          className="relative scroll-mt-6 overflow-hidden bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(248,250,252,0.95))] px-6 pt-24 pb-24 sm:px-12 lg:pr-28 lg:pl-44"
        >
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,rgba(39,255,195,0.18),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(234,179,8,0.16),transparent_32%)]"
          />

          <div className="mx-auto flex max-w-6xl flex-col gap-10">
            <div className="flex max-w-3xl flex-col gap-4">
              <Badge variant="secondary" className="w-fit">
                Projects
              </Badge>
              <h2 className="font-heading text-5xl font-light tracking-tight text-slate-950 sm:text-6xl">
                Case studies are the next layer to land here.
              </h2>
              <p className="text-base leading-8 text-slate-600 sm:text-lg">
                This section is wired into the rail already, so you can now drop
                in flagship work, screenshots, decisions, and measurable
                outcomes without changing the navigation again.
              </p>
            </div>

            <div className="grid gap-5 lg:grid-cols-3">
              {projectPreviewCards.map((card, index) => (
                <article
                  key={card.title}
                  className="rounded-[2rem] border border-black/8 bg-white/80 p-6 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.35)] backdrop-blur-sm"
                >
                  <p className="text-[0.65rem] font-semibold tracking-[0.28em] text-slate-400 uppercase">
                    {card.eyebrow}
                  </p>

                  <div className="mt-6 flex items-start justify-between gap-4">
                    <h3 className="max-w-48 text-2xl font-semibold tracking-tight text-slate-900">
                      {card.title}
                    </h3>
                    <span className="flex size-10 items-center justify-center rounded-full border border-black/8 bg-slate-950 text-sm font-semibold text-white">
                      {`0${index + 1}`}
                    </span>
                  </div>

                  <p className="mt-4 text-sm leading-7 text-slate-600">
                    {card.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section
          id="contact"
          className="relative scroll-mt-6 overflow-hidden bg-slate-950 px-6 pt-24 pb-28 text-white sm:px-12 lg:pr-28 lg:pl-44"
        >
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(234,179,8,0.22),transparent_22%),radial-gradient(circle_at_bottom_right,rgba(39,255,195,0.24),transparent_30%)]"
          />

          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(19rem,0.95fr)] lg:items-start">
            <div className="flex flex-col gap-4">
              <Badge variant="secondary" className="w-fit">
                Contact
              </Badge>
              <h2 className="font-heading text-5xl font-light tracking-tight text-white sm:text-6xl">
                Make the final step the easiest one.
              </h2>
              <p className="max-w-2xl text-base leading-8 text-white/70 sm:text-lg">
                This last section is ready for whatever contact flow you want
                visitors to hit after they scroll through the page.
              </p>
              <p className="max-w-2xl text-sm leading-7 text-white/50">
                Swap the placeholders on the right for real links once you
                decide which channels to expose publicly.
              </p>
            </div>

            <div className="grid gap-4">
              {contactCards.map((card) => (
                <article
                  key={card.title}
                  className="rounded-[1.75rem] border border-white/12 bg-white/6 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-sm"
                >
                  <p className="text-[0.65rem] font-semibold tracking-[0.28em] text-white/40 uppercase">
                    Channel
                  </p>
                  <h3 className="mt-4 text-xl font-semibold tracking-tight text-white">
                    {card.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-white/70">
                    {card.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
