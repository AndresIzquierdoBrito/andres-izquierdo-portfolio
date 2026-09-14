import { useEffect, useRef, useState } from "react"
import type { CSSProperties, SyntheticEvent, VideoHTMLAttributes } from "react"

import { useThemeMode } from "~/lib/useThemeMode"

type NativeVideoProps = Omit<
  VideoHTMLAttributes<HTMLVideoElement>,
  | "autoPlay"
  | "children"
  | "height"
  | "loop"
  | "muted"
  | "playsInline"
  | "preload"
  | "src"
  | "width"
>

export interface TransparentVideoProps extends NativeVideoProps {
  height?: string | number
  pointerEvents?: CSSProperties["pointerEvents"]
  width?: string | number
}

export default function TransparentVideo({
  className,
  height = 638,
  onError,
  onLoadedData,
  pointerEvents = "none",
  style,
  width = 540,
  ...videoProps
}: TransparentVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [shouldLoad, setShouldLoad] = useState(false)
  const [isReady, setIsReady] = useState(false)
  const [useWebmFallback, setUseWebmFallback] = useState(false)
  const { isDarkMode } = useThemeMode()

  useEffect(() => {
    const video = videoRef.current

    if (!video) {
      return
    }

    if (typeof IntersectionObserver === "undefined") {
      setShouldLoad(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) {
          return
        }

        setShouldLoad(true)
        observer.disconnect()
      },
      { rootMargin: "200px" }
    )

    observer.observe(video)

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!shouldLoad) {
      return
    }

    const video = videoRef.current

    if (!video) {
      return
    }

    setIsReady(false)
    setUseWebmFallback(false)

    // Wait for React to commit the new <source> elements before asking the
    // media element to reload. Safari can otherwise retain the previous
    // source (or an empty source list) when the video is loaded lazily.
    const frameId = window.requestAnimationFrame(() => {
      video.load()
    })

    return () => window.cancelAnimationFrame(frameId)
  }, [isDarkMode, shouldLoad])

  useEffect(() => {
    if (!shouldLoad || !useWebmFallback) {
      return
    }

    const video = videoRef.current

    if (!video) {
      return
    }

    const frameId = window.requestAnimationFrame(() => {
      video.load()
    })

    return () => window.cancelAnimationFrame(frameId)
  }, [shouldLoad, useWebmFallback])

  const handleCanPlay = (event: SyntheticEvent<HTMLVideoElement>) => {
    setIsReady(true)
    void event.currentTarget.play().catch(() => undefined)
  }

  const handleLoadedData = (event: SyntheticEvent<HTMLVideoElement>) => {
    setIsReady(true)
    onLoadedData?.(event)
  }

  const handleError = (event: SyntheticEvent<HTMLVideoElement>) => {
    onError?.(event)

    // If Safari cannot decode or fetch the HEVC alpha stream, remove that
    // source and retry the unchanged WebM asset instead of leaving the video
    // permanently transparent (opacity: 0).
    if (!useWebmFallback && event.currentTarget.currentSrc.endsWith(".mp4")) {
      setIsReady(false)
      setUseWebmFallback(true)
    }
  }

  return (
    <video
      {...videoProps}
      ref={videoRef}
      className={className}
      width={width}
      height={height}
      autoPlay
      loop
      muted
      playsInline
      preload={shouldLoad ? "auto" : "none"}
      onLoadedData={handleLoadedData}
      onCanPlay={handleCanPlay}
      onError={handleError}
      style={{
        background: "transparent",
        aspectRatio: "72 / 85",
        clipPath: "inset(8.2% 0 0 1.2%)",
        objectFit: "contain",
        opacity: isReady ? 1 : 0,
        pointerEvents,
        ...style,
      }}
    >
      {shouldLoad ? (
        <>
          {!useWebmFallback ? (
            <source
              src={
                isDarkMode
                  ? "/videos/izbri_safari_dark_v3.mp4"
                  : "/videos/izbri_safari_v3.mp4"
              }
              type={'video/mp4; codecs="hvc1"'}
            />
          ) : null}
          <source
            src={
              isDarkMode
                ? "/videos/izbri_background_dark.webm"
                : "/videos/izbri_background.webm"
            }
            type="video/webm"
          />
        </>
      ) : null}
    </video>
  )
}
