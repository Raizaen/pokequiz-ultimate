import { describe, expect, it } from 'vitest'
import { sinnohLostPlaceQuestions } from './sinnohLostPlaceQuestions'

describe('épreuve Lieu Perdu à Sinnoh', () => {
  it('contient trente lieux uniques et localisables', () => {
    expect(sinnohLostPlaceQuestions).toHaveLength(30)
    expect(new Set(sinnohLostPlaceQuestions.map(({ acceptedAnswers }) => acceptedAnswers[0])).size).toBe(30)
    expect(sinnohLostPlaceQuestions.every(({ category, mapRegion, mapTarget, type }) =>
      category === 'Lieu Perdu'
      && type === 'map-location'
      && mapRegion === 'Sinnoh'
      && mapTarget
      && mapTarget.x >= 0
      && mapTarget.x <= 100
      && mapTarget.y >= 0
      && mapTarget.y <= 100,
    )).toBe(true)
  })

  it('fournit des questions validées sur plusieurs niveaux', () => {
    expect(new Set(sinnohLostPlaceQuestions.map(({ difficulty }) => difficulty)).size).toBeGreaterThanOrEqual(4)
    expect(sinnohLostPlaceQuestions.every(({ points, validation }) =>
      points === 25
      && validation?.status === 'validated'
      && validation.sources.length >= 2,
    )).toBe(true)
  })
})
