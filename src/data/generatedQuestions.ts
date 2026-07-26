import type { Question } from '../domain/quiz'
import itemFacts from './generated/itemFacts.json'
import moveFacts from './generated/moveFacts.json'
import pokemonFacts from './generated/pokemonFacts.json'

const types = ['Normal', 'Feu', 'Eau', 'Électrik', 'Plante', 'Glace', 'Combat', 'Poison', 'Sol', 'Vol', 'Psy', 'Insecte', 'Roche', 'Spectre', 'Dragon', 'Ténèbres', 'Acier', 'Fée']
const stats = ['PV', 'Attaque', 'Défense', 'Attaque Spéciale', 'Défense Spéciale', 'Vitesse']
const regions = ['Kanto', 'Johto', 'Hoenn', 'Sinnoh', 'Unys', 'Kalos', 'Alola', 'Galar', 'Paldea']
const versionPairs = ['Rouge et Bleu', 'Or et Argent', 'Rubis et Saphir', 'Diamant et Perle', 'Noir et Blanc', 'X et Y', 'Soleil et Lune', 'Épée et Bouclier', 'Écarlate et Violet']
const damageClasses = ['Physique', 'Spéciale', 'Statut']

function fourChoices(pool: string[], answer: string, index: number): string[] {
  const choices = new Set([answer])
  const candidates = [...new Set([...pool, 'Autre', 'Variable', 'Sans catégorie', 'Aucun'])]
  let offset = 1
  while (choices.size < 4) {
    choices.add(candidates[(index + offset) % candidates.length])
    offset += 1
  }
  return [...choices].sort((left, right) => left.localeCompare(right, 'fr'))
}

const difficulty = (index: number) => ((index % 5) + 1) as Question['difficulty']
const numericChoices = (answer: number, step: number) => {
  const choices = new Set([answer, answer + step, Math.max(0, answer - step)])
  let offset = 2
  while (choices.size < 4) {
    choices.add(answer + step * offset)
    offset += 1
  }
  return [...choices].map(String).sort((a, b) => Number(a) - Number(b))
}
const formatDecimal = (value: number) => String(value).replace('.', ',')

function laboQuestion(fact: typeof pokemonFacts[number], index: number): Question {
  const template = index % 5
  if (template === 0) return {
    id: `labo-type-${fact.id}`, template: 'type-principal', type: 'multiple-choice', category: 'Labo', difficulty: difficulty(index),
    prompt: `Quel est le type principal de ${fact.name} ?`, choices: fourChoices(types, fact.primaryType, index), acceptedAnswers: [fact.primaryType],
    explanation: `Le type principal de ${fact.name} est ${fact.primaryType}.`, points: 10, durationSeconds: 20,
  }
  if (template === 1) return {
    id: `labo-taille-${fact.id}`, template: 'taille', type: 'open', category: 'Labo', difficulty: difficulty(index),
    prompt: `Quelle est la taille de ${fact.name}, en mètres ?`, acceptedAnswers: [String(fact.height), formatDecimal(fact.height), `${formatDecimal(fact.height)} m`],
    explanation: `${fact.name} mesure ${formatDecimal(fact.height)} m.`, points: 15, durationSeconds: 30,
  }
  if (template === 2) return {
    id: `labo-poids-${fact.id}`, template: 'poids', type: 'open', category: 'Labo', difficulty: difficulty(index),
    prompt: `Quel est le poids de ${fact.name}, en kilogrammes ?`, acceptedAnswers: [String(fact.weight), formatDecimal(fact.weight), `${formatDecimal(fact.weight)} kg`],
    explanation: `${fact.name} pèse ${formatDecimal(fact.weight)} kg.`, points: 15, durationSeconds: 30,
  }
  if (template === 3) {
    const answer = fact.types.join(' / ')
    return {
      id: `labo-types-${fact.id}`, template: 'combinaison-types', type: 'open', category: 'Labo', difficulty: difficulty(index),
      prompt: `Quelle est la combinaison complète de types de ${fact.name} ?`, acceptedAnswers: [answer, [...fact.types].reverse().join(' / ')],
      explanation: `${fact.name} est de type ${answer}.`, points: 15, durationSeconds: 30,
    }
  }
  return {
    id: `labo-exp-${fact.id}`, template: 'experience-base', type: 'multiple-choice', category: 'Labo', difficulty: difficulty(index),
    prompt: `Combien de points d’expérience de base rapporte ${fact.name} ?`, choices: numericChoices(fact.baseExperience, 20), acceptedAnswers: [String(fact.baseExperience)],
    explanation: `${fact.name} rapporte ${fact.baseExperience} points d’expérience de base.`, points: 20, durationSeconds: 25,
  }
}

