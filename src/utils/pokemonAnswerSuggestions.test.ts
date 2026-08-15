import { describe, expect, it } from 'vitest'
import type { Question } from '../domain/quiz'
import { pokemonAnswerSuggestions, questionExpectsPokemonName } from './pokemonAnswerSuggestions'

const question: Question = {
  id: 'test',
  type: 'open',
  category: 'Test',
  difficulty: 1,
  prompt: 'Test',
  acceptedAnswers: ['Pikachu'],
  explanation: '',
  points: 10,
  durationSeconds: 30,
}

describe('suggestions de réponses Pokémon', () => {
  it('propose les noms et formes correspondant à la saisie', () => {
    const suggestions = pokemonAnswerSuggestions('miaou', 20)

    expect(suggestions).toContain('Miaouss')
    expect(suggestions.some((name) => name.startsWith('Miaouss ('))).toBe(true)
  })

  it('active les suggestions uniquement quand la réponse attendue est un Pokémon', () => {
    expect(questionExpectsPokemonName(question)).toBe(true)
    expect(questionExpectsPokemonName({ ...question, acceptedAnswers: ['Kanto'] })).toBe(false)
    expect(questionExpectsPokemonName({ ...question, type: 'mining', acceptedAnswers: ['Miaouss (Gigamax)'] })).toBe(true)
  })
})
