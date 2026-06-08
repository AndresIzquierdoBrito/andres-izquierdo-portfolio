import { useEffect, useState } from "react"
import { MoonStar, Sun } from "lucide-react"
import { useTranslation } from "react-i18next"

import { Button } from "~/components/ui/button"
import { changeAppLanguage } from "~/i18n/language"
import { languageOptions, resolveAppLanguage } from "~/i18n/settings"
import {
  applyThemeMode,
  persistThemeMode,
  resolveInitialThemeMode,
  type ThemeMode,
} from "~/lib/theme"
import { cn } from "~/lib/utils"

export default function HomeHeroToolbar() {
  const { i18n, t } = useTranslation("common", { keyPrefix: "hero.toolbar" })
  const [themeMode, setThemeMode] = useState<ThemeMode>("light")

  useEffect(() => {
    const initialThemeMode = resolveInitialThemeMode()

    setThemeMode(initialThemeMode)
    applyThemeMode(initialThemeMode)
  }, [])

  const activeLanguage = resolveAppLanguage(
    i18n.resolvedLanguage ?? i18n.language
  )

  const isDarkMode = themeMode === "dark"
  const ThemeIcon = isDarkMode ? Sun : MoonStar

  return (
    <div className="absolute top-6 right-6 z-10 flex flex-wrap items-center justify-end gap-2 sm:top-8 sm:right-12 lg:right-28">
      <div
        className="inline-flex items-center gap-1 rounded-full border border-black/10 bg-white/55 p-1 shadow-[0_18px_60px_rgba(15,23,42,0.08)] backdrop-blur-md dark:border-white/15 dark:bg-slate-900/45"
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
                "rounded-full px-3 py-1.5 text-[0.68rem] font-semibold tracking-[0.28em] uppercase transition-colors duration-200",
                isActive
                  ? "bg-slate-950 text-white dark:bg-white dark:text-slate-950"
                  : "text-black/55 hover:text-black dark:text-white/65 dark:hover:text-white"
              )}
              aria-pressed={isActive}
              aria-label={option.description}
              onClick={() => {
                void changeAppLanguage(i18n, option.value)
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
        className="rounded-full border-black/10 bg-white/55 text-slate-900 shadow-[0_18px_60px_rgba(15,23,42,0.08)] backdrop-blur-md hover:bg-white/70 dark:border-white/15 dark:bg-slate-900/45 dark:text-white dark:hover:bg-slate-900/70"
        aria-label={t("themeHint")}
        title={t("themeHint")}
        onClick={() => {
          const nextThemeMode: ThemeMode = isDarkMode ? "light" : "dark"

          setThemeMode(nextThemeMode)
          applyThemeMode(nextThemeMode)
          persistThemeMode(nextThemeMode)
        }}
      >
        <ThemeIcon className="size-4" />
      </Button>
    </div>
  )
}
