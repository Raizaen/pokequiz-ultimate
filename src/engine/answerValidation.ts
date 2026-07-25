import type { AnswerValue, Question } from '../domain/quiz'

export function normalizeAnswer(value: string): string {
  return value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLocaleLowerCase('fr')
    .replace(/[^a-z0-9]/g, '')
}

export function isAnswerCorrect(question: Question, answer: AnswerValue): boolean {
  if (question.type === 'stat-order') {
    if (!Array.isArray(answer) || !question.orderEntries) return false
    const direction = question.orderDirection === 'descending' ? -1 : 1
    const expected = [...question.orderEntries]
      .sort((left, right) => (left.value - right.value) * direction)
      .map(({ name }) => normalizeAnswer(name))
    const submitted = answer.map(normalizeAnswer)
    return submitted.length === expected.length
      && submitted.every((value, index) => value === expected[index])
  }
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

export function pointsForAnswer(question: Question, answer: AnswerValue): number {
  if (question.type !== 'stat-order') {
    return isAnswerCorrect(question, answer) ? question.points : 0
  }
  if (!Array.isArray(answer) || !question.orderEntries) return 0

  const direction = question.orderDirection === 'descending' ? -1 : 1
  const expected = [...question.orderEntries]
    .sort((left, right) => (left.value - right.value) * direction)
    .map(({ name }) => normalizeAnswer(name))

  return answer.reduce(
    (points, name, index) => points + (normalizeAnswer(name) === expected[index] ? 5 : 0),
    0,
  )
}
