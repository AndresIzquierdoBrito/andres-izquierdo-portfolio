import { useLayoutEffect, useRef, useState } from "react"

import gsap from "gsap"
import {
  Award,
  BookOpenText,
  BriefcaseBusiness,
  GraduationCap,
  type LucideIcon,
} from "lucide-react"

import { Avatar, AvatarFallback } from "~/components/ui/avatar"
import { Badge } from "~/components/ui/badge"
import { Separator } from "~/components/ui/separator"
import { cn } from "~/lib/utils"

import SectionBadge from "~/components/home/SectionBadge"

type PanelKey = "experience" | "education"

type ExperienceEntry = {
  company: string
  role: string
  location: string
  period: string
  highlights: string[]
  technologies: string[]
  initials: string
  tone: string
}

type EducationCard = {
  title: string
  description: string
  icon: LucideIcon
}

const experienceEntries: ExperienceEntry[] = [
  {
    company: "iRaiser",
    role: "Software Engineer",
    location: "Nantes, France",
    period: "Nov. 2024 - Now (1 year and 6 months)",
    highlights: [
      "Participated in the development of a SaaS product that helps non-profits and NGOs raise funds.",
      "Built custom features and solution adaptations for specific customer requirements.",
    ],
    technologies: ["VueJS", "JavaScript", "PHP", "HTML", "CSS", "Docker"],
    initials: "IR",
    tone: "bg-secondary text-secondary-foreground",
  },
  {
    company: "Spikeelabs",
    role: "Fullstack Developer",
    location: "Rennes, France",
    period: "Mar. 2021 - Sept. 2022 (1 year and 7 months)",
    highlights: [
      "Developed a portal to manage judicial requisitions for a telecom operator.",
      "Contributed to an internal design system used across multiple projects.",
      "Built tools for managing financial objects, assets, billing, and dashboard prototypes.",
    ],
    technologies: [
      "VueJS",
      "TypeScript",
      "Design Systems",
      "Dashboards",
      "Telecom",
    ],
    initials: "SP",
    tone: "bg-muted text-foreground",
  },
]

const educationPreviewCards: EducationCard[] = [
  {
    title: "Formal education",
    description:
      "Add degrees, institutions, majors, honors, and thesis work in a structured academic lane.",
    icon: GraduationCap,
  },
  {
    title: "Certifications",
    description:
      "Show certifications, licenses, and specialized technical training that support your product and engineering profile.",
    icon: Award,
  },
  {
    title: "Continuous learning",
    description:
      "Track workshops, bootcamps, focused coursework, conferences, and self-directed study without mixing them into work history.",
    icon: BookOpenText,
  },
]

const educationKeywords = [
  "Degrees",
  "Certifications",
  "Bootcamps",
  "Workshops",
  "Coursework",
]

const panelMeta = {
  experience: {
    eyebrow: "Career",
    title: "Experience",
    description:
      "Selected product, SaaS, and engineering work across fundraising, internal platforms, and design systems.",
    icon: BriefcaseBusiness,
  },
  education: {
    eyebrow: "Learning",
    title: "Education",
    description:
      "A dedicated lane for degrees, certifications, and ongoing learning, separate from work so both stories can expand cleanly.",
    icon: GraduationCap,
  },
} satisfies Record<
  PanelKey,
  {
    eyebrow: string
    title: string
    description: string
    icon: LucideIcon
  }
>

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
  const meta = panelMeta[panel]
  const Icon = meta.icon

  return (
    <div className="relative z-10 flex flex-col gap-3">
      <SectionBadge size="compact">{meta.eyebrow}</SectionBadge>
      <div className="flex items-center gap-3">
        <Icon className="text-foreground/55" />
        <h3 className="font-heading text-4xl font-light tracking-tight text-foreground">
          {meta.title}
        </h3>
      </div>
      <p className="max-w-2xl text-base leading-7 text-muted-foreground">
        {meta.description}
      </p>
    </div>
  )
}

