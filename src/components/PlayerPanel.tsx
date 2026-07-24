import { useState } from 'react'
import type { Player, PlayerAnswer, Question } from '../domain/quiz'

interface Props {
  player: Player
  question: Question
  answer?: PlayerAnswer
  disabled: boolean
  onAnswer: (value: string) => void
}

export function PlayerPanel({ player, question, answer, disabled, onAnswer }: Props) {
  const [draft, setDraft] = useState('')
  const locked = disabled || answer?.locked
  const attemptsLeft = question.type === 'multiple-choice' ? (answer ? 0 : 1) : 3 - (answer?.attempts ?? 0)

  const submit = () => {
    if (!draft.trim() || locked) return
    onAnswer(draft)
    setDraft('')
  }

  return (
    <article className={`player-panel ${answer?.isCorrect ? 'is-correct' : ''}`} style={{ '--player': player.color } as React.CSSProperties}>
      <header>
        <span className="avatar">{player.avatar}</span>
        <strong>{player.name}</strong>
        <b>{player.score} pts</b>
      </header>

      {question.type === 'multiple-choice' ? (
        <div className="choices">
          {question.choices?.map((choice, index) => (
            <button key={choice} className={`choice choice-${index}`} disabled={locked} onClick={() => onAnswer(choice)}>
              <span>{['▲', '◆', '●', '■'][index]}</span>{choice}
            </button>
          ))}
        </div>
      ) : (
        <div className="open-answer">
          <input
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => event.key === 'Enter' && submit()}
            placeholder="Ta réponse…"
            disabled={locked}
            aria-label={`Réponse de ${player.name}`}
          />
          <button onClick={submit} disabled={locked || !draft.trim()}>Valider</button>
        </div>
      )}

      <p className="attempts">
        {answer?.isCorrect ? '✓ Bonne réponse !' : locked && answer ? 'Réponse verrouillée' : `${attemptsLeft} essai${attemptsLeft > 1 ? 's' : ''} restant${attemptsLeft > 1 ? 's' : ''}`}
      </p>
    </article>
  )
}
