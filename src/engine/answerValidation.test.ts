import { describe, expect, it } from 'vitest'
import type { Question } from '../domain/quiz'
import {
  isAnswerCorrect,
  mapAccuracyLabel,
  mapPointsForDistance,
  maxAttemptsFor,
  normalizeAnswer,
} from './answerValidation'

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

  it('valide un QCM multiple indépendamment de l’ordre des choix', () => {
    const multipleQuestion: Question = {
      ...openQuestion,
      type: 'multiple-select',
      choices: ['Charge', 'Flammèche', 'Griffe', 'Rugissement'],
      correctChoices: ['Charge', 'Griffe'],
    }

    expect(isAnswerCorrect(multipleQuestion, ['Griffe', 'Charge'])).toBe(true)
    expect(isAnswerCorrect(multipleQuestion, ['Charge'])).toBe(false)
    expect(isAnswerCorrect(multipleQuestion, ['Charge', 'Griffe', 'Flammèche'])).toBe(false)
    expect(maxAttemptsFor(multipleQuestion)).toBe(1)
  })

  it('valide une réponse ouverte multiple indépendamment de l’ordre et des accents', () => {
    const evolutionQuestion: Question = {
      ...openQuestion,
      type: 'open-multiple',
      acceptedAnswers: ['Aquali · Voltali · Pyroli'],
      correctChoices: ['Aquali', 'Voltali', 'Pyroli'],
    }

    expect(isAnswerCorrect(evolutionQuestion, ['pyroli', 'AQUAli', 'Voltali'])).toBe(true)
    expect(isAnswerCorrect(evolutionQuestion, ['Aquali', 'Voltali'])).toBe(false)
    expect(maxAttemptsFor(evolutionQuestion)).toBe(3)
  })

  it('calibre précisément le score des réponses cartographiques', () => {
    expect([0, 2.5, 5, 8, 12, 18, 19].map(mapPointsForDistance))
      .toEqual([25, 25, 20, 15, 10, 5, 0])
    expect(mapAccuracyLabel(2)).toBe('Dans le mille !')
    expect(mapAccuracyLabel(20)).toBe('Trop éloigné')
  })
})
