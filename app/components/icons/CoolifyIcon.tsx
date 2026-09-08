import type { SVGProps } from "react"

export function CoolifyIcon({ className, style }: SVGProps<SVGSVGElement>) {
  return (
    <img
      src="/coolify.svg"
      alt=""
      aria-hidden="true"
      className={className}
      style={style}
    />
  )
}
