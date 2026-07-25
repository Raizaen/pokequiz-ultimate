import { describe, expect, it } from 'vitest'
import { isAnswerCorrect } from '../../engine/answerValidation'
import { statOrderQuestions } from './statOrderQuestions'

describe('Stats en Ordre', () => {
  it('propose soixante séries de cinq Pokémon Champions sans égalité', () => {
    expect(statOrderQuestions).toHaveLength(60)
    expect(statOrderQuestions.every(({ orderEntries, type, category }) =>
      type === 'stat-order'
      && category === 'Stats en Ordre'
      && orderEntries?.length === 5
      && new Set(orderEntries.map(({ value }) => value)).size === 5,
    )).toBe(true)
  })

  it('répartit dix séries sur chacune des six statistiques', () => {
    const templates = new Map<string, number>()
    for (const { template } of statOrderQuestions) {
      templates.set(template ?? '', (templates.get(template ?? '') ?? 0) + 1)
    }
    expect([...templates.values()]).toEqual([10, 10, 10, 10, 10, 10])
  })

  it('valide uniquement l’ordre croissant exact', () => {
    for (const question of statOrderQuestions) {
      const correct = [...(question.orderEntries ?? [])]
        .sort((left, right) => left.value - right.value)
        .map(({ name }) => name)
      expect(isAnswerCorrect(question, correct)).toBe(true)
      expect(isAnswerCorrect(question, [...correct].reverse())).toBe(false)
    }
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
