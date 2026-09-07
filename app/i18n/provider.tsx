import { useEffect, useMemo, type ReactNode } from "react"
import { I18nextProvider } from "react-i18next"

import { createAppI18n } from "~/i18n"
import { persistLanguagePreference } from "~/i18n/language"
import type { AppLanguage } from "~/i18n/settings"

function I18nEffects({ language }: { language: AppLanguage }) {
  useEffect(() => {
    document.documentElement.lang = language
    persistLanguagePreference(language)
  }, [language])

  return null
}

export default function AppI18nProvider({
  children,
  language,
}: {
  children: ReactNode
  language: AppLanguage
}) {
  const appI18n = useMemo(() => createAppI18n(language), [language])

  return (
    <I18nextProvider i18n={appI18n}>
      <I18nEffects language={language} />
      {children}
    </I18nextProvider>
  )
}
