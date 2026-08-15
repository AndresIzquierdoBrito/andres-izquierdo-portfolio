import HomeSectionNav from "~/components/HomeSectionNav"
import HomeAboutSection from "~/components/home/HomeAboutSection"
import HomeContactSection from "~/components/home/HomeContactSection"
import HomeHeroSection from "~/components/home/HomeHeroSection"
import HomeProjectsSection from "~/components/home/HomeProjectsSection"
import { useActiveHomeSection } from "~/components/home/useActiveHomeSection"

export default function Home() {
  const activeSection = useActiveHomeSection()

  return (
    <div className="relative h-full w-full">
      <HomeSectionNav activeSection={activeSection} />

      <main className="relative pb-28 lg:pb-0">
        <HomeHeroSection />
        <HomeAboutSection />
        <HomeProjectsSection />
        <HomeContactSection />
      </main>
    </div>
  )
}
