import { describe, expect, it } from 'vitest'
import type { Player, Question } from '../domain/quiz'
import { createGame, nextQuestion, submitAnswer, tick } from './quizEngine'

const player: Player = { id: 'p1', name: 'Red', avatar: '⚡', color: '#fff', score: 0 }
const qcm: Question = { id: 'q1', type: 'multiple-choice', category: 'Test', difficulty: 1, prompt: 'Qui ?', choices: ['Pikachu', 'Évoli'], acceptedAnswers: ['Pikachu'], explanation: '', points: 10, durationSeconds: 2 }
const open: Question = { ...qcm, id: 'q2', type: 'open', choices: undefined, acceptedAnswers: ['Évoli'] }
const statOrder: Question = {
  ...qcm,
  id: 'q3',
  type: 'stat-order',
  choices: undefined,
  acceptedAnswers: ['A → B → C'],
  orderEntries: [
    { id: 1, name: 'B', value: 60, image: 'b.png' },
    { id: 2, name: 'A', value: 30, image: 'a.png' },
    { id: 3, name: 'C', value: 90, image: 'c.png' },
  ],
  points: 15,
}

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

  it('accorde les points lorsque l’ordre statistique est exact', () => {
    const game = submitAnswer(createGame([player], [statOrder]), player.id, ['A', 'B', 'C'])
    expect(game.answers[player.id]).toMatchObject({ isCorrect: true, locked: true, pointsAwarded: 15 })
    expect(game.players[0].score).toBe(statOrder.points)
  })

  it('accorde cinq points par Pokémon placé à la bonne position', () => {
    const game = submitAnswer(createGame([player], [statOrder]), player.id, ['A', 'C', 'B'])
    expect(game.answers[player.id]).toMatchObject({ isCorrect: false, locked: true, pointsAwarded: 5 })
    expect(game.players[0].score).toBe(5)
  })
})
