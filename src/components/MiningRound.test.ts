import { describe, expect, it } from 'vitest'
import { applyMiningHit } from '../engine/miningMechanics'

const fullWall = () => Array.from({ length: 48 }, () => 3)

describe('outils de Fouille dans les Mines', () => {
  it('applique deux dégâts au centre et un aux quatre voisins avec la pioche', () => {
    const result = applyMiningHit(fullWall(), 19, 'pickaxe')

    expect(result.rocks[19]).toBe(1)
    expect(result.affected.sort((left, right) => left - right)).toEqual([11, 18, 19, 20, 27])
    expect(result.rocks[10]).toBe(3)
  })

  it('applique deux dégâts au centre et un dans toute la zone 3 × 3 avec le marteau', () => {
    const result = applyMiningHit(fullWall(), 19, 'hammer')

    expect(result.rocks[19]).toBe(1)
    expect(result.affected.sort((left, right) => left - right)).toEqual([10, 11, 12, 18, 19, 20, 26, 27, 28])
    expect(result.rocks[9]).toBe(3)
  })

  it('ne déborde jamais de la grille sur une case située dans un angle', () => {
    const result = applyMiningHit(fullWall(), 0, 'hammer')

    expect(result.affected.sort((left, right) => left - right)).toEqual([0, 1, 8, 9])
  })

  it('cumule plusieurs frappes successives sans perdre les dégâts précédents', () => {
    const firstHit = applyMiningHit(fullWall(), 19, 'hammer')
    const secondHit = applyMiningHit(firstHit.rocks, 20, 'hammer')

    expect(secondHit.rocks[19]).toBe(0)
    expect(secondHit.rocks[20]).toBe(0)
    expect(secondHit.rocks[11]).toBe(1)
    expect(secondHit.rocks[21]).toBe(2)
  })
})
