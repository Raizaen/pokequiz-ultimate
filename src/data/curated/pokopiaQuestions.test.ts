import { describe, expect, it } from 'vitest'
import { questionsForConfig } from '../../engine/questionSelection'
import { pokopiaQuestions } from './pokopiaQuestions'

describe('pack Pokémon Pokopia', () => {
  it('contient exactement 50 questions vérifiées', () => {
    expect(pokopiaQuestions).toHaveLength(50)
    expect(pokopiaQuestions.every((question) =>
      question.category === 'Pokopia'
      && question.validation?.status === 'validated'
      && question.choices?.length === 4
      && question.choices.includes(question.acceptedAnswers[0]),
    )).toBe(true)
  })

  it('sépare le contenu sans spoilers de la partie complète', () => {
    const safe = questionsForConfig(pokopiaQuestions, {
      mode: 'category',
      category: 'Pokopia',
      difficulty: 'all',
      pokopiaSpoilers: 'safe',
    })
    const complete = questionsForConfig(pokopiaQuestions, {
      mode: 'category',
      category: 'Pokopia',
      difficulty: 'all',
      pokopiaSpoilers: 'all',
    })

    expect(safe.length).toBeGreaterThanOrEqual(40)
    expect(safe.every((question) => !question.tags?.includes('pokopia-spoiler'))).toBe(true)
    expect(complete).toHaveLength(50)
  })

  it('conserve les appellations officielles françaises auditées', () => {
    const serialized = JSON.stringify(pokopiaQuestions)
    for (const term of [
      'Feuillage',
      'Éclate-Roc',
      'Vol Plané',
      'Professeur Bouldeneu',
      'Pikapâle',
      'Ronflex Moussu',
      'Maître Queulorior',
      'Terrassec',
      'Grisemer',
      'Collinangle',
      'Flotîles-Millefeux',
      'Rongragoût',
      'Cheffelina',
      'DJ Motisma',
    ]) {
      expect(serialized).toContain(term)
    }
    expect(pokopiaQuestions[43].acceptedAnswers[0])
      .toBe('The Pokémon Company, GAME FREAK et KOEI TECMO GAMES')
  })
})
