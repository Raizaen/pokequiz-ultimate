import type { GameState, MapAnswer, Player, Question } from '../domain/quiz'
import { mapAnswerDistance } from './answerValidation'

export interface LostPlaceAttempt {
  question: Question
  point: MapAnswer
  distance: number
  points: number
}

export interface LostPlacePlayerStats {
  player: Player
  totalPoints: number
  clickCount: number
  averageDistance: number | null
  bestDistance: number | null
  worstDistance: number | null
  bullseyes: number
  attempts: LostPlaceAttempt[]
}

export function buildLostPlaceStats(game: GameState): LostPlacePlayerStats[] {
  const questionsById = new Map(game.questions.map((question) => [question.id, question]))

  return game.players.map((player) => {
    const attempts = (game.history ?? []).flatMap((result): LostPlaceAttempt[] => {
      const question = questionsById.get(result.questionId)
      const answer = result.answers[player.id]
      if (!question || question.type !== 'map-location' || !answer) return []
      const distance = mapAnswerDistance(question, answer.value)
      if (
        distance === null
        || typeof answer.value === 'string'
        || Array.isArray(answer.value)
      ) return []

      return [{
        question,
        point: answer.value,
        distance,
        points: answer.pointsAwarded ?? 0,
      }]
    })
    const distances = attempts.map(({ distance }) => distance)

    return {
      player,
      totalPoints: attempts.reduce((total, { points }) => total + points, 0),
      clickCount: attempts.length,
      averageDistance: distances.length
        ? distances.reduce((total, distance) => total + distance, 0) / distances.length
        : null,
      bestDistance: distances.length ? Math.min(...distances) : null,
      worstDistance: distances.length ? Math.max(...distances) : null,
      bullseyes: distances.filter((distance) => distance <= 2.5).length,
      attempts,
    }
  })
}
