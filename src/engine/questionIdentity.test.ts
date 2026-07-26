import { describe, expect, it } from 'vitest'
import type { Question } from '../domain/quiz'
import { deduplicateQuestions, mergeQuestionBanks, questionFingerprint } from './questionIdentity'

const question = (id: string, prompt = 'Quel Pokémon porte le numéro 025 ?'): Question => ({
  id,
  type: 'multiple-choice',
  category: 'Pokédex',
  difficulty: 1,
  prompt,
  choices: ['Pikachu', 'Raichu', 'Mélofée', 'Sabelette'],
  acceptedAnswers: ['Pikachu'],
  explanation: 'Pikachu.',
  points: 10,
  durationSeconds: 20,
})

describe('question identity', () => {
  it('reconnaît deux formulations identiques malgré la ponctuation et les accents', () => {
    expect(questionFingerprint(question('a')))
      .toBe(questionFingerprint(question('b', 'Quel Pokemon porte le numero 025 ?')))
  })

  it('retire les doublons sémantiques', () => {
    expect(deduplicateQuestions([question('a'), question('b')]).map(({ id }) => id)).toEqual(['a'])
  })

  it('préfère la version distante lors de la fusion', () => {
    expect(mergeQuestionBanks([question('remote')], [question('local')]).map(({ id }) => id)).toEqual(['remote'])
  })
})
