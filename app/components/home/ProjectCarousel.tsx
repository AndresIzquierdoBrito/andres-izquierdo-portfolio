import { useEffect, useLayoutEffect, useRef } from "react"

import gsap from "gsap"

import { useThemeMode } from "~/lib/useThemeMode"

import ProjectCard, { type ProjectCardData } from "./ProjectCard"

// Clone cards placed on each side so the carousel never needs to teleport a
// visible element: virtualCards = [...lastBUFFER, ...all, ...firstBUFFER].
// When the virtual centre reaches the boundary of the real zone, we do an
// invisible snap (gsap.set) back to the equivalent real-zone position — the
// visible cards are pixel-identical before and after so the user can't tell.
const BUFFER = 3

type ProjectCarouselProps = {
  cards: readonly ProjectCardData[]
  activeIndex: number
  onNavigate?: (direction: 1 | -1) => void
}

type CardSlotMetrics = {
  nearX: number
  farX: number
  offscreenX: number
  nearScale: number
  farScale: number
  nearY: number
  farY: number
}

type CardSlotState = {
  x: number
  y: number
  scale: number
  opacity: number
  zIndex: number
  blur: number
  overlayOpacity: number
}

function getCardMetrics(stageWidth: number): CardSlotMetrics {
  if (stageWidth >= 1280) {
    return {
      nearX: stageWidth * 0.26,
      farX: stageWidth * 0.48,
      offscreenX: stageWidth * 0.6,
      nearScale: 0.87,
      farScale: 0.73,
      nearY: 16,
      farY: 38,
    }
  }

  if (stageWidth >= 1024) {
    return {
      nearX: stageWidth * 0.4,
      farX: stageWidth * 0.39,
      offscreenX: stageWidth * 0.59,
      nearScale: 0.85,
      farScale: 0.71,
      nearY: 14,
      farY: 34,
    }
  }

  if (stageWidth >= 640) {
    return {
      nearX: stageWidth * 0.44,
      farX: stageWidth * 0.66,
      offscreenX: stageWidth * 0.84,
      nearScale: 0.82,
      farScale: 0.65,
      nearY: 18,
      farY: 42,
    }
  }

  return {
    nearX: stageWidth * 0.74,
    farX: stageWidth * 1.08,
    offscreenX: stageWidth * 1.3,
    nearScale: 0.76,
    farScale: 0.52,
    nearY: 20,
    farY: 46,
  }
}

function getSlotState(offset: number, m: CardSlotMetrics): CardSlotState {
  const d = Math.abs(offset)

  if (d === 0) {
    return {
      x: 0,
      y: 0,
      scale: 1,
      opacity: 1,
      zIndex: 5,
      blur: 0,
      overlayOpacity: 0,
    }
  }

  if (d === 1) {
    return {
      x: Math.sign(offset) * m.nearX,
      y: m.nearY,
      scale: m.nearScale,
      opacity: 1,
      zIndex: 4,
      blur: 0,
      overlayOpacity: 0.22,
    }
  }

  if (d === 2) {
    return {
      x: Math.sign(offset) * m.farX,
      y: m.farY,
      scale: m.farScale,
      opacity: 1,
      zIndex: 3,
      blur: 2,
      overlayOpacity: 0.52,
    }
  }

  // Off-screen (|offset| >= 3)
  return {
    x: Math.sign(offset) * m.offscreenX,
    y: m.farY + 12,
    scale: m.farScale * 0.9,
    opacity: 0,
    zIndex: 1,
    blur: 4,
    overlayOpacity: 0.72,
  }
}

