import { describe, expect, it } from 'vitest'
import { intruderQuestions } from './intruderQuestions'

describe('questions Qui est l’intrus', () => {
  it('fournit un pack visuel varié et validé pour le Labo', () => {
    expect(intruderQuestions.length).toBeGreaterThanOrEqual(15)
    expect(intruderQuestions.every((question) =>
      question.category === 'Labo'
      && question.choices?.length === 4
      && Object.keys(question.choiceMedia ?? {}).length === 4
      && question.validation?.status === 'validated',
    )).toBe(true)
  })

  it('contient toujours une unique bonne réponse parmi les quatre choix', () => {
    expect(intruderQuestions.every((question) =>
      question.acceptedAnswers.length === 1
      && question.choices?.includes(question.acceptedAnswers[0]),
    )).toBe(true)
  })
})
