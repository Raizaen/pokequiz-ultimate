import { describe, expect, it } from 'vitest'
import { curatedPokedexQuestions } from './pokedexPilot'

describe('curated Pokédex pilot pack', () => {
  it('contient 20 questions Pokédex validées et sourcées', () => {
    expect(curatedPokedexQuestions).toHaveLength(20)
    expect(curatedPokedexQuestions.every(({ category, validation, difficultyReason, generationScope }) =>
      category === 'Pokédex'
      && validation?.status === 'validated'
      && validation.verifiedAt === '2026-07-25'
      && validation.sources.length >= 1
      && Boolean(difficultyReason)
      && Boolean(generationScope),
    )).toBe(true)
  })

  it('couvre au moins quinze modèles éditoriaux', () => {
    expect(new Set(curatedPokedexQuestions.map(({ template }) => template)).size).toBeGreaterThanOrEqual(15)
  })

  it('inclut plusieurs QCM multiples complets', () => {
    const multiple = curatedPokedexQuestions.filter(({ type }) => type === 'multiple-select')
    expect(multiple.length).toBeGreaterThanOrEqual(5)
    expect(multiple.every(({ choices, correctChoices }) =>
      choices?.length === 4 && correctChoices && correctChoices.length >= 2,
    )).toBe(true)
  })
})
