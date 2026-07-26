import { describe, expect, it } from 'vitest'
import { curatedItemQuestions } from './itemsPilot'

describe('curated items pilot pack', () => {
  it('contient 20 questions Objets validées et sourcées', () => {
    expect(curatedItemQuestions).toHaveLength(20)
    expect(curatedItemQuestions.every(({ category, validation, difficultyReason, generationScope }) =>
      category === 'Objets'
      && validation?.status === 'validated'
      && validation.verifiedAt === '2026-07-25'
      && validation.sources.length >= 1
      && Boolean(difficultyReason)
      && Boolean(generationScope),
    )).toBe(true)
  })

  it('couvre au moins quinze modèles éditoriaux', () => {
    expect(new Set(curatedItemQuestions.map(({ template }) => template)).size).toBeGreaterThanOrEqual(15)
  })

  it('inclut plusieurs QCM multiples complets', () => {
    const multiple = curatedItemQuestions.filter(({ type }) => type === 'multiple-select')
    expect(multiple.length).toBeGreaterThanOrEqual(5)
    expect(multiple.every(({ choices, correctChoices }) =>
      choices?.length === 4 && correctChoices && correctChoices.length >= 2,
    )).toBe(true)
  })

  it('diversifie combat, Baies, Balls et évolutions', () => {
    const templates = curatedItemQuestions.map(({ template }) => template ?? '')
    for (const prefix of ['objet-', 'baie', 'ball-', 'evolution-']) {
      expect(templates.some((template) => template.startsWith(prefix))).toBe(true)
    }
  })
})
