import { useTranslation } from "react-i18next"

import Grainient from "~/components/Grainient"
import RotatingGreeting from "~/components/RotatingGreeting"
import { resolveAppLanguage } from "~/i18n/settings"
import { useThemeMode } from "~/lib/useThemeMode"

import { getHomeGradientPalette, heroGreetings } from "./home-content"
import HeroWavePlaceholder from "./HeroWavePlaceholder"
import HomeHeroToolbar from "./HomeHeroToolbar"
import SiteBrandMark from "./SiteBrandMark"

export default function HomeHeroSection() {
  const { i18n, t } = useTranslation("common", { keyPrefix: "hero" })
  const { themeMode } = useThemeMode()
  const palette = getHomeGradientPalette(themeMode)
  const activeLanguage = resolveAppLanguage(
    i18n.resolvedLanguage ?? i18n.language
  )

  return (
    <div className="relative bg-transparent">
      <SiteBrandMark className="pointer-events-none absolute top-8 left-8 z-40 hidden lg:flex" />

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
        className="relative mx-auto min-h-screen max-w-7xl scroll-mt-6 overflow-hidden px-6 sm:px-12 xl:pr-28 xl:pl-44"
      >
        <HomeHeroToolbar />

        <div className="relative z-10 flex min-h-screen flex-col justify-center gap-6 pt-28 pb-[45vh] sm:pb-[46vh] lg:py-20">
          <div
            className="flex max-w-5xl flex-col gap-4 lg:max-w-[62%]"
            lang={activeLanguage}
          >
            <h2 className="text-4xl font-light text-black/75 sm:text-5xl lg:text-6xl dark:text-white/70">
              <RotatingGreeting greetings={heroGreetings} />
            </h2>
            <h1 className="font-heading text-6xl font-medium tracking-[-0.055em] text-slate-950 sm:text-7xl lg:text-8xl dark:text-white">
              {t("title")}
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-black/60 sm:text-xl dark:text-white/70">
              {t("description")}
            </p>
          </div>
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-0 mx-auto h-[56vh] max-h-152 w-[102%] text-slate-950/38 sm:h-[60vh] sm:max-h-176 sm:w-[82%] lg:-right-16 lg:left-auto lg:mx-0 lg:h-[82%] lg:max-h-none lg:w-[46%] xl:-right-28 xl:w-[48%] dark:text-white/42">
          <HeroWavePlaceholder />
        </div>
      </section>
    </div>
  )
}
