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
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

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
    if (items.length < 2) {
      return
    }

    const startDelay = Math.max(intervalMs - animationMs, 0)
    const timer = window.setTimeout(() => {
      setIsAnimating(true)
    }, startDelay)

    return () => window.clearTimeout(timer)
  }, [animationMs, currentIndex, intervalMs, items.length])

  useEffect(() => {
    if (!isAnimating) {
      return
    }

    const timer = window.setTimeout(() => {
      setCurrentIndex((currentIndex + 1) % items.length)
      setIsAnimating(false)
    }, animationMs)

    return () => window.clearTimeout(timer)
  }, [animationMs, currentIndex, isAnimating, items.length])

  const upcomingGreeting = items[(currentIndex + 1) % items.length]

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
        className="col-start-1 row-start-1 block h-[1.1em] overflow-hidden"
        aria-hidden="true"
      >
        <span
          className="block will-change-transform"
          style={{
            transform: isAnimating ? "translateY(0%)" : "translateY(-50%)",
            transitionDuration: `${animationMs}ms`,
            transitionProperty: "transform",
            transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        >
          <span className="block h-[1.1em]">{upcomingGreeting}</span>
          <span className="block h-[1.1em]">{items[currentIndex]}</span>
        </span>
      </span>
    </span>
  )
}
