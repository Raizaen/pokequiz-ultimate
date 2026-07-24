import { describe, expect, it } from 'vitest'
import { curatedMoveQuestions } from './movesPilot'

describe('curated moves pilot pack', () => {
  it('contient 20 questions validées et sourcées', () => {
    expect(curatedMoveQuestions).toHaveLength(20)
    expect(curatedMoveQuestions.every(({ validation, difficultyReason, generationScope }) =>
      validation?.status === 'validated'
      && validation.verifiedAt === '2026-07-25'
      && validation.sources.length >= 1
      && Boolean(difficultyReason)
      && Boolean(generationScope),
    )).toBe(true)
  })

  it('couvre au moins dix modèles éditoriaux', () => {
    expect(new Set(curatedMoveQuestions.map(({ template }) => template)).size).toBeGreaterThanOrEqual(10)
  })

  it('contient au moins quatre QCM multiples complets', () => {
    const multiple = curatedMoveQuestions.filter(({ type }) => type === 'multiple-select')
    expect(multiple.length).toBeGreaterThanOrEqual(4)
    expect(multiple.every(({ choices, correctChoices }) =>
      choices?.length === 4 && correctChoices && correctChoices.length >= 2,
    )).toBe(true)
  })
})
