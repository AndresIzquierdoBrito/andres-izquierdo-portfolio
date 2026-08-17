import i18n from "i18next"
import { initReactI18next } from "react-i18next"

import { resources } from "~/i18n/resources"
import {
  defaultNamespace,
  fallbackLanguage,
  supportedLanguages,
} from "~/i18n/settings"

if (!i18n.isInitialized) {
  void i18n.use(initReactI18next).init({
    resources,
    defaultNS: defaultNamespace,
    fallbackLng: fallbackLanguage,
    lng: fallbackLanguage,
    ns: [defaultNamespace],
    supportedLngs: supportedLanguages,
    interpolation: {
      escapeValue: false,
    },
    returnNull: false,
  })
} else {
  for (const language of supportedLanguages) {
    i18n.addResourceBundle(
      language,
      defaultNamespace,
      resources[language][defaultNamespace],
      true,
      true
    )
  }
}

export { i18n }
