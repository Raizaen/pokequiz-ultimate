import { mkdir, writeFile } from 'node:fs/promises'

const API = 'https://pokeapi.co/api/v2'
const OUTPUT = new URL('../src/data/generated/', import.meta.url)
const frenchTypes = {
  normal: 'Normal', fire: 'Feu', water: 'Eau', electric: 'Électrik', grass: 'Plante',
  ice: 'Glace', fighting: 'Combat', poison: 'Poison', ground: 'Sol', flying: 'Vol',
  psychic: 'Psy', bug: 'Insecte', rock: 'Roche', ghost: 'Spectre', dragon: 'Dragon',
  dark: 'Ténèbres', steel: 'Acier', fairy: 'Fée',
}
const frenchStats = {
  hp: 'PV', attack: 'Attaque', defense: 'Défense', 'special-attack': 'Attaque Spéciale',
  'special-defense': 'Défense Spéciale', speed: 'Vitesse',
}
const frenchDamageClasses = { physical: 'Physique', special: 'Spéciale', status: 'Statut' }
const frenchColors = {
  black: 'Noir', blue: 'Bleu', brown: 'Brun', gray: 'Gris', green: 'Vert',
  pink: 'Rose', purple: 'Violet', red: 'Rouge', white: 'Blanc', yellow: 'Jaune',
}
const formWords = {
  mega: 'Méga', gmax: 'Gigamax', alola: "d’Alola", galar: 'de Galar', hisui: 'de Hisui',
  paldea: 'de Paldea', origin: 'Originelle', altered: 'Alternative', attack: 'Attaque',
  defense: 'Défense', speed: 'Vitesse', primal: 'Primo', therian: 'Totémique',
  incarnate: 'Avatar', sky: 'Céleste', land: 'Terrestre', black: 'Noir', white: 'Blanc',
  resolute: 'Décidé', ordinary: 'Ordinaire', crowned: 'Suprême', hero: 'Héros',
  school: 'Banc', solo: 'Solo', dusk: 'Crépusculaire', midnight: 'Nocturne',
  midday: 'Diurne', complete: 'Parfaite', blade: 'Assaut', shield: 'Parade',
  small: 'Mini', large: 'Maxi', super: 'Ultra', zen: 'Transe', standard: 'Normal',
}

const fetchJson = async (url) => {
  const response = await fetch(url)
  if (!response.ok) throw new Error(`${response.status} ${url}`)
  return response.json()
}
const resourceCache = new Map()
const fetchCached = (url) => {
  if (!resourceCache.has(url)) resourceCache.set(url, fetchJson(url))
  return resourceCache.get(url)
}

async function mapLimit(values, limit, mapper) {
  const results = new Array(values.length)
  let cursor = 0
  async function worker() {
    while (cursor < values.length) {
      const index = cursor++
      results[index] = await mapper(values[index], index)
    }
  }
  await Promise.all(Array.from({ length: limit }, worker))
  return results
}

const localName = (names, fallback) => names.find(({ language }) => language.name === 'fr')?.name ?? fallback
const cleanText = (value) => value.replace(/[\n\f\r]+/g, ' ').replace(/\s+/g, ' ').trim()
const idFromUrl = (url) => Number(url.match(/\/(\d+)\/?$/)?.[1])
const generationNumber = (generationName) => ({
  i: 1, ii: 2, iii: 3, iv: 4, v: 5, vi: 6, vii: 7, viii: 8, ix: 9,
}[generationName.replace('generation-', '')] ?? 1)

