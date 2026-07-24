import { describe, expect, it } from 'vitest'
import type { Question } from '../domain/quiz'
import { questionsForConfig } from './questionSelection'

const question = (id: string, category: string, difficulty: Question['difficulty']): Question => ({
  id,
  category,
  difficulty,
  type: 'open',
  prompt: id,
  acceptedAnswers: [id],
  explanation: '',
  points: 10,
  durationSeconds: 20,
})

const bank = [
  question('labo-easy', 'Labo', 1),
  question('labo-hard', 'Labo', 4),
  question('lore-medium', 'Lore', 3),
]

describe('question selection', () => {
  it('filtre les questions par catégorie', () => {
    expect(questionsForConfig(bank, { mode: 'category', category: 'Labo', difficulty: 'all' }).map(({ id }) => id))
      .toEqual(['labo-easy', 'labo-hard'])
  })

  it('filtre les questions selon la difficulté choisie', () => {
    expect(questionsForConfig(bank, { mode: 'mixed', difficulty: 'expert' }).map(({ id }) => id))
      .toEqual(['labo-hard', 'lore-medium'])
  })
})
