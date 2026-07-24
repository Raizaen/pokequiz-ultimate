import type { GameState } from '../domain/quiz'

const STORAGE_KEY = 'pokequiz-ultimate:game:v1'

export function saveGame(game: GameState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(game))
}

export function loadGame(): GameState | null {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (!saved) return null
  try {
    return JSON.parse(saved) as GameState
  } catch {
    localStorage.removeItem(STORAGE_KEY)
    return null
  }
}

export function clearSavedGame(): void {
  localStorage.removeItem(STORAGE_KEY)
}
