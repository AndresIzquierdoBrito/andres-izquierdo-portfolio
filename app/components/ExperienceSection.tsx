import { useLayoutEffect, useRef, useState } from "react"

import gsap from "gsap"
import { useTranslation } from "react-i18next"

import { Badge } from "~/components/ui/badge"
import { Separator } from "~/components/ui/separator"
import { cn } from "~/lib/utils"

type PanelKey = "experience" | "education"

type ExperienceEntry = {
  id: "dst" | "step"
  technologies: string[]
  initials: string
  tone: string
  logoSrc?: string
  logoFit?: "contain" | "cover-left" | "cover-center"
}

type EducationEntryMeta = {
  id: "uoc" | "cifp"
  period: string
  status: "completed" | "ongoing"
  initials: string
  tone: string
  logoSrc?: string
  logoFit?: "contain" | "cover-left" | "cover-center"
}

type CertificationMeta = {
  id: "cambridgeC1" | "awsCloudPractitioner"
  /** Path to the issuer's logo image (e.g. "/logos/cambridge-english.svg") */
  logoSrc?: string
}

const experienceEntries: ExperienceEntry[] = [
  {
    id: "dst",
    technologies: [
      "FastAPI",
      "Python",
      "React.js",
      "TypeScript",
      "Docker",
      "Pytest",
      "Cypress",
    ],
    initials: "DST",
    tone: "bg-secondary text-secondary-foreground",
    logoSrc: "/logos/dst.svg",
    logoFit: "contain",
  },
  {
    id: "step",
    technologies: ["Next.js", "React.js", "TypeScript", "Figma"],
    initials: "STP",
    tone: "bg-muted text-foreground",
    logoSrc: "/logos/step.png",
    logoFit: "contain",
  },
]

const educationEntryMeta: EducationEntryMeta[] = [
  {
    id: "uoc",
    period: "2025 - Present",
    status: "ongoing",
    initials: "UOC",
    tone: "bg-muted text-foreground",
    logoSrc: "/logos/uoc.png",
    logoFit: "cover-center",
  },
  {
    id: "cifp",
    period: "2022 - 2024",
    status: "completed",
    initials: "CM",
    tone: "bg-secondary text-secondary-foreground",
    logoSrc: "/logos/cifp-cesar-manrique.png",
    logoFit: "cover-left",
  },
]

const certificationMeta: CertificationMeta[] = [
  {
    id: "cambridgeC1",
    logoSrc: "/logos/cambridge-english.svg",
  },
  {
    id: "awsCloudPractitioner",
    logoSrc: "/logos/aws-cloud-practitioner.png",
  },
]

const inactivePanelState = {
  opacity: 0.78,
  scale: 0.985,
  y: 20,
  filter: "blur(4px)",
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
  logoSrc,
  logoFit = "contain",
  accent = "green",
}: Pick<ExperienceEntry, "initials" | "tone" | "logoSrc" | "logoFit"> & {
  accent?: "green" | "gold"
}) {
  return (
    <div
      className={cn(
        "flex size-20 shrink-0 rounded-full border-2 bg-white p-1.5 sm:size-24 md:size-28 dark:bg-slate-950",
        accent === "green"
          ? "border-emerald-300/80 dark:border-cyan-400/55"
          : "border-amber-300/80 dark:border-indigo-400/55"
      )}
    >
      <span
        className={cn(
          "flex size-full items-center justify-center overflow-hidden rounded-full text-lg font-medium sm:text-xl md:text-2xl",
          tone
        )}
      >
        {logoSrc ? (
          <img
            src={logoSrc}
            alt=""
            className={cn(
              "size-full rounded-full",
              logoFit === "cover-left" && "object-cover object-left",
              logoFit === "cover-center" && "object-cover object-center",
              logoFit === "contain" && "object-contain p-2"
            )}
          />
        ) : (
          initials
        )}
      </span>
    </div>
  )
}

