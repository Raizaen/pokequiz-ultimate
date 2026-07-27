import { describe, expect, it } from 'vitest'
import { localizePokemonFormName, localizePokemonNamesInQuestion } from './pokemonNameLocalization'

describe('French Pokémon form names', () => {
  it.each([
    ['Motisma (Mow)', 'Motisma (Tonte)'],
    ['Motisma (Heat)', 'Motisma (Chaleur)'],
    ['Mimiqui (Disguised)', 'Mimiqui (Déguisée)'],
    ['Morpeko (Full Belly)', 'Morpeko (Mode Rassasié)'],
    ['Tauros (de Paldea Aqua Breed)', 'Tauros (de Paldea — Race Aquatique)'],
    ['Male Méga Mistigrix', 'Méga-Mistigrix (Mâle)'],
    ['Méga X Dracaufeu', 'Méga-Dracaufeu X'],
  ])('traduit %s', (source, expected) => {
    expect(localizePokemonFormName(source)).toBe(expected)
  })

  it('corrige également une ancienne question provenant de Supabase', () => {
    const question = localizePokemonNamesInQuestion({
      id: 'sprite-mow',
      type: 'multiple-choice',
      category: 'Sprites',
      difficulty: 2,
      prompt: 'Qui est-ce ?',
      choices: ['Motisma (Mow)', 'Motisma (Heat)'],
      acceptedAnswers: ['Motisma (Mow)'],
      explanation: 'Il s’agit de Motisma (Mow).',
      points: 10,
      durationSeconds: 20,
    })
    expect(question.choices).toEqual(['Motisma (Tonte)', 'Motisma (Chaleur)'])
    expect(question.acceptedAnswers).toEqual(['Motisma (Tonte)'])
    expect(question.explanation).toBe('Il s’agit de Motisma (Tonte).')
  })
})
