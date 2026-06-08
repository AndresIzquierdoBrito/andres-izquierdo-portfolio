import { useEffect, useState } from "react"

import { homeSections, type HomeSectionId } from "~/components/HomeSectionNav"

export function useActiveHomeSection() {
  const [activeSection, setActiveSection] = useState<HomeSectionId>("home")

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
            entry.isIntersecting ? entry.intersectionRect.height : 0
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
        threshold: [0, 0.05, 0.1, 0.2, 0.4, 0.65],
      }
    )

    sectionElements.forEach((section) => {
      visibilityRatios.set(section.id as HomeSectionId, 0)
      observer.observe(section)
    })

    return () => observer.disconnect()
  }, [])

  return activeSection
}