function ExperienceTimeline({ entries }: { entries: ExperienceEntry[] }) {
  return (
    <div className="flex flex-col">
      {entries.map((entry, index) => {
        const showConnector = index < entries.length - 1

        return (
          <article
            key={`${entry.company}-${entry.period}`}
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
                    {entry.company}
                  </h3>
                  <div className="flex flex-col gap-1 md:flex-row md:items-baseline md:gap-3">
                    <p className="text-xl text-foreground/80">{entry.role}</p>
                    <p className="text-sm text-muted-foreground italic">
                      {entry.location}
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {entry.period}
                  </p>
                </div>
              </div>

              <Separator className="w-16 bg-black/8 dark:bg-white/10" />

              <ul className="flex list-disc flex-col gap-2 pl-5 text-base leading-7 text-foreground/75 marker:text-muted-foreground">
                {entry.highlights.map((highlight) => (
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
          </article>
        )
      })}
    </div>
  )
}

function ExperiencePanel() {
  return (
    <div className="relative z-10 flex h-full flex-col gap-8">
      <PanelHeader panel="experience" />
      <Separator className="bg-black/8 dark:bg-white/10" />
      <ExperienceTimeline entries={experienceEntries} />
    </div>
  )
}

function EducationPanel() {
  return (
    <div className="relative z-10 flex h-full flex-col gap-8">
      <PanelHeader panel="education" />
      <Separator className="bg-black/8 dark:bg-white/10" />

      <div className="grid flex-1 gap-6 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)]">
        <div className="grid gap-4">
          {educationPreviewCards.map((card) => {
            const Icon = card.icon

            return (
              <article
                key={card.title}
                className="rounded-[1.5rem] border border-white/50 bg-white/40 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.35)] backdrop-blur-xl dark:border-white/12 dark:bg-white/6 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
              >
                <div className="flex items-start gap-4">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl border border-white/55 bg-white/55 text-foreground/65 shadow-sm dark:border-white/12 dark:bg-white/8 dark:text-foreground/80">
                    <Icon />
                  </div>
                  <div className="flex flex-col gap-2">
                    <h4 className="text-lg font-semibold tracking-tight text-foreground">
                      {card.title}
                    </h4>
                    <p className="text-sm leading-7 text-muted-foreground">
                      {card.description}
                    </p>
                  </div>
                </div>
              </article>
            )
          })}
        </div>

        <div className="flex flex-col justify-between gap-6 rounded-[1.5rem] border border-white/50 bg-white/35 p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.35)] backdrop-blur-xl dark:border-white/12 dark:bg-white/6 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
          <div className="flex flex-col gap-4">
            <p className="text-xl font-semibold tracking-tight text-foreground">
              Ready for the academic timeline
            </p>
            <p className="text-sm leading-7 text-muted-foreground">
              Once you add schools, dates, specializations, and certifications,
              this panel can either stay editorial and curated or evolve into a
              full timeline like the work panel.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {educationKeywords.map((keyword) => (
              <Badge
                key={keyword}
                variant="outline"
                className="border-black/10 bg-white/45 dark:border-white/12 dark:bg-white/8"
              >
                {keyword}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ExperienceSection() {
  const [activePanel, setActivePanel] = useState<PanelKey>("experience")
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
      <div className="flex justify-center sm:justify-start">
        <div className="frosted-tab-toggle inline-grid grid-cols-2 gap-1 rounded-full p-1.5">
          <button
            id="experience-tab"
            type="button"
            className={cn(
              "relative flex min-w-37 items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-medium transition-all duration-300",
              activePanel === "experience"
                ? "bg-[linear-gradient(135deg,rgba(234,179,8,0.36),rgba(39,255,195,0.4))] text-slate-950 shadow-[0_18px_34px_-18px_rgba(39,255,195,0.55)] dark:bg-[linear-gradient(135deg,rgba(34,211,238,0.28),rgba(99,102,241,0.34))] dark:text-white"
                : "text-foreground/60 hover:text-foreground/85 dark:text-white/68 dark:hover:text-white"
            )}
            onClick={() => setActivePanel("experience")}
          >
            <span className="pointer-events-none flex items-center gap-2">
              <BriefcaseBusiness data-icon="inline-start" />
              Experience
            </span>
          </button>
          <button
            id="education-tab"
            type="button"
            className={cn(
              "relative flex min-w-37 items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-medium transition-all duration-300",
              activePanel === "education"
                ? "bg-[linear-gradient(135deg,rgba(234,179,8,0.36),rgba(39,255,195,0.4))] text-slate-950 shadow-[0_18px_34px_-18px_rgba(39,255,195,0.55)] dark:bg-[linear-gradient(135deg,rgba(34,211,238,0.28),rgba(99,102,241,0.34))] dark:text-white"
                : "text-foreground/60 hover:text-foreground/85 dark:text-white/68 dark:hover:text-white"
            )}
            onClick={() => setActivePanel("education")}
          >
            <span className="pointer-events-none flex items-center gap-2">
              <GraduationCap data-icon="inline-start" />
              Education
            </span>
          </button>
        </div>
      </div>

      <div className="grid pb-10 lg:grid-cols-12">
        <section
          ref={experiencePanelRef}
          role="tabpanel"
          aria-hidden={activePanel !== "experience"}
          aria-labelledby="experience-tab"
          className={cn(
            "glass-gradient-surface relative col-start-1 row-start-1 overflow-hidden rounded-[2rem] p-8 shadow-[0_28px_90px_-44px_rgba(15,23,42,0.35)] will-change-[transform,filter,opacity] sm:p-10 lg:col-span-7 lg:col-start-1 lg:row-start-1 lg:self-start dark:shadow-[0_28px_90px_-44px_rgba(2,6,23,0.8)]",
            activePanel === "experience"
              ? "pointer-events-auto"
              : "pointer-events-none"
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
            "glass-gradient-surface relative col-start-1 row-start-1 overflow-hidden rounded-[2rem] p-8 shadow-[0_28px_90px_-44px_rgba(15,23,42,0.35)] will-change-[transform,filter,opacity] sm:p-10 lg:col-span-7 lg:col-start-6 lg:row-start-1 lg:mt-16 lg:self-start dark:shadow-[0_28px_90px_-44px_rgba(2,6,23,0.8)]",
            activePanel === "education"
              ? "pointer-events-auto"
              : "pointer-events-none"
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
