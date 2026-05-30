export const themeStorageKey = "portfolio-theme" as const
export const themeModeChangeEventName = "portfolio-theme-change" as const

export type ThemeMode = "light" | "dark"

export function isThemeMode(
  value: string | null | undefined
): value is ThemeMode {
  return value === "light" || value === "dark"
}

export function getSystemThemeMode(): ThemeMode {
  if (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    return "dark"
  }

  return "light"
}

export function resolveInitialThemeMode(): ThemeMode {
  if (typeof window === "undefined") {
    return "light"
  }

  const storedThemeMode = window.localStorage.getItem(themeStorageKey)

  return isThemeMode(storedThemeMode) ? storedThemeMode : getSystemThemeMode()
}

export function applyThemeMode(themeMode: ThemeMode) {
  if (typeof document === "undefined") {
    return
  }

  document.documentElement.classList.toggle("dark", themeMode === "dark")

  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent(themeModeChangeEventName, {
        detail: { themeMode },
      })
    )
  }
}

export function getCurrentThemeMode(): ThemeMode {
  if (typeof document !== "undefined") {
    return document.documentElement.classList.contains("dark")
      ? "dark"
      : "light"
  }

  return "light"
}

export function persistThemeMode(themeMode: ThemeMode) {
  if (typeof window === "undefined") {
    return
  }

  window.localStorage.setItem(themeStorageKey, themeMode)
}
