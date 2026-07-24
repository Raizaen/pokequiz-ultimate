import { describe, expect, it } from 'vitest'
import { questions } from './questions'

const playableCategories = [
  'Labo',
  'Sprites',
  'Pokédex',
  'Capacités et objets',
  'Stratégie',
  'Lore',
  'Jeux principaux',
  'Anime',
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
})
