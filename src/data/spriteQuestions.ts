import type { Question } from '../domain/quiz'
import spriteCatalog from './generated/spriteCatalog.json'

function choicesFor(index: number): string[] {
  const offsets = [0, 47, 131, 229]
  return offsets
    .map((offset) => spriteCatalog[(index + offset) % spriteCatalog.length].name)
    .sort((left, right) => left.localeCompare(right, 'fr'))
}

export const spriteQuestions: Question[] = spriteCatalog.map((entry, index) => ({
  id: `sprites-${String(entry.id).padStart(5, '0')}`,
  type: 'multiple-choice',
  category: 'Sprites',
  difficulty: entry.difficulty as Question['difficulty'],
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
