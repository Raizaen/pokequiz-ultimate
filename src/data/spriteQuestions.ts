import type { Question } from '../domain/quiz'
import spriteCatalog from './generated/spriteCatalog.json'

function choicesFor(index: number): string[] {
  const choices = [spriteCatalog[index].name]
  const step = 97
  let cursor = (index + step) % spriteCatalog.length

  while (choices.length < 4) {
    const candidate = spriteCatalog[cursor].name
    if (!choices.includes(candidate)) choices.push(candidate)
    cursor = (cursor + step) % spriteCatalog.length
  }

  return choices.sort((left, right) => left.localeCompare(right, 'fr'))
}

export const spriteQuestions: Question[] = spriteCatalog.map((entry, index) => ({
  id: `sprites-${String(entry.id).padStart(5, '0')}`,
  type: 'multiple-choice',
  category: 'Sprites',
  difficulty: entry.difficulty as Question['difficulty'],
  generationScope: [entry.generation],
  prompt: 'Quel est ce Pokémon ou cette forme ?',
  choices: choicesFor(index),
  acceptedAnswers: [entry.name],
  explanation: `Il s’agit de ${entry.name}.`,
  points: 10 + Math.floor((entry.difficulty - 1) / 2) * 5,
  durationSeconds: 20,
  media: {
    kind: 'image',
    src: entry.sprite,
    alt: 'Sprite mystère à identifier',
    pixelated: true,
  },
}))
