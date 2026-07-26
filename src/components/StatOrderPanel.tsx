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
  const [pendingPosition, setPendingPosition] = useState<number | null>(null)
  const candidate = entries[nextIndex]
  const complete = placed.length === entries.length

  const confirmCandidate = () => {
    if (!candidate || pendingPosition === null || locked) return
    setPlaced([
      ...placed.slice(0, pendingPosition),
      candidate,
      ...placed.slice(pendingPosition),
    ])
    setNextIndex(nextIndex + 1)
    setPendingPosition(null)
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
        <span>Moins de {question.statLabel ?? 'statistique'}</span>
        <span>Plus de {question.statLabel ?? 'statistique'}</span>
      </div>

      <div className="order-track">
        {!complete && pendingPosition === 0 && candidate && (
          <article className="order-pokemon order-pokemon-pending">
            <img src={candidate.image} alt={candidate.name} />
            <strong>{candidate.name}</strong>
            <span>Position à confirmer</span>
          </article>
        )}
        {!complete && pendingPosition === null && (
          <button className="insertion-slot" disabled={locked} onClick={() => setPendingPosition(0)}>＋</button>
        )}
        {placed.map((entry, index) => (
          <div className="order-position" key={entry.name}>
            <article className="order-pokemon">
              <img src={entry.image} alt={entry.name} />
              <strong>{entry.name}</strong>
              <span>{question.statLabel ?? 'Stat.'} {entry.value}</span>
            </article>
            {!complete && pendingPosition === index + 1 && candidate && (
              <article className="order-pokemon order-pokemon-pending">
                <img src={candidate.image} alt={candidate.name} />
                <strong>{candidate.name}</strong>
                <span>Position à confirmer</span>
              </article>
            )}
            {!complete && pendingPosition === null && (
              <button className="insertion-slot" disabled={locked} onClick={() => setPendingPosition(index + 1)}>＋</button>
            )}
          </div>
        ))}
      </div>

      {!complete && pendingPosition !== null && (
        <div className="order-confirm-actions">
          <button className="validate-order" disabled={locked} onClick={confirmCandidate}>
            Valider cette position
          </button>
          <button className="cancel-order-position" disabled={locked} onClick={() => setPendingPosition(null)}>
            Changer de position
          </button>
        </div>
      )}
      {complete && (
        <button className="validate-order" disabled={locked} onClick={() => onAnswer(placed.map(({ name }) => name))}>
          Valider cet ordre
        </button>
      )}
      {!complete && pendingPosition === null && <p className="order-help">Choisis le cercle où insérer ce Pokémon.</p>}
      {!complete && pendingPosition !== null && <p className="order-help">Confirme cette position pour révéler sa statistique et passer au Pokémon suivant.</p>}
    </div>
  )
}
