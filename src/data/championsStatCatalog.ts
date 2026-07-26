import { championPokemon } from './curated/statOrderQuestions'

export interface ChampionsPokemonStat {
  id: number
  name: string
  image: string
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
  name: pokemon.name,
  image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`,
  stats: {
    PV: pokemon.stats.hp,
    Attaque: pokemon.stats.attack,
    Défense: pokemon.stats.defense,
    'Attaque Spéciale': pokemon.stats.specialAttack,
    'Défense Spéciale': pokemon.stats.specialDefense,
    Vitesse: pokemon.stats.speed,
  },
}))
