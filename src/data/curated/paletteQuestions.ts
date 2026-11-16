import type { Question } from '../../domain/quiz'
import { preferImageCdn } from '../../utils/imageSources'

interface PaletteEntry {
  id: number
  name: string
  hue: number
  saturation: number
  lightness: number
  hueTolerance?: number
  lightnessTolerance?: number
  difficulty: Question['difficulty']
}

const entries: PaletteEntry[] = [
  { id: 25, name: 'Pikachu', hue: 49, saturation: 87, lightness: 57, difficulty: 1 },
  { id: 1, name: 'Bulbizarre', hue: 166, saturation: 45, lightness: 55, difficulty: 2 },
  { id: 4, name: 'Salamèche', hue: 24, saturation: 82, lightness: 60, difficulty: 1 },
  { id: 7, name: 'Carapuce', hue: 202, saturation: 57, lightness: 59, difficulty: 1 },
  { id: 133, name: 'Évoli', hue: 28, saturation: 42, lightness: 49, difficulty: 2 },
  { id: 94, name: 'Ectoplasma', hue: 258, saturation: 29, lightness: 45, hueTolerance: 35, difficulty: 3 },
  { id: 39, name: 'Rondoudou', hue: 347, saturation: 67, lightness: 78, lightnessTolerance: 28, difficulty: 2 },
  { id: 54, name: 'Psykokwak', hue: 48, saturation: 82, lightness: 61, difficulty: 1 },
  { id: 52, name: 'Miaouss', hue: 47, saturation: 58, lightness: 78, lightnessTolerance: 30, difficulty: 3 },
  { id: 58, name: 'Caninos', hue: 27, saturation: 77, lightness: 56, difficulty: 2 },
  { id: 212, name: 'Cizayox', hue: 356, saturation: 67, lightness: 48, difficulty: 2 },
  { id: 448, name: 'Lucario', hue: 218, saturation: 49, lightness: 46, difficulty: 2 },
  { id: 282, name: 'Gardevoir', hue: 151, saturation: 43, lightness: 55, difficulty: 4 },
  { id: 258, name: 'Gobou', hue: 205, saturation: 69, lightness: 57, difficulty: 2 },
  { id: 252, name: 'Arcko', hue: 133, saturation: 52, lightness: 45, difficulty: 2 },
  { id: 255, name: 'Poussifeu', hue: 24, saturation: 87, lightness: 61, difficulty: 1 },
  { id: 393, name: 'Tiplouf', hue: 215, saturation: 59, lightness: 49, difficulty: 2 },
  { id: 722, name: 'Brindibou', hue: 91, saturation: 54, lightness: 43, difficulty: 4 },
  { id: 810, name: 'Ouistempo', hue: 103, saturation: 55, lightness: 48, difficulty: 3 },
  { id: 906, name: 'Poussacha', hue: 126, saturation: 39, lightness: 58, difficulty: 3 },
]

const spriteUrl = (id: number) => preferImageCdn(
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
)

export const paletteQuestions: Question[] = entries.map((entry, index) => ({
  id: `palette-${String(entry.id).padStart(4, '0')}`,
  type: 'palette-match',
  category: 'Palette Perdue',
  difficulty: entry.difficulty,
  template: 'restauration-couleur',
  prompt: `Retrouve la couleur originale de ${entry.name}.`,
  acceptedAnswers: [`Couleur originale de ${entry.name}`],
  explanation: `Compare ta proposition avec la palette originale de ${entry.name}.`,
  points: 20,
  durationSeconds: 35,
  paletteTarget: {
    pokemonName: entry.name,
    hue: entry.hue,
    saturation: entry.saturation,
    lightness: entry.lightness,
    hueTolerance: entry.hueTolerance ?? 24,
    lightnessTolerance: entry.lightnessTolerance ?? 24,
  },
  media: {
    kind: 'image',
    src: spriteUrl(entry.id),
    alt: `Sprite de ${entry.name}`,
    pixelated: true,
    spriteVariant: 'normal',
  },
  tags: ['couleur', 'palette', `prototype-${index + 1}`],
}))
