import { describe, expect, it } from 'vitest'
import { isAnswerCorrect } from '../../engine/answerValidation'
import { statOrderQuestions } from './statOrderQuestions'

describe('Stats en Ordre', () => {
  it('propose douze séries de cinq Pokémon Champions aux vitesses distinctes', () => {
    expect(statOrderQuestions).toHaveLength(12)
    expect(statOrderQuestions.every(({ orderEntries, type, category }) =>
      type === 'stat-order'
      && category === 'Stratégie'
      && orderEntries?.length === 5
      && new Set(orderEntries.map(({ value }) => value)).size === 5,
    )).toBe(true)
  })

  it('valide uniquement l’ordre croissant exact', () => {
    const question = statOrderQuestions[0]
    const correct = [...(question.orderEntries ?? [])]
      .sort((left, right) => left.value - right.value)
      .map(({ name }) => name)
    expect(isAnswerCorrect(question, correct)).toBe(true)
    expect(isAnswerCorrect(question, [...correct].reverse())).toBe(false)
  })

  it('fournit images, sources et explications pour chaque série', () => {
    expect(statOrderQuestions.every(({ orderEntries, explanation, validation }) =>
      orderEntries?.every(({ image }) => image.startsWith('https://'))
      && explanation.includes('→')
      && validation?.status === 'validated'
      && validation.sources.length === 6,
    )).toBe(true)
  })
})
