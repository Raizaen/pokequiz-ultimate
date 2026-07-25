import type { Question } from '../../domain/quiz'

const source = (page: string, label: string) => ({
  label: `Bulbapedia — ${label}`,
  url: `https://bulbapedia.bulbagarden.net/wiki/${page}`,
})

function validated(question: Question, pages: Array<[string, string]>): Question {
  return {
    ...question,
    tags: ['anime', 'pack-pilote', 'sacha'],
    validation: {
      status: 'validated',
      verifiedAt: '2026-07-25',
      sources: pages.map(([page, label]) => source(page, label)),
    },
  }
}

export const curatedAnimeQuestions: Question[] = [
  validated({
    id: 'curated-anime-001', template: 'premier-pokemon', type: 'multiple-choice', category: 'Anime', difficulty: 1,
    prompt: 'Quel Pokémon le Professeur Chen confie-t-il à Sacha au début de la série ?',
    choices: ['Pikachu', 'Bulbizarre', 'Salamèche', 'Carapuce'], acceptedAnswers: ['Pikachu'],
    explanation: 'Arrivé en retard, Sacha reçoit Pikachu alors que les trois Pokémon de départ habituels ont déjà été choisis.',
    points: 10, durationSeconds: 20, generationScope: 'all', difficultyReason: 'Événement fondateur de la série animée.',
  }, [['Pokémon_-_I_Choose_You!', 'Pokémon - I Choose You!']]),
  validated({
    id: 'curated-anime-002', template: 'premiere-capture', type: 'multiple-choice', category: 'Anime', difficulty: 1,
    prompt: 'Quelle est la première espèce de Pokémon capturée par Sacha ?',
    choices: ['Chenipan', 'Roucool', 'Bulbizarre', 'Krabby'], acceptedAnswers: ['Chenipan'],
    explanation: 'Chenipan est le premier Pokémon que Sacha capture lui-même, avant d’évoluer rapidement en Chrysacier puis Papilusion.',
    points: 10, durationSeconds: 20, generationScope: 'all', difficultyReason: 'Première capture historique de Sacha.',
  }, [['Ash%27s_Butterfree', "Ash's Butterfree"]]),
  validated({
    id: 'curated-anime-003', template: 'premier-relache', type: 'multiple-choice', category: 'Anime', difficulty: 2,
    prompt: 'Quel est le premier Pokémon que Sacha laisse partir pour vivre avec ses semblables ?',
    choices: ['Papilusion', 'Lokhlass', 'Roucarnage', 'Colossinge'], acceptedAnswers: ['Papilusion'],
    explanation: 'Sacha laisse Papilusion rejoindre un Papilusion rose lors de la saison originale.',
    points: 10, durationSeconds: 20, generationScope: 'all', difficultyReason: 'Moment marquant des premiers épisodes.',
  }, [['Ash%27s_Butterfree', "Ash's Butterfree"]]),
  validated({
    id: 'curated-anime-004', template: 'motif-compagnon', type: 'multiple-choice', category: 'Anime', difficulty: 1,
    prompt: 'Pourquoi Ondine commence-t-elle initialement à suivre Sacha ?',
    choices: ['Pour obtenir le remboursement de son vélo', 'Pour défier la Ligue Indigo', 'Pour retrouver Togepi', 'Pour étudier Pikachu'],
    acceptedAnswers: ['Pour obtenir le remboursement de son vélo'],
    explanation: 'Le vélo d’Ondine est détruit après avoir été emprunté par Sacha ; elle le suit d’abord pour qu’il le remplace.',
    points: 10, durationSeconds: 20, generationScope: 'all', difficultyReason: 'Gag récurrent et origine de leur voyage commun.',
  }, [['Misty_(anime)', 'Misty']]),
  validated({
    id: 'curated-anime-005', template: 'compagnon-fonction', type: 'multiple-choice', category: 'Anime', difficulty: 1,
    prompt: 'De quelle Arène Pierre est-il le Champion lorsqu’il rencontre Sacha ?',
    choices: ['Argenta', 'Azuria', 'Carmin sur Mer', 'Céladopole'], acceptedAnswers: ['Argenta'],
    explanation: 'Pierre dirige l’Arène d’Argenta avant de confier ses responsabilités familiales et de voyager avec Sacha.',
    points: 10, durationSeconds: 20, generationScope: 'all', difficultyReason: 'Présentation originale d’un compagnon majeur.',
  }, [['Brock_(anime)', 'Brock']]),
  validated({
    id: 'curated-anime-006', template: 'compagnon-arc', type: 'multiple-choice', category: 'Anime', difficulty: 2,
    prompt: 'Quel observateur Pokémon voyage avec Sacha et Ondine dans les Îles Orange ?',
    choices: ['Jacky', 'Pierre', 'Régis', 'Todd'], acceptedAnswers: ['Jacky'],
    explanation: 'Jacky rejoint le groupe dans les Îles Orange, tandis que Pierre reste temporairement auprès du Professeur Flora.',
    points: 10, durationSeconds: 20, generationScope: 'all', difficultyReason: 'Composition particulière du groupe durant un arc précis.',
  }, [['Tracey_Sketchit', 'Tracey Sketchit']]),
  validated({
    id: 'curated-anime-007', template: 'objectif-compagnon', type: 'multiple-choice', category: 'Anime', difficulty: 1,
    prompt: 'Quelle discipline Flora choisit-elle comme objectif principal à Hoenn ?',
    choices: ['Les Concours Pokémon', 'Les combats d’Arène', 'L’élevage', 'La photographie'], acceptedAnswers: ['Les Concours Pokémon'],
    explanation: 'Flora devient Coordinatrice Pokémon et participe aux Concours de Hoenn puis de Kanto.',
    points: 10, durationSeconds: 20, generationScope: 'all', difficultyReason: 'Objectif central du personnage durant la série Advanced.',
  }, [['May_(anime)', 'May']]),
  validated({
    id: 'curated-anime-008', template: 'objectif-compagnon', type: 'multiple-choice', category: 'Anime', difficulty: 1,
    prompt: 'Quel titre Aurore cherche-t-elle à obtenir dans la région de Sinnoh ?',
    choices: ['Top Coordinatrice', 'Maître Pokémon', 'Maître Dragon', 'Reine de Kalos'], acceptedAnswers: ['Top Coordinatrice'],
    explanation: 'Aurore participe aux Concours Pokémon avec l’objectif de devenir Top Coordinatrice.',
    points: 10, durationSeconds: 20, generationScope: 'all', difficultyReason: 'Objectif explicitement répété pendant l’arc Sinnoh.',
  }, [['Dawn_(anime)', 'Dawn']]),
  validated({
    id: 'curated-anime-009', template: 'objectif-compagnon', type: 'multiple-choice', category: 'Anime', difficulty: 1,
    prompt: 'Quel est l’objectif d’Iris lorsqu’elle voyage avec Sacha à Unys ?',
    choices: ['Devenir Maître Dragon', 'Devenir Top Coordinatrice', 'Devenir Professeure Pokémon', 'Gagner la Ligue Orange'],
    acceptedAnswers: ['Devenir Maître Dragon'],
    explanation: 'Iris voyage pour approfondir son lien avec les Pokémon Dragon et devenir Maître Dragon.',
    points: 10, durationSeconds: 20, generationScope: 'all', difficultyReason: 'Motivation principale d’une compagne d’Unys.',
  }, [['Iris_(anime)', 'Iris']]),
  validated({
    id: 'curated-anime-010', template: 'roles-compagnon', type: 'multiple-select', category: 'Anime', difficulty: 2,
    prompt: 'Quels rôles Rachid occupe-t-il lorsqu’il rejoint Sacha ?',
    choices: ['Champion d’Arène', 'Connaisseur Pokémon', 'Maître de la Ligue', 'Coordinateur de Sinnoh'],
    correctChoices: ['Champion d’Arène', 'Connaisseur Pokémon'], acceptedAnswers: ['Champion d’Arène, Connaisseur Pokémon'],
    explanation: 'Rachid est l’un des Champions d’Ogoesse et un Connaisseur Pokémon de rang A.',
    points: 15, durationSeconds: 30, generationScope: 'all', difficultyReason: 'Sélection simultanée des deux fonctions du personnage.',
  }, [['Cilan_(anime)', 'Cilan']]),
  validated({
    id: 'curated-anime-011', template: 'objectif-kalos', type: 'multiple-choice', category: 'Anime', difficulty: 2,
    prompt: 'Quel titre Serena cherche-t-elle à obtenir en participant aux Salons Pokémon ?',
    choices: ['Reine de Kalos', 'Top Coordinatrice', 'Maître de Kalos', 'Étoile d’Illumis'], acceptedAnswers: ['Reine de Kalos'],
    explanation: 'Serena devient Artiste Pokémon et vise le titre de Reine de Kalos.',
    points: 10, durationSeconds: 20, generationScope: 'all', difficultyReason: 'Objectif propre au format des Salons Pokémon de Kalos.',
  }, [['Serena_(anime)', 'Serena']]),
  validated({
    id: 'curated-anime-012', template: 'compagnon-champion', type: 'multiple-choice', category: 'Anime', difficulty: 1,
    prompt: 'De quelle Arène Lem est-il le Champion ?',
    choices: ['Illumis', 'Neuvartault', 'Yantreizh', 'Romant-sous-Bois'], acceptedAnswers: ['Illumis'],
    explanation: 'Lem est le Champion de l’Arène d’Illumis, spécialisé dans le type Électrik.',
    points: 10, durationSeconds: 20, generationScope: 'all', difficultyReason: 'Fonction essentielle du compagnon de Kalos.',
  }, [['Clemont_(anime)', 'Clemont']]),
  validated({
    id: 'curated-anime-013', template: 'premiere-ligue-gagnee', type: 'multiple-choice', category: 'Anime', difficulty: 2,
    prompt: 'Quelle est la première compétition de type Ligue remportée par Sacha dans la série originale ?',
    choices: ['Ligue Orange', 'Ligue Indigo', 'Conférence Argentée', 'Conférence d’Hoenn'], acceptedAnswers: ['Ligue Orange'],
    explanation: 'Sacha vainc Didier et devient Champion de la Ligue Orange, bien avant son titre à Alola.',
    points: 10, durationSeconds: 20, generationScope: 'all', difficultyReason: 'Distingue une Ligue atypique des conférences régionales classiques.',
  }, [['Orange_League', 'Orange League']]),
  validated({
    id: 'curated-anime-014', template: 'classement-ligue', type: 'multiple-choice', category: 'Anime', difficulty: 2,
    prompt: 'À quel stade Sacha termine-t-il la Conférence du Plateau Indigo ?',
    choices: ['Top 16', 'Top 8', 'Finale', 'Vainqueur'], acceptedAnswers: ['Top 16'],
    explanation: 'Sacha est éliminé par Richie et termine parmi les seize meilleurs de la Conférence Indigo.',
    points: 10, durationSeconds: 20, generationScope: 'all', difficultyReason: 'Premier résultat de Sacha dans une conférence de Ligue.',
  }, [['Indigo_Plateau_Conference', 'Indigo Plateau Conference']]),
  validated({
    id: 'curated-anime-015', template: 'classement-ligue', type: 'multiple-choice', category: 'Anime', difficulty: 3,
    prompt: 'À quel stade Sacha est-il éliminé par Tobias lors de la Ligue de Sinnoh ?',
    choices: ['Demi-finale', 'Quart de finale', 'Finale', 'Premier tour'], acceptedAnswers: ['Demi-finale'],
    explanation: 'Après avoir vaincu Paul en quart de finale, Sacha perd contre Tobias en demi-finale et termine dans le Top 4.',
    points: 15, durationSeconds: 20, generationScope: 'all', difficultyReason: 'Résultat précis d’une Ligue très appréciée des fans.',
  }, [['Lily_of_the_Valley_Conference', 'Lily of the Valley Conference']]),
  validated({
    id: 'curated-anime-016', template: 'adversaire-finale', type: 'multiple-choice', category: 'Anime', difficulty: 2,
    prompt: 'Qui bat Sacha en finale de la Ligue de Kalos ?',
    choices: ['Alain', 'Tierno', 'Lem', 'Dianthéa'], acceptedAnswers: ['Alain'],
    explanation: 'Alain remporte la Conférence d’Illumis après avoir battu Sacha en finale.',
    points: 10, durationSeconds: 20, generationScope: 'all', difficultyReason: 'Adversaire du meilleur résultat de Sacha avant Alola.',
  }, [['Lumiose_Conference', 'Lumiose Conference']]),
  validated({
    id: 'curated-anime-017', template: 'premier-titre-regional', type: 'multiple-choice', category: 'Anime', difficulty: 1,
    prompt: 'Dans quelle région Sacha devient-il pour la première fois vainqueur d’une Conférence de Ligue régionale ?',
    choices: ['Alola', 'Kalos', 'Sinnoh', 'Unys'], acceptedAnswers: ['Alola'],
    explanation: 'Sacha remporte la première Ligue d’Alola en battant Gladio lors de la Conférence de Manalo.',
    points: 10, durationSeconds: 20, generationScope: 'all', difficultyReason: 'Aboutissement majeur de la série Soleil et Lune.',
  }, [['Manalo_Conference', 'Manalo Conference']]),
  validated({
    id: 'curated-anime-018', template: 'finale-mondiale', type: 'multiple-choice', category: 'Anime', difficulty: 1,
    prompt: 'Quel Maître Sacha affronte-t-il en finale du Tournoi des Huit Maîtres ?',
    choices: ['Tarak', 'Peter', 'Cynthia', 'Pierre Rochard'], acceptedAnswers: ['Tarak'],
    explanation: 'Sacha bat Tarak en finale du Tournoi des Huit Maîtres et devient le nouveau Monarque.',
    points: 10, durationSeconds: 20, generationScope: 'all', difficultyReason: 'Combat culminant de Pokémon, les voyages.',
  }, [['Masters_Eight_Tournament', 'Masters Eight Tournament']]),
  validated({
    id: 'curated-anime-019', template: 'transformation-anime', type: 'multiple-choice', category: 'Anime', difficulty: 2,
    prompt: 'Quel Pokémon de Sacha adopte une forme particulière grâce au phénomène de Synergie à Kalos ?',
    choices: ['Amphinobi', 'Brutalibré', 'Muplodocus', 'Flambusard'], acceptedAnswers: ['Amphinobi'],
    explanation: 'La Synergie entre Sacha et Amphinobi déclenche la forme connue comme Sachanobi.',
    points: 10, durationSeconds: 20, generationScope: 'all', difficultyReason: 'Transformation propre à l’arc XY et à leur lien.',
  }, [['Ash%27s_Greninja', "Ash's Greninja"]]),
  validated({
    id: 'curated-anime-020', template: 'equipe-voyages', type: 'multiple-select', category: 'Anime', difficulty: 3,
    prompt: 'Sélectionnez tous les Pokémon appartenant à l’équipe de Sacha durant le Tournoi des Huit Maîtres.',
    choices: ['Dracolosse', 'Ectoplasma', 'Lucario', 'Amphinobi'], correctChoices: ['Dracolosse', 'Ectoplasma', 'Lucario'],
    acceptedAnswers: ['Dracolosse, Ectoplasma, Lucario'],
    explanation: 'L’équipe de cette série comprend Pikachu, Dracolosse, Ectoplasma, Lucario, Palarticho et Hydragon ; Amphinobi n’en fait pas partie.',
    points: 20, durationSeconds: 30, generationScope: 'all', difficultyReason: 'Distingue l’équipe active de Pokémon issus d’anciens voyages.',
  }, [['Ash_Ketchum', 'Ash Ketchum']]),
]
