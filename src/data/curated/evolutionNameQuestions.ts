import type { Question } from '../../domain/quiz'

interface EvolutionEntry {
  id: number
  name: string
  evolutions: string[]
  difficulty?: Question['difficulty']
}

const entries: EvolutionEntry[] = [
  { id: 1, name: 'Bulbizarre', evolutions: ['Herbizarre'], difficulty: 1 },
  { id: 4, name: 'Salamèche', evolutions: ['Reptincel'], difficulty: 1 },
  { id: 7, name: 'Carapuce', evolutions: ['Carabaffe'], difficulty: 1 },
  { id: 44, name: 'Ortide', evolutions: ['Rafflesia', 'Joliflor'], difficulty: 2 },
  { id: 61, name: 'Têtarte', evolutions: ['Tartard', 'Tarpaud'], difficulty: 2 },
  { id: 79, name: 'Ramoloss', evolutions: ['Flagadoss', 'Roigada'], difficulty: 2 },
  { id: 129, name: 'Magicarpe', evolutions: ['Léviator'], difficulty: 1 },
  { id: 133, name: 'Évoli', evolutions: ['Aquali', 'Voltali', 'Pyroli', 'Mentali', 'Noctali', 'Phyllali', 'Givrali', 'Nymphali'], difficulty: 3 },
  { id: 147, name: 'Minidraco', evolutions: ['Draco'], difficulty: 1 },
  { id: 236, name: 'Debugant', evolutions: ['Kicklee', 'Tygnon', 'Kapoera'], difficulty: 3 },
  { id: 246, name: 'Embrylex', evolutions: ['Ymphect'], difficulty: 2 },
  { id: 265, name: 'Chenipotte', evolutions: ['Armulys', 'Blindalys'], difficulty: 2 },
  { id: 280, name: 'Tarsal', evolutions: ['Kirlia'], difficulty: 1 },
  { id: 281, name: 'Kirlia', evolutions: ['Gardevoir', 'Gallame'], difficulty: 2 },
  { id: 366, name: 'Coquiperl', evolutions: ['Serpang', 'Rosabyss'], difficulty: 3 },
  { id: 374, name: 'Terhal', evolutions: ['Métang'], difficulty: 2 },
  { id: 412, name: 'Cheniti', evolutions: ['Cheniselle', 'Papilord'], difficulty: 3 },
  { id: 436, name: 'Archéomire', evolutions: ['Archéodong'], difficulty: 2 },
  { id: 443, name: 'Griknot', evolutions: ['Carmache'], difficulty: 2 },
  { id: 447, name: 'Riolu', evolutions: ['Lucario'], difficulty: 1 },
  { id: 459, name: 'Blizzi', evolutions: ['Blizzaroi'], difficulty: 2 },
  { id: 577, name: 'Nucléos', evolutions: ['Méios'], difficulty: 2 },
  { id: 633, name: 'Solochi', evolutions: ['Diamat'], difficulty: 2 },
  { id: 704, name: 'Mucuscule', evolutions: ['Colimucus'], difficulty: 2 },
  { id: 712, name: 'Grelaçon', evolutions: ['Séracrawl'], difficulty: 2 },
  { id: 782, name: 'Bébécaille', evolutions: ['Écaïd'], difficulty: 2 },
  { id: 840, name: 'Verpom', evolutions: ['Pomdrapi', 'Dratatin', 'Pomdramour'], difficulty: 4 },
  { id: 884, name: 'Duralugon', evolutions: ['Pondralugon'], difficulty: 3 },
  { id: 885, name: 'Fantyrm', evolutions: ['Dispareptil'], difficulty: 2 },
  { id: 906, name: 'Poussacha', evolutions: ['Matourgeon'], difficulty: 1 },
  { id: 909, name: 'Chochodile', evolutions: ['Crocogril'], difficulty: 1 },
  { id: 912, name: 'Coiffeton', evolutions: ['Canarbello'], difficulty: 1 },
  { id: 935, name: 'Charbambin', evolutions: ['Carmadura', 'Malvalame'], difficulty: 2 },
  { id: 999, name: 'Mordudor', evolutions: ['Gromago'], difficulty: 3 },
]

function evolutionQuestion(entry: EvolutionEntry): Question {
  const multiple = entry.evolutions.length > 1
  const answer = entry.evolutions.join(' · ')
  return {
    id: `curated-labo-evolutions-${entry.id}`,
    template: multiple ? 'evolutions-directes-multiples' : 'evolution-directe',
    type: multiple ? 'open-multiple' : 'open',
    category: 'Labo',
    difficulty: entry.difficulty ?? 2,
    prompt: multiple
      ? `Quelles sont toutes les évolutions directes de ${entry.name} ?`
      : `Quelle est l’évolution directe de ${entry.name} ?`,
    acceptedAnswers: [answer],
    correctChoices: multiple ? entry.evolutions : undefined,
    explanation: multiple
      ? `${entry.name} peut évoluer directement en ${entry.evolutions.join(', ')}.`
      : `${entry.name} évolue directement en ${entry.evolutions[0]}.`,
    points: multiple ? Math.min(25, 10 + entry.evolutions.length * 2) : 10,
    durationSeconds: multiple ? 40 : 25,
    tags: ['évolution', 'réponse-ouverte', multiple ? 'branche' : 'linéaire'],
    difficultyReason: multiple
      ? `Il faut retrouver ${entry.evolutions.length} branches et toutes les saisir.`
      : 'Il faut connaître l’étape suivante de la famille sans propositions.',
    validation: {
      status: 'validated',
      verifiedAt: '2026-07-31',
      sources: [
        {
          label: `PokéAPI — espèce ${entry.name}`,
          url: `https://pokeapi.co/api/v2/pokemon-species/${entry.id}`,
        },
      ],
    },
  }
}

export const evolutionNameQuestions: Question[] = entries.map(evolutionQuestion)
