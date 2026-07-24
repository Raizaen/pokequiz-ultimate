import { describe, expect, it } from 'vitest'
import type { Question } from '../domain/quiz'
import { isAnswerCorrect, maxAttemptsFor, normalizeAnswer } from './answerValidation'

const openQuestion: Question = {
  id: 'test', type: 'open', category: 'Test', difficulty: 1, prompt: 'Test',
  acceptedAnswers: ['Méga-Évolution'], explanation: '', points: 10, durationSeconds: 30,
}

describe('answer validation', () => {
  it('ignore la casse, les accents, espaces et signes', () => {
    expect(normalizeAnswer('  MÉGA évolution ! ')).toBe('megaevolution')
    expect(isAnswerCorrect(openQuestion, 'mega evolution')).toBe(true)
  })

  it('accorde trois essais aux questions ouvertes et un seul aux QCM', () => {
    expect(maxAttemptsFor(openQuestion)).toBe(3)
    expect(maxAttemptsFor({ ...openQuestion, type: 'multiple-choice' })).toBe(1)
  })
})
