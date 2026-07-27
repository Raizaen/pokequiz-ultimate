import { describe, expect, it } from 'vitest'
import { imageFallbacks, preferImageCdn } from './imageSources'

describe('image sources', () => {
  const rawSprite = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/681.png'
  const cdnSprite = 'https://cdn.jsdelivr.net/gh/PokeAPI/sprites@master/sprites/pokemon/681.png'

  it('utilise le CDN en priorité pour les sprites PokeAPI', () => {
    expect(preferImageCdn(rawSprite)).toBe(cdnSprite)
  })

  it('conserve GitHub comme solution de secours', () => {
    expect(imageFallbacks(rawSprite)).toEqual([cdnSprite, rawSprite])
  })

  it('ne transforme pas une image provenant d’une autre source', () => {
    expect(imageFallbacks('https://example.com/image.png')).toEqual(['https://example.com/image.png'])
  })
})