function pokedexQuestion(fact: typeof pokemonFacts[number], index: number): Question {
  const names = pokemonFacts.map(({ name }) => name)
  const template = index % 5
  if (template === 0) return {
    id: `pokedex-numero-${fact.id}`, template: 'numero-vers-nom', type: 'multiple-choice', category: 'Pokédex', difficulty: difficulty(index),
    prompt: `Quel Pokémon porte le numéro ${String(fact.id).padStart(4, '0')} ?`, choices: fourChoices(names, fact.name, index), acceptedAnswers: [fact.name],
    explanation: `${fact.name} porte le numéro ${fact.id}.`, points: 10, durationSeconds: 20,
  }
  if (template === 1) return {
    id: `pokedex-nom-${fact.id}`, template: 'nom-vers-numero', type: 'multiple-choice', category: 'Pokédex', difficulty: difficulty(index),
    prompt: `Quel est le numéro national de ${fact.name} ?`, choices: numericChoices(fact.id, 21), acceptedAnswers: [String(fact.id)],
    explanation: `${fact.name} porte le numéro ${fact.id}.`, points: 10, durationSeconds: 20,
  }
  if (template === 2) return {
    id: `pokedex-espece-${fact.id}`, template: 'espece', type: 'multiple-choice', category: 'Pokédex', difficulty: difficulty(index),
    prompt: `Quel Pokémon est classé « ${fact.genus} » ?`, choices: fourChoices(names, fact.name, index), acceptedAnswers: [fact.name],
    explanation: `${fact.name} est classé « ${fact.genus} ».`, points: 15, durationSeconds: 25,
  }
  if (template === 3) return {
    id: `pokedex-couleur-${fact.id}`, template: 'couleur', type: 'multiple-choice', category: 'Pokédex', difficulty: difficulty(index),
    prompt: `Quelle couleur le Pokédex associe-t-il principalement à ${fact.name} ?`, choices: fourChoices(['Noir', 'Bleu', 'Brun', 'Gris', 'Vert', 'Rose', 'Violet', 'Rouge', 'Blanc', 'Jaune'], fact.color, index), acceptedAnswers: [fact.color],
    explanation: `${fact.name} est classé dans la couleur ${fact.color}.`, points: 15, durationSeconds: 20,
  }
  return {
    id: `pokedex-capture-${fact.id}`, template: 'taux-capture', type: 'multiple-choice', category: 'Pokédex', difficulty: difficulty(index),
    prompt: `Quel est le taux de capture de base de ${fact.name} ?`, choices: numericChoices(fact.captureRate, 15), acceptedAnswers: [String(fact.captureRate)],
    explanation: `Le taux de capture de base de ${fact.name} est ${fact.captureRate}.`, points: 20, durationSeconds: 25,
  }
}

function strategyQuestion(fact: typeof pokemonFacts[number], index: number): Question {
  const template = index % 5
  const statQuestion = (kind: 'haute' | 'basse', answer: string, value: number): Question => ({
    id: `strategy-${kind}-${fact.id}`, template: `stat-${kind}`, type: 'multiple-choice', category: 'Stratégie', difficulty: difficulty(index),
    prompt: `Quelle est la statistique de base la plus ${kind === 'haute' ? 'élevée' : 'basse'} de ${fact.name} ?`,
    choices: fourChoices(stats, answer, index), acceptedAnswers: [answer],
    explanation: `${answer} atteint ${value} points de base chez ${fact.name}.`, points: 15, durationSeconds: 25,
  })
  if (template === 0) return statQuestion('haute', fact.highestStats.join(' et '), fact.highestValue)
  if (template === 1) return statQuestion('basse', fact.lowestStats.join(' et '), fact.lowestValue)
  if (template === 2) return {
    id: `strategy-bst-${fact.id}`, template: 'bst', type: 'multiple-choice', category: 'Stratégie', difficulty: difficulty(index),
    prompt: `Quel est le total des statistiques de base de ${fact.name} ?`, choices: numericChoices(fact.statsTotal, 25), acceptedAnswers: [String(fact.statsTotal)],
    explanation: `Le BST de ${fact.name} est ${fact.statsTotal}.`, points: 20, durationSeconds: 25,
  }
  if (template === 3) return {
    id: `strategy-vitesse-${fact.id}`, template: 'vitesse', type: 'multiple-choice', category: 'Stratégie', difficulty: difficulty(index),
    prompt: `Quelle est la Vitesse de base de ${fact.name} ?`, choices: numericChoices(fact.speed, 10), acceptedAnswers: [String(fact.speed)],
    explanation: `${fact.name} possède ${fact.speed} points de Vitesse de base.`, points: 15, durationSeconds: 20,
  }
  return {
    id: `strategy-talent-${fact.id}`, template: 'talent', type: 'multiple-choice', category: 'Stratégie', difficulty: difficulty(index),
    prompt: `Lequel de ces talents peut naturellement appartenir à ${fact.name} ?`,
    choices: fourChoices(pokemonFacts.map(({ primaryAbility }) => primaryAbility), fact.primaryAbility, index), acceptedAnswers: [fact.primaryAbility],
    explanation: `${fact.name} peut posséder le talent ${fact.primaryAbility}.`, points: 20, durationSeconds: 25,
  }
}

