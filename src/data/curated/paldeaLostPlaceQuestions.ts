import type { Question } from '../../domain/quiz'

interface Place {
  name: string
  x: number
  y: number
  clue: string
  visual?: {
    sky: string
    ground: string
    landmark: string
    accent: string
  }
  difficulty: Question['difficulty']
}

const places: Place[] = [
  { name: 'Mesaledo', x: 50, y: 64, clue: 'Cette immense ville abrite l’Académie et se rejoint après Plato Real.', visual: { sky: '#78c8ef', ground: '#d9a06c', landmark: 'ACADEMIE', accent: '#8d5bb8' }, difficulty: 1 },
  { name: 'Cuchalaga', x: 72, y: 86, clue: 'Ce petit village côtier du sud-est est le point de départ du héros.', visual: { sky: '#76c9ed', ground: '#6fbf62', landmark: 'MAISON', accent: '#e9d5a3' }, difficulty: 1 },
  { name: 'Plato Real', x: 56, y: 77, clue: 'Ce village fleuri se trouve entre le point de départ et Mesaledo.', difficulty: 1 },
  { name: 'Cuencia', x: 76, y: 61, clue: 'Cette ville de l’est accueille le Champion de type Plante et son moulin.', visual: { sky: '#84cdec', ground: '#78bb5d', landmark: 'MOULIN', accent: '#ead889' }, difficulty: 2 },
  { name: 'Levalendura', x: 88, y: 45, clue: 'Cette métropole lumineuse de la côte est accueille Mashynn.', visual: { sky: '#769be4', ground: '#596486', landmark: 'NEONS', accent: '#ef68c2' }, difficulty: 2 },
  { name: 'Jarramanca', x: 33, y: 55, clue: 'Cette ville est construite autour d’une oasis et accueille Kombu.', difficulty: 2 },
  { name: 'Mezclamora', x: 39, y: 32, clue: 'Dans cette ville, le restaurant Trésor Culinaire sert également d’Arène.', visual: { sky: '#9dcdec', ground: '#c58e65', landmark: 'RESTAURANT', accent: '#eecc74' }, difficulty: 3 },
  { name: 'Frigao', x: 57, y: 16, clue: 'Cette ville enneigée accueille l’Arène de type Spectre de Laïm.', difficulty: 2 },
  { name: 'Alforneira', x: 20, y: 78, clue: 'Cette ville du sud-ouest, proche d’une caverne, accueille Tully.', visual: { sky: '#b58ed8', ground: '#bb8f70', landmark: 'CAVERNE', accent: '#e5b7ec' }, difficulty: 3 },
  { name: 'Porto Marinada', x: 18, y: 42, clue: 'Son marché aux enchères se trouve sur la côte occidentale de Paldea.', difficulty: 2 },
  { name: 'Lac Asrol', x: 28, y: 21, clue: 'Cette vaste étendue d’eau du nord-ouest abrite de nombreuses îles.', difficulty: 3 },
  { name: 'Zone Zéro', x: 55, y: 48, clue: 'Ce lieu interdit occupe le gigantesque cratère au centre de Paldea.', difficulty: 1 },
]

function sceneDataUri(place: Place): string | undefined {
  if (!place.visual) return undefined
  const { sky, ground, landmark, accent } = place.visual
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360">
    <defs><linearGradient id="s" x2="0" y2="1"><stop stop-color="${sky}"/><stop offset="1" stop-color="#eef7ff"/></linearGradient></defs>
    <rect width="640" height="360" fill="url(#s)"/><path d="M0 230 Q110 175 220 225 T430 205 T640 220 V360 H0Z" fill="${ground}"/>
    <path d="M0 290 Q140 245 280 285 T640 260" fill="none" stroke="#e9d8ad" stroke-width="35"/>
    <rect x="245" y="105" width="150" height="155" rx="8" fill="${accent}" stroke="#fff8" stroke-width="5"/>
    <path d="M225 110 L320 45 415 110Z" fill="#42465f"/><circle cx="320" cy="155" r="28" fill="#f8df72"/>
    <g fill="#5ba453"><circle cx="110" cy="235" r="38"/><circle cx="525" cy="220" r="45"/><rect x="103" y="235" width="14" height="70" fill="#73513e"/><rect x="518" y="220" width="14" height="82" fill="#73513e"/></g>
    <rect x="205" y="300" width="230" height="42" rx="20" fill="#17182bcc"/><text x="320" y="328" fill="white" font-family="Arial" font-size="20" font-weight="700" text-anchor="middle">${landmark}</text>
  </svg>`
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`
}

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
    src: sceneDataUri(place) ?? '',
    alt: `Scène stylisée donnant un indice sur ${place.name}`,
  } : undefined,
  tags: ['lieu-perdu', 'paldea', place.visual ? 'visuel' : 'description'],
  generationScope: [9],
  difficultyReason: place.visual ? 'Reconnaissance visuelle et localisation sur la carte.' : 'Déduction à partir d’indices géographiques.',
  validation: {
    status: 'validated',
    verifiedAt: '2026-07-25',
    sources: [{
      label: 'Poképédia — Paldea',
      url: 'https://www.pokepedia.fr/Paldea',
    }],
  },
}))
