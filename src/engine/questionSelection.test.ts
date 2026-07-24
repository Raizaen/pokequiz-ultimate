import { describe, expect, it } from 'vitest'
import type { Question } from '../domain/quiz'
import { questionsForConfig, selectQuestions, shuffleQuestions } from './questionSelection'

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

  it('ne sélectionne jamais deux fois le même identifiant', () => {
    const duplicatedBank = [...bank, { ...bank[0] }]
    const selection = selectQuestions(duplicatedBank, { mode: 'mixed', difficulty: 'all' }, 10)

    expect(selection).toHaveLength(3)
    expect(new Set(selection.map(({ id }) => id)).size).toBe(selection.length)
  })

  it('applique Fisher-Yates à la banque avant de la découper', () => {
    const shuffled = shuffleQuestions(bank, bank.length, () => 0)
    expect(shuffled.map(({ id }) => id)).not.toEqual(bank.map(({ id }) => id))
  })

  it('priorise le contenu validé dans une partie par catégorie', () => {
    const curated = {
      ...bank[0],
      id: 'labo-validated',
      validation: { status: 'validated' as const, verifiedAt: '2026-07-25', sources: [{ label: 'Source', url: 'https://example.com' }] },
    }
    const selection = selectQuestions([...bank, curated], { mode: 'category', category: 'Labo', difficulty: 'all' }, 1)
    expect(selection[0].id).toBe('labo-validated')
  })
})
