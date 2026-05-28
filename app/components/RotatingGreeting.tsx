import { useEffect, useMemo, useState } from "react"

const DEFAULT_GREETINGS = [
  "Hey there!",
  "Hola!",
  "Bonjour!",
  "Ciao!",
  "Hallo!",
  "Ola!",
  "Hej!",
  "Konnichiwa!",
]

type RotatingGreetingProps = {
  className?: string
  greetings?: string[]
  intervalMs?: number
  animationMs?: number
}

export default function RotatingGreeting({
  className = "",
  greetings = DEFAULT_GREETINGS,
  intervalMs = 4000,
  animationMs = 650,
}: RotatingGreetingProps) {
  const items = greetings.length > 0 ? greetings : DEFAULT_GREETINGS
  const greetingsKey = items.join("\u0000")
  const [currentIndex, setCurrentIndex] = useState(0)
  const [nextIndex, setNextIndex] = useState<number | null>(null)
  const [phase, setPhase] = useState<"idle" | "prepare" | "animate">("idle")

  const widestGreeting = useMemo(
    () =>
      items.reduce(
        (widest, greeting) =>
          greeting.length > widest.length ? greeting : widest,
        items[0]
      ),
    [items]
  )

  useEffect(() => {
    setCurrentIndex(0)
    setNextIndex(null)
    setPhase("idle")
  }, [greetingsKey])

  useEffect(() => {
    if (items.length < 2 || phase !== "idle") {
      return
    }

    const timer = window.setTimeout(() => {
      setNextIndex((currentIndex + 1) % items.length)
      setPhase("prepare")
    }, intervalMs)

    return () => window.clearTimeout(timer)
  }, [currentIndex, intervalMs, items.length, phase])

  useEffect(() => {
    if (phase !== "prepare" || nextIndex === null) {
      return
    }

    const frame = window.requestAnimationFrame(() => {
      setPhase("animate")
    })

    return () => window.cancelAnimationFrame(frame)
  }, [nextIndex, phase])

  useEffect(() => {
    if (phase !== "animate" || nextIndex === null) {
      return
    }

    const timer = window.setTimeout(() => {
      setCurrentIndex(nextIndex)
      setNextIndex(null)
      setPhase("idle")
    }, animationMs)

    return () => window.clearTimeout(timer)
  }, [animationMs, nextIndex, phase])

  const isAnimating = nextIndex !== null && phase !== "idle"
  const transitionStyle = {
    transitionDuration: `${animationMs}ms`,
    transitionProperty: "transform, opacity, filter",
    transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
  } as const

  const currentStyle =
    phase === "animate"
      ? {
          transform: "translateY(-115%) scale(0.985)",
          opacity: 0,
          filter: "blur(6px)",
        }
      : {
          transform: "translateY(0%) scale(1)",
          opacity: 1,
          filter: "blur(0px)",
        }

  const nextStyle =
    phase === "animate"
      ? {
          transform: "translateY(0%) scale(1)",
          opacity: 1,
          filter: "blur(0px)",
        }
      : {
          transform: "translateY(115%) scale(1.02)",
          opacity: 0,
          filter: "blur(6px)",
        }

  return (
    <span
      className={`relative inline-grid overflow-hidden align-baseline ${className}`.trim()}
      style={{ minWidth: `${widestGreeting.length}ch` }}
    >
      <span className="invisible col-start-1 row-start-1">
        {widestGreeting}
      </span>
      <span className="sr-only" aria-live="polite">
        {items[currentIndex]}
      </span>
      <span
        className="relative col-start-1 row-start-1 block h-[1.1em] overflow-hidden"
        aria-hidden="true"
      >
        <span
          className="block will-change-transform"
          style={
            isAnimating ? { ...transitionStyle, ...currentStyle } : undefined
          }
        >
          <span className="block h-[1.1em]">{items[currentIndex]}</span>
        </span>

        {nextIndex !== null ? (
          <span
            className="absolute inset-0 block will-change-transform"
            style={{ ...transitionStyle, ...nextStyle }}
          >
            <span className="block h-[1.1em]">{items[nextIndex]}</span>
          </span>
        ) : null}
      </span>
    </span>
  )
}
