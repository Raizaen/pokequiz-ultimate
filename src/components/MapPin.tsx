import type { MapAnswer } from '../domain/quiz'

export function MapPin({ x, y, color }: MapAnswer & { color: string }) {
  return (
    <g transform={`translate(${x} ${y})`} className="map-pin">
      <path
        d="M0 0C-1.7-2-2.1-3.1-2.1-4.1a2.1 2.1 0 1 1 4.2 0C2.1-3.1 1.7-2 0 0Z"
        fill={color}
        stroke="#fff"
        strokeWidth=".55"
      />
      <circle cy="-4.1" r=".65" fill="#fff" />
    </g>
  )
}
