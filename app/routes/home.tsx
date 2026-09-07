import HomeSectionNav from "~/components/HomeSectionNav"
import HomeAboutSection from "~/components/home/HomeAboutSection"
import HomeContactSection from "~/components/home/HomeContactSection"
import HomeHeroSection from "~/components/home/HomeHeroSection"
import HomeProjectsSection from "~/components/home/HomeProjectsSection"
import ProjectsDashboardBanner from "~/components/home/ProjectsDashboardBanner"
import { useActiveHomeSection } from "~/components/home/useActiveHomeSection"
import { isAppLanguage } from "~/i18n/settings"

import type { Route } from "./+types/home"

export function loader({ params }: Route.LoaderArgs) {
  if (!isAppLanguage(params.lang)) {
    throw new Response("Not Found", { status: 404 })
  }

  return null
}

export function meta(_: Route.MetaArgs) {
  return [
    {
      title: "Andrés Izquierdo — Software Engineer",
    },
    {
      name: "description",
      content:
        "Portfolio of Andrés Izquierdo, a software engineer building full-stack products, interfaces, and reliable systems.",
    },
    {
      name: "author",
      content: "Andrés Izquierdo",
    },
    {
      name: "robots",
      content: "index, follow",
    },
    {
      property: "og:title",
      content: "Andrés Izquierdo — Software Engineer",
    },
    {
      property: "og:description",
      content:
        "Software engineer building full-stack products, interfaces, and reliable systems.",
    },
    {
      property: "og:type",
      content: "website",
    },
    {
      name: "twitter:card",
      content: "summary",
    },
  ]
}

export default function Home() {
  const activeSection = useActiveHomeSection()

  return (
    <div className="relative h-full w-full">
      <HomeSectionNav activeSection={activeSection} />

      <main className="relative pb-28 lg:pb-0">
        <HomeHeroSection />
        <HomeAboutSection />
        <HomeProjectsSection />
        <ProjectsDashboardBanner />
        <HomeContactSection />
      </main>
    </div>
  )
}
