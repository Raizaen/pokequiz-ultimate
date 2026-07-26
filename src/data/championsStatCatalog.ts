import { championPokemon } from './curated/statOrderQuestions'

export interface ChampionsPokemonStat {
  id: number
  nationalId: number
  name: string
  image: string
  generation: number
  kind: 'standard' | 'regional' | 'mega' | 'other-form'
  stats: Record<string, number>
}

export const championStatLabels = [
  'PV',
  'Attaque',
  'Défense',
  'Attaque Spéciale',
  'Défense Spéciale',
  'Vitesse',
]

export const championsStatCatalog: ChampionsPokemonStat[] = championPokemon.map((pokemon) => ({
  id: pokemon.id,
  nationalId: pokemon.nationalId,
  name: pokemon.name,
  image: pokemon.image,
  generation: pokemon.generation,
  kind: pokemon.kind,
  stats: {
    PV: pokemon.stats.hp,
    Attaque: pokemon.stats.attack,
    Défense: pokemon.stats.defense,
    'Attaque Spéciale': pokemon.stats.specialAttack,
    'Défense Spéciale': pokemon.stats.specialDefense,
    Vitesse: pokemon.stats.speed,
  },
}))
