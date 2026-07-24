import { describe, expect, it } from 'vitest'
import { curatedLaboQuestions } from './laboPilot'

describe('curated Labo pilot pack', () => {
  it('contient 20 questions validées et sourcées', () => {
    expect(curatedLaboQuestions).toHaveLength(20)
    expect(curatedLaboQuestions.every(({ validation }) =>
      validation?.status === 'validated'
      && validation.verifiedAt === '2026-07-25'
      && validation.sources.length >= 2
      && validation.sources.every(({ url }) => url.startsWith('https://')),
    )).toBe(true)
  })

  it('couvre au moins dix modèles éditoriaux', () => {
    expect(new Set(curatedLaboQuestions.map(({ template }) => template)).size).toBeGreaterThanOrEqual(10)
  })

  it('documente la difficulté et la génération de chaque question', () => {
    expect(curatedLaboQuestions.every(({ difficultyReason, generationScope }) =>
      Boolean(difficultyReason) && Boolean(generationScope),
    )).toBe(true)
  })

  it('inclut plusieurs formats de réponse', () => {
    const formats = new Set(curatedLaboQuestions.map(({ type }) => type))
    expect(formats.has('multiple-choice')).toBe(true)
    expect(formats.has('multiple-select')).toBe(true)
    expect(formats.has('open')).toBe(true)
  })
})
