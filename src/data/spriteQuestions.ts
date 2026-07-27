import type { Question } from '../domain/quiz'
import { preferImageCdn } from '../utils/imageSources'
import { localizePokemonFormName } from '../utils/pokemonNameLocalization'
import spriteCatalog from './generated/spriteCatalog.json'

const localizedSpriteCatalog = spriteCatalog.map((entry) => ({
  ...entry,
  name: localizePokemonFormName(entry.name),
}))

function choicesFor(index: number): string[] {
  const choices = [localizedSpriteCatalog[index].name]
  const step = 97
  let cursor = (index + step) % localizedSpriteCatalog.length

  while (choices.length < 4) {
    const candidate = localizedSpriteCatalog[cursor].name
    if (!choices.includes(candidate)) choices.push(candidate)
    cursor = (cursor + step) % localizedSpriteCatalog.length
  }

  return choices.sort((left, right) => left.localeCompare(right, 'fr'))
}

export const spriteQuestions: Question[] = localizedSpriteCatalog.map((entry, index) => ({
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
    src: preferImageCdn(entry.sprite),
    shinySrc: entry.shinySprite ? preferImageCdn(entry.shinySprite) : undefined,
    alt: 'Sprite mystère à identifier',
    pixelated: true,
    spriteVariant: 'normal',
  },
}))
