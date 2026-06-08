import { useThemeMode } from "~/lib/useThemeMode"

import { contactCards, getHomeGradientPalette } from "./home-content"
import SectionBadge from "./SectionBadge"

export default function HomeContactSection() {
  const { themeMode } = useThemeMode()
  const palette = getHomeGradientPalette(themeMode)

  return (
    <section
      id="contact"
      className="relative scroll-mt-6 overflow-hidden px-6 pt-24 pb-28 text-white sm:px-12 lg:pr-28 lg:pl-44"
      style={{ backgroundColor: palette.contact.backgroundBase }}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage: `radial-gradient(circle at top left, ${palette.contact.orbTopLeft}, transparent 22%), radial-gradient(circle at bottom right, ${palette.contact.orbBottomRight}, transparent 30%)`,
        }}
      />

      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(19rem,0.95fr)] lg:items-start">
        <div className="flex flex-col gap-4">
          <SectionBadge>Contact</SectionBadge>
          <h2 className="font-heading text-5xl font-light tracking-tight text-white sm:text-6xl">
            Make the final step the easiest one.
          </h2>
          <p className="max-w-2xl text-base leading-8 text-white/70 sm:text-lg">
            This last section is ready for whatever contact flow you want
            visitors to hit after they scroll through the page.
          </p>
          <p className="max-w-2xl text-sm leading-7 text-white/50">
            Swap the placeholders on the right for real links once you decide
            which channels to expose publicly.
          </p>
        </div>

        <div className="grid gap-4">
          {contactCards.map((card) => (
            <article
              key={card.title}
              className="rounded-[1.75rem] border border-white/12 bg-white/6 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-sm"
            >
              <p className="text-[0.65rem] font-semibold tracking-[0.28em] text-white/40 uppercase">
                Channel
              </p>
              <h3 className="mt-4 text-xl font-semibold tracking-tight text-white">
                {card.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-white/70">
                {card.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
