import { describe, expect, it } from 'vitest'
import type { GameState, Player, Question } from '../domain/quiz'
import { buildLostPlaceStats } from './lostPlaceStats'

const player: Player = { id: 'p1', name: 'Aurore', avatar: '⭐', color: '#f2c94c', score: 30 }
const location = (id: string, x: number, y: number): Question => ({
  id,
  type: 'map-location',
  category: 'Lieu Perdu',
  difficulty: 2,
  prompt: id,
  acceptedAnswers: [id],
  explanation: '',
  points: 25,
  durationSeconds: 30,
  mapTarget: { x, y },
  mapRegion: 'Sinnoh',
})

describe('récapitulatif Lieu Perdu', () => {
  it('calcule le score, les distances et les tirs parfaits', () => {
    const questions = [location('q1', 10, 10), location('q2', 50, 50)]
    const game: GameState = {
      players: [player],
      questions,
      questionIndex: 1,
      answers: {},
      remainingSeconds: 0,
      revealed: true,
      finished: true,
      history: [
        { questionId: 'q1', answers: { p1: { attempts: 1, value: { x: 11, y: 11 }, isCorrect: true, locked: true, pointsAwarded: 25 } } },
        { questionId: 'q2', answers: { p1: { attempts: 1, value: { x: 56, y: 50 }, isCorrect: false, locked: true, pointsAwarded: 15 } } },
      ],
    }

    const [stats] = buildLostPlaceStats(game)
    expect(stats.totalPoints).toBe(40)
    expect(stats.clickCount).toBe(2)
    expect(stats.bullseyes).toBe(1)
    expect(stats.bestDistance).toBeCloseTo(Math.sqrt(2))
    expect(stats.worstDistance).toBe(6)
    expect(stats.averageDistance).toBeCloseTo((Math.sqrt(2) + 6) / 2)
  })
})
