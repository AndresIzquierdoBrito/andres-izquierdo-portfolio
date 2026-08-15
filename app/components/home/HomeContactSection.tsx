import { Download, Mail, MessageCircle, Phone, Send } from "lucide-react"
import { useTranslation } from "react-i18next"

import { LinkedInIcon } from "~/components/icons"
import { useThemeMode } from "~/lib/useThemeMode"

import { getHomeGradientPalette } from "./home-content"
import SectionBadge from "./SectionBadge"

const contactChannels = [
  { id: "email", icon: Mail, href: "mailto:andres.izbri@gmail.com", external: true },
  { id: "phone", icon: Phone, href: "tel:+34616428219", external: false },
  { id: "linkedin", icon: LinkedInIcon, href: "https://www.linkedin.com/in/andres-izquierdo/", external: true },
] as const

export default function HomeContactSection() {
  const { themeMode } = useThemeMode()
  const { t } = useTranslation("common", { keyPrefix: "sections.contact" })
  const palette = getHomeGradientPalette(themeMode)

  const accentGradient =
    themeMode === "dark"
      ? "linear-gradient(135deg,#22d3ee,#818cf8)"
      : "linear-gradient(135deg,#27ffc3,#EAB308)"

  return (
    <section
      id="contact"
      className="relative z-10 -mt-8 scroll-mt-6 overflow-hidden rounded-t-[2.5rem] px-6 pt-14 pb-10 text-white shadow-[0_-32px_64px_-32px_rgba(2,6,23,0.5)] sm:-mt-12 sm:rounded-t-[3rem] sm:px-12 sm:pt-24 sm:pb-16 xl:pr-28 xl:pl-44"
      style={{ backgroundImage: palette.contact.backgroundBase }}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage: `radial-gradient(circle at top left, ${palette.contact.orbTopLeft}, transparent 22%), radial-gradient(circle at bottom right, ${palette.contact.orbBottomRight}, transparent 30%)`,
        }}
      />

      <div className="mx-auto flex max-w-6xl flex-col gap-10">
        <div className="flex flex-col gap-4">
          <SectionBadge icon={MessageCircle}>{t("eyebrow")}</SectionBadge>
          <h2 className="font-heading text-5xl font-light tracking-tight text-white sm:text-6xl">
            {t("title")}
          </h2>
          <p className="max-w-2xl text-base leading-8 text-white/70 sm:text-lg">
            {t("lead")}
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(18rem,0.95fr)] lg:items-stretch">
          <form
            onSubmit={(event) => event.preventDefault()}
            className="flex flex-col gap-5 rounded-[1.75rem] border border-white/12 bg-white/6 p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-sm sm:p-8"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="flex flex-col gap-2 text-sm">
                <span className="text-[0.65rem] font-semibold tracking-[0.24em] text-white/45 uppercase">
                  {t("form.name")}
                </span>
                <input
                  type="text"
                  name="name"
                  placeholder={t("form.namePlaceholder")}
                  className="rounded-2xl border border-white/14 bg-white/6 px-4 py-3 text-sm text-white placeholder:text-white/35 outline-none transition-colors focus:border-white/35 focus:bg-white/10"
                />
              </label>
              <label className="flex flex-col gap-2 text-sm">
                <span className="text-[0.65rem] font-semibold tracking-[0.24em] text-white/45 uppercase">
                  {t("form.email")}
                </span>
                <input
                  type="email"
                  name="email"
                  placeholder={t("form.emailPlaceholder")}
                  className="rounded-2xl border border-white/14 bg-white/6 px-4 py-3 text-sm text-white placeholder:text-white/35 outline-none transition-colors focus:border-white/35 focus:bg-white/10"
                />
              </label>
            </div>

            <label className="flex flex-1 flex-col gap-2 text-sm">
              <span className="text-[0.65rem] font-semibold tracking-[0.24em] text-white/45 uppercase">
                {t("form.message")}
              </span>
              <textarea
                name="message"
                rows={5}
                placeholder={t("form.messagePlaceholder")}
                className="flex-1 resize-none rounded-2xl border border-white/14 bg-white/6 px-4 py-3 text-sm text-white placeholder:text-white/35 outline-none transition-colors focus:border-white/35 focus:bg-white/10"
              />
            </label>

            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 self-start rounded-full px-7 py-3 text-sm font-semibold text-slate-900 transition-all duration-200 hover:-translate-y-px hover:brightness-[1.06] hover:shadow-lg dark:text-white"
              style={{ background: accentGradient }}
            >
              <Send className="size-4" />
              {t("form.submit")}
            </button>
          </form>

          <div className="grid gap-4">
            {contactChannels.map((channel) => {
              const Icon = channel.icon

              return (
                <a
                  key={channel.id}
                  href={channel.href}
                  {...(channel.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="group flex items-center gap-4 rounded-[1.75rem] border border-white/12 bg-white/6 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-sm transition-all duration-200 hover:-translate-y-px hover:border-white/24 hover:bg-white/10"
                >
                  <span
                    className="flex size-14 shrink-0 items-center justify-center rounded-2xl text-slate-900 shadow-sm transition-transform duration-200 group-hover:scale-105 dark:text-white"
                    style={{ background: accentGradient }}
                  >
                    <Icon className="size-6" />
                  </span>
                  <span className="flex flex-col">
                    <span className="text-lg font-semibold tracking-tight text-white">
                      {t(`channels.${channel.id}.label`)}
                    </span>
                    <span className="text-sm text-white/55">
                      {t(`channels.${channel.id}.value`)}
                    </span>
                  </span>
                </a>
              )
            })}
          </div>
        </div>

        <div className="flex flex-col items-center gap-6 border-t border-white/10 pt-8">
          <a
            href="/cv.pdf"
            download
            className="inline-flex items-center gap-2.5 rounded-full px-8 py-3.5 text-sm font-semibold text-slate-900 transition-all duration-200 hover:-translate-y-px hover:brightness-[1.06] hover:shadow-lg dark:text-white"
            style={{ background: accentGradient }}
          >
            <Download className="size-4" />
            {t("downloadCv")}
          </a>
          <p className="text-center text-xs text-white/40">
            {t("footer", { year: new Date().getFullYear() })}
          </p>
        </div>
      </div>
    </section>
  )
}