function loreQuestion(fact: typeof pokemonFacts[number], index: number): Question {
  const names = pokemonFacts.map(({ name }) => name)
  const template = index % 5
  if (template === 0) return {
    id: `lore-description-${fact.id}`, template: 'description', type: 'multiple-choice', category: 'Lore', difficulty: difficulty(index),
    prompt: `Quel Pokémon correspond à cette description : « ${fact.flavor} » ?`, choices: fourChoices(names, fact.name, index), acceptedAnswers: [fact.name],
    explanation: `Cette description concerne ${fact.name}.`, points: 15, durationSeconds: 30,
  }
  if (template === 1) return {
    id: `lore-legendaire-${fact.id}`, template: 'legendaire', type: 'multiple-choice', category: 'Lore', difficulty: difficulty(index),
    prompt: `${fact.name} est-il officiellement classé comme Pokémon légendaire ?`, choices: ['Oui', 'Non', 'Seulement dans l’anime', 'Seulement sous une autre forme'],
    acceptedAnswers: [fact.isLegendary ? 'Oui' : 'Non'], explanation: `${fact.name} ${fact.isLegendary ? 'est' : 'n’est pas'} classé comme légendaire.`, points: 10, durationSeconds: 20,
  }
  if (template === 2) return {
    id: `lore-fabuleux-${fact.id}`, template: 'fabuleux', type: 'multiple-choice', category: 'Lore', difficulty: difficulty(index),
    prompt: `${fact.name} est-il officiellement classé comme Pokémon fabuleux ?`, choices: ['Oui', 'Non', 'Uniquement au Japon', 'Uniquement dans Pokémon GO'],
    acceptedAnswers: [fact.isMythical ? 'Oui' : 'Non'], explanation: `${fact.name} ${fact.isMythical ? 'est' : 'n’est pas'} classé comme fabuleux.`, points: 10, durationSeconds: 20,
  }
  if (template === 3) return {
    id: `lore-categorie-${fact.id}`, template: 'categorie-pokedex', type: 'multiple-choice', category: 'Lore', difficulty: difficulty(index),
    prompt: `À quel Pokémon appartient la catégorie « ${fact.genus} » ?`, choices: fourChoices(names, fact.name, index), acceptedAnswers: [fact.name],
    explanation: `La catégorie « ${fact.genus} » appartient à ${fact.name}.`, points: 15, durationSeconds: 25,
  }
  return {
    id: `lore-portrait-${fact.id}`, template: 'portrait', type: 'multiple-choice', category: 'Lore', difficulty: difficulty(index),
    prompt: `Quel Pokémon ${fact.color.toLowerCase()} de génération ${fact.generation} correspond à cet extrait : « ${fact.flavor} » ?`,
    choices: fourChoices(names, fact.name, index), acceptedAnswers: [fact.name],
    explanation: `Il s’agit de ${fact.name}.`, points: 20, durationSeconds: 30,
  }
}

