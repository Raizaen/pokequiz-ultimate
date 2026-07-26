import { describe, expect, it } from 'vitest'
import { curatedGameQuestions } from './gamesPilot'

describe('curated core games pilot pack', () => {
  it('contient 20 questions validées et sourcées', () => {
    expect(curatedGameQuestions).toHaveLength(20)
    expect(curatedGameQuestions.every(({ category, validation, difficultyReason, generationScope }) =>
      category === 'Jeux principaux'
      && validation?.status === 'validated'
      && validation.verifiedAt === '2026-07-25'
      && validation.sources.length >= 1
      && Boolean(difficultyReason)
      && Boolean(generationScope),
    )).toBe(true)
  })

  it('couvre au moins quinze modèles éditoriaux', () => {
    expect(new Set(curatedGameQuestions.map(({ template }) => template)).size).toBeGreaterThanOrEqual(15)
  })

  it('inclut plusieurs QCM multiples complets', () => {
    const multiple = curatedGameQuestions.filter(({ type }) => type === 'multiple-select')
    expect(multiple.length).toBeGreaterThanOrEqual(6)
    expect(multiple.every(({ choices, correctChoices }) =>
      choices?.length === 4 && correctChoices && correctChoices.length >= 2,
    )).toBe(true)
  })
})
