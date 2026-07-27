import type { Question } from '../domain/quiz'

const formNames: Record<string, string> = {
  Normal: 'Normale',
  '10': '10 %',
  '50': '50 %',
  Plant: 'Cape Plante',
  Sandy: 'Cape Sable',
  Trash: 'Cape Déchet',
  'Red Striped': 'Motif Rouge',
  'Blue Striped': 'Motif Bleu',
  'Blanc Striped': 'Motif Blanc',
  Male: 'Mâle',
  Female: 'Femelle',
  Average: 'Normale',
  Aria: 'Forme Chant',
  Pirouette: 'Forme Danse',
  Heat: 'Chaleur',
  Wash: 'Lavage',
  Frost: 'Froid',
  Fan: 'Hélice',
  Mow: 'Tonte',
  Sunny: 'Solaire',
  Rainy: 'Eau de Pluie',
  Snowy: 'Blizzard',
  Eternal: 'Fleur Éternelle',
  Original: 'Couleur du Passé',
  Unbound: 'Déchaîné',
  'Battle Bond': 'Synergie',
  Ash: 'Sacha',
  'Power Construct': 'Rassemblement',
  '10 Power Construct': '10 % — Rassemblement',
  '50 Power Construct': '50 % — Rassemblement',
  Baile: 'Style Flamenco',
  'Pom Pom': 'Style Pom-Pom',
  Pau: 'Style Hula',
  Sensu: 'Style Buyō',
  Disguised: 'Déguisée',
  Busted: 'Démasquée',
  'Totem Disguised': 'Dominante Déguisée',
  'Totem Busted': 'Dominante Démasquée',
  Totem: 'Dominant',
  'Totem d’Alola': "Dominant d’Alola",
  Amped: 'Forme Aigüe',
  'Low Key': 'Forme Grave',
  'Amped Gigamax': 'Forme Aigüe Gigamax',
  'Low Key Gigamax': 'Forme Grave Gigamax',
  Ice: 'Tête de Gel',
  Noice: 'Tête Dégel',
  'Full Belly': 'Mode Rassasié',
  Hangry: 'Mode Affamé',
  'Single Strike': 'Style Poing Final',
  'Rapid Strike': 'Style Mille Poings',
  'Single Strike Gigamax': 'Style Poing Final Gigamax',
  'Rapid Strike Gigamax': 'Style Mille Poings Gigamax',
  'Family Of Four': 'Famille de Quatre',
  'Family Of Three': 'Famille de Trois',
  Zero: 'Forme Ordinaire',
  Curly: 'Forme Courbée',
  Droopy: 'Forme Affalée',
  Stretchy: 'Forme Raide',
  'Two Segment': 'Forme Double',
  'Three Segment': 'Forme Triple',
  'Green Plumage': 'Plumage Vert',
  'Blue Plumage': 'Plumage Bleu',
  'Yellow Plumage': 'Plumage Jaune',
  'Blanc Plumage': 'Plumage Blanc',
  Roaming: 'Forme Marche',
  Bloodmoon: 'Lune Vermeille',
  'Wellspring Mask': 'Masque du Puits',
  'Hearthflame Mask': 'Masque du Fourneau',
  'Cornerstone Mask': 'Masque de la Pierre',
  Terastal: 'Forme Téracristal',
  Stellar: 'Forme Stellaire',
  Gulping: 'Forme Gobe-Tout',
  Gorging: 'Forme Gobe-Chu',
  'Red Meteor': 'Météore Rouge',
  'Orange Meteor': 'Météore Orange',
  'Yellow Meteor': 'Météore Jaune',
  'Green Meteor': 'Météore Vert',
  'Blue Meteor': 'Météore Bleu',
  'Indigo Meteor': 'Météore Indigo',
  'Violet Meteor': 'Météore Violet',
  Red: 'Noyau Rouge',
  Orange: 'Noyau Orange',
  Yellow: 'Noyau Jaune',
  Green: 'Noyau Vert',
  Blue: 'Noyau Bleu',
  Indigo: 'Noyau Indigo',
  Violet: 'Noyau Violet',
  'Original Cap': 'Casquette Originale',
  'Hoenn Cap': 'Casquette de Hoenn',
  'Sinnoh Cap': 'Casquette de Sinnoh',
  'Unova Cap': 'Casquette d’Unys',
  'Kalos Cap': 'Casquette de Kalos',
  'd’Alola Cap': 'Casquette d’Alola',
  'Partner Cap': 'Casquette Partenaire',
  'World Cap': 'Casquette Monde',
  'Rock Star': 'Rockeur',
  'Pop Star': 'Star',
  Phd: 'Docteur',
  'Own Tempo': 'Tempo Perso',
  Dawn: 'Ailes de l’Aurore',
  'de Paldea Combat Breed': 'de Paldea — Race Combative',
  'de Paldea Blaze Breed': 'de Paldea — Race Flamboyante',
  'de Paldea Aqua Breed': 'de Paldea — Race Aquatique',
  'de Galar Normal': 'de Galar — Mode Normal',
  'de Galar Transe': 'de Galar — Mode Transe',
  Eternamax: 'Infinimax',
  Shadow: 'Cavalier d’Effroi',
}

export function localizePokemonFormName(name: string): string {
  let localized = name
    .replace('Sylveroy (Ice)', 'Sylveroy (Cavalier du Froid)')
    .replace('Sylveroy (Shadow)', 'Sylveroy (Cavalier d’Effroi)')
    .replace(/^Male Méga (.+)$/, 'Méga-$1 (Mâle)')
    .replace(/^Female Méga (.+)$/, 'Méga-$1 (Femelle)')
    .replace(/^Original Méga (.+)$/, 'Méga-$1 (Couleur du Passé)')
    .replace(/^(Curly|Droopy|Stretchy) Méga (.+)$/, (_, form: string, pokemon: string) =>
      `Méga-${pokemon} (${formNames[form]})`)
    .replace(/^Méga ([XYZ]) (.+)$/, 'Méga-$2 $1')
    .replace(/^Méga (?!-)(.+)$/, 'Méga-$1')

  localized = localized.replace(/\(([^)]+)\)/g, (match, form: string) =>
    `(${formNames[form] ?? form})`)

  return localized
}

export function localizePokemonNamesInQuestion(question: Question): Question {
  if (question.category !== 'Sprites') return question

  const replacements = new Map<string, string>()
  const localize = (name: string) => {
    const localized = localizePokemonFormName(name)
    replacements.set(name, localized)
    return localized
  }
  const choices = question.choices?.map(localize)
  const acceptedAnswers = question.acceptedAnswers.map(localize)
  const correctChoices = question.correctChoices?.map(localize)
  const choiceMedia = question.choiceMedia
    ? Object.fromEntries(Object.entries(question.choiceMedia).map(([name, media]) => [localize(name), media]))
    : undefined
  const explanation = [...replacements].reduce(
    (text, [source, localized]) => text.replaceAll(source, localized),
    question.explanation,
  )

  return { ...question, choices, acceptedAnswers, correctChoices, choiceMedia, explanation }
}
