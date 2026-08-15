import type { Question } from '../domain/quiz'
import { normalizeAnswer } from '../engine/answerValidation'
import spriteCatalog from '../data/generated/spriteCatalog.json'
import { localizePokemonFormName } from './pokemonNameLocalization'

export const pokemonAnswerNames = [...new Set(spriteCatalog.map(({ name }) => localizePokemonFormName(name)))]
  .sort((left, right) => left.localeCompare(right, 'fr'))

const normalizedPokemonNames = new Set(pokemonAnswerNames.map(normalizeAnswer))

export function questionExpectsPokemonName(question: Question): boolean {
  if (question.type === 'mining') return true
  const expected = [...question.acceptedAnswers, ...(question.correctChoices ?? [])]
  return expected.some((answer) => normalizedPokemonNames.has(normalizeAnswer(answer)))
}

export function pokemonAnswerSuggestions(query: string, limit = 7): string[] {
  const normalizedQuery = normalizeAnswer(query)
  if (!normalizedQuery) return []

  return pokemonAnswerNames
    .map((name) => ({ name, normalized: normalizeAnswer(name) }))
    .filter(({ normalized }) => normalized.includes(normalizedQuery))
    .sort((left, right) => {
      const leftStarts = left.normalized.startsWith(normalizedQuery) ? 0 : 1
      const rightStarts = right.normalized.startsWith(normalizedQuery) ? 0 : 1
      return leftStarts - rightStarts || left.name.length - right.name.length || left.name.localeCompare(right.name, 'fr')
    })
    .slice(0, limit)
    .map(({ name }) => name)
}
