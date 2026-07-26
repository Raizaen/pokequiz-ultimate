import type { Question } from '../../domain/quiz'

const evolutionMethods = {
  label: 'Bulbapedia — Methods of Evolution',
  url: 'https://bulbapedia.bulbagarden.net/wiki/Evolution_method',
}

function sourceFor(speciesId: number, label: string) {
  return [
    evolutionMethods,
    { label: `PokéAPI — ${label}`, url: `https://pokeapi.co/api/v2/pokemon-species/${speciesId}` },
  ]
}

function validated(question: Question, speciesId: number, speciesLabel: string): Question {
  return {
    ...question,
    tags: ['évolution', 'pack-pilote'],
    validation: {
      status: 'validated',
      verifiedAt: '2026-07-25',
      sources: sourceFor(speciesId, speciesLabel),
    },
  }
}

export const curatedLaboQuestions: Question[] = [
  validated({
    id: 'curated-labo-001', template: 'niveau-evolution', type: 'multiple-choice', category: 'Labo', difficulty: 1,
    prompt: 'À quel niveau Bulbizarre évolue-t-il en Herbizarre ?', choices: ['Niveau 14', 'Niveau 16', 'Niveau 18', 'Niveau 20'],
    acceptedAnswers: ['Niveau 16'], explanation: 'Bulbizarre évolue en Herbizarre à partir du niveau 16.', points: 10, durationSeconds: 20,
    generationScope: 'all', difficultyReason: 'Évolution d’un Pokémon de départ très connue.',
  }, 1, 'Bulbizarre'),
  validated({
    id: 'curated-labo-002', template: 'niveau-evolution', type: 'multiple-choice', category: 'Labo', difficulty: 1,
    prompt: 'À quel niveau Reptincel évolue-t-il en Dracaufeu ?', choices: ['Niveau 32', 'Niveau 34', 'Niveau 36', 'Niveau 40'],
    acceptedAnswers: ['Niveau 36'], explanation: 'Reptincel évolue en Dracaufeu à partir du niveau 36.', points: 10, durationSeconds: 20,
    generationScope: 'all', difficultyReason: 'Évolution finale emblématique de la première génération.',
  }, 5, 'Reptincel'),
  validated({
    id: 'curated-labo-003', template: 'pierre-evolution', type: 'multiple-choice', category: 'Labo', difficulty: 1,
    prompt: 'Quelle pierre fait évoluer Évoli en Aquali ?', choices: ['Pierre Eau', 'Pierre Glace', 'Pierre Lune', 'Pierre Plante'],
    acceptedAnswers: ['Pierre Eau'], explanation: 'Évoli évolue en Aquali au contact d’une Pierre Eau.', points: 10, durationSeconds: 20,
    generationScope: 'all', difficultyReason: 'Méthode d’évolution classique et très répandue.',
  }, 133, 'Évoli'),
  validated({
    id: 'curated-labo-004', template: 'amitie-moment', type: 'multiple-choice', category: 'Labo', difficulty: 2,
    prompt: 'Avec une forte amitié, à quel moment de la journée Évoli évolue-t-il en Mentali ?', choices: ['Le matin uniquement', 'Le jour', 'La nuit', 'À minuit uniquement'],
    acceptedAnswers: ['Le jour'], explanation: 'Avec une forte amitié, Évoli évolue en Mentali lorsqu’il gagne un niveau pendant la journée.', points: 10, durationSeconds: 20,
    generationScope: [2, 3, 4, 5, 6, 7, 8, 9], difficultyReason: 'Demande de distinguer les deux évolutions d’Évoli liées à l’amitié.',
  }, 133, 'Évoli'),
  validated({
    id: 'curated-labo-005', template: 'amitie-moment', type: 'multiple-choice', category: 'Labo', difficulty: 2,
    prompt: 'Avec une forte amitié, à quel moment de la journée Évoli évolue-t-il en Noctali ?', choices: ['Le jour', 'La nuit', 'Sous la pluie', 'Pendant un combat'],
    acceptedAnswers: ['La nuit'], explanation: 'Avec une forte amitié, Évoli évolue en Noctali lorsqu’il gagne un niveau pendant la nuit.', points: 10, durationSeconds: 20,
    generationScope: [2, 3, 4, 5, 6, 7, 8, 9], difficultyReason: 'Demande de distinguer les deux évolutions d’Évoli liées à l’amitié.',
  }, 133, 'Évoli'),
  validated({
    id: 'curated-labo-006', template: 'comparaison-statistiques', type: 'multiple-choice', category: 'Labo', difficulty: 3,
    prompt: 'Quelle condition permet à Debugant d’évoluer en Kapoera au niveau 20 ?', choices: ['Attaque supérieure à la Défense', 'Défense supérieure à l’Attaque', 'Attaque égale à la Défense', 'Vitesse égale à l’Attaque'],
    acceptedAnswers: ['Attaque égale à la Défense'], explanation: 'Au niveau 20, Debugant évolue en Kapoera lorsque son Attaque est égale à sa Défense.', points: 15, durationSeconds: 25,
    generationScope: 'all', difficultyReason: 'Méthode conditionnée par la comparaison de deux statistiques.',
  }, 236, 'Debugant'),
  validated({
    id: 'curated-labo-007', template: 'geste-console', type: 'multiple-choice', category: 'Labo', difficulty: 3,
    prompt: 'Quelle manipulation faut-il effectuer lorsque Sepiatop atteint au moins le niveau 30 pour le faire évoluer dans les jeux compatibles ?', choices: ['Fermer le jeu', 'Retourner la console', 'Secouer la manette', 'Retirer un Joy-Con'],
    acceptedAnswers: ['Retourner la console'], explanation: 'Sepiatop évolue en Sepiatroce à partir du niveau 30 lorsque la console est tenue à l’envers.', points: 15, durationSeconds: 25,
    generationScope: [6, 7, 8], difficultyReason: 'Méthode inhabituelle dépendant du matériel.',
  }, 686, 'Sepiatop'),
  validated({
    id: 'curated-labo-008', template: 'meteo-evolution', type: 'multiple-choice', category: 'Labo', difficulty: 3,
    prompt: 'Quelle météo est nécessaire pour faire évoluer Colimucus en Muplodocus à partir du niveau 50 ?', choices: ['Grand soleil', 'Grêle', 'Pluie', 'Tempête de sable'],
    acceptedAnswers: ['Pluie'], explanation: 'Colimucus évolue en Muplodocus à partir du niveau 50 lorsqu’il pleut dans le monde du jeu.', points: 15, durationSeconds: 25,
    generationScope: [6, 7, 8, 9], difficultyReason: 'Combine un niveau élevé et une condition météorologique.',
  }, 705, 'Colimucus'),
  validated({
    id: 'curated-labo-009', template: 'combat-evolution', type: 'open', category: 'Labo', difficulty: 4,
    prompt: 'Combien de Scalproie tenant un Emblème du Général faut-il vaincre avec son propre Scalproie avant de le faire monter de niveau pour obtenir Scalpereur ?', acceptedAnswers: ['3', 'trois'],
    explanation: 'Scalproie doit vaincre trois Scalproie chefs tenant un Emblème du Général, puis gagner un niveau.', points: 20, durationSeconds: 30,
    generationScope: [9], difficultyReason: 'Méthode récente en plusieurs étapes avec objet porté et combats ciblés.',
  }, 625, 'Scalproie'),
  validated({
    id: 'curated-labo-010', template: 'objet-evolution', type: 'multiple-choice', category: 'Labo', difficulty: 2,
    prompt: 'Quel objet fait évoluer Verpom en Dratatin ?', choices: ['Pomme Acidulée', 'Pomme Sucrée', 'Pomme Nectar', 'Sirop de Pomme'],
    acceptedAnswers: ['Pomme Sucrée'], explanation: 'La Pomme Sucrée fait évoluer Verpom en Dratatin.', points: 10, durationSeconds: 20,
    generationScope: [8, 9], difficultyReason: 'Objet d’évolution spécifique à une branche de la famille.',
  }, 840, 'Verpom'),
  validated({
    id: 'curated-labo-011', template: 'objet-evolution', type: 'multiple-choice', category: 'Labo', difficulty: 2,
    prompt: 'Quel objet fait évoluer Verpom en Pomdrapi ?', choices: ['Pomme Acidulée', 'Pomme Sucrée', 'Pomme Nectar', 'Sirop de Pomme'],
    acceptedAnswers: ['Pomme Acidulée'], explanation: 'La Pomme Acidulée fait évoluer Verpom en Pomdrapi.', points: 10, durationSeconds: 20,
    generationScope: [8, 9], difficultyReason: 'Objet d’évolution spécifique à une branche de la famille.',
  }, 840, 'Verpom'),
  validated({
    id: 'curated-labo-012', template: 'forme-regionale', type: 'multiple-choice', category: 'Labo', difficulty: 3,
    prompt: 'En quel Pokémon évolue Ramoloss de Galar avec un Bracelet Galanoa ?', choices: ['Flagadoss', 'Flagadoss de Galar', 'Roigada de Galar', 'Ramoloss ne peut pas évoluer ainsi'],
    acceptedAnswers: ['Flagadoss de Galar'], explanation: 'Le Bracelet Galanoa fait évoluer Ramoloss de Galar en Flagadoss de Galar.', points: 15, durationSeconds: 25,
    generationScope: [8, 9], difficultyReason: 'Concerne une forme régionale et un objet exclusif.',
  }, 79, 'Ramoloss'),
  validated({
    id: 'curated-labo-013', template: 'qcm-multiple-echange', type: 'multiple-select', category: 'Labo', difficulty: 2,
    prompt: 'Sélectionnez tous les Pokémon qui évoluent par échange simple, sans objet tenu.', choices: ['Kadabra', 'Machopeur', 'Pikachu', 'Caninos'],
    correctChoices: ['Kadabra', 'Machopeur'], acceptedAnswers: ['Kadabra, Machopeur'],
    explanation: 'Kadabra et Machopeur évoluent par échange simple, respectivement en Alakazam et Mackogneur.', points: 15, durationSeconds: 30,
    generationScope: 'all', difficultyReason: 'Nécessite d’identifier plusieurs méthodes d’évolution simultanément.',
  }, 64, 'Kadabra'),
  validated({
    id: 'curated-labo-014', template: 'qcm-multiple-pierre', type: 'multiple-select', category: 'Labo', difficulty: 2,
    prompt: 'Sélectionnez tous les Pokémon qui peuvent évoluer avec une Pierre Lune.', choices: ['Nidorina', 'Mélofée', 'Pikachu', 'Goupix'],
    correctChoices: ['Nidorina', 'Mélofée'], acceptedAnswers: ['Nidorina, Mélofée'],
    explanation: 'Nidorina et Mélofée évoluent avec une Pierre Lune. Pikachu et Goupix utilisent d’autres pierres.', points: 15, durationSeconds: 30,
    generationScope: 'all', difficultyReason: 'QCM multiple sur plusieurs familles de la première génération.',
  }, 30, 'Nidorina'),
  validated({
    id: 'curated-labo-015', template: 'type-mega-evolution', type: 'multiple-choice', category: 'Labo', difficulty: 3,
    prompt: 'Quelle combinaison de types possède Méga-Altaria ?', choices: ['Dragon / Fée', 'Dragon / Vol', 'Normal / Fée', 'Vol / Fée'],
    acceptedAnswers: ['Dragon / Fée'], explanation: 'En méga-évoluant, Altaria devient de type Dragon/Fée.', points: 15, durationSeconds: 20,
    generationScope: [6, 7], difficultyReason: 'Demande de connaître un changement de types lié à la Méga-Évolution.',
  }, 334, 'Altaria'),
  validated({
    id: 'curated-labo-016', template: 'style-capacite', type: 'multiple-choice', category: 'Labo', difficulty: 4,
    prompt: 'Dans Pokémon Légendes : Arceus, quelle action permet à Qwilfish de Hisui d’évoluer en Qwilpik ?', choices: ['Utiliser Multitoxik 20 fois en Style Puissant', 'Vaincre 20 Qwilfish', 'Subir 294 PV de recul', 'Utiliser une Pierre Nuit'],
    acceptedAnswers: ['Utiliser Multitoxik 20 fois en Style Puissant'], explanation: 'Dans Légendes : Arceus, Qwilfish de Hisui évolue après avoir utilisé Multitoxik 20 fois en Style Puissant.', points: 20, durationSeconds: 30,
    generationScope: [8], difficultyReason: 'Méthode propre à un jeu et à son système de styles.',
  }, 211, 'Qwilfish'),
  validated({
    id: 'curated-labo-017', template: 'lune-objet', type: 'multiple-choice', category: 'Labo', difficulty: 4,
    prompt: 'Dans Pokémon Légendes : Arceus, comment faire évoluer Ursaring en Ursaking ?', choices: ['Utiliser un Bloc de Tourbe pendant la pleine lune', 'Gagner un niveau de nuit', 'Utiliser une Pierre Lune', 'Vaincre un Ursaking'],
    acceptedAnswers: ['Utiliser un Bloc de Tourbe pendant la pleine lune'], explanation: 'Ursaring évolue avec un Bloc de Tourbe utilisé pendant une pleine lune.', points: 20, durationSeconds: 30,
    generationScope: [8], difficultyReason: 'Combine un objet rare, une phase lunaire et un jeu spécifique.',
  }, 217, 'Ursaring'),
  validated({
    id: 'curated-labo-018', template: 'degats-recul', type: 'open', category: 'Labo', difficulty: 5,
    prompt: 'Combien de PV de dégâts de recul Bargantua Motif Blanc doit-il accumuler sans tomber K.O. pour pouvoir évoluer en Paragruel ?', acceptedAnswers: ['294', '294 PV'],
    explanation: 'Bargantua Motif Blanc doit perdre au moins 294 PV à cause du recul, sans être mis K.O.', points: 25, durationSeconds: 35,
    generationScope: [8, 9], difficultyReason: 'Valeur numérique précise d’une méthode d’évolution atypique.',
  }, 550, 'Bargantua'),
  validated({
    id: 'curated-labo-019', template: 'capacite-repetee', type: 'multiple-choice', category: 'Labo', difficulty: 4,
    prompt: 'Que doit faire Colossinge avant de gagner un niveau pour évoluer en Courrousinge ?', choices: ['Utiliser Poing de Colère 20 fois', 'Vaincre 20 Pokémon Spectre', 'Subir 294 PV de recul', 'Tenir une Pierre Stase'],
    acceptedAnswers: ['Utiliser Poing de Colère 20 fois'], explanation: 'Colossinge évolue après avoir utilisé Poing de Colère 20 fois puis gagné un niveau.', points: 20, durationSeconds: 30,
    generationScope: [9], difficultyReason: 'Méthode récente fondée sur le nombre d’utilisations d’une capacité.',
  }, 57, 'Colossinge'),
  validated({
    id: 'curated-labo-020', template: 'objet-branche', type: 'multiple-select', category: 'Labo', difficulty: 4,
    prompt: 'Sélectionnez les associations correctes pour les évolutions de Charbambin.', choices: ['Armure de la Fortune → Carmadura', 'Armure de la Rancune → Malvalame', 'Pierre Feu → Carmadura', 'Pierre Nuit → Malvalame'],
    correctChoices: ['Armure de la Fortune → Carmadura', 'Armure de la Rancune → Malvalame'],
    acceptedAnswers: ['Armure de la Fortune → Carmadura, Armure de la Rancune → Malvalame'],
    explanation: 'L’Armure de la Fortune donne Carmadura et l’Armure de la Rancune donne Malvalame.', points: 20, durationSeconds: 35,
    generationScope: [9], difficultyReason: 'QCM multiple sur deux objets et deux branches exclusives de version.',
  }, 935, 'Charbambin'),
]
