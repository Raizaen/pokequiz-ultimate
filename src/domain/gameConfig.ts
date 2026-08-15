import type { Question } from './quiz'

export type GameMode = 'mixed' | 'category'
export type DifficultyPreset = 'discovery' | 'confirmed' | 'expert' | 'all'
export type RegionFilter = 'all' | 'Paldea' | 'Sinnoh'
export type TimerSetting = 10 | 15 | 20 | 30 | null
export type SpriteGenerationFilter = number[] | 'all'
export type SpriteVariant = 'normal' | 'silhouette' | 'progressive' | 'shiny' | 'zoom' | 'flipped'
export type SpriteVariantFilter = SpriteVariant[] | 'all'
export type PokopiaSpoilerFilter = 'safe' | 'all'

export interface GameConfig {
  mode: GameMode
  category?: string
  difficulty: DifficultyPreset
  region?: RegionFilter
  spriteGenerations?: SpriteGenerationFilter
  spriteVariants?: SpriteVariantFilter
  pokopiaSpoilers?: PokopiaSpoilerFilter
  timerSeconds?: TimerSetting
}

export interface CategoryDefinition {
  id: string
  label: string
  description: string
  requiresMedia?: boolean
}

export const categories: CategoryDefinition[] = [
  { id: 'Labo', label: 'Labo', description: 'Types, évolutions et familles' },
  { id: 'Sprites', label: 'Sprites', description: 'Reconnaissance visuelle', requiresMedia: true },
  { id: 'Fouille dans les Mines', label: 'Fouille dans les Mines', description: 'Excavation de sprites enfouis', requiresMedia: true },
  { id: 'Cris', label: 'Cris', description: 'Reconnaissance sonore', requiresMedia: true },
  { id: 'Musique', label: 'Musique', description: 'Thèmes des jeux', requiresMedia: true },
  { id: 'Pokédex', label: 'Pokédex', description: 'Espèces et caractéristiques' },
  { id: 'Capacités', label: 'Capacités', description: 'Types, puissance et catégories de dégâts' },
  { id: 'Objets', label: 'Objets', description: 'Sac, prix, catégories et Dégommage' },
  { id: 'Stratégie', label: 'Stratégie', description: 'Statistiques et combat' },
  { id: 'Stats en Ordre', label: 'Stats en Ordre', description: 'Classement des six statistiques' },
  { id: 'Lieu Perdu', label: 'Lieu Perdu', description: 'Localisation sur une carte interactive' },
  { id: 'Lore', label: 'Lore', description: 'Légendes et univers' },
  { id: 'Spin-off', label: 'Spin-off', description: 'Jeux en dehors de la série principale' },
  { id: 'Pokopia', label: 'Pokopia', description: 'Construction, habitants et monde cosy' },
  { id: 'Jeux principaux', label: 'Jeux principaux', description: 'Régions, personnages et aventures' },
  { id: 'Anime', label: 'Anime', description: 'Sacha et ses compagnons' },
]

export const difficultyPresets: Array<{
  id: DifficultyPreset
  label: string
  description: string
  range: [Question['difficulty'], Question['difficulty']]
}> = [
  { id: 'discovery', label: 'Découverte', description: '★ à ★★', range: [1, 2] },
  { id: 'confirmed', label: 'Confirmé', description: '★★ à ★★★', range: [2, 3] },
  { id: 'expert', label: 'Expert', description: '★★★ à ★★★★★', range: [3, 5] },
  { id: 'all', label: 'Tous niveaux', description: 'Progression variée', range: [1, 5] },
]
