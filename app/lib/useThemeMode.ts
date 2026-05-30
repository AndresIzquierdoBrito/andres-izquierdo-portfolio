import { useEffect, useState } from "react"

import {
  getCurrentThemeMode,
  themeModeChangeEventName,
  type ThemeMode,
} from "~/lib/theme"

export function useThemeMode() {
  const [themeMode, setThemeMode] = useState<ThemeMode>(getCurrentThemeMode)

  useEffect(() => {
    setThemeMode(getCurrentThemeMode())

    const handleThemeModeChange = (event: Event) => {
      const customEvent = event as CustomEvent<{ themeMode?: ThemeMode }>

      if (customEvent.detail?.themeMode) {
        setThemeMode(customEvent.detail.themeMode)
        return
      }

      setThemeMode(getCurrentThemeMode())
    }

    window.addEventListener(themeModeChangeEventName, handleThemeModeChange)

    return () => {
      window.removeEventListener(
        themeModeChangeEventName,
        handleThemeModeChange
      )
    }
  }, [])

  return {
    themeMode,
    isDarkMode: themeMode === "dark",
  }
}
