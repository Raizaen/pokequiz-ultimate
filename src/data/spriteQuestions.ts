import type { Question } from '../domain/quiz'

const spriteNames = [
  'Bulbizarre', 'Herbizarre', 'Florizarre', 'Salamèche', 'Reptincel',
  'Dracaufeu', 'Carapuce', 'Carabaffe', 'Tortank', 'Chenipan',
  'Chrysacier', 'Papilusion', 'Aspicot', 'Coconfort', 'Dardargnan',
  'Roucool', 'Roucoups', 'Roucarnage', 'Rattata', 'Rattatac',
  'Piafabec', 'Rapasdepic', 'Abo', 'Arbok', 'Pikachu',
  'Raichu', 'Sabelette', 'Sablaireau', 'Nidoran♀', 'Nidorina',
  'Nidoqueen', 'Nidoran♂', 'Nidorino', 'Nidoking', 'Mélofée',
  'Mélodelfe', 'Goupix', 'Feunard', 'Rondoudou', 'Grodoudou',
  'Nosferapti', 'Nosferalto', 'Mystherbe', 'Ortide', 'Rafflesia',
  'Paras', 'Parasect', 'Mimitoss', 'Aéromite', 'Taupiqueur',
] as const

function choicesFor(index: number): string[] {
  const offsets = [0, 7, 19, 31]
  return offsets
    .map((offset) => spriteNames[(index + offset) % spriteNames.length])
    .sort((left, right) => left.localeCompare(right, 'fr'))
}

export const spriteQuestions: Question[] = spriteNames.map((name, index) => ({
  id: `sprites-${String(index + 1).padStart(3, '0')}`,
  type: 'multiple-choice',
  category: 'Sprites',
  difficulty: ((index % 5) + 1) as Question['difficulty'],
  prompt: 'Quel est ce Pokémon ?',
  choices: choicesFor(index),
  acceptedAnswers: [
    name,
    ...(name === 'Nidoran♀' ? ['Nidoran femelle', 'Nidoran F'] : []),
    ...(name === 'Nidoran♂' ? ['Nidoran mâle', 'Nidoran M'] : []),
  ],
  explanation: `Il s’agit de ${name}, le Pokémon n° ${String(index + 1).padStart(3, '0')} du Pokédex national.`,
  points: 10 + Math.floor(index % 5 / 2) * 5,
  durationSeconds: 20,
  media: {
    kind: 'image',
    src: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${index + 1}.png`,
    alt: 'Sprite mystère à identifier',
    pixelated: true,
  },
}))
