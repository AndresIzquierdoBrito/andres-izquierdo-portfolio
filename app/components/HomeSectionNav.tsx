import { cn } from "~/lib/utils"

export const homeSections = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "projects", label: "Projects" },
  { id: "contact", label: "Contact" },
] as const

export type HomeSectionId = (typeof homeSections)[number]["id"]

type HomeSectionNavProps = {
  activeSection: HomeSectionId
}

export default function HomeSectionNav({ activeSection }: HomeSectionNavProps) {
  const activeSectionIndex = Math.max(
    0,
    homeSections.findIndex((section) => section.id === activeSection)
  )

  return (
    <nav
      aria-label="Section navigation"
      className="fixed inset-x-3 bottom-4 z-50 lg:top-1/2 lg:right-auto lg:bottom-auto lg:left-3 lg:-translate-y-1/2"
    >
      <div className="pointer-events-auto rounded-[2rem] border border-black/10 bg-white/70 p-2 text-slate-900 shadow-[0_24px_64px_-30px_rgba(15,23,42,0.45)] backdrop-blur-2xl lg:w-60 lg:p-3">
        <ol className="grid grid-cols-4 gap-1 lg:flex lg:flex-col lg:gap-0">
          {homeSections.map((section, index) => {
            const isActive = section.id === activeSection
            const isComplete = index < activeSectionIndex

            return (
              <li
                key={section.id}
                className="flex flex-col items-center lg:items-start"
              >
                <a
                  aria-current={isActive ? "location" : undefined}
                  className={cn(
                    "group flex w-full min-w-0 flex-col items-center gap-2 rounded-[1.35rem] px-2 py-2.5 text-center transition-colors duration-200 lg:flex-row lg:justify-start lg:gap-3 lg:px-3",
                    isActive
                      ? "bg-black/5 text-slate-950"
                      : "text-slate-500 hover:bg-black/4 hover:text-slate-900"
                  )}
                  href={`#${section.id}`}
                >
                  <span
                    className={cn(
                      "relative flex size-7 shrink-0 items-center justify-center rounded-full border transition-all duration-200 lg:size-8",
                      isActive
                        ? "border-black/15 bg-white shadow-[0_10px_24px_-16px_rgba(15,23,42,0.9)]"
                        : isComplete
                          ? "border-emerald-300/70 bg-emerald-50"
                          : "border-black/10 bg-white/45"
                    )}
                  >
                    <span
                      className={cn(
                        "rounded-full transition-all duration-300",
                        isActive
                          ? "size-3 bg-[linear-gradient(135deg,#eab308,#27ffc3)] lg:size-3.5"
                          : isComplete
                            ? "size-2.5 bg-[#27ffc3]"
                            : "size-2.5 bg-black/20"
                      )}
                    />
                  </span>

                  <span className="text-[0.7rem] leading-tight font-medium text-current sm:text-xs lg:text-sm">
                    {section.label}
                  </span>
                </a>

                {index < homeSections.length - 1 ? (
                  <div className="hidden w-full py-1 lg:flex lg:justify-start">
                    <span
                      aria-hidden="true"
                      className="ml-4 h-7 w-px rounded-full bg-black/10"
                    >
                      <span
                        className={cn(
                          "block w-px rounded-full bg-[linear-gradient(180deg,#eab308,#27ffc3)] transition-[height] duration-300",
                          isComplete ? "h-full" : "h-0"
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
