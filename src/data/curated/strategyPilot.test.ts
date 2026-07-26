import { describe, expect, it } from 'vitest'
import { curatedStrategyQuestions } from './strategyPilot'

describe('curated strategy pilot pack', () => {
  it('contient 20 questions validées et sourcées', () => {
    expect(curatedStrategyQuestions).toHaveLength(20)
    expect(curatedStrategyQuestions.every(({ category, validation, difficultyReason, generationScope }) =>
      category === 'Stratégie'
      && validation?.status === 'validated'
      && validation.verifiedAt === '2026-07-25'
      && validation.sources.length >= 1
      && Boolean(difficultyReason)
      && Boolean(generationScope),
    )).toBe(true)
  })

  it('couvre au moins quinze modèles éditoriaux', () => {
    expect(new Set(curatedStrategyQuestions.map(({ template }) => template)).size).toBeGreaterThanOrEqual(15)
  })

  it('mélange QCM simples et multiples', () => {
    expect(curatedStrategyQuestions.filter(({ type }) => type === 'multiple-choice').length).toBeGreaterThanOrEqual(14)
    const multiple = curatedStrategyQuestions.filter(({ type }) => type === 'multiple-select')
    expect(multiple.length).toBeGreaterThanOrEqual(4)
    expect(multiple.every(({ choices, correctChoices }) =>
      choices?.length === 4 && correctChoices && correctChoices.length >= 2,
    )).toBe(true)
  })

  it('couvre les fondamentaux, objets, statuts, météo et écrans', () => {
    const templates = curatedStrategyQuestions.map(({ template }) => template ?? '')
    for (const prefix of ['ev-', 'objet-', 'statut-', 'meteo-', 'ecrans-']) {
      expect(templates.some((template) => template.startsWith(prefix))).toBe(true)
    }
  })
})
