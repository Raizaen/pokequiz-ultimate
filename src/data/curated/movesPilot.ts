import type { Question } from '../../domain/quiz'

const moveNames: Record<number, string> = {
  14: 'Danse Lames', 53: 'Lance-Flammes', 57: 'Surf', 85: 'Tonnerre', 87: 'Fatal-Foudre',
  89: 'Séisme', 92: 'Toxik', 94: 'Psyko', 98: 'Vive-Attaque', 105: 'Soin',
  113: 'Mur Lumière', 115: 'Protection', 166: 'Gribouille', 182: 'Abri', 183: 'Mach Punch',
  197: 'Détection', 240: 'Danse Pluie', 241: 'Zénith', 245: 'Vitesse Extrême',
  247: 'Ball’Ombre', 252: 'Bluff', 261: 'Feu Follet', 264: 'Mitra-Poing',
  344: 'Électacle', 370: 'Close Combat', 464: 'Trou Noir',
}

function validated(question: Question, moveIds: number[]): Question {
  return {
    ...question,
    tags: ['capacité', 'pack-pilote'],
    validation: {
      status: 'validated',
      verifiedAt: '2026-07-25',
      sources: moveIds.map((id) => ({
        label: `PokéAPI — ${moveNames[id]}`,
        url: `https://pokeapi.co/api/v2/move/${id}`,
      })),
    },
  }
}

