import type { Question } from '../domain/quiz'
import { normalizeAnswer } from './answerValidation'

export function questionFingerprint(question: Question): string {
  const answers = [...question.acceptedAnswers].map(normalizeAnswer).sort().join('|')
  const media = normalizeAnswer(question.media?.src ?? '')
  const mapTarget = question.mapTarget
    ? `${question.mapRegion ?? ''}:${question.mapTarget.x}:${question.mapTarget.y}`
    : ''
  const orderEntries = question.orderEntries
    ? [...question.orderEntries]
        .map((entry) => `${normalizeAnswer(entry.name)}:${entry.value}`)
        .sort()
        .join('|')
    : ''

  return [
    normalizeAnswer(question.category),
    normalizeAnswer(question.prompt),
    answers,
    media,
    mapTarget,
    orderEntries,
  ].join('::')
}

export function deduplicateQuestions(questions: Question[]): Question[] {
  const fingerprints = new Set<string>()
  return questions.filter((question) => {
    const fingerprint = questionFingerprint(question)
    if (fingerprints.has(fingerprint)) return false
    fingerprints.add(fingerprint)
    return true
  })
}

export function mergeQuestionBanks(preferred: Question[], fallback: Question[]): Question[] {
  const preferredIds = new Set(preferred.map(({ id }) => id))
  return deduplicateQuestions([
    ...preferred,
    ...fallback.filter(({ id }) => !preferredIds.has(id)),
  ])
}
