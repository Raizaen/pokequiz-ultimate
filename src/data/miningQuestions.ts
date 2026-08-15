import type { Question } from '../domain/quiz'
import { preferImageCdn } from '../utils/imageSources'
import { localizePokemonFormName } from '../utils/pokemonNameLocalization'
import spriteCatalog from './generated/spriteCatalog.json'

export const miningQuestions: Question[] = spriteCatalog.map((entry) => {
  const name = localizePokemonFormName(entry.name)
  return {
    id: `mining-${String(entry.id).padStart(5, '0')}`,
    type: 'mining',
    category: 'Fouille dans les Mines',
    difficulty: entry.difficulty as Question['difficulty'],
    generationScope: [entry.generation],
    prompt: 'Quel Pokémon est enfoui dans la paroi ?',
    acceptedAnswers: [name],
    explanation: `Le Pokémon enfoui était ${name}.`,
    points: 15,
    durationSeconds: 45,
    media: {
      kind: 'image',
      src: preferImageCdn(entry.sprite),
      alt: 'Sprite du Pokémon enfoui',
      pixelated: true,
      spriteVariant: 'normal',
    },
  }
})
