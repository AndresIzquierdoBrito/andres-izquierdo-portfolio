import { useLayoutEffect, useRef, useState } from "react"

import gsap from "gsap"
import { useTranslation } from "react-i18next"

import { Avatar, AvatarFallback } from "~/components/ui/avatar"
import { Badge } from "~/components/ui/badge"
import { Separator } from "~/components/ui/separator"
import { cn } from "~/lib/utils"
import { useThemeMode } from "~/lib/useThemeMode"

import SectionBadge from "~/components/home/SectionBadge"

type PanelKey = "experience" | "education"

type ExperienceEntry = {
  id: "dst" | "step"
  technologies: string[]
  initials: string
  tone: string
}

type EducationEntryMeta = {
  id: "uoc" | "cifp"
  period: string
  status: "completed" | "ongoing"
  initials: string
  tone: string
}

type CertificationMeta = {
  id: "cambridgeC1"
  /** Path to the issuer's logo image (e.g. "/logos/cambridge-english.svg") */
  logoSrc?: string
}

const experienceEntries: ExperienceEntry[] = [
  {
    id: "dst",
    technologies: ["FastAPI", "Python", "React.js", "TypeScript", "Docker", "Pytest", "Cypress"],
    initials: "DST",
    tone: "bg-secondary text-secondary-foreground",
  },
  {
    id: "step",
    technologies: ["Next.js", "React.js", "TypeScript", "Figma"],
    initials: "STP",
    tone: "bg-muted text-foreground",
  },
]

const educationEntryMeta: EducationEntryMeta[] = [
  {
    id: "uoc",
    period: "2025 - Present",
    status: "ongoing",
    initials: "UOC",
    tone: "bg-muted text-foreground",
  },
  {
    id: "cifp",
    period: "2022 - 2024",
    status: "completed",
    initials: "CM",
    tone: "bg-secondary text-secondary-foreground",
  },
]

const certificationMeta: CertificationMeta[] = [
  {
    id: "cambridgeC1",
    logoSrc: "/logos/cambridge-english.svg",
  },
]

const inactivePanelState = {
  opacity: 0.68,
  scale: 0.975,
  y: 32,
  filter: "blur(10px)",
} as const

const activePanelState = {
  opacity: 1,
  scale: 1,
  x: 0,
  y: 0,
  rotation: 0,
  filter: "blur(0px)",
} as const

function ExperienceAvatar({
  initials,
  tone,
}: Pick<ExperienceEntry, "initials" | "tone">) {
  return (
    <Avatar
      size="lg"
      className="size-16 rounded-[1.25rem] bg-card shadow-sm after:rounded-[1.25rem]"
    >
      <AvatarFallback className={cn("rounded-[1.25rem]", tone)}>
        {initials}
      </AvatarFallback>
    </Avatar>
  )
}

function PanelHeader({ panel }: { panel: PanelKey }) {
  const { t } = useTranslation("common", { keyPrefix: panel })

  return (
    <div className="relative z-10 flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <h3 className="font-heading text-4xl font-light tracking-tight text-foreground">
          {t("title")}
        </h3>
      </div>
      <p className="max-w-2xl text-base leading-7 text-muted-foreground">
        {t("description")}
      </p>
    </div>
  )
}

