import { describe, expect, it } from 'vitest'
import { spriteQuestions } from './spriteQuestions'

describe('sprite question pack', () => {
  it('contient tous les Pokémon nationaux et leurs formes disponibles', () => {
    expect(spriteQuestions.length).toBeGreaterThanOrEqual(1025)
    expect(new Set(spriteQuestions.map(({ id }) => id)).size).toBe(spriteQuestions.length)
    expect(spriteQuestions.every(({ category, choices, media }) =>
      category === 'Sprites' && choices?.length === 4 && media?.kind === 'image',
    )).toBe(true)
  })

  it('contient toujours la bonne réponse parmi les choix', () => {
    expect(spriteQuestions.every(({ choices, acceptedAnswers }) =>
      choices?.length === 4 && choices.includes(acceptedAnswers[0]),
    )).toBe(true)
  })

  it('contient les 1025 espèces nationales et de nombreuses formes spéciales', () => {
    expect(spriteQuestions.filter(({ id }) => Number(id.replace('sprites-', '')) <= 1025)).toHaveLength(1025)
    expect(spriteQuestions.filter(({ id }) => Number(id.replace('sprites-', '')) > 1025).length).toBeGreaterThanOrEqual(100)
  })

  it('propose quatre choix distincts pour chaque sprite', () => {
    expect(spriteQuestions.every(({ choices }) => new Set(choices).size === 4)).toBe(true)
  })

  it('associe chaque sprite à une génération valide', () => {
    expect(spriteQuestions.every(({ generationScope }) =>
      Array.isArray(generationScope)
      && generationScope.length === 1
      && generationScope[0] >= 1
      && generationScope[0] <= 9,
    )).toBe(true)
  })
})
