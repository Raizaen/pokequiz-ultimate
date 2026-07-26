import { describe, expect, it } from 'vitest'
import { spinOffQuestions } from './spinOffQuestions'

describe('spin-off question pack', () => {
  it('contient 50 questions jouables, validées et sourcées', () => {
    expect(spinOffQuestions).toHaveLength(50)
    expect(spinOffQuestions.every(({ category, choices, acceptedAnswers, validation }) =>
      category === 'Spin-off'
      && choices?.length === 4
      && choices.includes(acceptedAnswers[0])
      && validation?.status === 'validated'
      && validation.sources.length >= 1,
    )).toBe(true)
  })

  it('couvre de nombreuses séries et mécaniques', () => {
    expect(new Set(spinOffQuestions.map(({ template }) => template)).size).toBeGreaterThanOrEqual(25)
  })

  it('utilise des identifiants uniques', () => {
    expect(new Set(spinOffQuestions.map(({ id }) => id)).size).toBe(spinOffQuestions.length)
  })
})
