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
  const highestStats = pokemon.stats.filter(({ base_stat }) => base_stat === maximum).map(({ stat }) => frenchStats[stat.name])
  const flavor = species.flavor_text_entries.find(({ language }) => language.name === 'fr')?.flavor_text
  return {
    id,
    name,
    primaryType: frenchTypes[pokemon.types.sort((a, b) => a.slot - b.slot)[0].type.name],
    highestStats,
    highestValue: maximum,
    generation: generationNumber(species.generation.name),
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
    power: move.power,
    accuracy: move.accuracy,
    pp: move.pp,
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

const pokemonList = await fetchJson(`${API}/pokemon?limit=2000`)
const baseIds = Array.from({ length: 250 }, (_, index) => Math.round(1 + index * (1024 / 249)))
const baseResources = baseIds.map((id) => ({ url: `${API}/pokemon/${id}` }))
const specialPattern = /mega|gmax|alola|galar|hisui|paldea|primal|origin|therian|sky|black|white|crowned|dusk|midnight|school|zen/
const formResources = pokemonList.results
  .filter(({ name, url }) => idFromUrl(url) > 1025 && specialPattern.test(name))
  .slice(0, 180)
const formEntries = (await mapLimit(formResources, 12, spriteEntry)).filter(Boolean).slice(0, 100)
const baseEntries = (await mapLimit(baseResources, 12, spriteEntry)).filter(Boolean)
const spriteCatalog = [...baseEntries, ...formEntries].slice(0, 350)

if (spriteCatalog.length < 350) throw new Error(`Only ${spriteCatalog.length} sprites generated`)

await Promise.all([
  writeFile(new URL('pokemonFacts.json', OUTPUT), `${JSON.stringify(pokemonFacts, null, 2)}\n`),
  writeFile(new URL('moveFacts.json', OUTPUT), `${JSON.stringify(moveFacts, null, 2)}\n`),
  writeFile(new URL('spriteCatalog.json', OUTPUT), `${JSON.stringify(spriteCatalog, null, 2)}\n`),
])

console.log(`Generated ${pokemonFacts.length} Pokémon facts, ${moveFacts.length} move facts and ${spriteCatalog.length} sprites.`)
