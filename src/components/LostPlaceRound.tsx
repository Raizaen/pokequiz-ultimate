import { useMemo, useRef, useState } from 'react'
import type { AnswersByPlayer, MapAnswer, Player, Question } from '../domain/quiz'
import { mapAccuracyLabel } from '../engine/answerValidation'

interface Props {
  players: Player[]
  answers: AnswersByPlayer
  question: Question
  revealed: boolean
  onAnswer: (playerId: string, answer: MapAnswer) => void
}

const initialView = { x: 0, y: 0, width: 100, height: 100 }
const mapAssets: Record<string, { src: string; aspectRatio: string }> = {
  Paldea: { src: '/assets/maps/paldea-map-clean.png', aspectRatio: '1 / 1' },
  Sinnoh: { src: '/assets/maps/sinnoh-map.png', aspectRatio: '1268 / 734' },
}

function MapPin({ x, y, color }: MapAnswer & { color: string }) {
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

export function LostPlaceRound({ players, answers, question, revealed, onAnswer }: Props) {
  const [marker, setMarker] = useState<MapAnswer | null>(null)
  const [view, setView] = useState(initialView)
  const drag = useRef<{ x: number; y: number; viewX: number; viewY: number } | null>(null)
  const dragged = useRef(false)
  const activePlayer = players.find((player) => !answers[player.id])
  const submitted = players.filter((player) => answers[player.id]).length
  const target = question.mapTarget
  const mapAsset = mapAssets[question.mapRegion ?? 'Paldea'] ?? mapAssets.Paldea

  const zoom = (factor: number) => setView((current) => {
    const width = Math.max(35, Math.min(100, current.width * factor))
    const height = width
    return {
      x: Math.max(0, Math.min(100 - width, current.x + (current.width - width) / 2)),
      y: Math.max(0, Math.min(100 - height, current.y + (current.height - height) / 2)),
      width,
      height,
    }
  })

  const pan = (dx: number, dy: number) => setView((current) => ({
    ...current,
    x: Math.max(0, Math.min(100 - current.width, current.x + dx * current.width * 0.18)),
    y: Math.max(0, Math.min(100 - current.height, current.y + dy * current.height * 0.18)),
  }))

  const revealedMarkers = useMemo(() => players.flatMap((player) => {
    const value = answers[player.id]?.value
    return !revealed || !value || typeof value === 'string' || Array.isArray(value)
      ? []
      : [{
          player,
          point: value,
          points: answers[player.id]?.pointsAwarded ?? 0,
          distance: target ? Math.hypot(value.x - target.x, value.y - target.y) : 0,
        }]
  }), [answers, players, revealed, target])

  const placeMarker = (event: React.MouseEvent<SVGSVGElement>) => {
    if (dragged.current) {
      dragged.current = false
      return
    }
    if (!activePlayer || revealed) return
    const bounds = event.currentTarget.getBoundingClientRect()
    setMarker({
      x: view.x + ((event.clientX - bounds.left) / bounds.width) * view.width,
      y: view.y + ((event.clientY - bounds.top) / bounds.height) * view.height,
    })
  }

  const startDrag = (event: React.PointerEvent<SVGSVGElement>) => {
    drag.current = { x: event.clientX, y: event.clientY, viewX: view.x, viewY: view.y }
    dragged.current = false
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const moveDrag = (event: React.PointerEvent<SVGSVGElement>) => {
    if (!drag.current) return
    const bounds = event.currentTarget.getBoundingClientRect()
    const dx = ((event.clientX - drag.current.x) / bounds.width) * view.width
    const dy = ((event.clientY - drag.current.y) / bounds.height) * view.height
    if (Math.abs(dx) + Math.abs(dy) > 0.4) dragged.current = true
    setView((current) => ({
      ...current,
      x: Math.max(0, Math.min(100 - current.width, drag.current!.viewX - dx)),
      y: Math.max(0, Math.min(100 - current.height, drag.current!.viewY - dy)),
    }))
  }

  const stopDrag = (event: React.PointerEvent<SVGSVGElement>) => {
    drag.current = null
    event.currentTarget.releasePointerCapture(event.pointerId)
  }

  const wheelZoom = (event: React.WheelEvent<SVGSVGElement>) => {
    event.preventDefault()
    zoom(event.deltaY > 0 ? 1.18 : 0.84)
  }

  const validate = () => {
    if (!activePlayer || !marker) return
    onAnswer(activePlayer.id, marker)
    setMarker(null)
  }

  return (
    <section className="lost-place-round">
      <header className="lost-place-toolbar">
        <div>
          <strong>Carte de {question.mapRegion ?? 'Paldea'}</strong>
          <small>{submitted} / {players.length} réponses · glisse pour déplacer · molette pour zoomer</small>
        </div>
        <div className="map-controls">
          <button onClick={() => zoom(1.25)}>−</button>
          <button onClick={() => pan(0, -1)}>↑</button>
          <button onClick={() => pan(-1, 0)}>←</button>
          <button onClick={() => pan(1, 0)}>→</button>
          <button onClick={() => pan(0, 1)}>↓</button>
          <button onClick={() => zoom(0.8)}>＋</button>
          <button onClick={() => setView(initialView)}>Reset</button>
        </div>
      </header>

      <div className="region-map-frame">
        <svg
          className="region-map"
          style={{ aspectRatio: mapAsset.aspectRatio }}
          viewBox={`${view.x} ${view.y} ${view.width} ${view.height}`}
          onClick={placeMarker}
          onPointerDown={startDrag}
          onPointerMove={moveDrag}
          onPointerUp={stopDrag}
          onPointerCancel={stopDrag}
          onWheel={wheelZoom}
          role="img"
          aria-label={`Carte interactive de ${question.mapRegion ?? 'Paldea'}`}
        >
          <image href={mapAsset.src} x="0" y="0" width="100" height="100" preserveAspectRatio="none" />
          {marker && !revealed && <MapPin {...marker} color={activePlayer?.color ?? '#f2c94c'} />}
          {revealed && target && (
            <g className="map-target">
              <circle cx={target.x} cy={target.y} r="2.7" fill="#62d68b22" stroke="#62d68b" strokeWidth=".8" />
              <circle cx={target.x} cy={target.y} r=".75" fill="#62d68b" stroke="#fff" strokeWidth=".35" />
            </g>
          )}
          {revealed && target && revealedMarkers.map(({ player, point }) => (
            <line key={`line-${player.id}`} x1={point.x} y1={point.y} x2={target.x} y2={target.y} stroke={player.color} strokeWidth=".7" strokeDasharray="2 1" opacity=".8" />
          ))}
          {revealedMarkers.map(({ player, point }) => <MapPin key={player.id} {...point} color={player.color} />)}
        </svg>
      </div>

      {!revealed && activePlayer && (
        <div className="active-map-player" style={{ '--player': activePlayer.color } as React.CSSProperties}>
          <span>{activePlayer.avatar}</span>
          <div><strong>Au tour de {activePlayer.name}</strong><small>Clique sur la carte, ajuste ton marqueur puis valide.</small></div>
          <button disabled={!marker} onClick={validate}>Valider ce lieu</button>
        </div>
      )}
      {!revealed && !activePlayer && <p className="all-placed">Tous les marqueurs sont placés. Révélez maintenant la réponse.</p>}
      {revealed && (
        <div className="map-results">
          <p className="map-solution">
            La bonne réponse était <strong>{question.acceptedAnswers[0]}</strong>.
          </p>
          {revealedMarkers.map(({ player, points, distance }) => (
            <span key={player.id} style={{ borderColor: player.color }}>
              {player.avatar} {player.name} · <b>{points} pts</b> · {mapAccuracyLabel(distance)} · écart {distance.toFixed(1)}
            </span>
          ))}
        </div>
      )}
    </section>
  )
}
