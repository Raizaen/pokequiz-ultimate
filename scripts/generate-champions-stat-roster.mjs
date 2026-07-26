import { readFile, writeFile } from 'node:fs/promises'

const rosterApi = 'https://bulbapedia.bulbagarden.net/w/api.php?action=parse&page=List_of_Pok%C3%A9mon_in_Pok%C3%A9mon_Champions&prop=wikitext&format=json'
const showdownPokedex = 'https://raw.githubusercontent.com/smogon/pokemon-showdown/master/data/pokedex.ts'
const output = new URL('../src/data/generated/championsStatRoster.json', import.meta.url)
const spriteCatalogFile = new URL('../src/data/generated/spriteCatalog.json', import.meta.url)

const toId = (value) => value
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '')

const formTranslations = new Map([
  ['Alolan Form', "Forme d'Alola"],
  ['Galarian Form', 'Forme de Galar'],
  ['Hisuian Form', 'Forme de Hisui'],
  ['Paldean Form<br>(Combat Breed)', 'Forme de Paldea (Race Combative)'],
  ['Paldean Form<br>(Blaze Breed)', 'Forme de Paldea (Race Flamboyante)'],
  ['Paldean Form<br>(Aqua Breed)', 'Forme de Paldea (Race Aquatique)'],
  ['Male', 'Mâle'],
  ['Female', 'Femelle'],
  ['Shield Forme', 'Forme Parade'],
  ['Blade Forme', 'Forme Assaut'],
  ['Small Variety', 'Taille Mini'],
  ['Medium Variety', 'Taille Normale'],
  ['Large Variety', 'Taille Maxi'],
  ['Jumbo Variety', 'Taille Ultra'],
  ['Midday Form', 'Forme Diurne'],
  ['Midnight Form', 'Forme Nocturne'],
  ['Dusk Form', 'Forme Crépusculaire'],
  ['Full Belly Mode', 'Mode Rassasié'],
  ['Hangry Mode', 'Mode Affamé'],
  ['Zero Form', 'Forme Ordinaire'],
  ['Hero Form', 'Forme Héroïque'],
])

const unavailableShowdownSprites = new Set([
  'raichumegax',
  'raichumegay',
  'staraptormega',
  'meowsticmega',
  'scolipedemega',
  'scraftymega',
  'eelektrossmega',
  'pyroarmega',
  'malamarmega',
  'barbaraclemega',
  'dragalgemega',
  'falinksmega',
])

