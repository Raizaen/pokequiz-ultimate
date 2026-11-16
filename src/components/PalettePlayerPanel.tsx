import { useState, type CSSProperties } from 'react'
import type { ColorAnswer, Player, PlayerAnswer, Question } from '../domain/quiz'
import { isColorAnswer } from '../engine/answerValidation'
import { PaletteSpriteCanvas } from './PaletteSpriteCanvas'

interface Props {
  player: Player
  question: Question
  answer?: PlayerAnswer
  revealed: boolean
  onAnswer: (value: ColorAnswer) => void
}

const colorCss = ({ hue, saturation, lightness }: ColorAnswer) => `hsl(${hue} ${saturation}% ${lightness}%)`

export function PalettePlayerPanel({ player, question, answer, revealed, onAnswer }: Props) {
  const target = question.paletteTarget
  const submittedColor = answer && isColorAnswer(answer.value) ? answer.value : null
  const [color, setColor] = useState<ColorAnswer>(() => ({
    hue: ((target?.hue ?? 0) + 137) % 360,
    saturation: target?.saturation ?? 65,
    lightness: target?.lightness ?? 55,
  }))
  const locked = revealed || Boolean(answer?.locked)
  const displayedColor = submittedColor ?? color

  if (!target) return null

  const update = (field: keyof ColorAnswer, value: number) => setColor((current) => ({ ...current, [field]: value }))

  return (
    <article className="player-panel palette-player-panel" style={{ '--player': player.color } as CSSProperties}>
      <header>
        <span className="avatar">{player.avatar}</span>
        <strong>{player.name}</strong>
        <b>{player.score} pts</b>
      </header>

      <div className={`palette-comparison ${revealed ? 'is-revealed' : ''}`}>
        <div>
          <PaletteSpriteCanvas question={question} color={displayedColor} label={`Couleur proposée par ${player.name}`} />
          <span>{revealed ? 'Ta proposition' : 'Ta palette'}</span>
        </div>
        {revealed && (
          <div>
            <PaletteSpriteCanvas question={question} color={target} label={`Couleur originale de ${target.pokemonName}`} />
            <span>Original</span>
          </div>
        )}
      </div>

      <div className="palette-controls">
        <label>
          <span><b>Teinte</b><output>{Math.round(color.hue)}°</output></span>
          <input className="hue-slider" type="range" min="0" max="359" value={color.hue} disabled={locked} onChange={(event) => update('hue', Number(event.target.value))} />
        </label>
        <label>
          <span><b>Saturation</b><output>{Math.round(color.saturation)}%</output></span>
          <input type="range" min="10" max="100" value={color.saturation} disabled={locked} style={{ '--slider-color': colorCss({ ...color, saturation: 100 }) } as CSSProperties} onChange={(event) => update('saturation', Number(event.target.value))} />
        </label>
        <label>
          <span><b>Luminosité</b><output>{Math.round(color.lightness)}%</output></span>
          <input type="range" min="15" max="85" value={color.lightness} disabled={locked} style={{ '--slider-color': colorCss(color) } as CSSProperties} onChange={(event) => update('lightness', Number(event.target.value))} />
        </label>
      </div>

      {!answer && !revealed && <button className="palette-submit" onClick={() => onAnswer(color)}>Valider ma couleur</button>}
      {answer && !revealed && <p className="palette-waiting">Couleur enregistrée · En attente des autres joueurs</p>}
      {revealed && <p className="palette-score"><strong>{answer?.pointsAwarded ?? 0} / {question.points}</strong> points de précision</p>}
    </article>
  )
}
