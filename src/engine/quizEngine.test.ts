import { describe, expect, it } from 'vitest'
import type { Player, Question } from '../domain/quiz'
import {
  availablePoints,
  createGame,
  nextQuestion,
  progressiveRevealStage,
  miningPointsForClearedTiles,
  revealAnswer,
  submitAnswer,
  tick,
} from './quizEngine'

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
const mapLocation: Question = {
  ...qcm,
  id: 'q4',
  type: 'map-location',
  acceptedAnswers: ['Mesaledo'],
  mapTarget: { x: 50, y: 50 },
  points: 25,
}
const progressiveSprite: Question = {
  ...qcm,
  id: 'sprite-progressive',
  category: 'Sprites',
  points: 20,
  media: {
    kind: 'image',
    src: 'pikachu.png',
    alt: 'Sprite mystère',
    spriteVariant: 'progressive',
  },
}

describe('quiz engine', () => {
  it('prépare un identifiant et un horodatage pour le journal de partie', () => {
    const config = { mode: 'category', category: 'Test', difficulty: 'all' } as const
    const game = createGame([player], [qcm], 20, config)
    expect(game.sessionId).toMatch(/^[0-9a-f-]{36}$/)
    expect(game.startedAt).toBeTruthy()
    expect(game.config).toEqual(config)
  })

  it('verrouille un QCM après un seul essai', () => {
    const game = submitAnswer(createGame([player], [qcm]), player.id, 'Évoli')
    expect(game.answers[player.id]).toMatchObject({ attempts: 1, isCorrect: false, locked: true })
  })

  it('accorde les points une seule fois pour une bonne réponse', () => {
    let game = submitAnswer(createGame([player], [qcm]), player.id, 'Pikachu')
    game = submitAnswer(game, player.id, 'Pikachu')
    expect(game.players[0].score).toBe(10)
  })

  it('révèle immédiatement une bonne réponse en solo', () => {
    const game = submitAnswer(createGame([player], [qcm]), player.id, 'Pikachu')
    expect(game.revealed).toBe(true)
  })

  it('attend tous les joueurs avant la révélation automatique', () => {
    const secondPlayer: Player = { ...player, id: 'p2', name: 'Blue' }
    let game = submitAnswer(createGame([player, secondPlayer], [qcm]), player.id, 'Pikachu')
    expect(game.revealed).toBe(false)

    game = submitAnswer(game, secondPlayer.id, 'Évoli')
    expect(game.revealed).toBe(true)
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

  it('applique le timer choisi à toutes les questions', () => {
    let game = createGame([player], [qcm, open], 15)
    expect(game.remainingSeconds).toBe(15)
    game = nextQuestion(revealAnswer(game))
    expect(game.remainingSeconds).toBe(15)
  })

  it('ne décompte rien en mode sans timer', () => {
    const game = createGame([player], [qcm], null)
    expect(game.remainingSeconds).toBeNull()
    expect(tick(game)).toEqual(game)
  })

  it('réduit les points de la révélation progressive par paliers', () => {
    expect(progressiveRevealStage(progressiveSprite, 0, 20)).toBe(0)
    expect(availablePoints(progressiveSprite, 0, 20)).toBe(20)
    expect(availablePoints(progressiveSprite, 5, 20)).toBe(15)
    expect(availablePoints(progressiveSprite, 10, 20)).toBe(10)
    expect(availablePoints(progressiveSprite, 15, 20)).toBe(5)
  })

  it('accorde les points du palier exact au moment de la réponse', () => {
    let game = createGame([player], [progressiveSprite], 20)
    for (let second = 0; second < 6; second += 1) game = tick(game)
    game = submitAnswer(game, player.id, 'Pikachu')

    expect(game.answers[player.id].pointsAwarded).toBe(15)
    expect(game.players[0].score).toBe(15)
  })

  it('réduit les points de la Mine après la première case entièrement retirée', () => {
    const miningQuestion: Question = { ...open, id: 'mine', type: 'mining', points: 15 }

    expect(miningPointsForClearedTiles(miningQuestion, 0)).toBe(15)
    expect(miningPointsForClearedTiles(miningQuestion, 1)).toBe(15)
    expect(miningPointsForClearedTiles(miningQuestion, 2)).toBe(14)
    expect(miningPointsForClearedTiles(miningQuestion, 8)).toBe(8)
    expect(miningPointsForClearedTiles(miningQuestion, 48)).toBe(1)
  })

  it('fige le score de la Mine au palier disponible lors de la bonne réponse', () => {
    const miningQuestion: Question = { ...open, id: 'mine-score', type: 'mining', points: 15 }
    const game = submitAnswer(createGame([player], [miningQuestion]), player.id, miningQuestion.acceptedAnswers[0], 11)

    expect(game.answers[player.id].pointsAwarded).toBe(11)
    expect(game.players[0].score).toBe(11)
  })

  it('fait progresser la révélation même sans timer', () => {
    let game = createGame([player], [progressiveSprite], null)
    game = tick(tick(tick(game)))

    expect(game.remainingSeconds).toBeNull()
    expect(game.questionElapsedSeconds).toBe(3)
    expect(availablePoints(progressiveSprite, game.questionElapsedSeconds, null)).toBe(15)
  })

  it('archive les réponses avant de passer à la question suivante', () => {
    let game = submitAnswer(createGame([player], [qcm, open]), player.id, 'Pikachu')
    game = nextQuestion(revealAnswer(game))

    expect(game.history).toHaveLength(1)
    expect(game.history[0]).toMatchObject({
      questionId: qcm.id,
      answers: { [player.id]: { pointsAwarded: 10 } },
    })
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

  it('accorde les points du Lieu Perdu selon la distance', () => {
    const exact = submitAnswer(createGame([player], [mapLocation]), player.id, { x: 51, y: 51 })
    const close = submitAnswer(createGame([player], [mapLocation]), player.id, { x: 57, y: 50 })
    const far = submitAnswer(createGame([player], [mapLocation]), player.id, { x: 90, y: 90 })
    expect(exact.players[0].score).toBe(25)
    expect(close.players[0].score).toBe(15)
    expect(far.players[0].score).toBe(0)
  })
})