function PanelHeader({ panel }: { panel: PanelKey }) {
  const { t } = useTranslation("common", { keyPrefix: panel })

  return (
    <div className="relative z-10 flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <h3 className="font-heading text-4xl font-medium tracking-tight text-foreground">
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
    <div className="relative flex flex-col gap-12">
      {entries.map((entry, index) => {
        const showConnector = index < entries.length - 1
        const highlights = [
          t(`entries.${entry.id}.highlights.h0`),
          t(`entries.${entry.id}.highlights.h1`),
        ]

        return (
          <article
            key={entry.id}
            className="relative grid gap-5 md:grid-cols-[7rem_minmax(0,1fr)] md:gap-8"
          >
            {showConnector ? (
              <span
                aria-hidden="true"
                className="absolute top-28 -bottom-12 left-14 hidden w-px bg-emerald-300/80 md:block dark:bg-cyan-400/50"
              />
            ) : null}
            <div className="relative z-10 hidden md:flex md:flex-col md:items-center">
              <ExperienceAvatar
                initials={entry.initials}
                tone={entry.tone}
                logoSrc={entry.logoSrc}
                logoFit={entry.logoFit}
              />
            </div>

            <div className="flex flex-col gap-5">
              <div className="flex items-start gap-4 md:block">
                <div className="md:hidden">
                  <ExperienceAvatar
                    initials={entry.initials}
                    tone={entry.tone}
                    logoSrc={entry.logoSrc}
                    logoFit={entry.logoFit}
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
                  <p className="font-mono text-xs tracking-tight text-muted-foreground">
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
                      className="border-emerald-300/70 bg-white font-mono text-[0.7rem] dark:border-cyan-400/35 dark:bg-slate-950"
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
    <div className="relative flex flex-col gap-12">
      {entries.map((entry, index) => {
        const showConnector = index < entries.length - 1

        return (
          <article
            key={entry.id}
            className="relative grid gap-5 md:grid-cols-[7rem_minmax(0,1fr)] md:gap-8"
          >
            {showConnector ? (
              <span
                aria-hidden="true"
                className="absolute top-28 -bottom-12 left-14 hidden w-px bg-amber-300/80 md:block dark:bg-indigo-400/50"
              />
            ) : null}
            <div className="relative z-10 hidden md:flex md:flex-col md:items-center">
              <ExperienceAvatar
                initials={entry.initials}
                tone={entry.tone}
                logoSrc={entry.logoSrc}
                logoFit={entry.logoFit}
                accent="gold"
              />
            </div>

            <div className="flex flex-col gap-5">
              <div className="flex items-start gap-4 md:block">
                <div className="md:hidden">
                  <ExperienceAvatar
                    initials={entry.initials}
                    tone={entry.tone}
                    logoSrc={entry.logoSrc}
                    logoFit={entry.logoFit}
                    accent="gold"
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
                    <p className="font-mono text-xs tracking-tight text-muted-foreground">
                      {entry.period}
                    </p>
                    {entry.status === "ongoing" ? (
                      <Badge
                        variant="outline"
                        className="border-amber-300/70 bg-white font-mono text-[0.65rem] dark:border-indigo-400/35 dark:bg-slate-950"
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

      <div className="flex flex-col gap-3 border-t border-amber-300/70 pt-5 dark:border-indigo-400/35">
        <h4 className="text-lg font-semibold tracking-tight text-foreground">
          {t("certifications")}
        </h4>
        <ul className="divide-y divide-amber-300/45 dark:divide-indigo-400/25">
          {certificationMeta.map((cert) => (
            <li
              key={cert.id}
              className="flex items-center gap-4 py-4 first:pt-1 last:pb-1"
            >
              <span className="flex size-18 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-amber-300/70 bg-white p-2 dark:border-indigo-400/35 dark:bg-slate-950">
                {cert.logoSrc ? (
                  <img
                    src={cert.logoSrc}
                    alt={t(`certs.${cert.id}.issuer`)}
                    className="size-full object-contain"
                  />
                ) : (
                  t(`certs.${cert.id}.title`)
                    .replace(/[^A-Z0-9]/g, "")
                    .slice(0, 3)
                )}
              </span>
              <span className="flex min-w-0 flex-1 flex-col gap-1">
                <span className="text-base font-medium text-foreground sm:text-lg">
                  {t(`certs.${cert.id}.title`)}
                </span>
                <span className="text-sm text-muted-foreground">
                  {t(`certs.${cert.id}.issuer`)}
                </span>
              </span>
              <Badge
                variant="outline"
                className="shrink-0 border-amber-300/70 bg-white font-mono text-[0.65rem] dark:border-indigo-400/35 dark:bg-slate-950"
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
  const { t: tExperience } = useTranslation("common", {
    keyPrefix: "experience",
  })
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
    const inactiveX = activePanel === "experience" ? -18 : 18
    const inactiveRotation = activePanel === "experience" ? 0.7 : -0.7

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
        <div className="inline-grid grid-cols-2 gap-1 rounded-full border border-emerald-300/60 bg-white p-1.5 dark:border-cyan-400/30 dark:bg-slate-950">
          <button
            id="experience-tab"
            type="button"
            className={cn(
              "relative flex min-w-37 items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-medium transition-colors duration-300",
              activePanel === "experience"
                ? "bg-slate-950 text-white dark:bg-white dark:text-slate-950"
                : "text-foreground/60 hover:text-foreground/85 dark:text-white/68 dark:hover:text-white"
            )}
            onClick={() => setActivePanel("experience")}
          >
            <span className="pointer-events-none">{tExperience("tab")}</span>
          </button>
          <button
            id="education-tab"
            type="button"
            className={cn(
              "relative flex min-w-37 items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-medium transition-colors duration-300",
              activePanel === "education"
                ? "bg-slate-950 text-white dark:bg-white dark:text-slate-950"
                : "text-foreground/60 hover:text-foreground/85 dark:text-white/68 dark:hover:text-white"
            )}
            onClick={() => setActivePanel("education")}
          >
            <span className="pointer-events-none">{tEducation("tab")}</span>
          </button>
        </div>
      </div>

      <div className="grid px-1 pb-4 sm:px-4 lg:grid-cols-12 lg:px-6 lg:pb-8">
        <section
          ref={experiencePanelRef}
          role="tabpanel"
          aria-hidden={activePanel !== "experience"}
          aria-labelledby="experience-tab"
          className={cn(
            "relative col-start-1 row-start-1 overflow-hidden rounded-[1.75rem] border border-emerald-300/70 bg-white p-7 shadow-[0_24px_64px_-44px_rgba(15,23,42,0.28)] will-change-[transform,filter,opacity] sm:p-9 lg:col-span-8 lg:col-start-1 lg:row-start-1 lg:self-start dark:border-cyan-400/35 dark:bg-slate-950 dark:shadow-[0_24px_64px_-44px_rgba(2,6,23,0.72)]",
            activePanel === "experience"
              ? "pointer-events-auto"
              : "glass-anim-paused pointer-events-none"
          )}
        >
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-70 dark:opacity-35"
            style={{
              backgroundImage:
                "linear-gradient(145deg, rgba(39,255,195,0.09), transparent 42%, rgba(234,179,8,0.045))",
            }}
          />
          <ExperiencePanel />
        </section>

        <section
          ref={educationPanelRef}
          role="tabpanel"
          aria-hidden={activePanel !== "education"}
          aria-labelledby="education-tab"
          className={cn(
            "relative col-start-1 row-start-1 overflow-hidden rounded-[1.75rem] border border-amber-300/75 bg-white p-7 shadow-[0_24px_64px_-44px_rgba(15,23,42,0.28)] will-change-[transform,filter,opacity] sm:p-9 lg:col-span-8 lg:col-start-5 lg:row-start-1 lg:mt-10 lg:self-start dark:border-indigo-400/35 dark:bg-slate-950 dark:shadow-[0_24px_64px_-44px_rgba(2,6,23,0.72)]",
            activePanel === "education"
              ? "pointer-events-auto"
              : "glass-anim-paused pointer-events-none"
          )}
        >
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-70 dark:opacity-35"
            style={{
              backgroundImage:
                "linear-gradient(145deg, rgba(234,179,8,0.075), transparent 42%, rgba(99,102,241,0.055))",
            }}
          />
          <EducationPanel />
        </section>
      </div>
    </div>
  )
}
