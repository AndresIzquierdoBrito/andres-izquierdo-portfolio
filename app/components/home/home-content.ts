import type { ComponentType, CSSProperties, SVGProps } from "react"
import type { LucideIcon } from "lucide-react"

import {
  AmazonWebServicesIcon,
  FastAPIIcon,
  PythonIcon,
  ReactIcon,
  RaspberryIcon,
  TypeScriptIcon,
} from "~/components/icons"
import type { ThemeMode } from "~/lib/theme"

export type FocusToolIcon = LucideIcon | ComponentType<SVGProps<SVGSVGElement>>

export type FocusTool = {
  label: string
  icon: FocusToolIcon
}

export const currentFocusTools = [
  { label: "React", icon: ReactIcon },
  { label: "FastAPI", icon: FastAPIIcon },
  { label: "AWS", icon: AmazonWebServicesIcon },
  { label: "TypeScript", icon: TypeScriptIcon },
  { label: "Python", icon: PythonIcon },
  { label: "Raspberry", icon: RaspberryIcon },
] as const satisfies readonly FocusTool[]

export type ProjectCardData = {
  eyebrow: string
  name: string
  /** Short phrase shown as the section heading when this card is active */
  tagline: string
  description: string
  /** Path to the app icon image (e.g. "/icons/myapp.png") */
  iconSrc?: string
  /** 1-3 icons representing the project's stack, shown top-right of the card */
  stack?: readonly FocusToolIcon[]
  /** Up to 3 screenshot or gif paths shown scattered around the icon */
  screenshots?: readonly string[]
  /** Live project URL */
  projectUrl?: string
  /** Case study or demo site URL */
  caseStudyUrl?: string
}

export const projectPreviewCards: readonly ProjectCardData[] = [
  {
    eyebrow: "Proyecto destacado",
    name: "ApunteX",
    tagline: "Tus notas, por fin listas para enseñarte.",
    description:
      "Organiza tus notas, lee cada fuente y estudia con IA especializada: un espacio tranquilo donde tus archivos son la única fuente de verdad.",
    iconSrc: "/projects_media/apuntex/apuntex_logo.png",
    screenshots: [
      "/projects_media/apuntex/apuntex_sc1.png",
      "/projects_media/apuntex/apuntex_sc2.png",
      "/projects_media/apuntex/apuntex_sc3.png",
    ],
    projectUrl: "https://app.apuntex.com/workspace",
  },
  {
    eyebrow: "Projects",
    name: "Coming soon!",
    tagline: "Coming soon!",
    description: "Coming soon!",
  },
  {
    eyebrow: "Projects",
    name: "Coming soon!",
    tagline: "Coming soon!",
    description: "Coming soon!",
  },
  {
    eyebrow: "Projects",
    name: "Coming soon!",
    tagline: "Coming soon!",
    description: "Coming soon!",
  },
  {
    eyebrow: "Projects",
    name: "Coming soon!",
    tagline: "Coming soon!",
    description: "Coming soon!",
  },
  {
    eyebrow: "Projects",
    name: "Coming soon!",
    tagline: "Coming soon!",
    description: "Coming soon!",
  },
]

type HomeGradientPalette = {
  hero: {
    color1: string
    color2: string
    color3: string
  }
  about: {
    dotColor1: string
    dotColor2: string
    dotColor3: string
    washColor1: string
    washColor2: string
    washColor3: string
  }
  projects: {
    backgroundFrom: string
    backgroundTo: string
    orbTopRight: string
    orbBottomLeft: string
  }
  contact: {
    backgroundBase: string
    orbTopLeft: string
    orbBottomRight: string
  }
}

export const homeGradientPalettes: Record<ThemeMode, HomeGradientPalette> = {
  light: {
    hero: {
      color1: "#EAB308",
      color2: "#27ffc3",
      color3: "#cdfaeb",
    },
    about: {
      dotColor1: "#EAB308",
      dotColor2: "#27ffc3",
      dotColor3: "#cdfaeb",
      washColor1: "rgb(234 179 8 / 0.10)",
      washColor2: "rgb(39 255 195 / 0.10)",
      washColor3: "rgb(205 250 235 / 0.35)",
    },
    projects: {
      backgroundFrom: "rgba(255,255,255,0.98)",
      backgroundTo: "rgba(248,250,252,0.95)",
      orbTopRight: "rgba(39,255,195,0.18)",
      orbBottomLeft: "rgba(234,179,8,0.16)",
    },
    contact: {
      backgroundBase: "#103f3a",
      orbTopLeft: "rgba(234,179,8,0.12)",
      orbBottomRight: "rgba(39,255,195,0.14)",
    },
  },
  dark: {
    hero: {
      color1: "#00CED1",
      color2: "#6366f1",
      color3: "#0f172a",
    },
    about: {
      dotColor1: "#22d3ee",
      dotColor2: "#818cf8",
      dotColor3: "#0f172a",
      washColor1: "rgb(34 211 238 / 0.13)",
      washColor2: "rgb(129 140 248 / 0.13)",
      washColor3: "rgb(15 23 42 / 0.64)",
    },
    projects: {
      backgroundFrom: "rgba(10,15,20,0.98)",
      backgroundTo: "rgba(6,10,14,0.95)",
      orbTopRight: "rgba(129,140,248,0.22)",
      orbBottomLeft: "rgba(34,211,238,0.20)",
    },
    contact: {
      backgroundBase: "#0b1220",
      orbTopLeft: "rgba(129,140,248,0.12)",
      orbBottomRight: "rgba(34,211,238,0.12)",
    },
  },
}

export function getHomeGradientPalette(themeMode: ThemeMode) {
  return homeGradientPalettes[themeMode]
}

export const heroGreetings = [
  "Hey there!",
  "Hola!",
  "Bonjour!",
  "Ciao!",
] as const

export function getResumePatternStyle(): CSSProperties {
  return {
    "--resume-mouse-x": "50%",
    "--resume-mouse-y": "12rem",
    "--resume-trace-x": "50%",
    "--resume-trace-y": "12rem",
    "--resume-hover-opacity": "0",
    "--resume-trace-opacity": "0",
  } as CSSProperties
}
