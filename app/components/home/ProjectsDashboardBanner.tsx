import { ArrowUpRight } from "lucide-react"
import { useTranslation } from "react-i18next"

const uptimeBars = [
  72, 88, 80, 94, 84, 91, 76, 97, 87, 82, 93, 79, 89, 84, 96, 81, 90, 86,
] as const

export default function ProjectsDashboardBanner() {
  const { t } = useTranslation("common", {
    keyPrefix: "sections.projectDashboard",
  })

  return (
    <section className="relative z-1 overflow-hidden">
      <a
        href="https://projects.izbri.com"
        target="_blank"
        rel="noopener noreferrer"
        className="group relative block w-full border-y border-[#071127]/20 bg-[#caff4a] text-[#071127] transition-colors duration-300 hover:bg-[#d7ff73] dark:border-white/18 dark:bg-[#86f7ca] dark:text-[#071127] dark:hover:bg-[#a2ffdb]"
        aria-label={`${t("cta")} — projects.izbri.com`}
      >
        <div className="mx-auto grid max-w-7xl lg:grid-cols-[minmax(0,1.15fr)_minmax(22rem,0.85fr)] xl:max-w-none xl:pr-28 xl:pl-72">
          <div className="relative flex flex-col justify-center gap-4 px-6 py-14 sm:px-12 sm:py-16 lg:py-20 lg:pr-14">
            <h2 className="max-w-3xl font-heading text-3xl leading-[1.05] font-medium tracking-[-0.04em] sm:text-4xl lg:text-5xl">
              {t("title")}
            </h2>

            <p className="max-w-2xl text-sm leading-6 text-[#24304c] sm:text-base">
              {t("description")}
            </p>

            <span className="inline-flex items-center gap-2 text-sm font-semibold">
              {t("cta")}
              <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
            </span>
          </div>

          <div className="relative hidden min-h-52 items-center gap-5 border-t border-[#071127]/20 px-6 py-14 sm:px-12 sm:py-16 lg:flex lg:border-t-0 lg:border-l lg:px-10 lg:py-20">
            <div className="flex min-w-0 flex-1 flex-col gap-5">
              <div className="flex items-center justify-between gap-3 font-mono text-[0.6rem] font-semibold tracking-[0.1em] uppercase">
                <span>{t("monitor")}</span>
                <span className="border border-[#071127]/25 bg-white/30 px-2.5 py-1">
                  projects.izbri.com
                </span>
              </div>

              <div className="grid grid-cols-[auto_minmax(0,1fr)] items-end gap-5">
                <div className="flex flex-col">
                  <strong className="font-mono text-2xl leading-none tracking-[-0.06em] sm:text-3xl">
                    99.98%
                  </strong>
                  <span className="mt-2 font-mono text-[0.55rem] font-semibold tracking-[0.09em] uppercase">
                    {t("metrics.uptime")}
                  </span>
                </div>

                <div
                  aria-hidden="true"
                  className="flex h-20 items-end gap-1 border-b-2 border-[#071127]/35 bg-[repeating-linear-gradient(to_top,transparent_0,transparent_19px,rgba(7,17,39,0.10)_20px)] pb-1 sm:gap-1.5"
                >
                  {uptimeBars.map((height, index) => (
                    <span
                      key={`${height}-${index}`}
                      className="uptime-bar min-w-1 flex-1 bg-[#071127]"
                      style={{
                        height: `${height}%`,
                        animationDelay: `${index * 45}ms`,
                      }}
                    />
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-[#071127]/20 pt-3 font-mono text-[0.58rem] tracking-[0.06em] uppercase">
                <span className="flex items-baseline justify-between gap-2">
                  {t("metrics.latency")}
                  <strong className="text-xs">118ms</strong>
                </span>
                <span className="flex items-baseline justify-between gap-2">
                  {t("metrics.deployments")}
                  <strong className="text-xs">24</strong>
                </span>
              </div>
            </div>

            <span className="flex size-12 shrink-0 items-center justify-center rounded-full border border-[#071127]/30 bg-[#071127] text-white transition-transform duration-300 group-hover:scale-105 group-hover:rotate-12">
              <ArrowUpRight className="size-5" />
            </span>
          </div>
        </div>
      </a>
    </section>
  )
}
