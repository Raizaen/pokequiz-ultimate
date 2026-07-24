export type QuestionType = 'multiple-choice' | 'multiple-select' | 'open'
export type AnswerValue = string | string[]

export interface Question {
  id: string
  type: QuestionType
  category: string
  difficulty: 1 | 2 | 3 | 4 | 5
  prompt: string
  choices?: string[]
  acceptedAnswers: string[]
  correctChoices?: string[]
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
    alt: string
    pixelated?: boolean
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
}

export type AnswersByPlayer = Record<string, PlayerAnswer>

export interface GameState {
  players: Player[]
  questions: Question[]
  questionIndex: number
  answers: AnswersByPlayer
  remainingSeconds: number
  revealed: boolean
  finished: boolean
}
