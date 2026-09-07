import { useEffect } from "react"
import { Download, MoonStar, Sun } from "lucide-react"
import { useTranslation } from "react-i18next"
import { useLocation, useNavigate } from "react-router"

import { Button } from "~/components/ui/button"
import { persistLanguagePreference } from "~/i18n/language"
import { languageOptions, resolveAppLanguage } from "~/i18n/settings"
import {
  applyThemeMode,
  getCurrentThemeMode,
  persistThemeMode,
  resolveInitialThemeMode,
  type ThemeMode,
} from "~/lib/theme"
import { cn } from "~/lib/utils"

function CvButton({ label, className }: { label: string; className?: string }) {
  return (
    <a
      href="/cv.pdf"
      download
      className={cn(
        "inline-flex h-12 items-center gap-2 rounded-full border border-black/10 bg-white/55 px-4 text-xs font-semibold tracking-[0.18em] whitespace-nowrap text-slate-900 uppercase shadow-[0_18px_60px_rgba(15,23,42,0.08)] backdrop-blur-md transition-colors duration-200 hover:bg-white/80 sm:px-5 lg:h-10 lg:px-4 dark:border-white/15 dark:bg-slate-900/45 dark:text-white dark:hover:bg-slate-900/70",
        className
      )}
    >
      <Download className="size-3.5" />
      {label}
    </a>
  )
}

export default function HomeHeroToolbar() {
  const { i18n, t } = useTranslation("common", { keyPrefix: "hero.toolbar" })
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const initialThemeMode = resolveInitialThemeMode()

    applyThemeMode(initialThemeMode)
  }, [])

  const activeLanguage = resolveAppLanguage(
    i18n.resolvedLanguage ?? i18n.language
  )

  const cvLabel = t("downloadCv")

  return (
    <div className="fixed top-6 right-6 z-50 flex justify-end sm:top-8 sm:right-12 xl:right-16">
      <div className="flex flex-wrap items-center justify-end gap-2">
        <CvButton label={cvLabel} />

        <div
          className="inline-flex h-12 items-center gap-1 rounded-full border border-black/10 bg-white/55 p-1 shadow-[0_18px_60px_rgba(15,23,42,0.08)] backdrop-blur-md lg:h-10 dark:border-white/15 dark:bg-slate-900/45"
          role="group"
          aria-label={t("languageHint")}
        >
          {languageOptions.map((option) => {
            const isActive = option.value === activeLanguage

            return (
              <button
                key={option.value}
                type="button"
                className={cn(
                  "h-10 rounded-full px-4 text-xs font-semibold tracking-[0.28em] uppercase transition-colors duration-200 sm:px-5 lg:h-8 lg:px-3 lg:text-[0.68rem]",
                  isActive
                    ? "bg-slate-950 text-white dark:bg-white dark:text-slate-950"
                    : "text-black/55 hover:text-black dark:text-white/65 dark:hover:text-white"
                )}
                aria-pressed={isActive}
                aria-label={option.description}
                onClick={() => {
                  if (isActive) {
                    return
                  }

                  persistLanguagePreference(option.value)
                  navigate(
                    {
                      pathname: `/${option.value}`,
                      search: location.search,
                      hash: location.hash,
                    },
                    { replace: true, preventScrollReset: true }
                  )
                }}
              >
                {option.label}
              </button>
            )
          })}
        </div>

        <Button
          type="button"
          size="icon"
          variant="outline"
          className="size-12 rounded-full border-black/10 bg-white/55 text-slate-900 shadow-[0_18px_60px_rgba(15,23,42,0.08)] backdrop-blur-md hover:bg-white/70 lg:size-10 dark:border-white/15 dark:bg-slate-900/45 dark:text-white dark:hover:bg-slate-900/70"
          aria-label={t("themeHint")}
          title={t("themeHint")}
          onClick={() => {
            const nextThemeMode: ThemeMode =
              getCurrentThemeMode() === "dark" ? "light" : "dark"

            applyThemeMode(nextThemeMode)
            persistThemeMode(nextThemeMode)
          }}
        >
          <MoonStar className="size-4 sm:size-5 lg:size-4 dark:hidden" />
          <Sun className="hidden size-4 sm:size-5 lg:size-4 dark:block" />
        </Button>
      </div>
    </div>
  )
}
