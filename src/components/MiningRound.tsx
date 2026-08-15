import { useMemo, useRef, useState, type CSSProperties } from 'react'
import type { Question } from '../domain/quiz'
import { applyMiningHit, type MiningTool } from '../engine/miningMechanics'
import { SpriteImage } from './SpriteImage'

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
    return 2 + ((seed >>> 16) % 2)
  })
}

function tileVariant(questionId: string, index: number): number {
  return (hash(`${questionId}-${index}`) >>> 16) % 2
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
  const rocksRef = useRef(startingRocks)
  const [tool, setTool] = useState<MiningTool>('pickaxe')
  const [damage, setDamage] = useState(0)
  const damageRef = useRef(0)
  const [impact, setImpact] = useState<{ id: number; index: number; tool: MiningTool; affected: number[] } | null>(null)
  const collapsed = damage >= maximumDamage
  const visibleTiles = rocks.filter((depth) => depth === 0).length
  const uncoveredPercent = Math.round((visibleTiles / rocks.length) * 100)

  const dig = (index: number) => {
    const currentRocks = rocksRef.current
    if (revealed || damageRef.current >= maximumDamage || currentRocks[index] === 0) return
    const hit = applyMiningHit(currentRocks, index, tool)
    const nextDamage = Math.min(maximumDamage, damageRef.current + (tool === 'pickaxe' ? 1 : 3))
    rocksRef.current = hit.rocks
    damageRef.current = nextDamage
    setRocks(hit.rocks)
    setDamage(nextDamage)
    setImpact({ id: Date.now(), index, tool, affected: hit.affected })
    onClearedTilesChange(hit.rocks.filter((depth) => depth === 0).length)
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
          <button className={tool === 'pickaxe' ? 'selected' : ''} disabled={revealed || collapsed} onClick={() => setTool('pickaxe')}><img src="/assets/mining/pickaxe.png" alt="" /><span>Pioche</span></button>
          <button className={tool === 'hammer' ? 'selected' : ''} disabled={revealed || collapsed} onClick={() => setTool('hammer')}><img src="/assets/mining/hammer.png" alt="" /><span>Marteau</span></button>
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
              className={`mining-rock depth-${depth} variant-${tileVariant(question.id, index)} ${impact?.affected.includes(index) ? 'hit' : ''} ${impact?.index === index ? 'direct-hit' : ''}`}
              aria-label={depth === 0 ? 'Zone dégagée' : `Frapper la roche, couche ${depth}`}
              disabled={revealed || collapsed || depth === 0}
              onClick={() => dig(index)}
            />
          ))}
        </div>
        {impact && !revealed && (
          <div
            key={impact.id}
            className={`mining-impact ${impact.tool}`}
            style={{
              '--impact-x': `${(((impact.index % columns) + .5) / columns) * 100}%`,
              '--impact-y': `${((Math.floor(impact.index / columns) + .5) / rows) * 100}%`,
            } as CSSProperties}
          >
            <img src={`/assets/mining/${impact.tool}.png`} alt="" />
            {Array.from({ length: impact.tool === 'hammer' ? 9 : 6 }, (_, particle) => <i key={particle} style={{ '--particle': particle } as CSSProperties} />)}
          </div>
        )}
        {collapsed && !revealed && (
          <div className="mining-collapse-overlay" role="status">
            <div>{Array.from({ length: 12 }, (_, debris) => <i key={debris} style={{ '--debris': debris } as CSSProperties} />)}</div>
            <strong>PAROI EFFONDRÉE</strong>
            <span>Tu peux encore proposer ta réponse.</span>
          </div>
        )}
      </div>
      <p className="mining-help">Clique directement sur une case de roche. Tu peux changer d’outil entre chaque coup.</p>
    </section>
  )
}