export const curatedMoveQuestions: Question[] = [
  validated({
    id: 'curated-move-001', template: 'puissance', type: 'multiple-choice', category: 'Capacités', difficulty: 1,
    prompt: 'Quelle est la puissance de base de Lance-Flammes ?', choices: ['80', '90', '100', '110'], acceptedAnswers: ['90'],
    explanation: 'Lance-Flammes possède une puissance de base de 90.', points: 10, durationSeconds: 20,
    generationScope: [6, 7, 8, 9], difficultyReason: 'Valeur actuelle d’une capacité offensive très courante.',
  }, [53]),
  validated({
    id: 'curated-move-002', template: 'precision', type: 'multiple-choice', category: 'Capacités', difficulty: 2,
    prompt: 'Quelle est la précision de base de Fatal-Foudre ?', choices: ['50 %', '70 %', '85 %', '100 %'], acceptedAnswers: ['70 %', '70'],
    explanation: 'Fatal-Foudre possède une précision de base de 70 %.', points: 10, durationSeconds: 20,
    generationScope: 'all', difficultyReason: 'Valeur connue, mais souvent confondue avec celle de Tonnerre.',
  }, [87]),
  validated({
    id: 'curated-move-003', template: 'pp', type: 'multiple-choice', category: 'Capacités', difficulty: 3,
    prompt: 'Combien de PP de base possède Gribouille ?', choices: ['1', '5', '10', '15'], acceptedAnswers: ['1'],
    explanation: 'Gribouille ne possède qu’un seul PP de base.', points: 15, durationSeconds: 20,
    generationScope: 'all', difficultyReason: 'Valeur atypique d’une capacité très particulière.',
  }, [166]),
  validated({
    id: 'curated-move-004', template: 'priorite', type: 'multiple-choice', category: 'Capacités', difficulty: 2,
    prompt: 'Quel est le niveau de priorité de Vitesse Extrême ?', choices: ['+1', '+2', '+3', '+4'], acceptedAnswers: ['+2', '2'],
    explanation: 'Vitesse Extrême possède une priorité de +2.', points: 10, durationSeconds: 20,
    generationScope: [5, 6, 7, 8, 9], difficultyReason: 'Interaction compétitive courante autour des capacités prioritaires.',
  }, [245]),
  validated({
    id: 'curated-move-005', template: 'priorite', type: 'multiple-choice', category: 'Capacités', difficulty: 3,
    prompt: 'Quel est le niveau de priorité d’Abri ?', choices: ['+1', '+2', '+3', '+4'], acceptedAnswers: ['+4', '4'],
    explanation: 'Abri possède une priorité de +4.', points: 15, durationSeconds: 20,
    generationScope: [5, 6, 7, 8, 9], difficultyReason: 'Priorité actuelle élevée moins intuitive qu’une attaque rapide.',
  }, [182]),
  validated({
    id: 'curated-move-006', template: 'priorite-negative', type: 'multiple-choice', category: 'Capacités', difficulty: 4,
    prompt: 'Quel est le niveau de priorité de Mitra-Poing ?', choices: ['−1', '−3', '−5', '0'], acceptedAnswers: ['−3', '-3'],
    explanation: 'Mitra-Poing possède une priorité de −3.', points: 20, durationSeconds: 25,
    generationScope: 'all', difficultyReason: 'Valeur négative précise d’une capacité à fonctionnement spécial.',
  }, [264]),
  validated({
    id: 'curated-move-007', template: 'classe-degats', type: 'multiple-choice', category: 'Capacités', difficulty: 1,
    prompt: 'À quelle catégorie de dégâts appartient Séisme ?', choices: ['Physique', 'Spéciale', 'Statut', 'Variable'], acceptedAnswers: ['Physique'],
    explanation: 'Séisme est une capacité physique de type Sol.', points: 10, durationSeconds: 20,
    generationScope: [4, 5, 6, 7, 8, 9], difficultyReason: 'Capacité physique emblématique.',
  }, [89]),
  validated({
    id: 'curated-move-008', template: 'classe-degats', type: 'multiple-choice', category: 'Capacités', difficulty: 2,
    prompt: 'À quelle catégorie de dégâts appartient Ball’Ombre ?', choices: ['Physique', 'Spéciale', 'Statut', 'Variable'], acceptedAnswers: ['Spéciale'],
    explanation: 'Depuis la séparation physique/spéciale par capacité, Ball’Ombre est spéciale.', points: 10, durationSeconds: 20,
    generationScope: [4, 5, 6, 7, 8, 9], difficultyReason: 'Demande de ne pas se fier à l’ancien classement du type Spectre.',
  }, [247]),
  validated({
    id: 'curated-move-009', template: 'classe-degats', type: 'multiple-choice', category: 'Capacités', difficulty: 1,
    prompt: 'À quelle catégorie appartient Toxik ?', choices: ['Physique', 'Spéciale', 'Statut', 'Variable'], acceptedAnswers: ['Statut'],
    explanation: 'Toxik est une capacité de statut : elle n’inflige pas directement de dégâts.', points: 10, durationSeconds: 20,
    generationScope: 'all', difficultyReason: 'Distinction élémentaire entre capacité offensive et de statut.',
  }, [92]),
  validated({
    id: 'curated-move-010', template: 'qcm-multiple-physique', type: 'multiple-select', category: 'Capacités', difficulty: 2,
    prompt: 'Sélectionnez toutes les capacités physiques.', choices: ['Séisme', 'Surf', 'Ball’Ombre', 'Close Combat'],
    correctChoices: ['Séisme', 'Close Combat'], acceptedAnswers: ['Séisme, Close Combat'],
    explanation: 'Séisme et Close Combat sont physiques ; Surf et Ball’Ombre sont spéciales.', points: 15, durationSeconds: 30,
    generationScope: [4, 5, 6, 7, 8, 9], difficultyReason: 'Compare quatre capacités de types différents.',
  }, [89, 57, 247, 370]),
  validated({
    id: 'curated-move-011', template: 'qcm-multiple-speciale', type: 'multiple-select', category: 'Capacités', difficulty: 2,
    prompt: 'Sélectionnez toutes les capacités spéciales.', choices: ['Lance-Flammes', 'Tonnerre', 'Mach Punch', 'Toxik'],
    correctChoices: ['Lance-Flammes', 'Tonnerre'], acceptedAnswers: ['Lance-Flammes, Tonnerre'],
    explanation: 'Lance-Flammes et Tonnerre sont spéciales ; Mach Punch est physique et Toxik est de statut.', points: 15, durationSeconds: 30,
    generationScope: [4, 5, 6, 7, 8, 9], difficultyReason: 'Compare les trois catégories de capacités.',
  }, [53, 85, 183, 92]),
  validated({
    id: 'curated-move-012', template: 'qcm-multiple-statut', type: 'multiple-select', category: 'Capacités', difficulty: 2,
    prompt: 'Sélectionnez toutes les capacités de statut.', choices: ['Danse Lames', 'Soin', 'Surf', 'Vive-Attaque'],
    correctChoices: ['Danse Lames', 'Soin'], acceptedAnswers: ['Danse Lames, Soin'],
    explanation: 'Danse Lames et Soin sont de statut ; Surf est spéciale et Vive-Attaque est physique.', points: 15, durationSeconds: 30,
    generationScope: [4, 5, 6, 7, 8, 9], difficultyReason: 'Nécessite d’identifier plusieurs capacités non offensives.',
  }, [14, 105, 57, 98]),
  validated({
    id: 'curated-move-013', template: 'qcm-multiple-priorite', type: 'multiple-select', category: 'Capacités', difficulty: 3,
    prompt: 'Sélectionnez toutes les capacités ayant une priorité strictement positive.', choices: ['Vive-Attaque', 'Vitesse Extrême', 'Bluff', 'Mitra-Poing'],
    correctChoices: ['Vive-Attaque', 'Vitesse Extrême', 'Bluff'], acceptedAnswers: ['Vive-Attaque, Vitesse Extrême, Bluff'],
    explanation: 'Ces trois capacités ont respectivement +1, +2 et +3. Mitra-Poing possède une priorité de −3.', points: 20, durationSeconds: 30,
    generationScope: [5, 6, 7, 8, 9], difficultyReason: 'Compare plusieurs niveaux de priorité actuels, dont une valeur négative.',
  }, [98, 245, 252, 264]),
  validated({
    id: 'curated-move-014', template: 'ecran', type: 'multiple-choice', category: 'Capacités', difficulty: 2,
    prompt: 'Quelle capacité réduit les dégâts des attaques spéciales reçues par l’équipe ?', choices: ['Abri', 'Mur Lumière', 'Protection', 'Soin'],
    acceptedAnswers: ['Mur Lumière'], explanation: 'Mur Lumière réduit les dégâts spéciaux reçus par le camp de l’utilisateur.', points: 10, durationSeconds: 20,
    generationScope: 'all', difficultyReason: 'Interaction défensive courante en combat.',
  }, [113, 115]),
  validated({
    id: 'curated-move-015', template: 'meteo', type: 'multiple-choice', category: 'Capacités', difficulty: 1,
    prompt: 'Quelle capacité déclenche la pluie ?', choices: ['Danse Pluie', 'Grêle', 'Tempête de Sable', 'Zénith'], acceptedAnswers: ['Danse Pluie'],
    explanation: 'Danse Pluie déclenche la pluie pour cinq tours dans les conditions normales.', points: 10, durationSeconds: 20,
    generationScope: 'all', difficultyReason: 'Effet directement indiqué par le nom de la capacité.',
  }, [240]),
  validated({
    id: 'curated-move-016', template: 'meteo', type: 'multiple-choice', category: 'Capacités', difficulty: 1,
    prompt: 'Quelle capacité déclenche le soleil intense ?', choices: ['Danse Pluie', 'Grêle', 'Tempête de Sable', 'Zénith'], acceptedAnswers: ['Zénith'],
    explanation: 'Zénith déclenche le soleil intense pour cinq tours dans les conditions normales.', points: 10, durationSeconds: 20,
    generationScope: 'all', difficultyReason: 'Effet météorologique très connu.',
  }, [241]),
  validated({
    id: 'curated-move-017', template: 'effet-secondaire', type: 'multiple-choice', category: 'Capacités', difficulty: 3,
    prompt: 'Quelle est la probabilité de base que Lance-Flammes brûle sa cible ?', choices: ['10 %', '20 %', '30 %', '100 %'], acceptedAnswers: ['10 %', '10'],
    explanation: 'Lance-Flammes a 10 % de chances de brûler sa cible.', points: 15, durationSeconds: 25,
    generationScope: 'all', difficultyReason: 'Valeur d’effet secondaire à connaître précisément.',
  }, [53]),
  validated({
    id: 'curated-move-018', template: 'comparaison-precision', type: 'multiple-choice', category: 'Capacités', difficulty: 2,
    prompt: 'Laquelle de ces capacités Électrik possède la meilleure précision de base ?', choices: ['Fatal-Foudre', 'Tonnerre', 'Les deux ont la même', 'Cela dépend du Pokémon'],
    acceptedAnswers: ['Tonnerre'], explanation: 'Tonnerre possède 100 % de précision contre 70 % pour Fatal-Foudre, hors effets modificateurs.', points: 10, durationSeconds: 20,
    generationScope: 'all', difficultyReason: 'Comparaison entre deux capacités souvent mises en balance.',
  }, [85, 87]),
  validated({
    id: 'curated-move-019', template: 'capacite-signature', type: 'multiple-choice', category: 'Capacités', difficulty: 3,
    prompt: 'À quelle famille de Pokémon la capacité Électacle est-elle historiquement associée ?', choices: ['Famille d’Évoli', 'Famille de Pikachu', 'Famille de Lixy', 'Famille de Togedemaru'],
    acceptedAnswers: ['Famille de Pikachu'], explanation: 'Électacle est la capacité signature historiquement associée à la famille de Pikachu.', points: 15, durationSeconds: 25,
    generationScope: 'all', difficultyReason: 'Connaissance des capacités signatures et de la reproduction.',
  }, [344]),
  validated({
    id: 'curated-move-020', template: 'capacite-signature', type: 'multiple-choice', category: 'Capacités', difficulty: 4,
    prompt: 'À quel Pokémon la capacité Trou Noir est-elle associée ?', choices: ['Darkrai', 'Hoopa', 'Lunala', 'Spiritomb'], acceptedAnswers: ['Darkrai'],
    explanation: 'Trou Noir est la capacité signature de Darkrai.', points: 20, durationSeconds: 25,
    generationScope: 'all', difficultyReason: 'Connaissance spécialisée d’une capacité de Pokémon fabuleux.',
  }, [464]),
]
