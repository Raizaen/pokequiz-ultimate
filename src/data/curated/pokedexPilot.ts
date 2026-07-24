import type { Question } from '../../domain/quiz'

const pokemonSource = (name: string, label: string) => ({
  label: `Bulbapedia — ${label}`,
  url: `https://bulbapedia.bulbagarden.net/wiki/${name}_(Pokémon)`,
})

function validated(question: Question, entries: Array<[string, string]>): Question {
  return {
    ...question,
    tags: ['pokédex', 'pack-pilote'],
    validation: {
      status: 'validated',
      verifiedAt: '2026-07-25',
      sources: entries.map(([name, label]) => pokemonSource(name, label)),
    },
  }
}

export const curatedPokedexQuestions: Question[] = [
  validated({
    id: 'curated-pokedex-001', template: 'numero-national', type: 'multiple-choice', category: 'Pokédex', difficulty: 1,
    prompt: 'Quel Pokémon porte le numéro 025 dans le Pokédex national ?',
    choices: ['Mélofée', 'Pikachu', 'Raichu', 'Sabelette'], acceptedAnswers: ['Pikachu'],
    explanation: 'Pikachu est le Pokémon n° 025 du Pokédex national.', points: 10, durationSeconds: 20,
    generationScope: 'all', difficultyReason: 'Numéro emblématique de la mascotte de la licence.',
  }, [['Pikachu', 'Pikachu']]),
  validated({
    id: 'curated-pokedex-002', template: 'numero-inverse', type: 'multiple-choice', category: 'Pokédex', difficulty: 2,
    prompt: 'Quel est le numéro national d’Évoli ?',
    choices: ['132', '133', '134', '135'], acceptedAnswers: ['133'],
    explanation: 'Évoli occupe la place n° 133, juste avant ses trois premières évolutions.', points: 10, durationSeconds: 20,
    generationScope: 'all', difficultyReason: 'Numéro connu mais moins immédiat que celui de Pikachu.',
  }, [['Eevee', 'Eevee']]),
  validated({
    id: 'curated-pokedex-003', template: 'numero-legendaire', type: 'open', category: 'Pokédex', difficulty: 2,
    prompt: 'Quel Pokémon correspond au numéro national 150 ?',
    acceptedAnswers: ['Mewtwo'], explanation: 'Mewtwo est le Pokémon n° 150 ; Mew porte le numéro 151.',
    points: 10, durationSeconds: 30, generationScope: 'all', difficultyReason: 'Repère classique de la première génération.',
  }, [['Mewtwo', 'Mewtwo']]),
  validated({
    id: 'curated-pokedex-004', template: 'double-type', type: 'multiple-choice', category: 'Pokédex', difficulty: 1,
    prompt: 'Quels sont les types de Dracaufeu dans sa forme normale ?',
    choices: ['Feu/Dragon', 'Feu/Vol', 'Dragon/Vol', 'Feu'], acceptedAnswers: ['Feu/Vol'],
    explanation: 'Dracaufeu est de type Feu et Vol dans sa forme normale.', points: 10, durationSeconds: 20,
    generationScope: 'all', difficultyReason: 'Double type emblématique souvent confondu avec Feu/Dragon.',
  }, [['Charizard', 'Charizard']]),
  validated({
    id: 'curated-pokedex-005', template: 'double-type', type: 'multiple-choice', category: 'Pokédex', difficulty: 1,
    prompt: 'Quels sont les types de Lucario ?',
    choices: ['Combat/Acier', 'Combat/Psy', 'Acier/Psy', 'Combat/Ténèbres'], acceptedAnswers: ['Combat/Acier'],
    explanation: 'Lucario possède le double type Combat/Acier.', points: 10, durationSeconds: 20,
    generationScope: 'all', difficultyReason: 'Double type caractéristique d’un Pokémon populaire.',
  }, [['Lucario', 'Lucario']]),
  validated({
    id: 'curated-pokedex-006', template: 'type-partiel', type: 'multiple-select', category: 'Pokédex', difficulty: 2,
    prompt: 'Sélectionnez les deux types de Mimiqui.',
    choices: ['Spectre', 'Fée', 'Ténèbres', 'Normal'], correctChoices: ['Spectre', 'Fée'],
    acceptedAnswers: ['Spectre, Fée'],
    explanation: 'Mimiqui possède le double type Spectre/Fée.', points: 15, durationSeconds: 30,
    generationScope: 'all', difficultyReason: 'QCM multiple exigeant de sélectionner les deux composantes du type.',
  }, [['Mimikyu', 'Mimikyu']]),
  validated({
    id: 'curated-pokedex-007', template: 'formes-rotom', type: 'multiple-select', category: 'Pokédex', difficulty: 3,
    prompt: 'Depuis la cinquième génération, sélectionnez toutes les associations correctes pour les formes de Motisma.',
    choices: ['Lavage — Électrik/Eau', 'Chaleur — Électrik/Feu', 'Froid — Électrik/Glace', 'Tonte — Électrik/Sol'],
    correctChoices: ['Lavage — Électrik/Eau', 'Chaleur — Électrik/Feu', 'Froid — Électrik/Glace'],
    acceptedAnswers: ['Lavage — Électrik/Eau, Chaleur — Électrik/Feu, Froid — Électrik/Glace'],
    explanation: 'Motisma Tonte est Électrik/Plante, tandis que Lavage, Chaleur et Froid correspondent aux associations proposées.',
    points: 20, durationSeconds: 30, generationScope: [5, 6, 7, 8, 9],
    difficultyReason: 'Compare plusieurs formes dont les types ont changé après la quatrième génération.',
  }, [['Rotom', 'Rotom']]),
  validated({
    id: 'curated-pokedex-008', template: 'talent-signature', type: 'multiple-choice', category: 'Pokédex', difficulty: 1,
    prompt: 'Quel est le talent caractéristique de Munja ?',
    choices: ['Garde Mystik', 'Lévitation', 'Fermeté', 'Peau Dure'], acceptedAnswers: ['Garde Mystik'],
    explanation: 'Garde Mystik protège Munja des capacités offensives qui ne sont pas super efficaces.', points: 10, durationSeconds: 20,
    generationScope: 'all', difficultyReason: 'Talent indissociable de la particularité de Munja.',
  }, [['Shedinja', 'Shedinja']]),
  validated({
    id: 'curated-pokedex-009', template: 'talent-contrainte', type: 'multiple-choice', category: 'Pokédex', difficulty: 2,
    prompt: 'Quel talent force normalement Monaflèmit à ne pouvoir agir qu’un tour sur deux ?',
    choices: ['Absentéisme', 'Défaitiste', 'Frein', 'Simple'], acceptedAnswers: ['Absentéisme'],
    explanation: 'Absentéisme empêche Monaflèmit d’utiliser une capacité lors d’un tour sur deux.', points: 10, durationSeconds: 20,
    generationScope: 'all', difficultyReason: 'Talent négatif compensant les statistiques élevées de Monaflèmit.',
  }, [['Slaking', 'Slaking']]),
  validated({
    id: 'curated-pokedex-010', template: 'talent-couleur', type: 'multiple-choice', category: 'Pokédex', difficulty: 3,
    prompt: 'Quel talent est historiquement associé à Kecleon et change son type lorsqu’il est touché ?',
    choices: ['Homochromie', 'Protéen', 'Peau Miracle', 'Imitation'], acceptedAnswers: ['Homochromie'],
    explanation: 'Homochromie change le type de Kecleon pour celui de la capacité qui vient de le toucher.', points: 15, durationSeconds: 25,
    generationScope: [3, 4, 5, 6, 7, 8, 9], difficultyReason: 'Demande de distinguer deux talents capables de modifier un type.',
  }, [['Kecleon', 'Kecleon']]),
  validated({
    id: 'curated-pokedex-011', template: 'statistique-record', type: 'multiple-choice', category: 'Pokédex', difficulty: 2,
    prompt: 'Quelle est la statistique de base de PV de Leuphorie ?',
    choices: ['200', '230', '250', '255'], acceptedAnswers: ['255'],
    explanation: 'Leuphorie possède 255 PV de base, la valeur maximale possible dans cette statistique.', points: 15, durationSeconds: 20,
    generationScope: 'all', difficultyReason: 'Valeur record connue des joueurs intéressés par les statistiques.',
  }, [['Blissey', 'Blissey']]),
  validated({
    id: 'curated-pokedex-012', template: 'statistiques-jumelles', type: 'multiple-select', category: 'Pokédex', difficulty: 3,
    prompt: 'Quelles statistiques de base de Caratroc valent 230 ?',
    choices: ['Défense', 'Défense Spéciale', 'Attaque', 'PV'], correctChoices: ['Défense', 'Défense Spéciale'],
    acceptedAnswers: ['Défense, Défense Spéciale'],
    explanation: 'Caratroc possède 230 en Défense et en Défense Spéciale, contre seulement 20 PV et 10 en Attaque.',
    points: 20, durationSeconds: 30, generationScope: 'all', difficultyReason: 'Deux valeurs extrêmes doivent être identifiées simultanément.',
  }, [['Shuckle', 'Shuckle']]),
  validated({
    id: 'curated-pokedex-013', template: 'statistique-dominante', type: 'multiple-choice', category: 'Pokédex', difficulty: 2,
    prompt: 'Quelle est la statistique de base la plus élevée de Ronflex ?',
    choices: ['PV', 'Attaque', 'Défense Spéciale', 'Défense'], acceptedAnswers: ['PV'],
    explanation: 'Les PV constituent la statistique de base la plus élevée de Ronflex avec une valeur de 160.', points: 10, durationSeconds: 20,
    generationScope: 'all', difficultyReason: 'Lie la physionomie du Pokémon à son profil statistique réel.',
  }, [['Snorlax', 'Snorlax']]),
  validated({
    id: 'curated-pokedex-014', template: 'statistique-surprise', type: 'multiple-choice', category: 'Pokédex', difficulty: 3,
    prompt: 'Quelle est la Vitesse de base de Magicarpe ?',
    choices: ['20', '40', '60', '80'], acceptedAnswers: ['80'],
    explanation: 'Malgré ses très faibles statistiques offensives, Magicarpe possède une Vitesse de base de 80.', points: 15, durationSeconds: 20,
    generationScope: 'all', difficultyReason: 'Valeur contre-intuitive d’un Pokémon réputé très faible.',
  }, [['Magikarp', 'Magikarp']]),
  validated({
    id: 'curated-pokedex-015', template: 'evolution-branche', type: 'multiple-select', category: 'Pokédex', difficulty: 2,
    prompt: 'En quels Pokémon Chenipotte peut-il évoluer directement ?',
    choices: ['Armulys', 'Blindalys', 'Charmillon', 'Papinox'], correctChoices: ['Armulys', 'Blindalys'],
    acceptedAnswers: ['Armulys, Blindalys'],
    explanation: 'Au niveau 7, Chenipotte évolue en Armulys ou Blindalys selon une valeur interne invisible.',
    points: 15, durationSeconds: 30, generationScope: 'all', difficultyReason: 'Distingue les évolutions directes de leurs stades finaux.',
  }, [['Wurmple', 'Wurmple']]),
  validated({
    id: 'curated-pokedex-016', template: 'evolution-statistiques', type: 'multiple-choice', category: 'Pokédex', difficulty: 3,
    prompt: 'En quoi Debugant évolue-t-il au niveau 20 si son Attaque et sa Défense sont égales ?',
    choices: ['Kapoera', 'Kicklee', 'Tygnon', 'Il n’évolue pas'], acceptedAnswers: ['Kapoera'],
    explanation: 'Debugant évolue en Kapoera si Attaque et Défense sont égales, en Kicklee si l’Attaque est supérieure et en Tygnon si la Défense est supérieure.',
    points: 15, durationSeconds: 25, generationScope: 'all', difficultyReason: 'Condition d’évolution dépendant d’une comparaison statistique.',
  }, [['Tyrogue', 'Tyrogue']]),
  validated({
    id: 'curated-pokedex-017', template: 'evolution-jour-nuit', type: 'multiple-select', category: 'Pokédex', difficulty: 2,
    prompt: 'Sélectionnez toutes les associations correctes pour une évolution d’Évoli avec une forte amitié.',
    choices: ['Jour — Mentali', 'Nuit — Noctali', 'Jour — Noctali', 'Nuit — Mentali'],
    correctChoices: ['Jour — Mentali', 'Nuit — Noctali'], acceptedAnswers: ['Jour — Mentali, Nuit — Noctali'],
    explanation: 'Avec une forte amitié, Évoli évolue en Mentali le jour et en Noctali la nuit, hors condition prioritaire liée à une capacité Fée.',
    points: 15, durationSeconds: 30, generationScope: [2, 3, 4, 5, 6, 7, 8, 9],
    difficultyReason: 'Compare les deux évolutions temporelles historiques d’Évoli.',
  }, [['Eevee', 'Eevee']]),
  validated({
    id: 'curated-pokedex-018', template: 'evolution-particuliere', type: 'multiple-choice', category: 'Pokédex', difficulty: 3,
    prompt: 'Quel Pokémon peut apparaître en plus de Ninjask lorsque Ningale évolue, si l’équipe et le Sac le permettent ?',
    choices: ['Munja', 'Maskadra', 'Muciole', 'Arakdo'], acceptedAnswers: ['Munja'],
    explanation: 'Munja apparaît dans une place libre de l’équipe lorsque Ningale évolue, sous réserve de posséder aussi une Poké Ball dans les jeux concernés.',
    points: 15, durationSeconds: 25, generationScope: [3, 4, 5, 6, 7, 8, 9],
    difficultyReason: 'Méthode d’obtention unique avec plusieurs conditions.',
  }, [['Nincada', 'Nincada'], ['Shedinja', 'Shedinja']]),
  validated({
    id: 'curated-pokedex-019', template: 'comparaison-taille', type: 'multiple-choice', category: 'Pokédex', difficulty: 2,
    prompt: 'Lequel de ces Pokémon de Kanto est le plus grand selon sa taille officielle ?',
    choices: ['Onix', 'Léviator', 'Dracolosse', 'Ronflex'], acceptedAnswers: ['Onix'],
    explanation: 'Onix mesure officiellement 8,8 m, contre 6,5 m pour Léviator, 2,2 m pour Dracolosse et 2,1 m pour Ronflex.',
    points: 10, durationSeconds: 25, generationScope: 'all', difficultyReason: 'Comparaison de quatre mensurations plutôt qu’une valeur isolée.',
  }, [['Onix', 'Onix'], ['Gyarados', 'Gyarados'], ['Dragonite', 'Dragonite'], ['Snorlax', 'Snorlax']]),
  validated({
    id: 'curated-pokedex-020', template: 'comparaison-poids', type: 'multiple-choice', category: 'Pokédex', difficulty: 3,
    prompt: 'Lequel de ces Pokémon est le plus lourd selon son poids officiel ?',
    choices: ['Ronflex', 'Galeking', 'Wailord', 'Métalosse'], acceptedAnswers: ['Métalosse'],
    explanation: 'Métalosse pèse 550 kg, devant Ronflex (460 kg), Wailord (398 kg) et Galeking (360 kg).',
    points: 15, durationSeconds: 25, generationScope: 'all', difficultyReason: 'Comparaison de mensurations officielles.',
  }, [['Snorlax', 'Snorlax'], ['Aggron', 'Aggron'], ['Wailord', 'Wailord'], ['Metagross', 'Metagross']]),
]
