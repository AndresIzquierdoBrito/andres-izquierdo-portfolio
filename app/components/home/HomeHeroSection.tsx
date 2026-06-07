import { useTranslation } from "react-i18next"

import Grainient from "~/components/Grainient"
import RotatingGreeting from "~/components/RotatingGreeting"
import { resolveAppLanguage } from "~/i18n/settings"
import { useThemeMode } from "~/lib/useThemeMode"

import { getHomeGradientPalette, heroGreetings } from "./home-content"
import HomeHeroToolbar from "./HomeHeroToolbar"

export default function HomeHeroSection() {
  const { i18n, t } = useTranslation("common", { keyPrefix: "hero" })
  const { themeMode } = useThemeMode()
  const palette = getHomeGradientPalette(themeMode)
  const activeLanguage = resolveAppLanguage(
    i18n.resolvedLanguage ?? i18n.language
  )

  return (
    <div className="relative bg-transparent">
      <div className="absolute inset-0 -z-10 h-[calc(100vh+10rem)] md:h-[calc(100vh+12rem)] lg:h-[calc(100vh+16rem)]">
        <Grainient
          color1={palette.hero.color1}
          color2={palette.hero.color2}
          color3={palette.hero.color3}
          timeSpeed={0.25}
          colorBalance={0}
          warpStrength={1}
          warpFrequency={5}
          warpSpeed={2}
          warpAmplitude={50}
          blendAngle={0}
          blendSoftness={0.05}
          rotationAmount={500}
          noiseScale={2}
          grainAmount={0.1}
          grainScale={2}
          grainAnimated={false}
          contrast={1.5}
          gamma={1}
          saturation={1}
          centerX={0}
          centerY={0}
          zoom={0.9}
        />
      </div>

      <section
        id="home"
        className="relative mx-auto min-h-screen max-w-7xl scroll-mt-6 px-6 sm:px-12 lg:pr-28 lg:pl-44"
      >
        <HomeHeroToolbar />

        <div className="flex min-h-screen flex-col justify-center gap-6 py-20">
          <div className="flex max-w-5xl flex-col gap-4" lang={activeLanguage}>
            <h2 className="text-4xl font-light text-black/75 sm:text-5xl lg:text-6xl dark:text-white/70">
              <RotatingGreeting greetings={heroGreetings} />
            </h2>
            <h1
              className="font-heading text-6xl font-normal tracking-tight text-slate-950 sm:text-7xl lg:text-8xl dark:text-white"
              style={{ fontFamily: "Kinetic, sans-serif" }}
            >
              {t("title")}
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-black/60 sm:text-xl dark:text-white/70">
              {t("description")}
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
