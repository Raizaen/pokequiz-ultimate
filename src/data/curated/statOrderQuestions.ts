import type { Question } from '../../domain/quiz'
import championsStatRoster from '../generated/championsStatRoster.json'
import { localizePokemonFormName } from '../../utils/pokemonNameLocalization'

type StatKey = 'hp' | 'attack' | 'defense' | 'specialAttack' | 'specialDefense' | 'speed'

export interface ChampionPokemon {
  id: number
  key: string
  nationalId: number
  name: string
  image: string
  generation: number
  kind: 'standard' | 'regional' | 'mega' | 'other-form'
  stats: Record<StatKey, number>
}

export const championPokemon = championsStatRoster.map((pokemon) => ({
  ...pokemon,
  name: localizePokemonFormName(pokemon.name),
})) as ChampionPokemon[]

const stats: Array<{ key: StatKey; label: string; slug: string }> = [
  { key: 'hp', label: 'PV', slug: 'pv' },
  { key: 'attack', label: 'Attaque', slug: 'attaque' },
  { key: 'defense', label: 'Défense', slug: 'defense' },
  { key: 'specialAttack', label: 'Attaque Spéciale', slug: 'attaque-speciale' },
  { key: 'specialDefense', label: 'Défense Spéciale', slug: 'defense-speciale' },
  { key: 'speed', label: 'Vitesse', slug: 'vitesse' },
]

const strides = [7, 11, 13, 17, 19, 23]
function createSeries(stat: StatKey, statIndex: number, seriesIndex: number): ChampionPokemon[] {
  const selected: ChampionPokemon[] = []
  const values = new Set<number>()
  let cursor = (statIndex * 5 + seriesIndex * 3) % championPokemon.length

  while (selected.length < 5) {
    const candidate = championPokemon[cursor]
    const value = candidate.stats[stat]
    if (!values.has(value)) {
      selected.push(candidate)
      values.add(value)
    }
    cursor = (cursor + strides[statIndex]) % championPokemon.length
  }

  return selected
}

export const statOrderQuestions: Question[] = stats.flatMap(({ key, label, slug }, statIndex) =>
  Array.from({ length: 10 }, (_, seriesIndex) => {
    const entries = createSeries(key, statIndex, seriesIndex)
    const sorted = [...entries].sort((left, right) => left.stats[key] - right.stats[key])

    return {
      id: `curated-stat-order-${slug}-${String(seriesIndex + 1).padStart(2, '0')}`,
      type: 'stat-order',
      category: 'Stats en Ordre',
      difficulty: seriesIndex < 3 ? 2 : seriesIndex < 7 ? 3 : 4,
      template: `stats-en-ordre-${slug}`,
      prompt: `Classe ces Pokémon par ${label} de base`,
      acceptedAnswers: [sorted.map(({ name }) => name).join(' → ')],
      orderEntries: entries.map(({ id, name, image, stats: values }) => ({
        id,
        name,
        value: values[key],
        image,
      })),
      orderDirection: 'ascending',
      statLabel: label,
      explanation: `Du plus faible au plus élevé en ${label} : ${sorted.map(({ name, stats: values }) => `${name} (${values[key]})`).join(' → ')}.`,
      points: 25,
      durationSeconds: 60,
      generationScope: 'all',
      difficultyReason: `Épreuve progressive comparant cinq valeurs de ${label} de base sans égalité.`,
      tags: ['stats-en-ordre', 'pokémon-champions', slug],
      validation: {
        status: 'validated',
        verifiedAt: '2026-07-25',
        sources: [
          {
            label: 'Bulbapedia — Liste des Pokémon disponibles dans Pokémon Champions',
            url: 'https://bulbapedia.bulbagarden.net/wiki/List_of_Pok%C3%A9mon_in_Pok%C3%A9mon_Champions',
          },
          ...entries.map(({ id, name }) => ({
            label: `PokéAPI — statistiques de ${name}`,
            url: `https://pokeapi.co/api/v2/pokemon/${id}`,
          })),
        ],
      },
    } satisfies Question
  }),
)