// Three slowly-rotating ellipses behind the centre card.
// Pulses outward each time the carousel navigates.
function CarouselHalo({ activeIndex }: { activeIndex: number }) {
  const { themeMode } = useThemeMode()
  const isDark = themeMode === "dark"

  const containerRef = useRef<HTMLDivElement>(null)
  const g1Ref = useRef<SVGGElement>(null)
  const g2Ref = useRef<SVGGElement>(null)
  const g3Ref = useRef<SVGGElement>(null)
  const hasMountedRef = useRef(false)

  // Continuous slow rotation — each ring at a different speed and direction.
  useEffect(() => {
    const g1 = g1Ref.current
    const g2 = g2Ref.current
    const g3 = g3Ref.current
    if (!g1 || !g2 || !g3) return

    // Stagger the starting angles so the rings aren't all aligned.
    gsap.set(g1, { rotation: 12, svgOrigin: "270 240" })
    gsap.set(g2, { rotation: -30, svgOrigin: "270 240" })
    gsap.set(g3, { rotation: 52, svgOrigin: "270 240" })

    const t1 = gsap.to(g1, {
      rotation: 372,
      duration: 14,
      repeat: -1,
      ease: "none",
      svgOrigin: "270 240",
    })
    const t2 = gsap.to(g2, {
      rotation: -390,
      duration: 20,
      repeat: -1,
      ease: "none",
      svgOrigin: "270 240",
    })
    const t3 = gsap.to(g3, {
      rotation: 412,
      duration: 30,
      repeat: -1,
      ease: "none",
      svgOrigin: "270 240",
    })

    return () => {
      t1.kill()
      t2.kill()
      t3.kill()
    }
  }, [])

  // Pulse on every navigation press.
  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true
      return
    }
    const el = containerRef.current
    if (!el) return
    gsap.killTweensOf(el)
    gsap.fromTo(
      el,
      { scale: 0.88, opacity: 0.5 },
      { scale: 1, opacity: 1, duration: 0.9, ease: "elastic.out(1.1, 0.55)" }
    )
  }, [activeIndex])

  const c1 = isDark ? "rgba(34,211,238,0.26)" : "rgba(39,255,195,0.55)"
  const c2 = isDark ? "rgba(99,102,241,0.18)" : "rgba(234,179,8,0.42)"
  const c3 = isDark ? "rgba(34,211,238,0.13)" : "rgba(39,255,195,0.30)"

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="pointer-events-none absolute top-1/2 left-1/2 z-2 -translate-x-1/2 -translate-y-1/2"
      style={{ width: 560, height: 500 }}
    >
      <svg className="h-full w-full" viewBox="0 0 560 500" fill="none">
        <g ref={g1Ref}>
          <ellipse
            cx="280"
            cy="250"
            rx="178"
            ry="112"
            stroke={c1}
            strokeWidth="1.5"
          />
        </g>
        <g ref={g2Ref}>
          <ellipse
            cx="280"
            cy="250"
            rx="216"
            ry="136"
            stroke={c2}
            strokeWidth="1"
          />
        </g>
        <g ref={g3Ref}>
          <ellipse
            cx="280"
            cy="250"
            rx="254"
            ry="160"
            stroke={c3}
            strokeWidth="0.75"
          />
        </g>
      </svg>
    </div>
  )
}

