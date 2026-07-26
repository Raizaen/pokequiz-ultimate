import type { Player } from '../domain/quiz'

export interface RankedPlayer {
  player: Player
  rank: number
}

export function rankPlayers(players: Player[]): RankedPlayer[] {
  const sorted = [...players].sort((left, right) => right.score - left.score)

  return sorted.map((player) => ({
    player,
    rank: sorted.findIndex((candidate) => candidate.score === player.score) + 1,
  }))
}
