export default function HeroWavePlaceholder() {
  return (
    <div
      aria-hidden="true"
      className="hero-wave-placeholder relative h-full w-full"
    >
      <svg
        viewBox="0 0 520 680"
        className="h-full w-full overflow-visible"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <ellipse
          cx="278"
          cy="648"
          rx="196"
          ry="18"
          fill="currentColor"
          opacity="0.1"
        />

        <g className="hero-wave-placeholder__orbit" opacity="0.32">
          <ellipse
            cx="282"
            cy="352"
            rx="206"
            ry="274"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeDasharray="8 12"
          />
          <ellipse
            cx="282"
            cy="352"
            rx="166"
            ry="238"
            stroke="currentColor"
            strokeWidth="1"
          />
        </g>

        <g className="hero-wave-placeholder__figure">
          <path
            d="M119 680C124 568 148 475 205 420C230 396 257 383 283 383C331 383 373 417 398 470C420 518 428 587 431 680H119Z"
            fill="currentColor"
            opacity="0.12"
          />
          <path
            d="M119 680C124 568 148 475 205 420C230 396 257 383 283 383C331 383 373 417 398 470C420 518 428 587 431 680"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M246 371V408C246 429 263 446 284 446C305 446 322 429 322 408V371"
            fill="currentColor"
            opacity="0.1"
          />
          <path
            d="M246 371V408C246 429 263 446 284 446C305 446 322 429 322 408V371"
            stroke="currentColor"
            strokeWidth="3"
          />
          <circle cx="284" cy="292" r="86" fill="currentColor" opacity="0.12" />
          <circle
            cx="284"
            cy="292"
            r="86"
            stroke="currentColor"
            strokeWidth="3"
          />
          <path
            d="M238 286C250 269 269 261 284 261C302 261 319 269 330 286"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            opacity="0.5"
          />
          <path
            d="M252 322C269 337 299 337 316 322"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            opacity="0.65"
          />
          <circle cx="257" cy="295" r="4" fill="currentColor" />
          <circle cx="311" cy="295" r="4" fill="currentColor" />

          <path
            d="M210 435C169 464 142 508 124 566"
            stroke="currentColor"
            strokeWidth="38"
            strokeLinecap="round"
            opacity="0.13"
          />
          <path
            d="M210 435C169 464 142 508 124 566"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />

          <g className="hero-wave-placeholder__arm">
            <path
              d="M358 431C392 391 411 344 421 295C429 255 432 218 432 185"
              stroke="currentColor"
              strokeWidth="42"
              strokeLinecap="round"
              opacity="0.13"
            />
            <path
              d="M358 431C392 391 411 344 421 295C429 255 432 218 432 185"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <path
              d="M432 190C417 176 411 155 418 137C422 127 430 127 435 137L441 151L443 116C444 104 454 104 456 116L459 151L466 122C469 111 479 114 480 125L479 158L488 138C493 128 502 133 501 144C499 170 486 194 466 208C452 218 440 207 432 190Z"
              fill="currentColor"
              opacity="0.12"
            />
            <path
              d="M432 190C417 176 411 155 418 137C422 127 430 127 435 137L441 151L443 116C444 104 454 104 456 116L459 151L466 122C469 111 479 114 480 125L479 158L488 138C493 128 502 133 501 144C499 170 486 194 466 208C452 218 440 207 432 190Z"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinejoin="round"
            />
          </g>
        </g>
      </svg>

      <span className="absolute right-[8%] bottom-[5%] font-mono text-[0.58rem] tracking-[0.2em] text-current uppercase opacity-50">
        Video placeholder
      </span>
    </div>
  )
}
