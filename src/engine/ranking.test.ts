import { describe, expect, it } from 'vitest'
import type { Player } from '../domain/quiz'
import { rankPlayers } from './ranking'

const player = (id: string, score: number): Player => ({
  id,
  name: id,
  avatar: '⚡',
  color: '#fff',
  score,
})

describe('ranking', () => {
  it('attribue le même rang aux joueurs ex æquo', () => {
    const ranking = rankPlayers([
      player('Red', 70),
      player('Blue', 95),
      player('Leaf', 95),
      player('Gold', 50),
    ])

    expect(ranking.map(({ player: rankedPlayer, rank }) => [rankedPlayer.id, rank])).toEqual([
      ['Blue', 1],
      ['Leaf', 1],
      ['Red', 3],
      ['Gold', 4],
    ])
  })

  it('attribue la première place à tous les joueurs si les scores sont égaux', () => {
    expect(rankPlayers([player('Red', 95), player('Blue', 95), player('Leaf', 95)]).map(({ rank }) => rank))
      .toEqual([1, 1, 1])
  })
})
