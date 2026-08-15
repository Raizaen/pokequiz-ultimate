import { describe, expect, it } from 'vitest'
import { maxAttemptsFor } from '../engine/answerValidation'
import { miningQuestions } from './miningQuestions'

describe('Fouille dans les Mines', () => {
  it('génère une question unique pour chaque entrée du catalogue de sprites', () => {
    expect(miningQuestions.length).toBeGreaterThanOrEqual(1000)
    expect(new Set(miningQuestions.map(({ id }) => id)).size).toBe(miningQuestions.length)
  })

  it('utilise uniquement des sprites Pokémon et des réponses ouvertes à trois essais', () => {
    expect(miningQuestions.every((question) => question.type === 'mining')).toBe(true)
    expect(miningQuestions.every((question) => question.category === 'Fouille dans les Mines')).toBe(true)
    expect(miningQuestions.every((question) => Boolean(question.media?.src))).toBe(true)
    expect(maxAttemptsFor(miningQuestions[0])).toBe(3)
  })
})
