import type { Question } from '../domain/quiz'

export function normalizeAnswer(value: string): string {
  return value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLocaleLowerCase('fr')
    .replace(/[^a-z0-9]/g, '')
}

export function isAnswerCorrect(question: Question, answer: string): boolean {
  const normalized = normalizeAnswer(answer)
  return question.acceptedAnswers.some((accepted) => normalizeAnswer(accepted) === normalized)
}

export function maxAttemptsFor(question: Question): number {
  return question.type === 'multiple-choice' ? 1 : 3
}
