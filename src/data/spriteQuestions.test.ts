import { describe, expect, it } from 'vitest'
import { spriteQuestions } from './spriteQuestions'

describe('sprite question pack', () => {
  it('contient 50 questions uniques et complètes', () => {
    expect(spriteQuestions).toHaveLength(50)
    expect(new Set(spriteQuestions.map(({ id }) => id)).size).toBe(50)
    expect(spriteQuestions.every(({ category, choices, media }) =>
      category === 'Sprites' && choices?.length === 4 && media?.kind === 'image',
    )).toBe(true)
  })

  it('contient toujours la bonne réponse parmi les choix', () => {
    expect(spriteQuestions.every(({ choices, acceptedAnswers }) =>
      choices?.includes(acceptedAnswers[0]),
    )).toBe(true)
  })
})