const imageOverrides = new Map([
  ['taurospaldeacombat', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10250.png'],
  ['taurospaldeablaze', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10251.png'],
  ['taurospaldeaaqua', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10252.png'],
  ['vivillon', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/666.png'],
])

const generationFromNationalId = (id) => {
  if (id <= 151) return 1
  if (id <= 251) return 2
  if (id <= 386) return 3
  if (id <= 493) return 4
  if (id <= 649) return 5
  if (id <= 721) return 6
  if (id <= 809) return 7
  if (id <= 905) return 8
  return 9
}

function parseParameters(line) {
  const body = line.slice('{{gdex/Champs|'.length, -2)
  const parts = body.split('|')
  const positional = []
  const named = {}

  for (const part of parts) {
    const separator = part.indexOf('=')
    if (separator === -1) positional.push(part)
    else named[part.slice(0, separator)] = part.slice(separator + 1)
  }

  return { positional, named }
}

function parseShowdown(source) {
  const entries = new Map()
  const matcher = /^\t("?[\w-]+"?): \{\r?\n([\s\S]*?)^\t\},/gm
  let match

  while ((match = matcher.exec(source))) {
    const key = match[1].replaceAll('"', '')
    const block = match[2]
    const name = block.match(/^\t\tname: ["'](.+?)["'],/m)?.[1]
    const stats = block.match(/^\t\tbaseStats: \{ hp: (\d+), atk: (\d+), def: (\d+), spa: (\d+), spd: (\d+), spe: (\d+) \},/m)
    if (!name || !stats) continue
    entries.set(key, {
      name,
      stats: {
        hp: Number(stats[1]),
        attack: Number(stats[2]),
        defense: Number(stats[3]),
        specialAttack: Number(stats[4]),
        specialDefense: Number(stats[5]),
        speed: Number(stats[6]),
      },
    })
  }

  return entries
}

function showdownCandidates(name, suffix) {
  const normalizedSuffix = suffix.replace(/^-/, '')
  if (name === 'Vivillon' && normalizedSuffix === 'High Plains') return ['vivillon']
  const aliases = [
    `${name}${normalizedSuffix}`,
    `${name}${normalizedSuffix.replace('Paldea ', 'Paldea-')}`,
  ]
  return aliases.map(toId)
}

const [rosterResponse, showdownResponse, spriteCatalog] = await Promise.all([
  fetch(rosterApi),
  fetch(showdownPokedex),
  readFile(spriteCatalogFile, 'utf8').then(JSON.parse),
])

if (!rosterResponse.ok || !showdownResponse.ok) {
  throw new Error(`Téléchargement impossible (${rosterResponse.status}/${showdownResponse.status}).`)
}

const rosterPayload = await rosterResponse.json()
const wikiLines = rosterPayload.parse.wikitext['*'].split('\n')
const showdown = parseShowdown(await showdownResponse.text())
showdown.set('meowsticmega', {
  name: 'Mega Meowstic',
  stats: { hp: 74, attack: 48, defense: 76, specialAttack: 143, specialDefense: 101, speed: 124 },
})
const frenchNames = new Map(spriteCatalog
  .filter(({ id }) => id <= 1025)
  .map(({ id, name }) => [id, name]))
const firstRosterLine = wikiLines.findIndex((line) => line.startsWith('{{gdex/Champs|'))
const otherFormsHeading = wikiLines.findIndex((line) => line === '====Other forms====')
const relevantLines = wikiLines
  .slice(firstRosterLine, otherFormsHeading)
  .filter((line) => line.startsWith('{{gdex/Champs|'))

const missing = []
const roster = relevantLines.flatMap((line) => {
  const { positional, named } = parseParameters(line)
  const nationalId = Number(positional[0])
  const englishName = positional[1]
  const suffix = named.ig ?? ''
  const candidates = showdownCandidates(englishName, suffix)
  const showdownKey = candidates.find((candidate) => showdown.has(candidate))
  const data = showdown.get(showdownKey)

  if (!data) {
    missing.push({ nationalId, englishName, suffix, candidates })
    return []
  }

  const baseFrenchName = frenchNames.get(nationalId) ?? englishName
  const rawForm = named.form
  const isMega = rawForm?.startsWith('Mega ')
  const isRegional = /Alolan|Galarian|Hisuian|Paldean/.test(rawForm ?? '')
  const spriteSuffix = suffix.replace(/^-/, '').toLowerCase().replaceAll(' ', '-')
  const spriteSlug = `${toId(englishName)}${suffix
    ? `-${spriteSuffix.replace(/^mega-([xy])$/, 'mega$1')}`
    : ''}`
  const fallbackImage = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${nationalId}.png`
  const formName = isMega
    ? rawForm.replace(/^Mega \S+/, '').trim()
    : formTranslations.get(rawForm)
  const name = isMega
    ? `Méga-${baseFrenchName}${formName ? ` ${formName}` : ''}`
    : formName ? `${baseFrenchName} — ${formName}` : baseFrenchName

  return [{
    key: showdownKey,
    nationalId,
    name,
    image: imageOverrides.get(showdownKey)
      ?? (unavailableShowdownSprites.has(showdownKey)
        ? fallbackImage
        : `https://play.pokemonshowdown.com/sprites/gen5/${spriteSlug}.png`),
    generation: generationFromNationalId(nationalId),
    kind: isMega ? 'mega' : isRegional ? 'regional' : rawForm ? 'other-form' : 'standard',
    stats: data.stats,
    sourceForm: rawForm ?? null,
  }]
})

if (missing.length) {
  console.error(JSON.stringify(missing, null, 2))
  throw new Error(`${missing.length} forme(s) du roster n'ont pas été trouvées dans les données de statistiques.`)
}

const uniqueRoster = [...new Map(roster.map((pokemon) => [pokemon.key, pokemon])).values()]
  .sort((left, right) => left.nationalId - right.nationalId || left.name.localeCompare(right.name, 'fr'))
  .map((pokemon, index) => ({ id: index + 1, ...pokemon }))

await writeFile(output, `${JSON.stringify(uniqueRoster, null, 2)}\n`, 'utf8')
console.log(`${uniqueRoster.length} Pokémon et formes de combat écrits dans ${output.pathname}.`)
