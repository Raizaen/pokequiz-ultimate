import { describe, expect, it } from 'vitest'
import type { Player, Question } from '../domain/quiz'
import { createGame, nextQuestion, submitAnswer, tick } from './quizEngine'

const player: Player = { id: 'p1', name: 'Red', avatar: '⚡', color: '#fff', score: 0 }
const qcm: Question = { id: 'q1', type: 'multiple-choice', category: 'Test', difficulty: 1, prompt: 'Qui ?', choices: ['Pikachu', 'Évoli'], acceptedAnswers: ['Pikachu'], explanation: '', points: 10, durationSeconds: 2 }
const open: Question = { ...qcm, id: 'q2', type: 'open', choices: undefined, acceptedAnswers: ['Évoli'] }

describe('quiz engine', () => {
  it('verrouille un QCM après un seul essai', () => {
    const game = submitAnswer(createGame([player], [qcm]), player.id, 'Évoli')
    expect(game.answers[player.id]).toMatchObject({ attempts: 1, isCorrect: false, locked: true })
  })

  it('accorde les points une seule fois pour une bonne réponse', () => {
    let game = submitAnswer(createGame([player], [qcm]), player.id, 'Pikachu')
    game = submitAnswer(game, player.id, 'Pikachu')
    expect(game.players[0].score).toBe(10)
  })

  it('laisse trois essais sur une question ouverte', () => {
    let game = createGame([player], [open])
    game = submitAnswer(game, player.id, 'A')
    game = submitAnswer(game, player.id, 'B')
    expect(game.answers[player.id].locked).toBe(false)
    game = submitAnswer(game, player.id, 'C')
    expect(game.answers[player.id].locked).toBe(true)
  })

  it('révèle à la fin du chronomètre puis termine après la dernière question', () => {
    let game = createGame([player], [qcm])
    game = tick(tick(game))
    expect(game.revealed).toBe(true)
    expect(nextQuestion(game).finished).toBe(true)
  })
})
