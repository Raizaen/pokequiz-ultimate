import { useState } from 'react'
import type { AnswerValue, Player, PlayerAnswer, Question } from '../domain/quiz'
import { StatOrderPanel } from './StatOrderPanel'
import { PokemonAnswerField } from './PokemonAnswerField'
import { questionExpectsPokemonName } from '../utils/pokemonAnswerSuggestions'

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
  const isWrong = Boolean(answer && answer.attempts > 0 && answer.locked && !answer.isCorrect)
  const attemptsLeft = question.type === 'open' || question.type === 'open-multiple' || question.type === 'mining' ? 3 - (answer?.attempts ?? 0) : (answer ? 0 : 1)

  const submit = () => {
    if (!draft.trim() || locked) return
    onAnswer(draft)
    setDraft('')
  }

  const addOpenChoice = () => {
    const value = draft.trim()
    if (!value || locked || selectedChoices.some((choice) => choice.toLocaleLowerCase('fr') === value.toLocaleLowerCase('fr'))) return
    setSelectedChoices([...selectedChoices, value])
    setDraft('')
  }

  return (
    <article className={`player-panel ${answer?.isCorrect ? 'is-correct' : isWrong ? 'is-wrong' : ''}`} style={{ '--player': player.color } as React.CSSProperties}>
      <header>
        <span className="avatar">{player.avatar}</span>
        <strong>{player.name}</strong>
        <b>{player.score} pts</b>
      </header>

      {question.type === 'map-location' ? null : question.type === 'stat-order' ? (
        <StatOrderPanel question={question} locked={Boolean(locked)} onAnswer={onAnswer} />
      ) : question.type === 'multiple-choice' ? (
        <div className="choices">
          {question.choices?.map((choice, index) => (
            <button key={choice} className={`choice choice-${index}`} disabled={locked} onClick={() => onAnswer(choice)}>
              {question.choiceMedia?.[choice] && <img className="choice-image" src={question.choiceMedia[choice]} alt="" />}
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
      ) : question.type === 'open-multiple' ? (
        <div className="open-multiple-answer">
          <div className="multi-select-hint">Saisis toutes les évolutions, dans n’importe quel ordre</div>
          <PokemonAnswerField
            value={draft}
            onChange={setDraft}
            onConfirm={addOpenChoice}
            confirmLabel="Ajouter"
            placeholder="Nom d’un Pokémon…"
            disabled={Boolean(locked)}
            ariaLabel={`Évolution proposée par ${player.name}`}
            suggestionsEnabled={questionExpectsPokemonName(question)}
          />
          <div className="open-answer-chips">
            {selectedChoices.map((choice) => (
              <button key={choice} disabled={locked} onClick={() => setSelectedChoices(selectedChoices.filter((value) => value !== choice))}>
                {choice} <span>×</span>
              </button>
            ))}
          </div>
          <button className="validate-selection" disabled={locked || selectedChoices.length === 0} onClick={() => onAnswer(selectedChoices)}>
            Valider la liste ({selectedChoices.length})
          </button>
        </div>
      ) : (
        <PokemonAnswerField
          value={draft}
          onChange={setDraft}
          onConfirm={submit}
          confirmLabel="Valider"
          placeholder="Ta réponse…"
          disabled={Boolean(locked)}
          ariaLabel={`Réponse de ${player.name}`}
          suggestionsEnabled={questionExpectsPokemonName(question)}
        />
      )}

      <p className="attempts">
        {question.type === 'stat-order' && answer
          ? `${answer.pointsAwarded ?? 0} / 25 points remportés`
          : answer?.isCorrect
            ? '✓ Bonne réponse !'
            : locked && answer
              ? 'Réponse verrouillée'
              : `${attemptsLeft} essai${attemptsLeft > 1 ? 's' : ''} restant${attemptsLeft > 1 ? 's' : ''}`}
      </p>
    </article>
  )
}
