import { describe, expect, it } from 'vitest'
import { curatedLoreQuestions } from './lorePilot'

describe('curated lore pilot pack', () => {
  it('contient 20 questions Lore validées et sourcées', () => {
    expect(curatedLoreQuestions).toHaveLength(20)
    expect(curatedLoreQuestions.every(({ category, validation, difficultyReason, generationScope }) =>
      category === 'Lore'
      && validation?.status === 'validated'
      && validation.verifiedAt === '2026-07-25'
      && validation.sources.length >= 1
      && Boolean(difficultyReason)
      && Boolean(generationScope),
    )).toBe(true)
  })

  it('couvre au moins quinze modèles éditoriaux', () => {
    expect(new Set(curatedLoreQuestions.map(({ template }) => template)).size).toBeGreaterThanOrEqual(15)
  })

  it('inclut de nombreux QCM multiples complets', () => {
    const multiple = curatedLoreQuestions.filter(({ type }) => type === 'multiple-select')
    expect(multiple.length).toBeGreaterThanOrEqual(9)
    expect(multiple.every(({ choices, correctChoices }) =>
      choices?.length === 4 && correctChoices && correctChoices.length >= 2,
    )).toBe(true)
  })
})
