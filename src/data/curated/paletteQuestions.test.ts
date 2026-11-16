import { describe, expect, it } from 'vitest'
import { paletteQuestions } from './paletteQuestions'

describe('prototype Palette Perdue', () => {
  it('contient vingt sprites calibrés', () => {
    expect(paletteQuestions).toHaveLength(20)
    expect(paletteQuestions.every((question) =>
      question.type === 'palette-match'
      && question.category === 'Palette Perdue'
      && question.media?.kind === 'image'
      && question.paletteTarget,
    )).toBe(true)
  })

  it('utilise des valeurs HSL valides', () => {
    expect(paletteQuestions.every(({ paletteTarget }) => paletteTarget
      && paletteTarget.hue >= 0 && paletteTarget.hue < 360
      && paletteTarget.saturation >= 0 && paletteTarget.saturation <= 100
      && paletteTarget.lightness >= 0 && paletteTarget.lightness <= 100,
    )).toBe(true)
  })
})
