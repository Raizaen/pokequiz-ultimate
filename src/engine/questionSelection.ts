import type { Question } from '../domain/quiz'
import { difficultyPresets, type GameConfig } from '../domain/gameConfig'

export function shuffleQuestions(questions: Question[], count = questions.length): Question[] {
  const shuffled = [...questions]
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapWith = Math.floor(Math.random() * (index + 1))
    ;[shuffled[index], shuffled[swapWith]] = [shuffled[swapWith], shuffled[index]]
  }
  return shuffled.slice(0, Math.min(count, shuffled.length))
}

export function questionsForConfig(questions: Question[], config: GameConfig): Question[] {
  const preset = difficultyPresets.find(({ id }) => id === config.difficulty)
  const [minimum, maximum] = preset?.range ?? [1, 5]

  return questions.filter((question) => {
    const matchesDifficulty = question.difficulty >= minimum && question.difficulty <= maximum
    const matchesCategory = config.mode === 'mixed' || question.category === config.category
    return matchesDifficulty && matchesCategory
  })
}

export function selectQuestions(questions: Question[], config: GameConfig, count = 10): Question[] {
  return shuffleQuestions(questionsForConfig(questions, config), count)
}
