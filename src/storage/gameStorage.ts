import type { GameState } from '../domain/quiz'

const STORAGE_KEY = 'pokequiz-ultimate:game:v1'
const QUESTION_HISTORY_KEY = 'pokequiz-ultimate:question-history:v1'

export function saveGame(game: GameState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(game))
}

export function loadGame(): GameState | null {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (!saved) return null
  try {
    const game = JSON.parse(saved) as GameState
    return { ...game, history: game.history ?? [] }
  } catch {
    localStorage.removeItem(STORAGE_KEY)
    return null
  }
}

export function clearSavedGame(): void {
  localStorage.removeItem(STORAGE_KEY)
}

export function loadQuestionHistory(): string[] {
  try {
    return JSON.parse(localStorage.getItem(QUESTION_HISTORY_KEY) ?? '[]') as string[]
  } catch {
    return []
  }
}

export function rememberQuestions(ids: string[]): void {
  const history = [...new Set([...loadQuestionHistory(), ...ids])]
  localStorage.setItem(QUESTION_HISTORY_KEY, JSON.stringify(history.slice(-4000)))
}