function ExperienceTimeline({ entries }: { entries: ExperienceEntry[] }) {
  const { t } = useTranslation("common", { keyPrefix: "experience" })

  return (
    <div className="flex flex-col">
      {entries.map((entry, index) => {
        const showConnector = index < entries.length - 1
        const highlights = [
          t(`entries.${entry.id}.highlights.h0`),
          t(`entries.${entry.id}.highlights.h1`),
        ]

        return (
          <article
            key={entry.id}
            className="grid gap-5 pb-12 last:pb-0 md:grid-cols-[4.5rem_minmax(0,1fr)] md:gap-8"
          >
            <div className="hidden md:flex md:flex-col md:items-center">
              <ExperienceAvatar initials={entry.initials} tone={entry.tone} />
              {showConnector ? (
                <div className="mt-4 w-px flex-1 bg-border" />
              ) : null}
            </div>

            <div className="flex flex-col gap-5">
              <div className="flex items-start gap-4 md:block">
                <div className="md:hidden">
                  <ExperienceAvatar
                    initials={entry.initials}
                    tone={entry.tone}
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <h3 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                    {t(`entries.${entry.id}.company`)}
                  </h3>
                  <div className="flex flex-col gap-1 md:flex-row md:items-baseline md:gap-3">
                    <p className="text-base text-foreground/80 sm:text-xl">
                      {t(`entries.${entry.id}.role`)}
                    </p>
                    <p className="text-sm text-muted-foreground italic">
                      {t(`entries.${entry.id}.location`)}
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {t(`entries.${entry.id}.period`)}
                  </p>
                </div>
              </div>

              <Separator className="w-16 bg-black/8 dark:bg-white/10" />

              <div className="flex flex-col gap-5">
                <ul className="flex list-disc flex-col gap-2 pl-5 text-sm leading-7 text-foreground/75 marker:text-muted-foreground sm:text-base">
                  {highlights.map((highlight) => (
                    <li key={highlight}>{highlight}</li>
                  ))}
                </ul>

                <div className="flex flex-wrap gap-2">
                  {entry.technologies.map((technology) => (
                    <Badge
                      key={technology}
                      variant="outline"
                      className="border-black/10 bg-white/45 dark:border-white/12 dark:bg-white/8"
                    >
                      {technology}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </article>
        )
      })}
    </div>
  )
}

function ExperiencePanel() {
  return (
    <div className="relative z-10 flex h-full flex-col gap-5">
      <PanelHeader panel="experience" />
      <Separator className="bg-black/8 dark:bg-white/10" />
      <ExperienceTimeline entries={experienceEntries} />
    </div>
  )
}

function EducationTimeline({ entries }: { entries: EducationEntryMeta[] }) {
  const { t } = useTranslation("common", { keyPrefix: "education" })

  return (
    <div className="flex flex-col">
      {entries.map((entry, index) => {
        const showConnector = index < entries.length - 1

        return (
          <article
            key={entry.id}
            className="grid gap-5 pb-12 last:pb-0 md:grid-cols-[4.5rem_minmax(0,1fr)] md:gap-8"
          >
            <div className="hidden md:flex md:flex-col md:items-center">
              <ExperienceAvatar initials={entry.initials} tone={entry.tone} />
              {showConnector ? (
                <div className="mt-4 w-px flex-1 bg-border" />
              ) : null}
            </div>

            <div className="flex flex-col gap-5">
              <div className="flex items-start gap-4 md:block">
                <div className="md:hidden">
                  <ExperienceAvatar
                    initials={entry.initials}
                    tone={entry.tone}
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <h3 className="text-2xl font-semibold tracking-tight text-foreground">
                    {t(`entries.${entry.id}.institution`)}
                  </h3>
                  <div className="flex flex-col gap-1 md:flex-row md:items-baseline md:gap-3">
                    <p className="text-xl text-foreground/80">
                      {t(`entries.${entry.id}.degree`)}
                    </p>
                    <p className="text-sm text-muted-foreground italic">
                      {t(`entries.${entry.id}.location`)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-muted-foreground">
                      {entry.period}
                    </p>
                    {entry.status === "ongoing" ? (
                      <Badge
                        variant="outline"
                        className="border-black/10 bg-white/45 text-[0.65rem] dark:border-white/12 dark:bg-white/8"
                      >
                        {t("ongoing")}
                      </Badge>
                    ) : null}
                  </div>
                </div>
              </div>

              <Separator className="w-16 bg-black/8 dark:bg-white/10" />

              <p className="text-sm leading-7 text-foreground/75 sm:text-base">
                {t(`entries.${entry.id}.description`)}
              </p>
            </div>
          </article>
        )
      })}
    </div>
  )
}

function EducationPanel() {
  const { t } = useTranslation("common", { keyPrefix: "education" })

  return (
    <div className="relative z-10 flex h-full flex-col gap-5">
      <PanelHeader panel="education" />
      <Separator className="bg-black/8 dark:bg-white/10" />
      <EducationTimeline entries={educationEntryMeta} />

      <div className="flex flex-col gap-3 rounded-[1.5rem] border border-white/50 bg-white/40 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.35)] backdrop-blur-xl dark:border-white/12 dark:bg-white/6 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
        <h4 className="text-lg font-semibold tracking-tight text-foreground">
          {t("certifications")}
        </h4>
        <ul className="flex flex-col gap-2.5">
          {certificationMeta.map((cert) => (
            <li
              key={cert.id}
              className="flex flex-wrap items-center gap-3 text-sm leading-7 text-muted-foreground"
            >
              <span className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/55 bg-white/55 text-[0.65rem] font-semibold text-foreground/65 shadow-sm dark:border-white/12 dark:bg-white/8 dark:text-foreground/80">
                {cert.logoSrc ? (
                  <img
                    src={cert.logoSrc}
                    alt={t(`certs.${cert.id}.issuer`)}
                    className="size-full object-contain p-1"
                  />
                ) : (
                  t(`certs.${cert.id}.title`)
                    .replace(/[^A-Z0-9]/g, "")
                    .slice(0, 3)
                )}
              </span>
              <span className="text-foreground/80">
                {t(`certs.${cert.id}.title`)}
              </span>
              <span aria-hidden="true">·</span>
              <span>{t(`certs.${cert.id}.issuer`)}</span>
              <Badge
                variant="outline"
                className="border-black/10 bg-white/45 text-[0.65rem] dark:border-white/12 dark:bg-white/8"
              >
                {t(`certs.${cert.id}.status`)}
              </Badge>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default function ExperienceSection() {
  const [activePanel, setActivePanel] = useState<PanelKey>("experience")
  const { themeMode } = useThemeMode()
  const { t: tExperience } = useTranslation("common", { keyPrefix: "experience" })
  const { t: tEducation } = useTranslation("common", { keyPrefix: "education" })
  const hasMountedRef = useRef(false)
  const experiencePanelRef = useRef<HTMLDivElement>(null)
  const educationPanelRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const experiencePanel = experiencePanelRef.current
    const educationPanel = educationPanelRef.current

    if (!experiencePanel || !educationPanel) {
      return
    }

    const activeElement =
      activePanel === "experience" ? experiencePanel : educationPanel
    const inactiveElement =
      activePanel === "experience" ? educationPanel : experiencePanel
    const inactiveX = activePanel === "experience" ? -40 : 40
    const inactiveRotation = activePanel === "experience" ? 1.8 : -1.8

    const applyLayout = (animate: boolean) => {
      gsap.killTweensOf([activeElement, inactiveElement])

      const inactiveProps = {
        ...inactivePanelState,
        x: inactiveX,
        rotation: inactiveRotation,
        zIndex: 1,
      }

      const activeProps = {
        ...activePanelState,
        zIndex: 2,
      }

      if (animate) {
        gsap.to(inactiveElement, {
          ...inactiveProps,
          duration: 0.7,
          ease: "power3.out",
        })
        gsap.to(activeElement, {
          ...activeProps,
          duration: 0.76,
          ease: "power3.out",
        })
      } else {
        gsap.set(inactiveElement, inactiveProps)
        gsap.set(activeElement, activeProps)
      }
    }

    applyLayout(hasMountedRef.current)
    hasMountedRef.current = true

    return () => {
      gsap.killTweensOf([activeElement, inactiveElement])
    }
  }, [activePanel])

  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-center">
        <div className="inline-grid grid-cols-2 gap-1 rounded-full border border-black/8 bg-white p-1.5 shadow-[0_4px_18px_-6px_rgba(15,23,42,0.14)] dark:border-white/12 dark:bg-slate-900/80 dark:shadow-[0_4px_18px_-6px_rgba(2,6,23,0.5)]">
          <button
            id="experience-tab"
            type="button"
            className={cn(
              "relative flex min-w-37 items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-medium transition-[color,box-shadow] duration-300",
              activePanel === "experience"
                ? "text-slate-900 shadow-[0_14px_30px_-18px_rgba(15,23,42,0.32)] dark:text-white"
                : "text-foreground/60 hover:text-foreground/85 dark:text-white/68 dark:hover:text-white"
            )}
            style={
              activePanel === "experience"
                ? {
                    background:
                      themeMode === "dark"
                        ? "linear-gradient(135deg,rgba(34,211,238,0.55),rgba(129,140,248,0.55),rgba(34,211,238,0.55))"
                        : "linear-gradient(135deg,rgba(39,255,195,0.6),rgba(234,179,8,0.5),rgba(39,255,195,0.6))",
                    backgroundSize: "250% 250%",
                    animation: "flow-gradient 9s ease-in-out infinite",
                  }
                : undefined
            }
            onClick={() => setActivePanel("experience")}
          >
            <span className="pointer-events-none">{tExperience("tab")}</span>
          </button>
          <button
            id="education-tab"
            type="button"
            className={cn(
              "relative flex min-w-37 items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-medium transition-[color,box-shadow] duration-300",
              activePanel === "education"
                ? "text-slate-900 shadow-[0_14px_30px_-18px_rgba(15,23,42,0.32)] dark:text-white"
                : "text-foreground/60 hover:text-foreground/85 dark:text-white/68 dark:hover:text-white"
            )}
            style={
              activePanel === "education"
                ? {
                    background:
                      themeMode === "dark"
                        ? "linear-gradient(135deg,rgba(34,211,238,0.55),rgba(129,140,248,0.55),rgba(34,211,238,0.55))"
                        : "linear-gradient(135deg,rgba(39,255,195,0.6),rgba(234,179,8,0.5),rgba(39,255,195,0.6))",
                    backgroundSize: "250% 250%",
                    animation: "flow-gradient 9s ease-in-out infinite",
                  }
                : undefined
            }
            onClick={() => setActivePanel("education")}
          >
            <span className="pointer-events-none">{tEducation("tab")}</span>
          </button>
        </div>
      </div>

      <div className="grid pb-6 lg:grid-cols-12 lg:pb-10">
        <section
          ref={experiencePanelRef}
          role="tabpanel"
          aria-hidden={activePanel !== "experience"}
          aria-labelledby="experience-tab"
          className={cn(
            "glass-gradient-surface glass-card-surface relative col-start-1 row-start-1 overflow-hidden rounded-[2rem] p-8 shadow-[0_28px_90px_-44px_rgba(15,23,42,0.35)] will-change-[transform,filter,opacity] sm:p-10 lg:col-span-8 lg:col-start-1 lg:row-start-1 lg:self-start dark:shadow-[0_28px_90px_-44px_rgba(2,6,23,0.8)]",
            activePanel === "experience"
              ? "pointer-events-auto"
              : "glass-anim-paused pointer-events-none"
          )}
        >
          <div
            aria-hidden="true"
            className="glass-panel-orb absolute top-0 right-0 size-52 translate-x-18 -translate-y-20 rounded-full"
          />
          <ExperiencePanel />
        </section>

        <section
          ref={educationPanelRef}
          role="tabpanel"
          aria-hidden={activePanel !== "education"}
          aria-labelledby="education-tab"
          className={cn(
            "glass-gradient-surface glass-card-surface relative col-start-1 row-start-1 overflow-hidden rounded-[2rem] p-8 shadow-[0_28px_90px_-44px_rgba(15,23,42,0.35)] will-change-[transform,filter,opacity] sm:p-10 lg:col-span-8 lg:col-start-5 lg:row-start-1 lg:mt-16 lg:self-start dark:shadow-[0_28px_90px_-44px_rgba(2,6,23,0.8)]",
            activePanel === "education"
              ? "pointer-events-auto"
              : "glass-anim-paused pointer-events-none"
          )}
        >
          <div
            aria-hidden="true"
            className="glass-panel-orb absolute right-8 bottom-0 size-48 translate-y-12 rounded-full"
          />
          <EducationPanel />
        </section>
      </div>
    </div>
  )
}
