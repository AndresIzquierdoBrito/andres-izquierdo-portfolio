export const supportedLanguages = ["en", "es"] as const

export const fallbackLanguage = "en" as const
export const defaultNamespace = "common" as const
export const languageStorageKey = "portfolio-language" as const

export type AppLanguage = (typeof supportedLanguages)[number]

export const languageOptions = [
  { value: "en", label: "EN", description: "English" },
  { value: "es", label: "ES", description: "Español" },
] as const satisfies readonly {
  value: AppLanguage
  label: string
  description: string
}[]

export function isAppLanguage(
  value: string | null | undefined
): value is AppLanguage {
  return supportedLanguages.includes(value as AppLanguage)
}

export function resolveAppLanguage(
  value: string | null | undefined
): AppLanguage {
  return isAppLanguage(value) ? value : fallbackLanguage
}
