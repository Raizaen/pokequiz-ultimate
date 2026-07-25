import { useState } from 'react'
import type { Question } from '../domain/quiz'

type OrderEntry = NonNullable<Question['orderEntries']>[number]

interface Props {
  question: Question
  locked: boolean
  onAnswer: (value: string[]) => void
}

export function StatOrderPanel({ question, locked, onAnswer }: Props) {
  const entries = question.orderEntries ?? []
  const [placed, setPlaced] = useState<OrderEntry[]>(entries.slice(0, 1))
  const [nextIndex, setNextIndex] = useState(1)
  const candidate = entries[nextIndex]
  const complete = placed.length === entries.length

  const insertCandidate = (position: number) => {
    if (!candidate || locked) return
    setPlaced([...placed.slice(0, position), candidate, ...placed.slice(position)])
    setNextIndex(nextIndex + 1)
  }

  if (entries.length === 0) return <p>Épreuve indisponible.</p>

  return (
    <div className="stat-order">
      <div className="stat-order-heading">
        <strong>{question.statLabel ?? 'Statistique'}</strong>
        <span>{Math.min(nextIndex, entries.length)} / {entries.length} Pokémon</span>
      </div>

      {!complete && candidate && (
        <div className="order-candidate">
          <small>À placer</small>
          <img src={candidate.image} alt={candidate.name} />
          <strong>{candidate.name}</strong>
          <span>Valeur masquée</span>
        </div>
      )}

      <div className="order-scale">
        <span>Moins rapide</span>
        <span>Plus rapide</span>
      </div>

      <div className="order-track">
        {!complete && <button className="insertion-slot" disabled={locked} onClick={() => insertCandidate(0)}>＋</button>}
        {placed.map((entry, index) => (
          <div className="order-position" key={entry.name}>
            <article className="order-pokemon">
              <img src={entry.image} alt={entry.name} />
              <strong>{entry.name}</strong>
              <span>{question.statLabel ?? 'Stat.'} {entry.value}</span>
            </article>
            {!complete && <button className="insertion-slot" disabled={locked} onClick={() => insertCandidate(index + 1)}>＋</button>}
          </div>
        ))}
      </div>

      {complete && (
        <button className="validate-order" disabled={locked} onClick={() => onAnswer(placed.map(({ name }) => name))}>
          Valider cet ordre
        </button>
      )}
      {!complete && <p className="order-help">Choisis le cercle où insérer ce Pokémon.</p>}
    </div>
  )
}
