import { useEffect, type ReactNode } from "react"
import { I18nextProvider, useTranslation } from "react-i18next"

import { i18n } from "~/i18n"
import { applyInitialLanguage } from "~/i18n/language"
import { resolveAppLanguage } from "~/i18n/settings"

function I18nEffects() {
  const { i18n } = useTranslation()
  const activeLanguage = resolveAppLanguage(
    i18n.resolvedLanguage ?? i18n.language
  )

  useEffect(() => {
    document.documentElement.lang = activeLanguage
  }, [activeLanguage])

  useEffect(() => {
    const abortController = new AbortController()

    void applyInitialLanguage(i18n, abortController.signal).catch(
      (error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") {
          return
        }

        console.error("Failed to resolve the initial app language.", error)
      }
    )

    return () => abortController.abort()
  }, [i18n])

  return null
}

export default function AppI18nProvider({ children }: { children: ReactNode }) {
  return (
    <I18nextProvider i18n={i18n}>
      <I18nEffects />
      {children}
    </I18nextProvider>
  )
}
