import { useMemo, useState } from 'react'
import { pokemonAnswerSuggestions } from '../utils/pokemonAnswerSuggestions'

interface Props {
  value: string
  onChange: (value: string) => void
  onConfirm: () => void
  confirmLabel: string
  placeholder: string
  ariaLabel: string
  disabled: boolean
  suggestionsEnabled: boolean
}

export function PokemonAnswerField({ value, onChange, onConfirm, confirmLabel, placeholder, ariaLabel, disabled, suggestionsEnabled }: Props) {
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const suggestions = useMemo(
    () => suggestionsEnabled ? pokemonAnswerSuggestions(value) : [],
    [suggestionsEnabled, value],
  )

  const choose = (suggestion: string) => {
    onChange(suggestion)
    setOpen(false)
    setActiveIndex(-1)
  }

  return (
    <div className="open-answer">
      <div className="answer-search">
        <input
          value={value}
          onChange={(event) => {
            onChange(event.target.value)
            setOpen(true)
            setActiveIndex(-1)
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => window.setTimeout(() => setOpen(false), 100)}
          onKeyDown={(event) => {
            if (event.key === 'ArrowDown' && suggestions.length > 0) {
              event.preventDefault()
              setOpen(true)
              setActiveIndex((current) => (current + 1) % suggestions.length)
            } else if (event.key === 'ArrowUp' && suggestions.length > 0) {
              event.preventDefault()
              setOpen(true)
              setActiveIndex((current) => current <= 0 ? suggestions.length - 1 : current - 1)
            } else if (event.key === 'Escape') {
              setOpen(false)
            } else if (event.key === 'Enter') {
              event.preventDefault()
              if (open && activeIndex >= 0 && suggestions[activeIndex]) choose(suggestions[activeIndex])
              else onConfirm()
            }
          }}
          placeholder={placeholder}
          disabled={disabled}
          aria-label={ariaLabel}
          autoComplete="off"
          role="combobox"
          aria-expanded={open && suggestions.length > 0}
          aria-autocomplete="list"
        />
        {open && suggestions.length > 0 && (
          <div className="answer-suggestions" role="listbox" aria-label="Suggestions de Pokémon">
            {suggestions.map((suggestion, index) => (
              <button
                type="button"
                key={suggestion}
                role="option"
                aria-selected={index === activeIndex}
                className={index === activeIndex ? 'active' : ''}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => choose(suggestion)}
              >{suggestion}</button>
            ))}
          </div>
        )}
      </div>
      <button onClick={onConfirm} disabled={disabled || !value.trim()}>{confirmLabel}</button>
    </div>
  )
}
