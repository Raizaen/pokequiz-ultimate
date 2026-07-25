import { useState } from 'react'
import type { AnswerValue, Player, PlayerAnswer, Question } from '../domain/quiz'
import { StatOrderPanel } from './StatOrderPanel'

interface Props {
  player: Player
  question: Question
  answer?: PlayerAnswer
  disabled: boolean
  onAnswer: (value: AnswerValue) => void
}

export function PlayerPanel({ player, question, answer, disabled, onAnswer }: Props) {
  const [draft, setDraft] = useState('')
  const [selectedChoices, setSelectedChoices] = useState<string[]>([])
  const locked = disabled || answer?.locked
  const attemptsLeft = question.type === 'open' ? 3 - (answer?.attempts ?? 0) : (answer ? 0 : 1)

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

      {question.type === 'stat-order' ? (
        <StatOrderPanel question={question} locked={Boolean(locked)} onAnswer={onAnswer} />
      ) : question.type === 'multiple-choice' ? (
        <div className="choices">
          {question.choices?.map((choice, index) => (
            <button key={choice} className={`choice choice-${index}`} disabled={locked} onClick={() => onAnswer(choice)}>
              <span>{['▲', '◆', '●', '■'][index]}</span>{choice}
            </button>
          ))}
        </div>
      ) : question.type === 'multiple-select' ? (
        <>
          <div className="multi-select-hint">Plusieurs réponses possibles</div>
          <div className="choices">
            {question.choices?.map((choice, index) => {
              const selected = selectedChoices.includes(choice)
              return (
                <button
                  key={choice}
                  className={`choice choice-${index} ${selected ? 'is-selected' : ''}`}
                  disabled={locked}
                  aria-pressed={selected}
                  onClick={() => setSelectedChoices(selected
                    ? selectedChoices.filter((value) => value !== choice)
                    : [...selectedChoices, choice])}
                >
                  <span>{selected ? '✓' : ['▲', '◆', '●', '■'][index]}</span>{choice}
                </button>
              )
            })}
          </div>
          <button className="validate-selection" disabled={locked || selectedChoices.length === 0} onClick={() => onAnswer(selectedChoices)}>
            Valider {selectedChoices.length} réponse{selectedChoices.length > 1 ? 's' : ''}
          </button>
        </>
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
