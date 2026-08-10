import type { Question } from '../domain/quiz'
import spriteCatalog from '../data/generated/spriteCatalog.json'

const searchablePokemon = spriteCatalog
  .filter(({ name, sprite }) => name.trim().length > 0 && Boolean(sprite))
  .sort((left, right) => right.name.length - left.name.length)

function searchableText(value: string): string {
  return ` ${value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLocaleLowerCase('fr')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()} `
}

export function pokemonMentionedInPrompt(question: Question) {
  if (question.media || question.type === 'map-location' || question.category === 'Sprites') return null
  const prompt = searchableText(question.prompt)
  return searchablePokemon.find(({ name }) => prompt.includes(searchableText(name))) ?? null
}

export function withContextualPokemonMedia(question: Question): Question {
  const pokemon = pokemonMentionedInPrompt(question)
  if (!pokemon) return question
  return {
    ...question,
    media: {
      kind: 'image',
      src: pokemon.sprite,
      shinySrc: pokemon.shinySprite,
      alt: `Sprite de ${pokemon.name}`,
      spriteVariant: 'normal',
    },
  }
}
