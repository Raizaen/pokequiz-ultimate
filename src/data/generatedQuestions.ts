import type { Question } from '../domain/quiz'
import moveFacts from './generated/moveFacts.json'
import pokemonFacts from './generated/pokemonFacts.json'

const types = ['Normal', 'Feu', 'Eau', 'Électrik', 'Plante', 'Glace', 'Combat', 'Poison', 'Sol', 'Vol', 'Psy', 'Insecte', 'Roche', 'Spectre', 'Dragon', 'Ténèbres', 'Acier', 'Fée']
const stats = ['PV', 'Attaque', 'Défense', 'Attaque Spéciale', 'Défense Spéciale', 'Vitesse']

function fourChoices(pool: string[], answer: string, index: number): string[] {
  const choices = new Set([answer])
  let offset = 1
  while (choices.size < 4) {
    choices.add(pool[(index + offset * 7) % pool.length])
    offset += 1
  }
  return [...choices].sort((left, right) => left.localeCompare(right, 'fr'))
}

const difficulty = (index: number) => ((index % 5) + 1) as Question['difficulty']

export const generatedQuestions: Question[] = [
  ...pokemonFacts.map((fact, index): Question => ({
    id: `labo-${fact.id}`, type: 'multiple-choice', category: 'Labo', difficulty: difficulty(index),
    prompt: `Quel est le type principal de ${fact.name} ?`,
    choices: fourChoices(types, fact.primaryType, index), acceptedAnswers: [fact.primaryType],
    explanation: `Le type principal de ${fact.name} est ${fact.primaryType}.`,
    points: 10, durationSeconds: 20,
  })),
  ...pokemonFacts.map((fact, index): Question => ({
    id: `pokedex-${fact.id}`, type: 'multiple-choice', category: 'Pokédex', difficulty: difficulty(index),
    prompt: `Quel Pokémon porte le numéro ${String(fact.id).padStart(4, '0')} dans le Pokédex national ?`,
    choices: fourChoices(pokemonFacts.map(({ name }) => name), fact.name, index), acceptedAnswers: [fact.name],
    explanation: `${fact.name} porte le numéro ${fact.id} dans le Pokédex national.`,
    points: 10, durationSeconds: 20,
  })),
  ...pokemonFacts.map((fact, index): Question => {
    const answer = fact.highestStats.join(' et ')
    return {
      id: `strategy-${fact.id}`, type: 'multiple-choice', category: 'Stratégie', difficulty: difficulty(index),
      prompt: `Quelle est la statistique de base la plus élevée de ${fact.name} ?`,
      choices: fourChoices(stats, answer, index), acceptedAnswers: [answer],
      explanation: `${answer} culmine à ${fact.highestValue} points de base chez ${fact.name}.`,
      points: 15, durationSeconds: 25,
    }
  }),
  ...pokemonFacts.map((fact, index): Question => ({
    id: `lore-${fact.id}`, type: 'multiple-choice', category: 'Lore', difficulty: difficulty(index),
    prompt: `Quel Pokémon correspond à cette description du Pokédex : « ${fact.flavor} » ?`,
    choices: fourChoices(pokemonFacts.map(({ name }) => name), fact.name, index), acceptedAnswers: [fact.name],
    explanation: `Cette description du Pokédex concerne ${fact.name}.`,
    points: 15, durationSeconds: 30,
  })),
  ...pokemonFacts.map((fact, index): Question => ({
    id: `games-${fact.id}`, type: 'multiple-choice', category: 'Jeux principaux', difficulty: difficulty(index),
    prompt: `Dans quelle génération ${fact.name} a-t-il été introduit ?`,
    choices: fourChoices(Array.from({ length: 9 }, (_, generation) => `Génération ${generation + 1}`), `Génération ${fact.generation}`, index),
    acceptedAnswers: [`Génération ${fact.generation}`],
    explanation: `${fact.name} a été introduit en génération ${fact.generation}.`,
    points: 10, durationSeconds: 20,
  })),
  ...moveFacts.map((fact, index): Question => ({
    id: `moves-${fact.id}`, type: 'multiple-choice', category: 'Capacités et objets', difficulty: difficulty(index),
    prompt: `De quel type est la capacité ${fact.name} ?`,
    choices: fourChoices(types, fact.type, index), acceptedAnswers: [fact.type],
    explanation: `${fact.name} est une capacité de type ${fact.type}${fact.power ? ` d’une puissance de ${fact.power}` : ''}.`,
    points: 10, durationSeconds: 20,
  })),
]
