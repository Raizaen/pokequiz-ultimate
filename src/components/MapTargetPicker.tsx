import { mapAssetFor } from '../data/mapAssets'

interface Props {
  region: string
  x: number
  y: number
  onChange: (point: { x: number; y: number }) => void
}

export function MapTargetPicker({ region, x, y, onChange }: Props) {
  const map = mapAssetFor(region)

  const place = (event: React.MouseEvent<SVGSVGElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect()
    onChange({
      x: Number((((event.clientX - bounds.left) / bounds.width) * 100).toFixed(1)),
      y: Number((((event.clientY - bounds.top) / bounds.height) * 100).toFixed(1)),
    })
  }

  return (
    <div className="admin-map-picker">
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        style={{ aspectRatio: map.aspectRatio }}
        onClick={place}
        role="img"
        aria-label={`Choisir un emplacement sur la carte de ${region}`}
      >
        <image href={map.src} x="0" y="0" width="100" height="100" preserveAspectRatio="none" />
        <g className="admin-map-target" transform={`translate(${x} ${y})`}>
          <circle r="2.2" fill="#ef445d33" stroke="#fff" strokeWidth=".6" />
          <circle r=".8" fill="#ef445d" stroke="#fff" strokeWidth=".3" />
        </g>
      </svg>
      <small>Clique sur la carte pour placer la réponse · X {x.toFixed(1)} · Y {y.toFixed(1)}</small>
    </div>
  )
}
