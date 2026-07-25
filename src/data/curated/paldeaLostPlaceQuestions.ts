import type { Question } from '../../domain/quiz'

interface Place {
  name: string
  x: number
  y: number
  clue: string
  visual?: string
  difficulty: Question['difficulty']
}

const places: Place[] = [
  { name: 'Mesaledo', x: 47, y: 76, clue: 'Cette immense ville abrite l’Académie et se rejoint après Plato Real.', visual: 'mesaledo.png', difficulty: 1 },
  { name: 'Cuchalaga', x: 47, y: 96, clue: 'Ce petit village côtier du sud est le point de départ du héros.', visual: 'cuchalaga.png', difficulty: 1 },
  { name: 'Plato Real', x: 47, y: 89, clue: 'Ce village fleuri se trouve entre le point de départ et Mesaledo.', difficulty: 1 },
  { name: 'Cuencia', x: 76, y: 75, clue: 'Cette ville de l’est accueille le Champion de type Plante et son moulin.', visual: 'cuencia.png', difficulty: 2 },
  { name: 'Levalendura', x: 84, y: 58, clue: 'Cette métropole lumineuse de la côte est accueille Mashynn.', visual: 'levalendura.png', difficulty: 2 },
  { name: 'Jarramanca', x: 29.5, y: 52.5, clue: 'Cette ville est construite autour d’une oasis et accueille Kombu.', difficulty: 2 },
  { name: 'Mezclamora', x: 41.5, y: 45.8, clue: 'Dans cette ville, le restaurant Trésor Culinaire sert également d’Arène.', visual: 'mezclamora.png', difficulty: 3 },
  { name: 'Frigao', x: 55, y: 29, clue: 'Cette ville enneigée accueille l’Arène de type Spectre de Laïm.', difficulty: 2 },
  { name: 'Alforneira', x: 18, y: 89, clue: 'Cette ville du sud-ouest, proche d’une caverne, accueille Tully.', visual: 'alforneira.png', difficulty: 3 },
  { name: 'Porto Marinada', x: 8, y: 48, clue: 'Son marché aux enchères se trouve sur la côte occidentale de Paldea.', difficulty: 2 },
  { name: 'Lac Asrol', x: 19.5, y: 29.5, clue: 'Cette vaste étendue d’eau du nord-ouest abrite de nombreuses îles.', difficulty: 3 },
  { name: 'Zone Zéro', x: 50, y: 60.5, clue: 'Ce lieu interdit occupe le gigantesque cratère au centre de Paldea.', difficulty: 1 },
  { name: 'Sevaro', x: 30, y: 75, clue: 'Cette ville entourée d’oliveraies accueille l’Arène de type Insecte d’Éra.', difficulty: 2 },
  { name: 'Pinchoria', x: 68, y: 63, clue: 'Cette petite ville minière de l’est se trouve au milieu d’un terrain rocheux.', difficulty: 3 },
  { name: 'Ligue Pokémon', x: 38.5, y: 68, clue: 'Ce bâtiment se trouve au nord-ouest de Mesaledo, au pied du Grand Cratère.', difficulty: 1 },
  { name: 'Désert Rôtissable', x: 20, y: 53, clue: 'Cette immense étendue sableuse occupe l’ouest de Paldea, près de Jarramanca.', difficulty: 1 },
  { name: 'Mont Nappé', x: 55, y: 24, clue: 'Le point culminant enneigé de Paldea domine toute la partie nord de la région.', difficulty: 1 },
  { name: 'Bosquet Tagué', x: 69, y: 47, clue: 'Cette forêt colorée de l’est abrite le repaire du Groupe Tsih.', difficulty: 3 },
  { name: 'Forêt Toastée', x: 17, y: 21, clue: 'Ce sentier boisé borde le Lac Asrol dans le nord-ouest de Paldea.', difficulty: 4 },
  { name: 'Tunnel Mezcla-Pincho', x: 47, y: 39, clue: 'Ce tunnel permet de traverser les reliefs entre Mezclamora et Pinchoria.', difficulty: 4 },
  { name: 'Repaire du Groupe Segin', x: 23, y: 67, clue: 'Le repaire Ténèbres de la Team Star se trouve dans la partie occidentale de Paldea.', difficulty: 3 },
  { name: 'Repaire du Groupe Schedar', x: 67, y: 69, clue: 'Le repaire Feu de la Team Star est installé dans la partie orientale de Paldea.', difficulty: 3 },
  { name: 'Repaire du Groupe Tsih', x: 70, y: 45, clue: 'Le repaire Poison de la Team Star se cache au cœur du Bosquet Tagué.', difficulty: 4 },
  { name: 'Repaire du Groupe Ruchbah', x: 78, y: 24, clue: 'Le repaire Fée de la Team Star se situe tout au nord de Paldea.', difficulty: 4 },
  { name: 'Repaire du Groupe Caph', x: 28, y: 31, clue: 'Le repaire Combat de la Team Star se trouve dans le nord-ouest, non loin du Lac Asrol.', difficulty: 4 },
]

export const paldeaLostPlaceQuestions: Question[] = places.map((place, index) => ({
  id: `paldea-lost-place-${String(index + 1).padStart(2, '0')}`,
  type: 'map-location',
  category: 'Lieu Perdu',
  difficulty: place.difficulty,
  template: place.visual ? 'capture-stylisee' : 'description-geographique',
  prompt: place.visual ? 'Où a été prise cette scène à Paldea ?' : place.clue,
  acceptedAnswers: [place.name],
  explanation: `${place.name} se situe à l’emplacement indiqué sur la carte de Paldea. ${place.clue}`,
  points: 25,
  durationSeconds: 120,
  mapTarget: { x: place.x, y: place.y },
  mapRegion: 'Paldea',
  media: place.visual ? {
    kind: 'image',
    src: `/assets/lost-place/paldea/${place.visual}`,
    alt: `Capture en jeu donnant un indice sur ${place.name}`,
  } : undefined,
  tags: ['lieu-perdu', 'paldea', place.visual ? 'visuel' : 'description'],
  generationScope: [9],
  difficultyReason: place.visual ? 'Reconnaissance visuelle et localisation sur la carte.' : 'Déduction à partir d’indices géographiques.',
  validation: {
    status: 'validated',
    verifiedAt: '2026-07-25',
    sources: [
      {
        label: 'Poképédia — Paldea',
        url: 'https://www.pokepedia.fr/Paldea',
      },
      ...(place.visual ? [{
        label: `Poképédia — capture de ${place.name}`,
        url: `https://www.pokepedia.fr/Fichier:${encodeURIComponent(place.name)}_EV.png`,
      }] : []),
    ],
  },
}))
