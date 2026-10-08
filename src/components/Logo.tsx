export function Logo({ variant = 'white', size = 'md' }: { variant?: 'white' | 'dark'; size?: 'sm' | 'md' | 'lg' }) {
  const sizes = {
    sm: { width: 140, height: 36 },
    md: { width: 180, height: 48 },
    lg: { width: 280, height: 72 },
  }
  const { width, height } = sizes[size]
  const strokeColor = variant === 'white' ? '#fff' : '#070014'
  const glowColor1 = 'rgba(123,44,255,0.8)'
  const glowColor2 = 'rgba(0,229,255,0.8)'

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 320 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="drop-shadow-[0_0_20px_rgba(168,85,247,0.35)]"
    >
      <defs>
        <linearGradient id="brainGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7B2CFF" />
          <stop offset="50%" stopColor="#E600FF" />
          <stop offset="100%" stopColor="#00E5FF" />
        </linearGradient>
        <linearGradient id="textGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#A855F7" />
        </linearGradient>
        <filter id="brainGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Brain Icon */}
      <g filter="url(#brainGlow)" transform="translate(4, 10) scale(0.95)">
        {/* Left hemisphere */}
        <path
          d="M20 35 C20 15, 38 6, 44 6 C46 2, 52 0, 56 6 C60 10, 64 14, 64 20 C68 18, 76 22, 76 30 C76 36, 72 40, 66 40 L66 50 C66 54, 64 56, 60 58 C58 62, 52 62, 50 58 L40 58 L40 40 L32 40 C24 40, 20 38, 20 35 Z"
          fill="url(#brainGrad)"
          opacity="0.95"
        />
        {/* Right hemisphere */}
        <path
          d="M100 35 C100 15, 82 6, 76 6 C74 2, 68 0, 64 6 C60 10, 56 14, 56 20 C52 18, 44 22, 44 30 C44 36, 48 40, 54 40 L54 50 C54 54, 56 56, 60 58 C62 62, 68 62, 70 58 L80 58 L80 40 L88 40 C96 40, 100 38, 100 35 Z"
          fill="url(#brainGrad)"
          opacity="0.9"
        />
        {/* Circuit nodes */}
        <circle cx="38" cy="18" r="2" fill={glowColor2} />
        <circle cx="52" cy="14" r="2.2" fill={glowColor1} />
        <circle cx="68" cy="14" r="2.2" fill={glowColor2} />
        <circle cx="82" cy="18" r="2" fill={glowColor1} />
        <circle cx="42" cy="32" r="1.8" fill="#fff" opacity="0.9" />
        <circle cx="60" cy="28" r="2" fill="#fff" opacity="0.95" />
        <circle cx="78" cy="32" r="1.8" fill="#fff" opacity="0.9" />
        <circle cx="48" cy="48" r="1.8" fill={glowColor2} />
        <circle cx="72" cy="48" r="1.8" fill={glowColor1} />
        {/* Connection lines */}
        <path d="M42 32 L52 14 L60 28" stroke="#00E5FF" strokeWidth="0.8" opacity="0.6" />
        <path d="M60 28 L68 14 L78 32" stroke="#E600FF" strokeWidth="0.8" opacity="0.6" />
        <path d="M38 18 L60 28 L82 18" stroke="#fff" strokeWidth="0.5" opacity="0.4" />
        {/* Center glow */}
        <ellipse cx="60" cy="30" rx="4" ry="6" fill="#fff" opacity="0.85" filter="url(#brainGlow)" />
      </g>

      {/* "CEREBRO DIGITAL IO" text blocks */}
      <g transform="translate(100, 0)">
        <text
          x="12"
          y="44"
          fontFamily="Space Grotesk, Inter, sans-serif"
          fontSize="26"
          fontWeight="700"
          letterSpacing="-0.5"
          fill="url(#textGrad)"
        >
          CEREBRO
        </text>
        <text
          x="12"
          y="68"
          fontFamily="Space Grotesk, Inter, sans-serif"
          fontSize="16"
          fontWeight="500"
          letterSpacing="4"
          fill={strokeColor}
          opacity="0.85"
        >
          DIGITAL
        </text>
        {/* IO */}
        <g transform="translate(146, 46)">
          <rect
            x="0"
            y="-12"
            width="3"
            height="28"
            rx="1"
            fill="#00E5FF"
            opacity="0.9"
          />
          <circle
            cx="24"
            cy="2"
            r="13"
            stroke="url(#brainGrad)"
            strokeWidth="2.5"
            fill="none"
          />
          <circle
            cx="24"
            cy="2"
            r="5"
            fill="#E600FF"
            opacity="0.6"
          />
        </g>
      </g>
    </svg>
  )
}