function gamesQuestion(fact: typeof pokemonFacts[number], index: number): Question {
  const generationAnswer = `Génération ${fact.generation}`
  const generationChoices = Array.from({ length: 9 }, (_, generation) => `Génération ${generation + 1}`)
  const template = index % 5
  if (template === 0) return {
    id: `games-generation-${fact.id}`, template: 'generation', type: 'multiple-choice', category: 'Jeux principaux', difficulty: difficulty(index),
    prompt: `Dans quelle génération ${fact.name} a-t-il été introduit ?`, choices: fourChoices(generationChoices, generationAnswer, index), acceptedAnswers: [generationAnswer],
    explanation: `${fact.name} a été introduit en génération ${fact.generation}.`, points: 10, durationSeconds: 20,
  }
  if (template === 1) return {
    id: `games-region-${fact.id}`, template: 'region', type: 'multiple-choice', category: 'Jeux principaux', difficulty: difficulty(index),
    prompt: `À quelle région d’origine ${fact.name} est-il associé ?`, choices: fourChoices(regions, regions[fact.generation - 1], index), acceptedAnswers: [regions[fact.generation - 1]],
    explanation: `${fact.name} est originaire de ${regions[fact.generation - 1]}.`, points: 10, durationSeconds: 20,
  }
  if (template === 2) return {
    id: `games-versions-${fact.id}`, template: 'versions', type: 'multiple-choice', category: 'Jeux principaux', difficulty: difficulty(index),
    prompt: `Dans quelle paire de versions la génération de ${fact.name} a-t-elle débuté ?`, choices: fourChoices(versionPairs, versionPairs[fact.generation - 1], index), acceptedAnswers: [versionPairs[fact.generation - 1]],
    explanation: `La génération ${fact.generation} a débuté avec ${versionPairs[fact.generation - 1]}.`, points: 15, durationSeconds: 25,
  }
  if (template === 3) return {
    id: `games-region-generation-${fact.id}`, template: 'region-vers-generation', type: 'multiple-choice', category: 'Jeux principaux', difficulty: difficulty(index),
    prompt: `${fact.name} vient de ${regions[fact.generation - 1]}. À quelle génération correspond cette région ?`, choices: fourChoices(generationChoices, generationAnswer, index), acceptedAnswers: [generationAnswer],
    explanation: `${regions[fact.generation - 1]} correspond à la génération ${fact.generation}.`, points: 15, durationSeconds: 20,
  }
  return {
    id: `games-jeux-${fact.id}`, template: 'pokemon-vers-versions', type: 'multiple-choice', category: 'Jeux principaux', difficulty: difficulty(index),
    prompt: `Quel duo de jeux a introduit ${fact.name} dans la série principale ?`, choices: fourChoices(versionPairs, versionPairs[fact.generation - 1], index), acceptedAnswers: [versionPairs[fact.generation - 1]],
    explanation: `${fact.name} a été introduit avec ${versionPairs[fact.generation - 1]}.`, points: 20, durationSeconds: 25,
  }
}

function moveQuestion(fact: typeof moveFacts[number], index: number): Question {
  const template = index % 5
  if (template === 0) return {
    id: `move-type-${fact.id}`, template: 'type', type: 'multiple-choice', category: 'Capacités', difficulty: difficulty(index),
    prompt: `De quel type est la capacité ${fact.name} ?`, choices: fourChoices(types, fact.type, index), acceptedAnswers: [fact.type],
    explanation: `${fact.name} est de type ${fact.type}.`, points: 10, durationSeconds: 20,
  }
  if (template === 1) return {
    id: `move-classe-${fact.id}`, template: 'classe-degats', type: 'multiple-choice', category: 'Capacités', difficulty: difficulty(index),
    prompt: `${fact.name} est-elle physique, spéciale ou de statut ?`, choices: [...damageClasses, 'Variable'], acceptedAnswers: [fact.damageClass],
    explanation: `${fact.name} appartient à la catégorie ${fact.damageClass}.`, points: 10, durationSeconds: 20,
  }
  if (template === 2) {
    const value = fact.power ?? fact.pp
    const label = fact.power == null ? 'PP de base' : 'puissance'
    return {
      id: `move-valeur-${fact.id}`, template: fact.power == null ? 'pp' : 'puissance', type: 'multiple-choice', category: 'Capacités', difficulty: difficulty(index),
      prompt: `Quelle est la ${label} de ${fact.name} ?`, choices: numericChoices(value, 10), acceptedAnswers: [String(value)],
      explanation: `${fact.name} possède ${value} ${label === 'puissance' ? 'de puissance' : 'PP de base'}.`, points: 15, durationSeconds: 20,
    }
  }
  if (template === 3) return {
    id: `move-pp-${fact.id}`, template: 'pp', type: 'multiple-choice', category: 'Capacités', difficulty: difficulty(index),
    prompt: `Combien de PP de base possède ${fact.name} ?`, choices: numericChoices(fact.pp, 5), acceptedAnswers: [String(fact.pp)],
    explanation: `${fact.name} possède ${fact.pp} PP de base.`, points: 15, durationSeconds: 20,
  }
  const selectedMoves = [0, 7, 19, 31].map((offset) => moveFacts[(index + offset) % moveFacts.length])
  const targetClass = fact.damageClass
  const correctChoices = selectedMoves.filter(({ damageClass }) => damageClass === targetClass).map(({ name }) => name)
  return {
    id: `move-multiple-${fact.id}`, template: 'qcm-multiple-classe', type: 'multiple-select', category: 'Capacités', difficulty: difficulty(index),
    prompt: `Sélectionnez toutes les capacités de catégorie ${targetClass}.`,
    choices: selectedMoves.map(({ name }) => name).sort((left, right) => left.localeCompare(right, 'fr')),
    correctChoices, acceptedAnswers: [correctChoices.join(', ')],
    explanation: `Les bonnes réponses sont : ${correctChoices.join(', ')}.`, points: 20, durationSeconds: 30,
  }
}

