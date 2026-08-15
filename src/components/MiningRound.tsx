import { useMemo, useState } from 'react'
import type { Question } from '../domain/quiz'
import { SpriteImage } from './SpriteImage'

type Tool = 'pickaxe' | 'hammer'

const columns = 8
const rows = 6
const maximumDamage = 30

function hash(value: string): number {
  return [...value].reduce((result, character) => ((result * 31) + character.charCodeAt(0)) >>> 0, 2166136261)
}

function initialRocks(questionId: string): number[] {
  let seed = hash(questionId)
  return Array.from({ length: columns * rows }, () => {
    seed = (seed * 1664525 + 1013904223) >>> 0
    return 2 + (seed % 2)
  })
}

interface Props {
  question: Question
  revealed: boolean
  availablePoints: number
  onClearedTilesChange: (clearedTiles: number) => void
}

export function MiningRound({ question, revealed, availablePoints, onClearedTilesChange }: Props) {
  const startingRocks = useMemo(() => initialRocks(question.id), [question.id])
  const [rocks, setRocks] = useState(startingRocks)
  const [tool, setTool] = useState<Tool>('pickaxe')
  const [damage, setDamage] = useState(0)
  const collapsed = damage >= maximumDamage
  const visibleTiles = rocks.filter((depth) => depth === 0).length
  const uncoveredPercent = Math.round((visibleTiles / rocks.length) * 100)

  const dig = (index: number) => {
    if (revealed || collapsed || rocks[index] === 0) return
    const x = index % columns
    const y = Math.floor(index / columns)
    const next = [...rocks]

    if (tool === 'pickaxe') {
      next[index] = Math.max(0, next[index] - 2)
      setDamage((current) => Math.min(maximumDamage, current + 1))
    } else {
      for (let offsetY = -1; offsetY <= 1; offsetY += 1) {
        for (let offsetX = -1; offsetX <= 1; offsetX += 1) {
          const targetX = x + offsetX
          const targetY = y + offsetY
          if (targetX < 0 || targetX >= columns || targetY < 0 || targetY >= rows) continue
          const target = targetY * columns + targetX
          next[target] = Math.max(0, next[target] - 1)
        }
      }
      setDamage((current) => Math.min(maximumDamage, current + 3))
    }

    setRocks(next)
    onClearedTilesChange(next.filter((depth) => depth === 0).length)
  }

  return (
    <section className="mining-round" aria-label="Fouille dans les Mines">
      <header className="mining-toolbar">
        <div>
          <span className="eyebrow">FOUILLE DANS LES MINES</span>
          <strong>Choisis ton outil puis frappe la paroi</strong>
          <small>Pioche : précise · Marteau : large mais destructeur</small>
        </div>
        <div className="mining-tools" role="group" aria-label="Outil de fouille">
          <button className={tool === 'pickaxe' ? 'selected' : ''} disabled={revealed || collapsed} onClick={() => setTool('pickaxe')}><i>⛏️</i><span>Pioche</span></button>
          <button className={tool === 'hammer' ? 'selected' : ''} disabled={revealed || collapsed} onClick={() => setTool('hammer')}><i>🔨</i><span>Marteau</span></button>
        </div>
      </header>

      <div className="mining-status">
        <div><span>Stabilité du mur</span><b>{maximumDamage - damage} / {maximumDamage}</b></div>
        <div className="mining-stability"><i style={{ width: `${((maximumDamage - damage) / maximumDamage) * 100}%` }} /></div>
        <div className="mining-progress-detail">
          <small>{revealed ? 'Sprite entièrement révélé' : collapsed ? 'Le mur s’est effondré : la fouille est terminée !' : `${uncoveredPercent}% de la paroi dégagée`}</small>
          <strong>{availablePoints} point{availablePoints > 1 ? 's' : ''} disponible{availablePoints > 1 ? 's' : ''}</strong>
        </div>
      </div>

      <div className={`mining-wall ${collapsed ? 'collapsed' : ''} ${revealed ? 'revealed' : ''}`}>
        <div className="mining-sprite">
          {question.media && <SpriteImage media={question.media} revealed={revealed} />}
        </div>
        <div className="mining-grid">
          {rocks.map((depth, index) => (
            <button
              type="button"
              key={index}
              className={`mining-rock depth-${depth}`}
              aria-label={depth === 0 ? 'Zone dégagée' : `Frapper la roche, couche ${depth}`}
              disabled={revealed || collapsed || depth === 0}
              onClick={() => dig(index)}
            ><span /></button>
          ))}
        </div>
      </div>
      <p className="mining-help">Clique directement sur une case de roche. Tu peux changer d’outil entre chaque coup.</p>
    </section>
  )
}
