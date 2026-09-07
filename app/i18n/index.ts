import { createInstance, type i18n as I18nInstance } from "i18next"
import { initReactI18next } from "react-i18next"

import { resources } from "~/i18n/resources"
import {
  defaultNamespace,
  fallbackLanguage,
  supportedLanguages,
  type AppLanguage,
} from "~/i18n/settings"

export function createAppI18n(
  language: AppLanguage = fallbackLanguage
): I18nInstance {
  const i18n = createInstance()

  void i18n.use(initReactI18next).init({
    resources,
    defaultNS: defaultNamespace,
    fallbackLng: fallbackLanguage,
    lng: language,
    ns: [defaultNamespace],
    supportedLngs: supportedLanguages,
    interpolation: {
      escapeValue: false,
    },
    returnNull: false,
    initAsync: false,
  })

  return i18n
}
