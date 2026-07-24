import type { AnswersByPlayer, GameState, Player, Question } from '../domain/quiz'
import { isAnswerCorrect, maxAttemptsFor } from './answerValidation'

const emptyAnswers = (): AnswersByPlayer => ({})

export function createGame(players: Player[], questions: Question[]): GameState {
  if (players.length < 1 || players.length > 8) {
    throw new Error('Une partie doit contenir entre 1 et 8 joueurs.')
  }
  if (questions.length === 0) throw new Error('Une partie doit contenir au moins une question.')

  return {
    players,
    questions,
    questionIndex: 0,
    answers: emptyAnswers(),
    remainingSeconds: questions[0].durationSeconds,
    revealed: false,
    finished: false,
  }
}

export function submitAnswer(state: GameState, playerId: string, value: string): GameState {
  if (state.finished || state.revealed || state.remainingSeconds <= 0) return state
  const question = state.questions[state.questionIndex]
  const previous = state.answers[playerId]
  if (previous?.locked) return state

  const attempts = (previous?.attempts ?? 0) + 1
  const isCorrect = isAnswerCorrect(question, value)
  const locked = isCorrect || attempts >= maxAttemptsFor(question)
  const wasAlreadyCorrect = previous?.isCorrect ?? false

  return {
    ...state,
    answers: { ...state.answers, [playerId]: { attempts, value, isCorrect, locked } },
    players: state.players.map((player) =>
      player.id === playerId && isCorrect && !wasAlreadyCorrect
        ? { ...player, score: player.score + question.points }
        : player,
    ),
  }
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
  if (nextIndex >= state.questions.length) return { ...state, finished: true }
  return {
    ...state,
    questionIndex: nextIndex,
    answers: emptyAnswers(),
    remainingSeconds: state.questions[nextIndex].durationSeconds,
    revealed: false,
  }
}

export function tick(state: GameState): GameState {
  if (state.finished || state.revealed || state.remainingSeconds <= 0) return state
  const remainingSeconds = state.remainingSeconds - 1
  return remainingSeconds === 0 ? revealAnswer({ ...state, remainingSeconds }) : { ...state, remainingSeconds }
}
