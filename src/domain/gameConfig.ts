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
  icon: string
  image: string
  description: string
  requiresMedia?: boolean
}

export const categories: CategoryDefinition[] = [
  { id: 'Labo', label: 'Labo', icon: '🧬', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/133.png', description: 'Types, évolutions et familles' },
  { id: 'Sprites', label: 'Sprites', icon: '👾', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png', description: 'Reconnaissance visuelle', requiresMedia: true },
  { id: 'Cris', label: 'Cris', icon: '🔊', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/441.png', description: 'Reconnaissance sonore', requiresMedia: true },
  { id: 'Musique', label: 'Musique', icon: '🎵', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/648.png', description: 'Thèmes des jeux', requiresMedia: true },
  { id: 'Pokédex', label: 'Pokédex', icon: '📕', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/479.png', description: 'Espèces et caractéristiques' },
  { id: 'Capacités', label: 'Capacités', icon: '💥', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/448.png', description: 'Types, puissance et catégories de dégâts' },
  { id: 'Objets', label: 'Objets', icon: '🎒', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/225.png', description: 'Sac, prix, catégories et Dégommage' },
  { id: 'Stratégie', label: 'Stratégie', icon: '♟️', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/681.png', description: 'Statistiques et combat' },
  { id: 'Stats en Ordre', label: 'Stats en Ordre', icon: '📊', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/376.png', description: 'Classement des six statistiques' },
  { id: 'Lieu Perdu', label: 'Lieu Perdu', icon: '📍', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/50.png', description: 'Localisation sur une carte interactive' },
  { id: 'Lore', label: 'Lore', icon: '📜', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/493.png', description: 'Légendes et univers' },
  { id: 'Spin-off', label: 'Spin-off', icon: '🎮', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/251.png', description: 'Jeux en dehors de la série principale' },
  { id: 'Pokopia', label: 'Pokopia', icon: '🏡', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/132.png', description: 'Construction, habitants et monde cosy' },
  { id: 'Jeux principaux', label: 'Jeux principaux', icon: '🗺️', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png', description: 'Régions, personnages et aventures' },
  { id: 'Anime', label: 'Anime', icon: '📺', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png', description: 'Sacha et ses compagnons' },
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
