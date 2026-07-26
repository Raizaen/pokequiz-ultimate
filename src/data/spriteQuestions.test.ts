import { describe, expect, it } from 'vitest'
import { spriteQuestions } from './spriteQuestions'

describe('sprite question pack', () => {
  it('contient 350 questions uniques et complètes', () => {
    expect(spriteQuestions).toHaveLength(350)
    expect(new Set(spriteQuestions.map(({ id }) => id)).size).toBe(350)
    expect(spriteQuestions.every(({ category, choices, media }) =>
      category === 'Sprites' && choices?.length === 4 && media?.kind === 'image',
    )).toBe(true)
  })

  it('contient toujours la bonne réponse parmi les choix', () => {
    expect(spriteQuestions.every(({ choices, acceptedAnswers }) =>
      choices?.length === 4 && choices.includes(acceptedAnswers[0]),
    )).toBe(true)
  })

  it('contient au moins 100 formes spéciales', () => {
    expect(spriteQuestions.filter(({ id }) => Number(id.replace('sprites-', '')) > 1025)).toHaveLength(100)
  })
})
