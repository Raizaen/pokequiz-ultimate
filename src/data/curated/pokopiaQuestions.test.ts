import { describe, expect, it } from 'vitest'
import { questionsForConfig } from '../../engine/questionSelection'
import { pokopiaQuestions } from './pokopiaQuestions'

describe('pack Pokémon Pokopia', () => {
  it('contient exactement 50 questions vérifiées', () => {
    expect(pokopiaQuestions).toHaveLength(50)
    expect(pokopiaQuestions.every((question) =>
      question.category === 'Pokopia'
      && question.validation?.status === 'validated'
      && question.choices?.length === 4
      && question.choices.includes(question.acceptedAnswers[0]),
    )).toBe(true)
  })

  it('sépare le contenu sans spoilers de la partie complète', () => {
    const safe = questionsForConfig(pokopiaQuestions, {
      mode: 'category',
      category: 'Pokopia',
      difficulty: 'all',
      pokopiaSpoilers: 'safe',
    })
    const complete = questionsForConfig(pokopiaQuestions, {
      mode: 'category',
      category: 'Pokopia',
      difficulty: 'all',
      pokopiaSpoilers: 'all',
    })

    expect(safe.length).toBeGreaterThanOrEqual(40)
    expect(safe.every((question) => !question.tags?.includes('pokopia-spoiler'))).toBe(true)
    expect(complete).toHaveLength(50)
  })
})
