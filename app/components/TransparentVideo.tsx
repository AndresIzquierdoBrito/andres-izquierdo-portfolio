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
  onLoadedData,
  pointerEvents = "none",
  style,
  width = 540,
  ...videoProps
}: TransparentVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [shouldLoad, setShouldLoad] = useState(false)
  const [isReady, setIsReady] = useState(false)
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
    video.load()
    void video.play().catch(() => undefined)
  }, [isDarkMode, shouldLoad])

  const handleLoadedData = (event: SyntheticEvent<HTMLVideoElement>) => {
    setIsReady(true)
    onLoadedData?.(event)
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
      preload="none"
      onLoadedData={handleLoadedData}
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
          <source
            src={
              isDarkMode
                ? "/videos/izbri_safari_dark_v2.mp4"
                : "/videos/izbri_safari_v2.mp4"
            }
            type={'video/mp4; codecs="hvc1"'}
          />
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
