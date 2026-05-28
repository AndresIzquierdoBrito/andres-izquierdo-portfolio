import type { i18n as I18nInstance } from "i18next"

import {
  fallbackLanguage,
  isAppLanguage,
  languageStorageKey,
  resolveAppLanguage,
  type AppLanguage,
} from "~/i18n/settings"

type IpApiLocationResponse = {
  country_code?: string
}

export function getStoredLanguagePreference(): AppLanguage | null {
  if (typeof window === "undefined") {
    return null
  }

  const storedLanguage = window.localStorage.getItem(languageStorageKey)

  return isAppLanguage(storedLanguage) ? storedLanguage : null
}

export function persistLanguagePreference(language: AppLanguage) {
  if (typeof window === "undefined") {
    return
  }

  window.localStorage.setItem(languageStorageKey, language)
}

export async function detectLanguageFromLocation(
  signal?: AbortSignal
): Promise<AppLanguage> {
  if (typeof window === "undefined") {
    return fallbackLanguage
  }

  try {
    const response = await window.fetch("https://ipapi.co/json/", {
      headers: {
        Accept: "application/json",
      },
      signal,
    })

    if (!response.ok) {
      return fallbackLanguage
    }

    const payload = (await response.json()) as IpApiLocationResponse

    return payload.country_code === "ES" ? "es" : fallbackLanguage
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw error
    }

    return fallbackLanguage
  }
}

export async function applyInitialLanguage(
  i18n: I18nInstance,
  signal?: AbortSignal
): Promise<AppLanguage> {
  const storedLanguage = getStoredLanguagePreference()

  if (storedLanguage) {
    if (
      resolveAppLanguage(i18n.resolvedLanguage ?? i18n.language) !==
      storedLanguage
    ) {
      await i18n.changeLanguage(storedLanguage)
    }

    return storedLanguage
  }

  const detectedLanguage = await detectLanguageFromLocation(signal)
  const latestStoredLanguage = getStoredLanguagePreference()
  const nextLanguage = latestStoredLanguage ?? detectedLanguage

  if (
    resolveAppLanguage(i18n.resolvedLanguage ?? i18n.language) !== nextLanguage
  ) {
    await i18n.changeLanguage(nextLanguage)
  }

  return nextLanguage
}

export async function changeAppLanguage(
  i18n: I18nInstance,
  language: AppLanguage
) {
  persistLanguagePreference(language)

  if (resolveAppLanguage(i18n.resolvedLanguage ?? i18n.language) === language) {
    return
  }

  await i18n.changeLanguage(language)
}
