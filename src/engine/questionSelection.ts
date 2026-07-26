import type { Question } from '../domain/quiz'
import {
  difficultyPresets,
  type GameConfig,
  type SpriteVariant,
} from '../domain/gameConfig'

const allSpriteVariants: SpriteVariant[] = ['normal', 'silhouette', 'progressive', 'shiny', 'zoom', 'flipped']

function secureRandom(): number {
  if (globalThis.crypto?.getRandomValues) {
    const value = new Uint32Array(1)
    globalThis.crypto.getRandomValues(value)
    return value[0] / 2 ** 32
  }
  return Math.random()
}

export function shuffleQuestions(questions: Question[], count = questions.length, random = secureRandom): Question[] {
  const shuffled = [...new Map(questions.map((question) => [question.id, question])).values()]
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapWith = Math.floor(random() * (index + 1))
    ;[shuffled[index], shuffled[swapWith]] = [shuffled[swapWith], shuffled[index]]
  }
  return shuffled.slice(0, Math.min(count, shuffled.length))
}

export function questionsForConfig(questions: Question[], config: GameConfig): Question[] {
  const preset = difficultyPresets.find(({ id }) => id === config.difficulty)
  const [minimum, maximum] = preset?.range ?? [1, 5]
  const selectedSpriteGenerations = config.spriteGenerations

  return questions.filter((question) => {
    const matchesDifficulty = question.difficulty >= minimum && question.difficulty <= maximum
    const matchesCategory = config.mode === 'mixed' || question.category === config.category
    const matchesRegion = config.category !== 'Lieu Perdu'
      || !config.region
      || config.region === 'all'
      || question.mapRegion === config.region
    const matchesSpriteGeneration = config.category !== 'Sprites'
      || !selectedSpriteGenerations
      || selectedSpriteGenerations === 'all'
      || question.generationScope === 'all'
      || question.generationScope?.some((generation) => selectedSpriteGenerations.includes(generation))
    const matchesSpriteVariant = config.category !== 'Sprites'
      || config.spriteVariants === 'all'
      || !config.spriteVariants
      || config.spriteVariants.length !== 1
      || config.spriteVariants[0] !== 'shiny'
      || Boolean(question.media?.shinySrc)
    return matchesDifficulty && matchesCategory && matchesRegion && matchesSpriteGeneration && matchesSpriteVariant
  })
}

function applySpriteVariants(selected: Question[], config: GameConfig): Question[] {
  if (config.category !== 'Sprites') return selected
  const requested = !config.spriteVariants || config.spriteVariants === 'all'
    ? allSpriteVariants
    : config.spriteVariants

  return selected.map((question) => {
    if (!question.media) return question
    const supported = requested.filter((variant) => variant !== 'shiny' || question.media?.shinySrc)
    const variants = supported.length > 0 ? supported : ['normal' as const]
    const variant = variants[Math.floor(secureRandom() * variants.length)]
    return {
      ...question,
      media: {
        ...question.media,
        src: variant === 'shiny' ? question.media.shinySrc ?? question.media.src : question.media.src,
        spriteVariant: variant,
      },
    }
  })
}

function spreadMapLocations(questions: Question[], count: number): Question[] {
  const selected: Question[] = []
  const deferred: Question[] = []

  questions.forEach((question) => {
    if (!question.mapTarget || selected.length >= count) {
      deferred.push(question)
      return
    }

    const isFarEnough = selected.every((picked) => !picked.mapTarget
      || Math.hypot(
        question.mapTarget!.x - picked.mapTarget.x,
        question.mapTarget!.y - picked.mapTarget.y,
      ) >= 8)

    if (isFarEnough) selected.push(question)
    else deferred.push(question)
  })

  return [...selected, ...deferred].slice(0, count)
}

export function selectQuestions(questions: Question[], config: GameConfig, count = 10): Question[] {
  const eligible = questionsForConfig(questions, config)
  if (config.mode !== 'category') return shuffleQuestions(eligible, count)

  const validated = shuffleQuestions(eligible.filter(({ validation }) => validation?.status === 'validated'))
  let selected: Question[]
  if (validated.length === 0) {
    selected = shuffleQuestions(eligible, count)
  } else {
    const remaining = shuffleQuestions(eligible.filter(({ validation }) => validation?.status !== 'validated'))
    const ordered = [...validated, ...remaining]
    selected = config.category === 'Lieu Perdu'
      ? spreadMapLocations(ordered, count)
      : ordered.slice(0, count)
  }
  return applySpriteVariants(selected, config)
}
