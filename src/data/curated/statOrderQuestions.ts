import type { Question } from '../../domain/quiz'

type StatKey = 'hp' | 'attack' | 'defense' | 'specialAttack' | 'specialDefense' | 'speed'

export interface ChampionPokemon {
  id: number
  name: string
  stats: Record<StatKey, number>
}

export const championPokemon: ChampionPokemon[] = [
  { id: 3, name: 'Florizarre', stats: { hp: 80, attack: 82, defense: 83, specialAttack: 100, specialDefense: 100, speed: 80 } },
  { id: 6, name: 'Dracaufeu', stats: { hp: 78, attack: 84, defense: 78, specialAttack: 109, specialDefense: 85, speed: 100 } },
  { id: 9, name: 'Tortank', stats: { hp: 79, attack: 83, defense: 100, specialAttack: 85, specialDefense: 105, speed: 78 } },
  { id: 15, name: 'Dardargnan', stats: { hp: 65, attack: 90, defense: 40, specialAttack: 45, specialDefense: 80, speed: 75 } },
  { id: 25, name: 'Pikachu', stats: { hp: 35, attack: 55, defense: 40, specialAttack: 50, specialDefense: 50, speed: 90 } },
  { id: 26, name: 'Raichu', stats: { hp: 60, attack: 90, defense: 55, specialAttack: 90, specialDefense: 80, speed: 110 } },
  { id: 36, name: 'Mélodelfe', stats: { hp: 95, attack: 70, defense: 73, specialAttack: 95, specialDefense: 90, speed: 60 } },
  { id: 59, name: 'Arcanin', stats: { hp: 90, attack: 110, defense: 80, specialAttack: 100, specialDefense: 80, speed: 95 } },
  { id: 65, name: 'Alakazam', stats: { hp: 55, attack: 50, defense: 45, specialAttack: 135, specialDefense: 95, speed: 120 } },
  { id: 71, name: 'Empiflor', stats: { hp: 80, attack: 105, defense: 65, specialAttack: 100, specialDefense: 70, speed: 70 } },
  { id: 80, name: 'Flagadoss', stats: { hp: 95, attack: 75, defense: 110, specialAttack: 100, specialDefense: 80, speed: 30 } },
  { id: 94, name: 'Ectoplasma', stats: { hp: 60, attack: 65, defense: 60, specialAttack: 130, specialDefense: 75, speed: 110 } },
  { id: 115, name: 'Kangourex', stats: { hp: 105, attack: 95, defense: 80, specialAttack: 40, specialDefense: 80, speed: 90 } },
  { id: 121, name: 'Staross', stats: { hp: 60, attack: 75, defense: 85, specialAttack: 100, specialDefense: 85, speed: 115 } },
  { id: 127, name: 'Scarabrute', stats: { hp: 65, attack: 125, defense: 100, specialAttack: 55, specialDefense: 70, speed: 85 } },
  { id: 128, name: 'Tauros', stats: { hp: 75, attack: 100, defense: 95, specialAttack: 40, specialDefense: 70, speed: 110 } },
  { id: 130, name: 'Léviator', stats: { hp: 95, attack: 125, defense: 79, specialAttack: 60, specialDefense: 100, speed: 81 } },
  { id: 132, name: 'Métamorph', stats: { hp: 48, attack: 48, defense: 48, specialAttack: 48, specialDefense: 48, speed: 48 } },
  { id: 134, name: 'Aquali', stats: { hp: 130, attack: 65, defense: 60, specialAttack: 110, specialDefense: 95, speed: 65 } },
  { id: 135, name: 'Voltali', stats: { hp: 65, attack: 65, defense: 60, specialAttack: 110, specialDefense: 95, speed: 130 } },
  { id: 142, name: 'Ptéra', stats: { hp: 80, attack: 105, defense: 65, specialAttack: 60, specialDefense: 75, speed: 130 } },
  { id: 143, name: 'Ronflex', stats: { hp: 160, attack: 110, defense: 65, specialAttack: 65, specialDefense: 110, speed: 30 } },
  { id: 149, name: 'Dracolosse', stats: { hp: 91, attack: 134, defense: 95, specialAttack: 100, specialDefense: 100, speed: 80 } },
  { id: 181, name: 'Pharamp', stats: { hp: 90, attack: 75, defense: 85, specialAttack: 115, specialDefense: 90, speed: 55 } },
  { id: 184, name: 'Azumarill', stats: { hp: 100, attack: 50, defense: 80, specialAttack: 60, specialDefense: 80, speed: 50 } },
  { id: 186, name: 'Tarpaud', stats: { hp: 90, attack: 75, defense: 75, specialAttack: 90, specialDefense: 100, speed: 70 } },
  { id: 196, name: 'Mentali', stats: { hp: 65, attack: 65, defense: 60, specialAttack: 130, specialDefense: 95, speed: 110 } },
  { id: 199, name: 'Roigada', stats: { hp: 95, attack: 75, defense: 80, specialAttack: 100, specialDefense: 110, speed: 30 } },
  { id: 248, name: 'Tyranocif', stats: { hp: 100, attack: 134, defense: 110, specialAttack: 95, specialDefense: 100, speed: 61 } },
  { id: 981, name: 'Farigiraf', stats: { hp: 120, attack: 90, defense: 70, specialAttack: 110, specialDefense: 70, speed: 60 } },
  { id: 903, name: 'Farfurex', stats: { hp: 80, attack: 130, defense: 60, specialAttack: 40, specialDefense: 80, speed: 120 } },
]

const stats: Array<{ key: StatKey; label: string; slug: string }> = [
  { key: 'hp', label: 'PV', slug: 'pv' },
  { key: 'attack', label: 'Attaque', slug: 'attaque' },
  { key: 'defense', label: 'Défense', slug: 'defense' },
  { key: 'specialAttack', label: 'Attaque Spéciale', slug: 'attaque-speciale' },
  { key: 'specialDefense', label: 'Défense Spéciale', slug: 'defense-speciale' },
  { key: 'speed', label: 'Vitesse', slug: 'vitesse' },
]

const strides = [7, 11, 13, 17, 19, 23]
const artwork = (id: number) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`

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
      orderEntries: entries.map(({ id, name, stats: values }) => ({
        id,
        name,
        value: values[key],
        image: artwork(id),
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
