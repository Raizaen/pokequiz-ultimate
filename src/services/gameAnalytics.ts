import type { GameState } from '../domain/quiz'
import { rankPlayers } from '../engine/ranking'
import { supabase } from '../lib/supabase'

export interface StoredGameSession {
  sessionId: string
  startedAt: string
  finishedAt: string
  durationSeconds: number
  mode: string
  category: string | null
  difficulty: string
  timerSeconds: number | null
  questionCount: number
  playerCount: number
  players: Array<{ name: string; avatar: string; score: number; rank: number }>
  questionResults: Array<{
    questionId: string
    prompt?: string
    acceptedAnswer?: string
    category: string
    difficulty: number
    answers: Array<{
      playerName: string
      isCorrect: boolean
      attempts: number
      points: number
      responseSeconds: number
    }>
  }>
  imageFailures: string[]
  excludedAt: string | null
}

const reportedKey = 'pokequiz-ultimate:reported-sessions:v1'

function reportedSessions(): string[] {
  try {
    return JSON.parse(localStorage.getItem(reportedKey) ?? '[]') as string[]
  } catch {
    return []
  }
}

function rememberReported(sessionId: string) {
  localStorage.setItem(reportedKey, JSON.stringify([...new Set([...reportedSessions(), sessionId])].slice(-500)))
}

export function serializeCompletedGame(game: GameState) {
  const startedAt = game.startedAt ?? new Date().toISOString()
  const finishedAt = game.finishedAt ?? new Date().toISOString()
  const questions = new Map(game.questions.map((question) => [question.id, question]))
  const players = new Map(game.players.map((player) => [player.id, player]))
  const ranking = rankPlayers(game.players)

  return {
    session_id: game.sessionId,
    started_at: startedAt,
    finished_at: finishedAt,
    duration_seconds: Math.max(0, Math.round((Date.parse(finishedAt) - Date.parse(startedAt)) / 1000)),
    mode: game.config?.mode ?? 'mixed',
    category: game.config?.category ?? null,
    difficulty: game.config?.difficulty ?? 'all',
    timer_seconds: game.timerSeconds ?? null,
    question_count: game.questions.length,
    player_count: game.players.length,
    players: ranking.map(({ player, rank }) => ({
      name: player.name,
      avatar: player.avatar,
      score: player.score,
      rank,
    })),
    question_results: game.history.map((result) => {
      const question = questions.get(result.questionId)
      return {
        questionId: result.questionId,
        prompt: question?.prompt,
        acceptedAnswer: question?.acceptedAnswers[0],
        category: question?.category ?? 'Inconnue',
        difficulty: question?.difficulty ?? 1,
        answers: Object.entries(result.answers).map(([playerId, answer]) => ({
          playerName: players.get(playerId)?.name ?? 'Joueur',
          isCorrect: answer.isCorrect,
          attempts: answer.attempts,
          points: answer.pointsAwarded ?? 0,
          responseSeconds: answer.responseSeconds ?? 0,
        })),
      }
    }),
    image_failures: game.imageFailures ?? [],
  }
}

export async function recordCompletedGame(game: GameState): Promise<boolean> {
  if (!supabase || !game.finished || !game.sessionId || reportedSessions().includes(game.sessionId)) return false
  const { error } = await supabase.from('game_sessions').insert(serializeCompletedGame(game))
  if (!error || error.code === '23505') {
    rememberReported(game.sessionId)
    return true
  }
  return false
}

export async function loadGameSessions(limit = 200): Promise<StoredGameSession[]> {
  if (!supabase) return []
  const { data, error } = await supabase
    .from('game_sessions')
    .select('*')
    .order('finished_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return (data ?? []).map((row) => ({
    sessionId: row.session_id,
    startedAt: row.started_at,
    finishedAt: row.finished_at,
    durationSeconds: row.duration_seconds,
    mode: row.mode,
    category: row.category,
    difficulty: row.difficulty,
    timerSeconds: row.timer_seconds,
    questionCount: row.question_count,
    playerCount: row.player_count,
    players: row.players,
    questionResults: row.question_results,
    imageFailures: row.image_failures,
    excludedAt: row.excluded_at ?? null,
  }))
}

export async function setGameSessionExcluded(sessionId: string, excluded: boolean): Promise<void> {
  if (!supabase) throw new Error('Supabase n’est pas configuré.')
  const { error } = await supabase.rpc('set_game_session_excluded', {
    target_session_id: sessionId,
    should_exclude: excluded,
  })
  if (error) throw error
}
