import type { Question } from '../../domain/quiz'
import { preferImageCdn } from '../../utils/imageSources'
import pokemonFacts from '../generated/pokemonFacts.json'

const artwork = (id: number) =>
  preferImageCdn(`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`)

const grouped = pokemonFacts.reduce<Record<string, typeof pokemonFacts>>((result, pokemon) => {
  ;(result[pokemon.primaryType] ??= []).push(pokemon)
  return result
}, {})
const groups = Object.entries(grouped).filter(([, members]) => members.length >= 3)

export const intruderQuestions: Question[] = groups.flatMap(([type, members], groupIndex) =>
  Array.from({ length: Math.min(4, members.length - 2) }, (_, round) => {
    const trio = Array.from({ length: 3 }, (__, offset) => members[(round + offset) % members.length])
    const outsiders = pokemonFacts.filter(({ primaryType }) => primaryType !== type)
    const intruder = outsiders[(groupIndex * 7 + round * 11) % outsiders.length]
    const choices = [...trio.map(({ name }) => name), intruder.name]
      .sort((left, right) => left.localeCompare(right, 'fr'))
    return {
      id: `labo-intrus-${groupIndex + 1}-${round + 1}`,
      type: 'multiple-choice',
      category: 'Labo',
      difficulty: Math.min(5, 2 + Math.floor(groupIndex / 3)) as Question['difficulty'],
      prompt: `Qui est l’intrus ? Trois Pokémon ont ${type} comme type principal.`,
      choices,
      choiceMedia: Object.fromEntries([...trio, intruder].map(({ id, name }) => [name, artwork(id)])),
      acceptedAnswers: [intruder.name],
      explanation: `${intruder.name} est l’intrus : les trois autres ont ${type} comme type principal.`,
      points: 15,
      durationSeconds: 25,
      template: 'intruder-primary-type',
      validation: {
        status: 'validated',
        verifiedAt: '2026-07-26',
        sources: [{ label: 'PokéAPI — types des Pokémon', url: 'https://pokeapi.co/' }],
      },
    }
  }),
)
