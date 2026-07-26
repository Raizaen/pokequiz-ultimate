import { describe, expect, it } from 'vitest'
import { championsStatCatalog, championStatLabels } from './championsStatCatalog'

describe('Pokémon Champions stat catalog', () => {
  it('propose les six statistiques', () => {
    expect(new Set(championStatLabels)).toEqual(new Set([
      'PV',
      'Attaque',
      'Défense',
      'Attaque Spéciale',
      'Défense Spéciale',
      'Vitesse',
    ]))
  })

  it('contient un catalogue complet avec image et six valeurs par Pokémon', () => {
    expect(championsStatCatalog.length).toBeGreaterThanOrEqual(290)
    expect(championsStatCatalog.every((pokemon) =>
      pokemon.image.startsWith('https://')
      && championStatLabels.every((label) => Number.isFinite(pokemon.stats[label])),
    )).toBe(true)
    expect(new Set(championsStatCatalog.map(({ name }) => name)).size).toBe(championsStatCatalog.length)
    expect(new Set(championsStatCatalog.map(({ generation }) => generation))).toEqual(new Set([1, 2, 3, 4, 5, 6, 7, 8, 9]))
    expect(new Set(championsStatCatalog.map(({ kind }) => kind))).toEqual(new Set(['standard', 'regional', 'mega', 'other-form']))
  })
})
