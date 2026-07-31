import { describe, expect, it } from 'vitest'
import { evolutionNameQuestions } from './evolutionNameQuestions'

describe('questions ouvertes sur les évolutions', () => {
  it('contient un lot varié de questions singulières et ramifiées', () => {
    expect(evolutionNameQuestions.length).toBeGreaterThanOrEqual(30)
    expect(evolutionNameQuestions.some(({ type }) => type === 'open')).toBe(true)
    expect(evolutionNameQuestions.some(({ type }) => type === 'open-multiple')).toBe(true)
  })

  it('déclare toutes les branches attendues pour les réponses multiples', () => {
    const multiple = evolutionNameQuestions.filter(({ type }) => type === 'open-multiple')
    expect(multiple.every(({ correctChoices, acceptedAnswers }) =>
      (correctChoices?.length ?? 0) > 1 && acceptedAnswers.length === 1,
    )).toBe(true)
  })

  it('possède une source et une explication pour chaque question', () => {
    expect(evolutionNameQuestions.every(({ explanation, validation }) =>
      explanation.length > 0 && validation?.status === 'validated' && validation.sources.length > 0,
    )).toBe(true)
  })
})