async function pokemonFact(id) {
  const pokemon = await fetchJson(`${API}/pokemon/${id}`)
  const species = await fetchJson(pokemon.species.url)
  const name = localName(species.names, pokemon.name)
  const maximum = Math.max(...pokemon.stats.map(({ base_stat }) => base_stat))
  const minimum = Math.min(...pokemon.stats.map(({ base_stat }) => base_stat))
  const highestStats = pokemon.stats.filter(({ base_stat }) => base_stat === maximum).map(({ stat }) => frenchStats[stat.name])
  const lowestStats = pokemon.stats.filter(({ base_stat }) => base_stat === minimum).map(({ stat }) => frenchStats[stat.name])
  const flavor = species.flavor_text_entries.find(({ language }) => language.name === 'fr')?.flavor_text
  const primaryAbilityData = await fetchCached(pokemon.abilities.find(({ is_hidden }) => !is_hidden)?.ability.url ?? pokemon.abilities[0].ability.url)
  return {
    id,
    name,
    primaryType: frenchTypes[pokemon.types.sort((a, b) => a.slot - b.slot)[0].type.name],
    types: pokemon.types.sort((a, b) => a.slot - b.slot).map(({ type }) => frenchTypes[type.name]),
    highestStats,
    highestValue: maximum,
    lowestStats,
    lowestValue: minimum,
    statsTotal: pokemon.stats.reduce((sum, { base_stat }) => sum + base_stat, 0),
    speed: pokemon.stats.find(({ stat }) => stat.name === 'speed').base_stat,
    height: pokemon.height / 10,
    weight: pokemon.weight / 10,
    baseExperience: pokemon.base_experience,
    primaryAbility: localName(primaryAbilityData.names, primaryAbilityData.name),
    generation: generationNumber(species.generation.name),
    genus: species.genera.find(({ language }) => language.name === 'fr')?.genus ?? 'Pokémon inconnu',
    color: frenchColors[species.color.name],
    captureRate: species.capture_rate,
    isLegendary: species.is_legendary,
    isMythical: species.is_mythical,
    flavor: cleanText(flavor ?? `Ce Pokémon porte le numéro ${id} dans le Pokédex national.`)
      .replace(new RegExp(name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'giu'), 'Ce Pokémon'),
  }
}

async function moveFact(id) {
  const move = await fetchJson(`${API}/move/${id}`)
  return {
    id,
    name: localName(move.names, move.name),
    type: frenchTypes[move.type.name],
    damageClass: frenchDamageClasses[move.damage_class.name],
    power: move.power,
    accuracy: move.accuracy,
    pp: move.pp,
    priority: move.priority,
  }
}

async function itemFact(id) {
  const item = await fetchJson(`${API}/item/${id}`)
  const category = await fetchCached(item.category.url)
  const pocket = await fetchCached(category.pocket.url)
  return {
    id,
    name: localName(item.names, item.name),
    cost: item.cost,
    flingPower: item.fling_power,
    category: localName(category.names, category.name),
    pocket: localName(pocket.names, pocket.name),
  }
}

function formLabel(baseName, speciesSlug, pokemonName) {
  const suffix = pokemonName.replace(new RegExp(`^${speciesSlug}-?`), '').split('-').filter(Boolean)
  if (!suffix.length) return baseName
  const translated = suffix.map((word) => formWords[word] ?? word[0].toUpperCase() + word.slice(1)).join(' ')
  return pokemonName.includes('-mega') ? `${translated} ${baseName}` : `${baseName} (${translated})`
}

async function spriteEntry(resource, index) {
  const pokemon = await fetchJson(resource.url)
  if (!pokemon.sprites.front_default) return null
  const species = await fetchJson(pokemon.species.url)
  const baseName = localName(species.names, pokemon.species.name)
  return {
    id: pokemon.id,
    name: formLabel(baseName, pokemon.species.name, pokemon.name),
    sprite: pokemon.sprites.front_default,
    difficulty: index % 5 + 1,
  }
}

await mkdir(OUTPUT, { recursive: true })

const factIds = Array.from({ length: 50 }, (_, index) => Math.round(1 + index * (1024 / 49)))
const pokemonFacts = await mapLimit(factIds, 12, pokemonFact)
const moveIds = Array.from({ length: 50 }, (_, index) => index + 1)
const moveFacts = await mapLimit(moveIds, 12, moveFact)
const itemIds = Array.from({ length: 50 }, (_, index) => index + 1)
const itemFacts = await mapLimit(itemIds, 12, itemFact)

const pokemonList = await fetchJson(`${API}/pokemon?limit=100000`)
const spriteCatalog = (await mapLimit(pokemonList.results, 16, spriteEntry))
  .filter(Boolean)
  .sort((left, right) => left.id - right.id)

if (spriteCatalog.length < 1025) {
  throw new Error(`Only ${spriteCatalog.length} sprites generated`)
}

await Promise.all([
  writeFile(new URL('pokemonFacts.json', OUTPUT), `${JSON.stringify(pokemonFacts, null, 2)}\n`),
  writeFile(new URL('moveFacts.json', OUTPUT), `${JSON.stringify(moveFacts, null, 2)}\n`),
  writeFile(new URL('itemFacts.json', OUTPUT), `${JSON.stringify(itemFacts, null, 2)}\n`),
  writeFile(new URL('spriteCatalog.json', OUTPUT), `${JSON.stringify(spriteCatalog, null, 2)}\n`),
])

console.log(`Generated ${pokemonFacts.length} Pokémon facts, ${moveFacts.length} moves, ${itemFacts.length} items and ${spriteCatalog.length} sprites.`)
