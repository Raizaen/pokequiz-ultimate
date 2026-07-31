export type QuestionType = 'multiple-choice' | 'multiple-select' | 'open' | 'open-multiple' | 'stat-order' | 'map-location'
export interface MapAnswer { x: number; y: number }
export type AnswerValue = string | string[] | MapAnswer

export interface Question {
  id: string
  type: QuestionType
  category: string
  difficulty: 1 | 2 | 3 | 4 | 5
  prompt: string
  choices?: string[]
  choiceMedia?: Record<string, string>
  acceptedAnswers: string[]
  correctChoices?: string[]
  orderEntries?: Array<{
    id: number
    name: string
    value: number
    image: string
  }>
  orderDirection?: 'ascending' | 'descending'
  statLabel?: string
  mapTarget?: MapAnswer
  mapRegion?: string
  template?: string
  tags?: string[]
  generationScope?: number[] | 'all'
  difficultyReason?: string
  validation?: {
    status: 'draft' | 'review' | 'validated'
    verifiedAt?: string
    sources: Array<{
      label: string
      url: string
    }>
  }
  explanation: string
  points: number
  durationSeconds: number
  media?: {
    kind: 'image'
    src: string
    shinySrc?: string
    alt: string
    pixelated?: boolean
    spriteVariant?: 'normal' | 'silhouette' | 'progressive' | 'shiny' | 'zoom' | 'flipped'
  }
}

export interface Player {
  id: string
  name: string
  avatar: string
  color: string
  score: number
}

export interface PlayerAnswer {
  attempts: number
  value: AnswerValue
  isCorrect: boolean
  locked: boolean
  pointsAwarded?: number
  responseSeconds?: number
}

export type AnswersByPlayer = Record<string, PlayerAnswer>

export interface QuestionResult {
  questionId: string
  answers: AnswersByPlayer
}

export interface GameState {
  sessionId?: string
  startedAt?: string
  finishedAt?: string
  config?: import('./gameConfig').GameConfig
  imageFailures?: string[]
  players: Player[]
  questions: Question[]
  questionIndex: number
  answers: AnswersByPlayer
  remainingSeconds: number | null
  timerSeconds?: number | null
  questionElapsedSeconds?: number
  revealed: boolean
  finished: boolean
  history: QuestionResult[]
}
