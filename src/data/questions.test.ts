import { describe, expect, it } from 'vitest'
import { questions } from './questions'

const playableCategories = [
  'Labo',
  'Sprites',
  'Pokédex',
  'Capacités',
  'Objets',
  'Stratégie',
  'Lore',
  'Jeux principaux',
  'Anime',
  'Spin-off',
]

describe('question bank', () => {
  it.each(playableCategories)('contient au moins 50 questions dans la catégorie %s', (category) => {
    expect(questions.filter((question) => question.category === category).length).toBeGreaterThanOrEqual(50)
  })

  it('utilise un identifiant unique pour chaque question', () => {
    expect(new Set(questions.map(({ id }) => id)).size).toBe(questions.length)
  })

  it('fournit quatre choix contenant la solution pour chaque QCM', () => {
    const multipleChoiceQuestions = questions.filter(({ type }) => type === 'multiple-choice')
    expect(multipleChoiceQuestions.every(({ choices, acceptedAnswers }) =>
      choices?.length === 4 && choices.includes(acceptedAnswers[0]),
    )).toBe(true)
  })

  it('propose plusieurs modèles dans chaque catégorie textuelle générée', () => {
    for (const category of ['Labo', 'Pokédex', 'Capacités', 'Objets', 'Stratégie', 'Lore', 'Jeux principaux']) {
      const templates = new Set(questions.filter((question) => question.category === category).map(({ template }) => template).filter(Boolean))
      expect(templates.size, category).toBeGreaterThanOrEqual(4)
    }
  })

  it('contient des QCM multiples valides dans la catégorie Capacités', () => {
    const multipleSelectQuestions = questions.filter(({ type }) => type === 'multiple-select')
    expect(multipleSelectQuestions.length).toBeGreaterThanOrEqual(10)
    expect(multipleSelectQuestions.every(({ choices, correctChoices }) =>
      choices?.length === 4 && correctChoices && correctChoices.length > 0 && correctChoices.every((answer) => choices.includes(answer)),
    )).toBe(true)
  })
})
