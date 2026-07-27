import { describe, expect, it } from 'vitest'
import type { GameState, Player, Question } from '../domain/quiz'
import { serializeCompletedGame } from './gameAnalytics'

const player: Player = { id: 'p1', name: 'Red', avatar: '⚡', color: '#fff', score: 10 }
const question: Question = {
  id: 'q1',
  type: 'multiple-choice',
  category: 'Pokédex',
  difficulty: 2,
  prompt: 'Qui ?',
  choices: ['Pikachu', 'Évoli'],
  acceptedAnswers: ['Pikachu'],
  explanation: '',
  points: 10,
  durationSeconds: 20,
}

describe('game analytics', () => {
  it('produit un bilan sans enregistrer le texte des réponses', () => {
    const game: GameState = {
      sessionId: '8edaf756-c492-4af0-99c8-c26200d28f41',
      startedAt: '2026-07-28T10:00:00.000Z',
      finishedAt: '2026-07-28T10:02:00.000Z',
      config: { mode: 'category', category: 'Pokédex', difficulty: 'confirmed', timerSeconds: 20 },
      players: [player],
      questions: [question],
      questionIndex: 0,
      answers: {},
      remainingSeconds: 10,
      timerSeconds: 20,
      revealed: true,
      finished: true,
      history: [{
        questionId: question.id,
        answers: {
          p1: {
            attempts: 1,
            value: 'Pikachu',
            isCorrect: true,
            locked: true,
            pointsAwarded: 10,
            responseSeconds: 4,
          },
        },
      }],
      imageFailures: [],
    }

    const row = serializeCompletedGame(game)
    expect(row).toMatchObject({
      duration_seconds: 120,
      mode: 'category',
      category: 'Pokédex',
      question_count: 1,
      player_count: 1,
    })
    expect(row.question_results[0].answers[0]).toEqual({
      playerName: 'Red',
      isCorrect: true,
      attempts: 1,
      points: 10,
      responseSeconds: 4,
    })
    expect(JSON.stringify(row)).not.toContain('"value"')
  })
})
