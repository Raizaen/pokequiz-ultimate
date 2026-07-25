import { describe, expect, it } from 'vitest'
import { curatedAnimeQuestions } from './animePilot'

describe('curated anime pilot pack', () => {
  it('contient 20 questions Anime validées et sourcées', () => {
    expect(curatedAnimeQuestions).toHaveLength(20)
    expect(curatedAnimeQuestions.every(({ category, validation, difficultyReason, generationScope }) =>
      category === 'Anime'
      && validation?.status === 'validated'
      && validation.verifiedAt === '2026-07-25'
      && validation.sources.length >= 1
      && Boolean(difficultyReason)
      && Boolean(generationScope),
    )).toBe(true)
  })

  it('couvre au moins quinze modèles éditoriaux', () => {
    expect(new Set(curatedAnimeQuestions.map(({ template }) => template)).size).toBeGreaterThanOrEqual(15)
  })

  it('inclut des QCM multiples complets', () => {
    const multiple = curatedAnimeQuestions.filter(({ type }) => type === 'multiple-select')
    expect(multiple.length).toBeGreaterThanOrEqual(2)
    expect(multiple.every(({ choices, correctChoices }) =>
      choices?.length === 4 && correctChoices && correctChoices.length >= 2,
    )).toBe(true)
  })
})
