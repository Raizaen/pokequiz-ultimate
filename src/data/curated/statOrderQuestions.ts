import type { Question } from '../../domain/quiz'

interface ChampionPokemon {
  id: number
  name: string
  speed: number
}

const pokemon: Record<string, ChampionPokemon> = {
  Florizarre: { id: 3, name: 'Florizarre', speed: 80 },
  Dracaufeu: { id: 6, name: 'Dracaufeu', speed: 100 },
  Tortank: { id: 9, name: 'Tortank', speed: 78 },
  Dardargnan: { id: 15, name: 'Dardargnan', speed: 75 },
  Pikachu: { id: 25, name: 'Pikachu', speed: 90 },
  Raichu: { id: 26, name: 'Raichu', speed: 110 },
  Mélodelfe: { id: 36, name: 'Mélodelfe', speed: 60 },
  Arcanin: { id: 59, name: 'Arcanin', speed: 95 },
  Alakazam: { id: 65, name: 'Alakazam', speed: 120 },
  Empiflor: { id: 71, name: 'Empiflor', speed: 70 },
  Flagadoss: { id: 80, name: 'Flagadoss', speed: 30 },
  Ectoplasma: { id: 94, name: 'Ectoplasma', speed: 110 },
  Kangourex: { id: 115, name: 'Kangourex', speed: 90 },
  Staross: { id: 121, name: 'Staross', speed: 115 },
  Scarabrute: { id: 127, name: 'Scarabrute', speed: 85 },
  Tauros: { id: 128, name: 'Tauros', speed: 110 },
  Léviator: { id: 130, name: 'Léviator', speed: 81 },
  Métamorph: { id: 132, name: 'Métamorph', speed: 48 },
  Aquali: { id: 134, name: 'Aquali', speed: 65 },
  Voltali: { id: 135, name: 'Voltali', speed: 130 },
  Ptéra: { id: 142, name: 'Ptéra', speed: 130 },
  Ronflex: { id: 143, name: 'Ronflex', speed: 30 },
  Dracolosse: { id: 149, name: 'Dracolosse', speed: 80 },
  Pharamp: { id: 181, name: 'Pharamp', speed: 55 },
  Azumarill: { id: 184, name: 'Azumarill', speed: 50 },
  Tarpaud: { id: 186, name: 'Tarpaud', speed: 70 },
  Mentali: { id: 196, name: 'Mentali', speed: 110 },
  Roigada: { id: 199, name: 'Roigada', speed: 30 },
  Tyranocif: { id: 248, name: 'Tyranocif', speed: 61 },
  Farigiraf: { id: 981, name: 'Farigiraf', speed: 60 },
  Farfurex: { id: 903, name: 'Farfurex', speed: 120 },
}

const series = [
  ['Arcanin', 'Métamorph', 'Voltali', 'Flagadoss', 'Mélodelfe'],
  ['Tyranocif', 'Staross', 'Ronflex', 'Alakazam', 'Azumarill'],
  ['Léviator', 'Roigada', 'Ptéra', 'Pharamp', 'Empiflor'],
  ['Farfurex', 'Aquali', 'Florizarre', 'Métamorph', 'Farigiraf'],
  ['Scarabrute', 'Voltali', 'Azumarill', 'Tarpaud', 'Tyranocif'],
  ['Pikachu', 'Pharamp', 'Alakazam', 'Tortank', 'Mélodelfe'],
  ['Dracolosse', 'Staross', 'Flagadoss', 'Arcanin', 'Farigiraf'],
  ['Raichu', 'Dardargnan', 'Ronflex', 'Léviator', 'Aquali'],
  ['Empiflor', 'Farfurex', 'Métamorph', 'Florizarre', 'Azumarill'],
  ['Dracaufeu', 'Roigada', 'Tortank', 'Tyranocif', 'Pharamp'],
  ['Ectoplasma', 'Mélodelfe', 'Scarabrute', 'Flagadoss', 'Tarpaud'],
  ['Alakazam', 'Aquali', 'Dracolosse', 'Ronflex', 'Farigiraf'],
] as const

const artwork = (id: number) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`

export const statOrderQuestions: Question[] = series.map((names, index) => {
  const entries = names.map((name) => pokemon[name])
  const sorted = [...entries].sort((left, right) => left.speed - right.speed)

  return {
    id: `curated-stat-order-${String(index + 1).padStart(3, '0')}`,
    type: 'stat-order',
    category: 'Stratégie',
    difficulty: index < 4 ? 2 : index < 9 ? 3 : 4,
    template: 'stats-en-ordre-vitesse',
    prompt: 'Classe ces Pokémon par Vitesse de base',
    acceptedAnswers: [sorted.map(({ name }) => name).join(' → ')],
    orderEntries: entries.map(({ id, name, speed }) => ({ id, name, value: speed, image: artwork(id) })),
    orderDirection: 'ascending',
    statLabel: 'Vit.',
    explanation: `Du moins rapide au plus rapide : ${sorted.map(({ name, speed }) => `${name} (${speed})`).join(' → ')}.`,
    points: 25,
    durationSeconds: 60,
    generationScope: 'all',
    difficultyReason: 'Épreuve progressive comparant cinq Vitesses de base sans égalité.',
    tags: ['stratégie', 'pokémon-champions', 'stats-en-ordre'],
    validation: {
      status: 'validated',
      verifiedAt: '2026-07-25',
      sources: [
        {
          label: 'Bulbapedia — Liste des Pokémon disponibles dans Pokémon Champions',
          url: 'https://bulbapedia.bulbagarden.net/wiki/List_of_Pokémon_in_Pokémon_Champions',
        },
        ...entries.map(({ id, name }) => ({
          label: `PokéAPI — statistiques de ${name}`,
          url: `https://pokeapi.co/api/v2/pokemon/${id}`,
        })),
      ],
    },
  }
})
