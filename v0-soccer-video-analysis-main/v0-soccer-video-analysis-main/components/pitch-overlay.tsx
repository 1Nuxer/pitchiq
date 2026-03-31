"use client"

interface PlayerDot {
  id: string
  x: number
  y: number
  team: "home" | "away"
  number?: number
}

interface PitchOverlayProps {
  homePlayers: PlayerDot[]
  awayPlayers: PlayerDot[]
  ballPosition: { x: number; y: number }
  annotation?: {
    x: number
    y: number
    width: number
    height: number
    label: string
  }
}

export function PitchOverlay({ homePlayers, awayPlayers, ballPosition, annotation }: PitchOverlayProps) {
  return (
    <svg
      viewBox="0 0 1050 680"
      className="h-full w-full"
      style={{ backgroundColor: "oklch(0.25 0.08 145)" }}
    >
      {/* Pitch outline */}
      <rect
        x="25"
        y="25"
        width="1000"
        height="630"
        fill="none"
        stroke="rgba(255,255,255,0.4)"
        strokeWidth="2"
      />

      {/* Center line */}
      <line
        x1="525"
        y1="25"
        x2="525"
        y2="655"
        stroke="rgba(255,255,255,0.4)"
        strokeWidth="2"
      />

      {/* Center circle */}
      <circle
        cx="525"
        cy="340"
        r="91.5"
        fill="none"
        stroke="rgba(255,255,255,0.4)"
        strokeWidth="2"
      />

      {/* Center spot */}
      <circle cx="525" cy="340" r="4" fill="rgba(255,255,255,0.6)" />

      {/* Left penalty area */}
      <rect
        x="25"
        y="138"
        width="165"
        height="404"
        fill="none"
        stroke="rgba(255,255,255,0.4)"
        strokeWidth="2"
      />

      {/* Left goal area */}
      <rect
        x="25"
        y="237"
        width="55"
        height="206"
        fill="none"
        stroke="rgba(255,255,255,0.4)"
        strokeWidth="2"
      />

      {/* Left penalty spot */}
      <circle cx="135" cy="340" r="4" fill="rgba(255,255,255,0.6)" />

      {/* Right penalty area */}
      <rect
        x="860"
        y="138"
        width="165"
        height="404"
        fill="none"
        stroke="rgba(255,255,255,0.4)"
        strokeWidth="2"
      />

      {/* Right goal area */}
      <rect
        x="970"
        y="237"
        width="55"
        height="206"
        fill="none"
        stroke="rgba(255,255,255,0.4)"
        strokeWidth="2"
      />

      {/* Right penalty spot */}
      <circle cx="915" cy="340" r="4" fill="rgba(255,255,255,0.6)" />

      {/* Corner arcs */}
      <path
        d="M 25 35 A 10 10 0 0 0 35 25"
        fill="none"
        stroke="rgba(255,255,255,0.4)"
        strokeWidth="2"
      />
      <path
        d="M 1015 25 A 10 10 0 0 0 1025 35"
        fill="none"
        stroke="rgba(255,255,255,0.4)"
        strokeWidth="2"
      />
      <path
        d="M 25 645 A 10 10 0 0 1 35 655"
        fill="none"
        stroke="rgba(255,255,255,0.4)"
        strokeWidth="2"
      />
      <path
        d="M 1015 655 A 10 10 0 0 1 1025 645"
        fill="none"
        stroke="rgba(255,255,255,0.4)"
        strokeWidth="2"
      />

      {/* Annotation box */}
      {annotation && (
        <g>
          <rect
            x={annotation.x}
            y={annotation.y}
            width={annotation.width}
            height={annotation.height}
            fill="rgba(245, 158, 11, 0.15)"
            stroke="rgba(245, 158, 11, 0.8)"
            strokeWidth="2"
            strokeDasharray="8 4"
          />
          <text
            x={annotation.x + annotation.width / 2}
            y={annotation.y - 10}
            textAnchor="middle"
            fill="rgba(245, 158, 11, 1)"
            fontSize="14"
            fontWeight="600"
          >
            {annotation.label}
          </text>
        </g>
      )}

      {/* Away team players */}
      {awayPlayers.map((player) => (
        <g key={player.id}>
          <circle
            cx={player.x}
            cy={player.y}
            r="18"
            fill="oklch(0.55 0.22 25)"
            stroke="rgba(255,255,255,0.5)"
            strokeWidth="2"
          />
          {player.number && (
            <text
              x={player.x}
              y={player.y + 5}
              textAnchor="middle"
              fill="white"
              fontSize="12"
              fontWeight="600"
            >
              {player.number}
            </text>
          )}
        </g>
      ))}

      {/* Home team players */}
      {homePlayers.map((player) => (
        <g key={player.id}>
          <circle
            cx={player.x}
            cy={player.y}
            r="18"
            fill="oklch(0.55 0.14 155)"
            stroke="rgba(255,255,255,0.5)"
            strokeWidth="2"
          />
          {player.number && (
            <text
              x={player.x}
              y={player.y + 5}
              textAnchor="middle"
              fill="white"
              fontSize="12"
              fontWeight="600"
            >
              {player.number}
            </text>
          )}
        </g>
      ))}

      {/* Ball */}
      <circle
        cx={ballPosition.x}
        cy={ballPosition.y}
        r="10"
        fill="white"
        stroke="rgba(0,0,0,0.3)"
        strokeWidth="1"
      />
    </svg>
  )
}
