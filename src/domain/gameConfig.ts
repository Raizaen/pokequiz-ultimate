import type { Question } from './quiz'

export type GameMode = 'mixed' | 'category'
export type DifficultyPreset = 'discovery' | 'confirmed' | 'expert' | 'all'

export interface GameConfig {
  mode: GameMode
  category?: string
  difficulty: DifficultyPreset
}

export interface CategoryDefinition {
  id: string
  label: string
  icon: string
  description: string
  requiresMedia?: boolean
}

export const categories: CategoryDefinition[] = [
  { id: 'Labo', label: 'Labo', icon: '🧬', description: 'Types, évolutions et familles' },
  { id: 'Sprites', label: 'Sprites', icon: '👾', description: 'Reconnaissance visuelle', requiresMedia: true },
  { id: 'Cris', label: 'Cris', icon: '🔊', description: 'Reconnaissance sonore', requiresMedia: true },
  { id: 'Musique', label: 'Musique', icon: '🎵', description: 'Thèmes des jeux', requiresMedia: true },
  { id: 'Pokédex', label: 'Pokédex', icon: '📕', description: 'Espèces et caractéristiques' },
  { id: 'Capacités', label: 'Capacités', icon: '💥', description: 'Types, puissance et catégories de dégâts' },
  { id: 'Objets', label: 'Objets', icon: '🎒', description: 'Sac, prix, catégories et Dégommage' },
  { id: 'Stratégie', label: 'Stratégie', icon: '♟️', description: 'Statistiques et combat' },
  { id: 'Lore', label: 'Lore', icon: '📜', description: 'Légendes et univers' },
  { id: 'Spin-off', label: 'Spin-off', icon: '🎮', description: 'Jeux en dehors de la série principale' },
  { id: 'Jeux principaux', label: 'Jeux principaux', icon: '🗺️', description: 'Régions, personnages et aventures' },
  { id: 'Anime', label: 'Anime', icon: '📺', description: 'Sacha et ses compagnons' },
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
