import type { AnswersByPlayer, AnswerValue, GameState, Player, Question } from '../domain/quiz'
import { isAnswerCorrect, maxAttemptsFor, pointsForAnswer } from './answerValidation'

const emptyAnswers = (): AnswersByPlayer => ({})
const questionDuration = (question: Question, timerSeconds: number | null | undefined) =>
  timerSeconds === undefined ? question.durationSeconds : timerSeconds

export function progressiveRevealStage(
  question: Question,
  elapsedSeconds = 0,
  timerSeconds?: number | null,
): 0 | 1 | 2 | 3 {
  if (question.media?.spriteVariant !== 'progressive') return 0
  const duration = timerSeconds ?? 12
  return Math.min(3, Math.floor((Math.max(0, elapsedSeconds) / duration) * 4)) as 0 | 1 | 2 | 3
}

export function availablePoints(
  question: Question,
  elapsedSeconds = 0,
  timerSeconds?: number | null,
): number {
  return question.media?.spriteVariant === 'progressive'
    ? 20 - progressiveRevealStage(question, elapsedSeconds, timerSeconds) * 5
    : question.points
}

export function createGame(
  players: Player[],
  questions: Question[],
  timerSeconds?: number | null,
): GameState {
  if (players.length < 1 || players.length > 8) {
    throw new Error('Une partie doit contenir entre 1 et 8 joueurs.')
  }
  if (questions.length === 0) throw new Error('Une partie doit contenir au moins une question.')

  return {
    players,
    questions,
    questionIndex: 0,
    answers: emptyAnswers(),
    remainingSeconds: questionDuration(questions[0], timerSeconds),
    timerSeconds,
    questionElapsedSeconds: 0,
    revealed: false,
    finished: false,
    history: [],
  }
}

export function submitAnswer(state: GameState, playerId: string, value: AnswerValue): GameState {
  if (state.finished || state.revealed || state.remainingSeconds === 0) return state
  const question = state.questions[state.questionIndex]
  const previous = state.answers[playerId]
  if (previous?.locked) return state

  const attempts = (previous?.attempts ?? 0) + 1
  const isCorrect = isAnswerCorrect(question, value)
  const rawPoints = pointsForAnswer(question, value)
  const pointsAwarded = isCorrect && question.media?.spriteVariant === 'progressive'
    ? availablePoints(question, state.questionElapsedSeconds, state.timerSeconds)
    : rawPoints
  const locked = isCorrect || attempts >= maxAttemptsFor(question)
  const previouslyAwarded = previous?.pointsAwarded ?? 0

  const nextState: GameState = {
    ...state,
    answers: {
      ...state.answers,
      [playerId]: {
        attempts,
        value,
        isCorrect,
        locked,
        pointsAwarded,
        responseSeconds: state.questionElapsedSeconds ?? 0,
      },
    },
    players: state.players.map((player) =>
      player.id === playerId && pointsAwarded > previouslyAwarded
        ? { ...player, score: player.score + pointsAwarded - previouslyAwarded }
        : player,
    ),
  }

  const everyPlayerHasFinished = nextState.players.every((player) => nextState.answers[player.id]?.locked)
  const hasCorrectAnswer = Object.values(nextState.answers).some((answer) => answer.isCorrect)

  return everyPlayerHasFinished && hasCorrectAnswer
    ? revealAnswer(nextState)
    : nextState
}

export function revealAnswer(state: GameState): GameState {
  return {
    ...state,
    revealed: true,
    answers: Object.fromEntries(
      state.players.map((player) => [
        player.id,
        state.answers[player.id] ?? { attempts: 0, value: '', isCorrect: false, locked: true },
      ]),
    ),
  }
}

export function nextQuestion(state: GameState): GameState {
  const nextIndex = state.questionIndex + 1
  const history = state.history ?? []
  const questionId = state.questions[state.questionIndex].id
  const archivedHistory = history.some((result) => result.questionId === questionId)
    ? history
    : [...history, { questionId, answers: state.answers }]

  if (nextIndex >= state.questions.length) return { ...state, history: archivedHistory, finished: true }
  return {
    ...state,
    history: archivedHistory,
    questionIndex: nextIndex,
    answers: emptyAnswers(),
    remainingSeconds: questionDuration(state.questions[nextIndex], state.timerSeconds),
    questionElapsedSeconds: 0,
    revealed: false,
  }
}

export function tick(state: GameState): GameState {
  if (state.finished || state.revealed || state.remainingSeconds === 0) return state
  const question = state.questions[state.questionIndex]
  const tracksProgressiveReveal = question.media?.spriteVariant === 'progressive'
  if (state.remainingSeconds === null && !tracksProgressiveReveal) return state
  const questionElapsedSeconds = (state.questionElapsedSeconds ?? 0) + 1
  if (state.remainingSeconds === null) return { ...state, questionElapsedSeconds }
  const remainingSeconds = state.remainingSeconds - 1
  const nextState = { ...state, remainingSeconds, questionElapsedSeconds }
  return remainingSeconds === 0 ? revealAnswer(nextState) : nextState
}
