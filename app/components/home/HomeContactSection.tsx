import { type FormEvent, useLayoutEffect, useRef, useState } from "react"

import gsap from "gsap"
import { ArrowUpRight, Download } from "lucide-react"
import { useTranslation } from "react-i18next"

import { useThemeMode } from "~/lib/useThemeMode"

import { getHomeGradientPalette } from "./home-content"
import SectionBadge from "./SectionBadge"
import SiteBrandMark from "./SiteBrandMark"

const contactChannels = [
  { id: "phone", href: "tel:+34616428219", external: false },
  {
    id: "linkedin",
    href: "https://www.linkedin.com/in/andres-izquierdo/",
    external: true,
  },
] as const

type FormStatus = "idle" | "submitting" | "success" | "error"

const contactEmail = "andres.izbri@gmail.com"
const contactEndpoint = `https://formsubmit.co/ajax/${contactEmail}`

export default function HomeContactSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [formStatus, setFormStatus] = useState<FormStatus>("idle")
  const { themeMode } = useThemeMode()
  const { t } = useTranslation("common", { keyPrefix: "sections.contact" })
  const palette = getHomeGradientPalette(themeMode)

  useLayoutEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const elements = section.querySelectorAll<HTMLElement>(
      "[data-contact-reveal]"
    )
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches

    if (reduceMotion) return

    gsap.set(elements, { autoAlpha: 0, y: 28 })

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return

        gsap.to(elements, {
          autoAlpha: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
        })
        observer.disconnect()
      },
      { threshold: 0.2 }
    )

    observer.observe(section)

    return () => {
      observer.disconnect()
      gsap.killTweensOf(elements)
    }
  }, [])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    const formData = new FormData(form)

    setFormStatus("submitting")

    try {
      const response = await fetch(contactEndpoint, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          message: formData.get("message"),
          _subject: "New portfolio message",
          _template: "table",
          _honey: formData.get("_honey"),
        }),
      })

      if (!response.ok) {
        throw new Error("Contact form request failed")
      }

      form.reset()
      setFormStatus("success")
    } catch {
      setFormStatus("error")
    }
  }

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative z-10 -mt-8 scroll-mt-6 overflow-hidden rounded-t-[2.5rem] px-6 pt-14 pb-28 text-white sm:-mt-12 sm:rounded-t-[3rem] sm:px-12 sm:pt-20 sm:pb-32 xl:pr-28 xl:pl-44"
      style={{ background: palette.contact.backgroundBase }}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 opacity-70"
        style={{
          backgroundImage: `radial-gradient(circle at 8% 8%, ${palette.contact.orbTopLeft}, transparent 30%), radial-gradient(circle at 92% 88%, ${palette.contact.orbBottomRight}, transparent 34%)`,
        }}
      />

      <div className="mx-auto flex max-w-7xl flex-col">
        <div
          data-contact-reveal
          className="flex flex-wrap items-center justify-between gap-4"
        >
          <SectionBadge className="text-white dark:text-white">
            {t("eyebrow")}
          </SectionBadge>

          <p className="flex items-center gap-2.5 font-heading text-[0.68rem] font-medium tracking-[0.17em] text-white/58 uppercase">
            <span className="contact-status-dot size-2 rounded-full bg-emerald-300" />
            {t("status")}
          </p>
        </div>

        <div className="grid gap-10 pt-12 pb-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(22rem,0.9fr)] lg:items-start lg:gap-16 lg:pt-18 lg:pb-16">
          <h2
            data-contact-reveal
            className="max-w-4xl font-heading text-5xl leading-[0.96] font-light tracking-[-0.04em] text-white sm:text-7xl lg:text-[5.5rem]"
          >
            {t("title")}
          </h2>
          <form
            data-contact-reveal
            className="flex flex-col gap-5 lg:pt-1"
            onSubmit={handleSubmit}
          >
            <input
              type="text"
              name="_honey"
              className="hidden"
              tabIndex={-1}
              autoComplete="off"
            />

            <div className="grid gap-5 sm:grid-cols-2">
              <label className="flex flex-col gap-2 font-heading text-[0.68rem] font-medium tracking-[0.12em] text-white/55 uppercase">
                {t("form.name")}
                <input
                  required
                  name="name"
                  autoComplete="name"
                  placeholder={t("form.namePlaceholder")}
                  className="h-11 border-b border-white/30 bg-transparent font-sans text-base tracking-normal text-white normal-case transition-colors outline-none placeholder:text-white/32 focus:border-emerald-300"
                />
              </label>

              <label className="flex flex-col gap-2 font-heading text-[0.68rem] font-medium tracking-[0.12em] text-white/55 uppercase">
                {t("form.email")}
                <input
                  required
                  type="email"
                  name="email"
                  autoComplete="email"
                  placeholder={t("form.emailPlaceholder")}
                  className="h-11 border-b border-white/30 bg-transparent font-sans text-base tracking-normal text-white normal-case transition-colors outline-none placeholder:text-white/32 focus:border-emerald-300"
                />
              </label>
            </div>

            <label className="flex flex-col gap-2 font-heading text-[0.68rem] font-medium tracking-[0.12em] text-white/55 uppercase">
              {t("form.message")}
              <textarea
                required
                name="message"
                rows={3}
                placeholder={t("form.messagePlaceholder")}
                className="min-h-24 resize-y border-b border-white/30 bg-transparent py-2 font-sans text-base leading-6 tracking-normal text-white normal-case transition-colors outline-none placeholder:text-white/32 focus:border-emerald-300"
              />
            </label>

            <div className="flex flex-wrap items-center gap-4">
              <button
                type="submit"
                disabled={formStatus === "submitting"}
                className="inline-flex h-11 items-center justify-center rounded-full bg-white px-6 text-sm font-medium text-slate-950 transition-transform hover:-translate-y-0.5 disabled:cursor-wait disabled:opacity-60"
              >
                {formStatus === "submitting"
                  ? t("form.submitting")
                  : t("form.submit")}
              </button>

              {formStatus === "success" || formStatus === "error" ? (
                <p
                  role="status"
                  className={
                    formStatus === "success"
                      ? "text-sm text-emerald-200"
                      : "text-sm text-rose-200"
                  }
                >
                  {t(`form.${formStatus}`)}
                </p>
              ) : null}
            </div>
          </form>
        </div>

        <a
          data-contact-reveal
          href={`mailto:${contactEmail}?subject=Portfolio%20enquiry`}
          aria-label={`Email ${contactEmail}`}
          className="contact-signal-line group flex items-center justify-between gap-5 border-y border-white/18 py-7 sm:py-9"
        >
          <span className="text-[clamp(1.65rem,5.2vw,4.8rem)] leading-none font-medium tracking-[-0.045em] break-all text-white">
            andres.izbri@gmail.com
          </span>
          <span className="flex size-12 shrink-0 items-center justify-center rounded-full border border-white/24 transition-transform duration-300 group-hover:rotate-12 group-hover:bg-white group-hover:text-slate-950 sm:size-16">
            <ArrowUpRight className="size-5 sm:size-7" />
          </span>
        </a>

        <div
          data-contact-reveal
          className="flex flex-col gap-6 pt-8 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-10 sm:gap-y-5"
        >
          {contactChannels.map((channel) => (
            <a
              key={channel.id}
              href={channel.href}
              {...(channel.external
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
              className="group inline-flex items-center gap-2 text-sm font-medium text-white/66 transition-colors hover:text-white"
            >
              {t(`channels.${channel.id}.label`)}
              <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          ))}

          <a
            href="/cv.pdf"
            download
            className="group inline-flex items-center gap-2 text-sm font-medium text-white/66 transition-colors hover:text-white"
          >
            <Download className="size-3.5" />
            {t("downloadCv")}
          </a>

          <SiteBrandMark
            inverted
            compact
            showCopyright
            className="pt-3 sm:ml-auto sm:items-end sm:pt-0"
          />
        </div>
      </div>
    </section>
  )
}
