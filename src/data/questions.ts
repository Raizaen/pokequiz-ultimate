import type { Question } from '../domain/quiz'
import { animeQuestions } from './animeQuestions'
import { curatedLaboQuestions } from './curated/laboPilot'
import { curatedMoveQuestions } from './curated/movesPilot'
import { curatedStrategyQuestions } from './curated/strategyPilot'
import { generatedQuestions } from './generatedQuestions'
import { spriteQuestions } from './spriteQuestions'

const textQuestions: Question[] = [
  {
    id: 'pokedex-001', type: 'multiple-choice', category: 'Pokédex', difficulty: 1,
    prompt: 'Quel Pokémon porte le numéro 025 dans le Pokédex national ?',
    choices: ['Mélofée', 'Pikachu', 'Raichu', 'Sabelette'], acceptedAnswers: ['Pikachu'],
    explanation: 'Pikachu est le Pokémon n° 025 du Pokédex national.', points: 10, durationSeconds: 20,
  },
  {
    id: 'regions-001', type: 'multiple-choice', category: 'Régions', difficulty: 1,
    prompt: 'Dans quelle région se trouve la ville de Doublonville ?',
    choices: ['Kanto', 'Johto', 'Hoenn', 'Sinnoh'], acceptedAnswers: ['Johto'],
    explanation: 'Doublonville est la plus grande ville de Johto.', points: 10, durationSeconds: 20,
  },
  {
    id: 'types-001', type: 'multiple-choice', category: 'Labo', difficulty: 2,
    prompt: 'Quel type est super efficace contre le type Dragon ?',
    choices: ['Feu', 'Électrik', 'Fée', 'Combat'], acceptedAnswers: ['Fée'],
    explanation: 'Le type Fée est super efficace contre Dragon et immunisé aux capacités Dragon.', points: 10, durationSeconds: 20,
  },
  {
    id: 'games-001', type: 'open', category: 'Jeux principaux', difficulty: 2,
    prompt: 'Quel est le nom de la région de Pokémon Noir et Blanc ?',
    acceptedAnswers: ['Unys'], explanation: 'Pokémon Noir et Blanc se déroulent dans la région d’Unys.',
    points: 10, durationSeconds: 30,
  },
  {
    id: 'evolution-001', type: 'open', category: 'Labo', difficulty: 1,
    prompt: 'En quel Pokémon évolue Reptincel ?',
    acceptedAnswers: ['Dracaufeu'], explanation: 'Reptincel évolue en Dracaufeu à partir du niveau 36.',
    points: 10, durationSeconds: 30,
  },
  {
    id: 'abilities-001', type: 'multiple-choice', category: 'Capacités', difficulty: 3,
    prompt: 'Quel talent caractéristique de Munja limite ses faiblesses aux capacités super efficaces ?',
    choices: ['Garde Mystik', 'Lévitation', 'Inconscient', 'Armurbaston'], acceptedAnswers: ['Garde Mystik'],
    explanation: 'Garde Mystik empêche les dégâts directs des capacités qui ne sont pas super efficaces.',
    points: 15, durationSeconds: 25,
  },
  {
    id: 'strategy-001', type: 'multiple-choice', category: 'Stratégie', difficulty: 3,
    prompt: 'Combien de statistiques différentes les EV peuvent-ils augmenter ?',
    choices: ['4', '5', '6', '7'], acceptedAnswers: ['6'],
    explanation: 'Les EV existent pour les PV, l’Attaque, la Défense, l’Attaque Spéciale, la Défense Spéciale et la Vitesse.',
    points: 15, durationSeconds: 25,
  },
  {
    id: 'legacy-anime-001', type: 'open', category: 'Anime', difficulty: 1,
    prompt: 'Quel Pokémon accompagne Sacha depuis le début de son voyage ?',
    acceptedAnswers: ['Pikachu'], explanation: 'Le Pikachu de Sacha est son premier Pokémon et son partenaire historique.',
    points: 10, durationSeconds: 30,
  },
  {
    id: 'moves-001', type: 'multiple-choice', category: 'Capacités', difficulty: 2,
    prompt: 'De quel type est la capacité Tonnerre ?',
    choices: ['Acier', 'Électrik', 'Normal', 'Psy'], acceptedAnswers: ['Électrik', 'Electrik'],
    explanation: 'Tonnerre est une capacité spéciale de type Électrik.', points: 10, durationSeconds: 20,
  },
  {
    id: 'legends-001', type: 'open', category: 'Lore', difficulty: 2,
    prompt: 'Quel Pokémon légendaire est la mascotte de Pokémon Émeraude ?',
    acceptedAnswers: ['Rayquaza'], explanation: 'Rayquaza figure sur la jaquette de Pokémon Émeraude.',
    points: 10, durationSeconds: 30,
  },
  {
    id: 'pokedex-002', type: 'multiple-choice', category: 'Pokédex', difficulty: 3,
    prompt: 'Lequel de ces Pokémon possède le type Spectre ?',
    choices: ['Lucario', 'Mimiqui', 'Tranchodon', 'Gardevoir'], acceptedAnswers: ['Mimiqui'],
    explanation: 'Mimiqui est de type Spectre/Fée.', points: 15, durationSeconds: 20,
  },
  {
    id: 'games-002', type: 'open', category: 'Jeux principaux', difficulty: 3,
    prompt: 'Comment s’appelle le professeur Pokémon de la région de Sinnoh ?',
    acceptedAnswers: ['Professeur Sorbier', 'Sorbier'], explanation: 'Le Professeur Sorbier étudie l’évolution des Pokémon à Sinnoh.',
    points: 15, durationSeconds: 30,
  },
]

export const questions: Question[] = [...curatedLaboQuestions, ...curatedMoveQuestions, ...curatedStrategyQuestions, ...textQuestions, ...generatedQuestions, ...animeQuestions, ...spriteQuestions]
