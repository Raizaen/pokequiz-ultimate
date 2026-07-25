import { describe, expect, it } from 'vitest'
import { paldeaLostPlaceQuestions } from './paldeaLostPlaceQuestions'

describe('prototype Lieu Perdu à Paldea', () => {
  it('contient douze lieux uniques et localisables', () => {
    expect(paldeaLostPlaceQuestions).toHaveLength(12)
    expect(new Set(paldeaLostPlaceQuestions.map(({ acceptedAnswers }) => acceptedAnswers[0])).size).toBe(12)
    expect(paldeaLostPlaceQuestions.every(({ category, mapRegion, mapTarget, type }) =>
      category === 'Lieu Perdu'
      && type === 'map-location'
      && mapRegion === 'Paldea'
      && mapTarget
      && mapTarget.x >= 0
      && mapTarget.x <= 100
      && mapTarget.y >= 0
      && mapTarget.y <= 100,
    )).toBe(true)
  })

  it('alterne six indices visuels et six descriptions', () => {
    expect(paldeaLostPlaceQuestions.filter(({ media }) => media).length).toBe(6)
    expect(paldeaLostPlaceQuestions.filter(({ media }) => !media).length).toBe(6)
  })

  it('fournit une validation et un barème maximal de 25 points', () => {
    expect(paldeaLostPlaceQuestions.every(({ points, validation }) =>
      points === 25 && validation?.status === 'validated' && validation.sources.length > 0,
    )).toBe(true)
  })
})