export default function ProjectCarousel({
  cards,
  activeIndex,
  onNavigate,
}: ProjectCarouselProps) {
  const N = cards.length
  const hasMountedRef = useRef(false)
  const stageRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<Array<HTMLDivElement | null>>([])
  const overlayRefs = useRef<Array<HTMLDivElement | null>>([])

  // Absolute position of the centre card within virtualCards.
  // Starts at BUFFER + activeIndex (the corresponding real-zone slot).
  const virtualCenterRef = useRef(BUFFER + activeIndex)

  // Previous activeIndex — used to detect navigation direction.
  const prevActiveIndexRef = useRef(activeIndex)

  // virtualCards = [last-BUFFER real cards] + [all real cards] + [first-BUFFER real cards]
  // For 5 cards with BUFFER=3: [C,D,E, A,B,C,D,E, A,B,C] — 11 elements
  const virtualCards: ProjectCardData[] =
    N > 0 ? [...cards.slice(-BUFFER), ...cards, ...cards.slice(0, BUFFER)] : []

  useLayoutEffect(() => {
    const stage = stageRef.current
    const cardEls = cardRefs.current.filter(
      (el): el is HTMLDivElement => el !== null
    )
    if (!stage || cardEls.length === 0 || N === 0) return

    const m = getCardMetrics(stage.getBoundingClientRect().width)
    const DURATION = 1.5
    const EASE = "power2.inOut"

    // Detect the direction of this navigation step.
    const prevAI = prevActiveIndexRef.current
    const currAI = activeIndex
    prevActiveIndexRef.current = currAI

    let direction = 0
    if (hasMountedRef.current && currAI !== prevAI) {
      const diff = currAI - prevAI
      // Handle both normal ±1 steps and wrap-around (N-1→0 or 0→N-1).
      if (diff === 1 || diff === -(N - 1)) direction = 1
      else if (diff === -1 || diff === N - 1) direction = -1
      else direction = Math.sign(diff)
    }

    let vc = virtualCenterRef.current

    // Before animating, check whether we need an invisible snap back into the
    // real zone.  The snap is safe because the visible cards are identical at
    // the snap source and destination — same card objects in the same visual
    // slots — so gsap.set produces no perceptible change.
    if (hasMountedRef.current && direction !== 0) {
      const realEnd = BUFFER + N - 1 // last real-zone index
      const realStart = BUFFER // first real-zone index

      const needsSnap =
        (direction === 1 && vc >= realEnd) ||
        (direction === -1 && vc <= realStart)

      if (needsSnap) {
        const snappedVc = direction === 1 ? vc - N : vc + N
        vc = snappedVc
        virtualCenterRef.current = snappedVc

        // Instantly reposition every element to match the new virtual centre.
        cardEls.forEach((el, vi) => {
          const offset = vi - snappedVc
          const state = getSlotState(offset, m)
          const overlay = overlayRefs.current[vi]
          gsap.set(el, {
            xPercent: -50,
            yPercent: -50,
            x: state.x,
            y: state.y,
            scale: state.scale,
            opacity: state.opacity,
            filter: `blur(${state.blur}px)`,
            zIndex: state.zIndex,
            force3D: true,
          })
          if (overlay) gsap.set(overlay, { opacity: state.overlayOpacity })
        })
      }
    }

    // Apply the navigation step to get the new virtual centre.
    vc += direction
    virtualCenterRef.current = vc

    // Animate (or instantly position on first mount) all elements.
    cardEls.forEach((el, vi) => {
      const offset = vi - vc
      const target = getSlotState(offset, m)
      const overlay = overlayRefs.current[vi]

      gsap.set(el, { zIndex: target.zIndex })

      const tweenProps = {
        xPercent: -50,
        yPercent: -50,
        x: target.x,
        y: target.y,
        scale: target.scale,
        opacity: target.opacity,
        filter: `blur(${target.blur}px)`,
        force3D: true,
        overwrite: "auto" as const,
      }

      if (hasMountedRef.current && direction !== 0) {
        gsap.to(el, { ...tweenProps, duration: DURATION, ease: EASE })
        if (overlay) {
          gsap.to(overlay, {
            opacity: target.overlayOpacity,
            duration: DURATION,
            ease: EASE,
            overwrite: "auto",
          })
        }
      } else {
        gsap.set(el, tweenProps)
        if (overlay) gsap.set(overlay, { opacity: target.overlayOpacity })
      }
    })

    hasMountedRef.current = true

    // Skip the ResizeObserver's initial callback so it doesn't kill in-flight
    // animations started just above.
    let skipInitialCallback = true
    const ro = new ResizeObserver(() => {
      if (skipInitialCallback) {
        skipInitialCallback = false
        return
      }
      const fresh = getCardMetrics(stage.getBoundingClientRect().width)
      const currentVc = virtualCenterRef.current
      cardEls.forEach((el, vi) => {
        const offset = vi - currentVc
        const state = getSlotState(offset, fresh)
        const overlay = overlayRefs.current[vi]
        gsap.killTweensOf(el)
        gsap.set(el, {
          xPercent: -50,
          yPercent: -50,
          x: state.x,
          y: state.y,
          scale: state.scale,
          opacity: state.opacity,
          filter: `blur(${state.blur}px)`,
          zIndex: state.zIndex,
          force3D: true,
        })
        if (overlay) {
          gsap.killTweensOf(overlay)
          gsap.set(overlay, { opacity: state.overlayOpacity })
        }
      })
    })
    ro.observe(stage)
    return () => ro.disconnect()
  }, [activeIndex, N])

  if (N === 0) return null

  if (N === 1) {
    return (
      <div className="mx-auto w-full max-w-152">
        <ProjectCard
          card={cards[0]}
          index={0}
          className="min-h-[41.6rem] lg:min-h-[42.9rem]"
        />
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="relative left-1/2 w-screen -translate-x-1/2 overflow-x-clip overflow-y-visible xl:left-[calc(50%-2rem)]">
        <div
          ref={stageRef}
          className="relative h-[37.7rem] sm:h-[39rem] lg:h-[40.3rem] xl:h-[44.2rem] 2xl:h-[46.8rem]"
        >
          <CarouselHalo activeIndex={activeIndex} />
          {virtualCards.map((card, vi) => {
            // Map virtual index back to real card index for tone / numbering.
            const realIndex = (((vi - BUFFER) % N) + N) % N
            return (
              <div
                key={`v${vi}`}
                ref={(node) => {
                  cardRefs.current[vi] = node
                }}
                className="absolute top-1/2 left-1/2 h-[37.7rem] w-[27.3rem] cursor-pointer will-change-[transform,opacity,filter] sm:h-[39rem] sm:w-[28.6rem] lg:h-[40.3rem] lg:w-[29.9rem] xl:h-[44.2rem] xl:w-[32.5rem] 2xl:h-[46.8rem] 2xl:w-[33.8rem]"
                onClick={() => {
                  const offset = vi - virtualCenterRef.current
                  if (offset === 0 || !onNavigate) return
                  onNavigate(Math.sign(offset) as 1 | -1)
                }}
                onMouseEnter={() => {
                  const el = cardRefs.current[vi]
                  if (!el || vi !== virtualCenterRef.current) return
                  gsap.to(el, {
                    scale: 1.04,
                    duration: 0.35,
                    ease: "power2.out",
                    overwrite: "auto",
                  })
                }}
                onMouseLeave={() => {
                  const el = cardRefs.current[vi]
                  if (!el || vi !== virtualCenterRef.current) return
                  gsap.to(el, {
                    scale: 1,
                    duration: 0.4,
                    ease: "power2.inOut",
                    overwrite: "auto",
                  })
                }}
              >
                <ProjectCard card={card} index={realIndex} />
                <div
                  ref={(node) => {
                    overlayRefs.current[vi] = node
                  }}
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 z-10 rounded-[2.25rem] bg-white dark:bg-slate-950"
                />
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
