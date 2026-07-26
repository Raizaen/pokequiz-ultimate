import { describe, expect, it } from 'vitest'
import { findOpaqueBounds, fragmentLayout } from './spriteFragment'

function pixels(width: number, height: number, bounds: [number, number, number, number]) {
  const data = new Uint8ClampedArray(width * height * 4)
  const [left, top, right, bottom] = bounds
  for (let y = top; y <= bottom; y += 1) {
    for (let x = left; x <= right; x += 1) data[(y * width + x) * 4 + 3] = 255
  }
  return data
}

describe('cadrage adaptatif des fragments', () => {
  it('détecte uniquement la zone réellement visible du sprite', () => {
    expect(findOpaqueBounds(pixels(10, 10, [3, 2, 6, 8]), 10, 10))
      .toEqual({ left: 3, top: 2, right: 6, bottom: 8 })
  })

  it('zoome davantage un petit Pokémon qu’un grand', () => {
    const small = fragmentLayout({ left: 40, top: 40, right: 55, bottom: 55 }, 96, 96)
    const large = fragmentLayout({ left: 8, top: 5, right: 87, bottom: 90 }, 96, 96)

    expect(small.scale).toBeGreaterThan(large.scale)
    expect(small.scale).toBeGreaterThanOrEqual(4)
    expect(large.scale).toBeGreaterThanOrEqual(2.2)
  })

  it('recentre un sprite décalé dans son canevas transparent', () => {
    const layout = fragmentLayout({ left: 5, top: 20, right: 35, bottom: 70 }, 96, 96)
    expect(layout.left).toBeGreaterThan(15)
    expect(layout.originX).toBeLessThan(50)
  })
})
