import { describe, expect, it } from 'vitest'
import type { Question } from '../domain/quiz'
import { pokemonMentionedInPrompt, withContextualPokemonMedia } from './questionPokemonMedia'

const question = (prompt: string): Question => ({
  id: 'test', type: 'open', category: 'Labo', difficulty: 1, prompt,
  acceptedAnswers: ['Test'], explanation: 'Test', points: 10, durationSeconds: 20,
})

describe('illustration contextuelle des questions', () => {
  it('trouve le Pokémon explicitement nommé dans la question', () => {
    expect(pokemonMentionedInPrompt(question('Quelle est l’évolution directe de Bulbizarre ?'))?.name).toBe('Bulbizarre')
  })

  it('préfère le nom complet lorsque deux noms se chevauchent', () => {
    expect(pokemonMentionedInPrompt(question('Quelle est la Vitesse de Mewtwo ?'))?.name).toBe('Mewtwo')
  })

  it('ne révèle pas un Pokémon qui est seulement la réponse', () => {
    expect(pokemonMentionedInPrompt(question('Quel Pokémon porte le numéro 025 ?'))).toBeNull()
  })

  it('préserve les médias spécifiques déjà configurés', () => {
    const original: Question = {
      ...question('Quel est ce Pokémon ?'),
      media: { kind: 'image', src: '/mystere.png', alt: 'Mystère' },
    }
    expect(withContextualPokemonMedia(original)).toBe(original)
  })
})