function itemQuestion(fact: typeof itemFacts[number], index: number): Question {
  const template = index % 5
  const categories = itemFacts.map(({ category }) => category)
  const pockets = itemFacts.map(({ pocket }) => pocket)
  if (template === 0) return {
    id: `item-prix-${fact.id}`, template: 'prix', type: 'multiple-choice', category: 'Objets', difficulty: difficulty(index),
    prompt: `Quel est le prix d’achat indiqué pour ${fact.name} ?`, choices: numericChoices(fact.cost, Math.max(50, Math.round(fact.cost / 4 / 10) * 10)), acceptedAnswers: [String(fact.cost)],
    explanation: `${fact.name} est référencé au prix de ${fact.cost} ₽.`, points: 10, durationSeconds: 20,
  }
  if (template === 1) return {
    id: `item-categorie-${fact.id}`, template: 'categorie', type: 'multiple-choice', category: 'Objets', difficulty: difficulty(index),
    prompt: `À quelle catégorie appartient ${fact.name} ?`, choices: fourChoices(categories, fact.category, index), acceptedAnswers: [fact.category],
    explanation: `${fact.name} appartient à la catégorie ${fact.category}.`, points: 15, durationSeconds: 25,
  }
  if (template === 2) return {
    id: `item-poche-${fact.id}`, template: 'poche', type: 'multiple-choice', category: 'Objets', difficulty: difficulty(index),
    prompt: `Dans quelle poche du Sac trouve-t-on ${fact.name} ?`, choices: fourChoices(pockets, fact.pocket, index), acceptedAnswers: [fact.pocket],
    explanation: `${fact.name} est rangé dans la poche ${fact.pocket}.`, points: 15, durationSeconds: 20,
  }
  if (template === 3 && fact.flingPower != null) return {
    id: `item-degommage-${fact.id}`, template: 'degommage', type: 'multiple-choice', category: 'Objets', difficulty: difficulty(index),
    prompt: `Quelle puissance ${fact.name} donne-t-il à la capacité Dégommage ?`, choices: numericChoices(fact.flingPower, 10), acceptedAnswers: [String(fact.flingPower)],
    explanation: `${fact.name} donne une puissance de ${fact.flingPower} à Dégommage.`, points: 20, durationSeconds: 25,
  }
  const compared = [0, 7, 19, 31].map((offset) => itemFacts[(index + offset) % itemFacts.length])
  const mostExpensive = [...compared].sort((left, right) => right.cost - left.cost)[0]
  return {
    id: `item-comparaison-${fact.id}`, template: 'comparaison-prix', type: 'multiple-choice', category: 'Objets', difficulty: difficulty(index),
    prompt: 'Lequel de ces objets possède le prix d’achat le plus élevé ?', choices: compared.map(({ name }) => name),
    acceptedAnswers: [mostExpensive.name], explanation: `${mostExpensive.name} est le plus cher de cette sélection avec ${mostExpensive.cost} ₽.`,
    points: 20, durationSeconds: 25,
  }
}

export const generatedQuestions: Question[] = [
  ...pokemonFacts.map(laboQuestion),
  ...pokemonFacts.map(pokedexQuestion),
  ...pokemonFacts.map(strategyQuestion),
  ...pokemonFacts.map(loreQuestion),
  ...pokemonFacts.map(gamesQuestion),
  ...moveFacts.map(moveQuestion),
  ...itemFacts.map(itemQuestion),
]
