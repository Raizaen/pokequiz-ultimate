import type { AnswerValue, Question } from '../domain/quiz'

export function normalizeAnswer(value: string): string {
  return value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLocaleLowerCase('fr')
    .replace(/[^a-z0-9]/g, '')
}

export function isAnswerCorrect(question: Question, answer: AnswerValue): boolean {
  if (question.type === 'multiple-select') {
    if (!Array.isArray(answer) || !question.correctChoices) return false
    const submitted = [...new Set(answer.map(normalizeAnswer))].sort()
    const expected = [...new Set(question.correctChoices.map(normalizeAnswer))].sort()
    return submitted.length === expected.length && submitted.every((value, index) => value === expected[index])
  }
  if (Array.isArray(answer)) return false
  const normalized = normalizeAnswer(answer)
  return question.acceptedAnswers.some((accepted) => normalizeAnswer(accepted) === normalized)
}

export function maxAttemptsFor(question: Question): number {
  return question.type === 'open' ? 3 : 1
}
