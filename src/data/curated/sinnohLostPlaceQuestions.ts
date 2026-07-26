import type { Question } from '../../domain/quiz'

interface Place {
  name: string
  x: number
  y: number
  clue: string
  difficulty: Question['difficulty']
}

const places: Place[] = [
  { name: 'Bonaugure', x: 24.2, y: 87.8, clue: 'Ce petit village du sud-ouest est le point de départ de l’aventure à Sinnoh.', difficulty: 1 },
  { name: 'Littorella', x: 37.6, y: 91, clue: 'Cette ville côtière abrite le laboratoire du Professeur Sorbier.', difficulty: 1 },
  { name: 'Féli-Cité', x: 29.2, y: 72.8, clue: 'Cette grande ville moderne accueille le siège de Féli-Télé.', difficulty: 1 },
  { name: 'Charbourg', x: 38.7, y: 71, clue: 'Cette ville minière accueille Pierrick et la première Arène de Sinnoh.', difficulty: 1 },
  { name: 'Floraville', x: 33.8, y: 50.5, clue: 'Cette petite ville fleurie se trouve près des Éoliennes.', difficulty: 2 },
  { name: 'Vestigion', x: 40.5, y: 49.3, clue: 'Cette ville ancienne accueille Flo, une Boutique de Vélo et une statue mystérieuse.', difficulty: 2 },
  { name: 'Unionpolis', x: 49.9, y: 66, clue: 'Cette ville accueille les Super Concours et l’Arène de Kiméra.', difficulty: 1 },
  { name: 'Bonville', x: 57.4, y: 61.5, clue: 'Cette petite ville paisible est connue pour sa Pension Pokémon et ses ruines.', difficulty: 2 },
  { name: 'Voilaroc', x: 66.8, y: 57, clue: 'Cette grande ville de l’est abrite le centre commercial et l’Arène de Mélina.', difficulty: 1 },
  { name: 'Verchamps', x: 61.3, y: 82.6, clue: 'Cette ville du sud-est donne accès au Grand Marais et accueille Lovis.', difficulty: 1 },
  { name: 'Célestia', x: 48.9, y: 48.5, clue: 'Ce village historique abrite des ruines liées aux légendes de Sinnoh.', difficulty: 2 },
  { name: 'Joliberges', x: 30, y: 59.5, clue: 'Cette ville portuaire coupée par un canal accueille Charles et sa bibliothèque.', difficulty: 2 },
  { name: 'Frimapic', x: 43.4, y: 12.5, clue: 'Cette ville enneigée du nord abrite l’Arène de Gladys.', difficulty: 1 },
  { name: 'Rivamar', x: 76.4, y: 72.5, clue: 'Cette ville solaire de la côte est accueille Tanguy et le Phare Panorama.', difficulty: 1 },
  { name: 'Ligue Pokémon', x: 75.4, y: 48.5, clue: 'Ce bâtiment isolé est accessible après la Route Victoire et une immense cascade.', difficulty: 2 },
  { name: 'Aire de Combat', x: 61.2, y: 38, clue: 'Cette destination de la Zone de Combat est le premier arrêt après la traversée en bateau.', difficulty: 3 },
  { name: 'Aire de Survie', x: 62.3, y: 28.8, clue: 'Cette petite aire se situe au nord de la Zone de Combat, sur la route du Mont Abrupt.', difficulty: 3 },
  { name: 'Aire de Détente', x: 72.5, y: 41.3, clue: 'Cette destination touristique de l’île nord-est est connue pour le Ruban Syndicat.', difficulty: 4 },
  { name: 'Lac Vérité', x: 22.2, y: 81.5, clue: 'Ce lac proche de Bonaugure est associé au Pokémon légendaire Créfollet.', difficulty: 2 },
  { name: 'Lac Savoir', x: 40.5, y: 12.5, clue: 'Ce lac enneigé du nord est associé au Pokémon légendaire Créhelf.', difficulty: 3 },
  { name: 'Lac Courage', x: 67, y: 68, clue: 'Ce lac de l’est est associé au Pokémon légendaire Créfadet.', difficulty: 3 },
  { name: 'Mont Couronné', x: 45, y: 57, clue: 'Cette immense montagne divise Sinnoh en deux parties.', difficulty: 1 },
  { name: 'Colonnes Lances', x: 45, y: 48, clue: 'Ce sommet sacré du Mont Couronné est au cœur du plan de la Team Galaxie.', difficulty: 3 },
  { name: 'Forêt Vestigion', x: 31.5, y: 53.5, clue: 'Cette forêt brumeuse se trouve à l’ouest de Vestigion et abrite le Vieux Château.', difficulty: 2 },
  { name: 'Les Éoliennes', x: 35.7, y: 61, clue: 'Cette centrale alimentée par le vent se trouve à l’est de Floraville.', difficulty: 2 },
  { name: 'Île de Fer', x: 26.2, y: 45, clue: 'Cette île minière accessible depuis Joliberges est le lieu de rencontre avec Armand.', difficulty: 3 },
  { name: 'Vieux Château', x: 30.5, y: 49.5, clue: 'Ce manoir abandonné se cache à la lisière de la Forêt Vestigion.', difficulty: 3 },
  { name: 'Grand Marais', x: 61, y: 77.5, clue: 'Cette vaste réserve naturelle jouxte la ville de Verchamps.', difficulty: 2 },
  { name: 'Temple de Frimapic', x: 43.4, y: 8.5, clue: 'Ce temple ancien au nord de Frimapic abrite Regigigas.', difficulty: 3 },
  { name: 'Mont Abrupt', x: 64, y: 9, clue: 'Ce volcan de l’extrême nord-est est lié à Heatran.', difficulty: 4 },
]

export const sinnohLostPlaceQuestions: Question[] = places.map((place, index) => ({
  id: `sinnoh-lost-place-${String(index + 1).padStart(2, '0')}`,
  type: 'map-location',
  category: 'Lieu Perdu',
  difficulty: place.difficulty,
  template: 'description-geographique',
  prompt: place.clue,
  acceptedAnswers: [place.name],
  explanation: `${place.name} se situe à l’emplacement indiqué sur la carte de Sinnoh. ${place.clue}`,
  points: 25,
  durationSeconds: 120,
  mapTarget: { x: place.x, y: place.y },
  mapRegion: 'Sinnoh',
  tags: ['lieu-perdu', 'sinnoh', 'description'],
  generationScope: [4, 8],
  difficultyReason: 'Déduction à partir d’indices géographiques et culturels sur Sinnoh.',
  validation: {
    status: 'validated',
    verifiedAt: '2026-07-26',
    sources: [
      {
        label: 'Poképédia — Sinnoh',
        url: 'https://www.pokepedia.fr/Sinnoh',
      },
      {
        label: 'Carte de Sinnoh — Pokémon Diamant Étincelant et Perle Scintillante',
        url: 'https://archives.bulbagarden.net/wiki/File:Sinnoh_BDSP.png',
      },
    ],
  },
}))
