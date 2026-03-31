export function PitchHeatmap() {
  return (
    <svg
      viewBox="0 0 1050 680"
      className="h-full w-full"
      style={{ backgroundColor: "oklch(0.18 0.02 250)" }}
    >
      {/* Pitch outline */}
      <rect
        x="25"
        y="25"
        width="1000"
        height="630"
        fill="none"
        stroke="rgba(255,255,255,0.3)"
        strokeWidth="2"
      />

      {/* Center line */}
      <line
        x1="525"
        y1="25"
        x2="525"
        y2="655"
        stroke="rgba(255,255,255,0.3)"
        strokeWidth="2"
      />

      {/* Center circle */}
      <circle
        cx="525"
        cy="340"
        r="91.5"
        fill="none"
        stroke="rgba(255,255,255,0.3)"
        strokeWidth="2"
      />

      {/* Left penalty area */}
      <rect
        x="25"
        y="138"
        width="165"
        height="404"
        fill="none"
        stroke="rgba(255,255,255,0.3)"
        strokeWidth="2"
      />

      {/* Right penalty area */}
      <rect
        x="860"
        y="138"
        width="165"
        height="404"
        fill="none"
        stroke="rgba(255,255,255,0.3)"
        strokeWidth="2"
      />

      {/* Heatmap zones */}
      <defs>
        <radialGradient id="heat1" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="oklch(0.55 0.14 155)" stopOpacity="0.8" />
          <stop offset="100%" stopColor="oklch(0.55 0.14 155)" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="heat2" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="oklch(0.75 0.15 85)" stopOpacity="0.6" />
          <stop offset="100%" stopColor="oklch(0.75 0.15 85)" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="heat3" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="oklch(0.60 0.20 25)" stopOpacity="0.5" />
          <stop offset="100%" stopColor="oklch(0.60 0.20 25)" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* High activity zones */}
      <ellipse cx="350" cy="340" rx="120" ry="180" fill="url(#heat1)" />
      <ellipse cx="520" cy="280" rx="100" ry="120" fill="url(#heat1)" />
      <ellipse cx="680" cy="320" rx="80" ry="100" fill="url(#heat2)" />
      <ellipse cx="450" cy="480" rx="90" ry="110" fill="url(#heat2)" />
      <ellipse cx="800" cy="340" rx="70" ry="90" fill="url(#heat3)" />
      <ellipse cx="280" cy="200" rx="60" ry="80" fill="url(#heat2)" />

      {/* Legend */}
      <g transform="translate(850, 580)">
        <text x="0" y="0" fill="rgba(255,255,255,0.6)" fontSize="12">Activity Level</text>
        <rect x="0" y="10" width="20" height="10" fill="oklch(0.55 0.14 155)" opacity="0.8" />
        <text x="25" y="18" fill="rgba(255,255,255,0.5)" fontSize="10">High</text>
        <rect x="60" y="10" width="20" height="10" fill="oklch(0.75 0.15 85)" opacity="0.6" />
        <text x="85" y="18" fill="rgba(255,255,255,0.5)" fontSize="10">Medium</text>
        <rect x="130" y="10" width="20" height="10" fill="oklch(0.60 0.20 25)" opacity="0.5" />
        <text x="155" y="18" fill="rgba(255,255,255,0.5)" fontSize="10">Low</text>
      </g>
    </svg>
  )
}
