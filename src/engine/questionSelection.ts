import type { Question } from '../domain/quiz'

export function shuffleQuestions(questions: Question[], count = questions.length): Question[] {
  const shuffled = [...questions]
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapWith = Math.floor(Math.random() * (index + 1))
    ;[shuffled[index], shuffled[swapWith]] = [shuffled[swapWith], shuffled[index]]
  }
  return shuffled.slice(0, Math.min(count, shuffled.length))
}
