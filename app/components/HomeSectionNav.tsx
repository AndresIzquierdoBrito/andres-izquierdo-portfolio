import { useTranslation } from "react-i18next"

import { cn } from "~/lib/utils"

export const homeSections = [
  { id: "home", labelKey: "home" },
  { id: "background", labelKey: "background" },
  { id: "projects", labelKey: "projects" },
  { id: "contact", labelKey: "contact" },
] as const

export type HomeSectionId = (typeof homeSections)[number]["id"]

type HomeSectionNavProps = {
  activeSection: HomeSectionId
}

export default function HomeSectionNav({ activeSection }: HomeSectionNavProps) {
  const { t } = useTranslation("common", { keyPrefix: "nav" })
  const activeSectionIndex = Math.max(
    0,
    homeSections.findIndex((section) => section.id === activeSection)
  )

  return (
    <nav
      aria-label="Section navigation"
      className="fixed inset-x-3 bottom-2 z-50 mx-auto max-w-md xl:top-1/2 xl:right-auto xl:bottom-auto xl:left-3 xl:max-w-none xl:-translate-y-1/2"
    >
      <div className="pointer-events-auto rounded-[2rem] border border-black/10 bg-white/70 p-1.5 text-slate-900 shadow-[0_24px_64px_-30px_rgba(15,23,42,0.45)] backdrop-blur-2xl xl:w-60 xl:p-3 dark:border-white/15 dark:bg-slate-900/45 dark:text-white">
        <ol className="grid grid-cols-4 gap-1 xl:flex xl:flex-col xl:gap-0">
          {homeSections.map((section, index) => {
            const isActive = section.id === activeSection
            const isComplete = index < activeSectionIndex

            return (
              <li
                key={section.id}
                className="flex flex-col items-center xl:items-start"
              >
                <a
                  aria-current={isActive ? "location" : undefined}
                  className={cn(
                    "group flex w-full min-w-0 flex-col items-center gap-1.5 rounded-[1.35rem] px-2 py-2 text-center transition-colors duration-200 xl:flex-row xl:justify-start xl:gap-3 xl:px-3 xl:py-2.5",
                    isActive
                      ? "bg-black/5 text-slate-950 dark:bg-white/10 dark:text-white"
                      : "text-slate-500 hover:bg-black/4 hover:text-slate-900 dark:text-white/55 dark:hover:bg-white/8 dark:hover:text-white"
                  )}
                  href={`#${section.id}`}
                >
                  <span
                    className={cn(
                      "relative flex shrink-0 items-center justify-center rounded-full border transition-all duration-300 xl:size-8",
                      isActive
                        ? "size-7 scale-[1.18] border-black/15 bg-white shadow-[0_10px_24px_-16px_rgba(15,23,42,0.9)] xl:size-8 xl:scale-[1.22] dark:border-white/15 dark:bg-white/12 dark:shadow-[0_10px_24px_-16px_rgba(2,6,23,0.9)]"
                        : isComplete
                          ? "size-6 border-emerald-300/70 bg-emerald-50 xl:size-7 dark:border-cyan-400/40 dark:bg-cyan-400/10"
                          : "size-6 border-black/10 bg-white/45 xl:size-7 dark:border-white/12 dark:bg-white/8"
                    )}
                  >
                    {isActive && (
                      <span
                        aria-hidden="true"
                        className="absolute inset-0 animate-ping rounded-full bg-[linear-gradient(135deg,#eab308,#27ffc3)] opacity-20 dark:bg-[linear-gradient(135deg,#22d3ee,#818cf8)]"
                      />
                    )}
                    <span
                      className={cn(
                        "relative rounded-full transition-all duration-300",
                        isActive
                          ? "size-3.5 bg-[linear-gradient(135deg,#eab308,#27ffc3)] xl:size-4 dark:bg-[linear-gradient(135deg,#22d3ee,#818cf8)]"
                          : isComplete
                            ? "size-2.5 bg-[#27ffc3] dark:bg-[#22d3ee]"
                            : "size-2.5 bg-black/20 dark:bg-white/30"
                      )}
                    />
                  </span>

                  <span className="text-[0.7rem] leading-tight font-medium text-current sm:text-xs xl:text-sm">
                    {t(section.labelKey)}
                  </span>
                </a>

                {index < homeSections.length - 1 ? (
                  <div className="hidden w-full py-0.5 xl:flex xl:justify-start">
                    <span
                      aria-hidden="true"
                      className="ml-6.5 h-8 w-0.5 overflow-hidden rounded-full bg-black/10 dark:bg-white/10"
                    >
                      <span
                        className={cn(
                          "block h-full w-0.5 rounded-full bg-[linear-gradient(180deg,#eab308,#27ffc3)] transition-[transform] duration-500 ease-out origin-top dark:bg-[linear-gradient(180deg,#22d3ee,#818cf8)]",
                          isComplete ? "scale-y-100" : "scale-y-0"
                        )}
                      />
                    </span>
                  </div>
                ) : null}
              </li>
            )
          })}
        </ol>
      </div>
    </nav>
  )
}
