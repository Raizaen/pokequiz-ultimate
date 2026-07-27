import { useMemo, useState } from 'react'
import type { SyntheticEvent } from 'react'
import { championsStatCatalog, type ChampionsPokemonStat } from '../data/championsStatCatalog'
import { preferImageCdn } from '../utils/imageSources'

interface Props {
  statLabel: string
  orderDirection: 'ascending' | 'descending'
  value: string
  onChange: (value: string) => void
}

type FormFilter = 'all' | ChampionsPokemonStat['kind']

const namesFromValue = (value: string) => value
  .split('\n')
  .map((line) => line.split('|')[0]?.trim())
  .filter(Boolean)

const formLabels: Record<FormFilter, string> = {
  all: 'Toutes les formes',
  standard: 'Pokémon standards',
  regional: 'Formes régionales',
  mega: 'Méga-Évolutions',
  'other-form': 'Autres formes',
}

export function PokemonStatPicker({ statLabel, orderDirection, value, onChange }: Props) {
  const [query, setQuery] = useState('')
  const [generation, setGeneration] = useState('all')
  const [formFilter, setFormFilter] = useState<FormFilter>('all')
  const selectedNames = namesFromValue(value)
  const selectedPokemon = selectedNames
    .map((name) => championsStatCatalog.find((candidate) => candidate.name === name))
    .filter((pokemon): pokemon is ChampionsPokemonStat => Boolean(pokemon))
  const sortedSelection = [...selectedPokemon].sort((left, right) => {
    const difference = left.stats[statLabel] - right.stats[statLabel]
    return orderDirection === 'ascending' ? difference : -difference
  })
  const selectedValues = new Set(selectedPokemon.map((pokemon) => pokemon.stats[statLabel]))
  const hasDuplicateValue = selectedValues.size !== selectedPokemon.length

  const visible = useMemo(() => championsStatCatalog.filter((pokemon) =>
    pokemon.stats[statLabel] !== undefined
    && pokemon.name.toLocaleLowerCase('fr').includes(query.toLocaleLowerCase('fr'))
    && (generation === 'all' || pokemon.generation === Number(generation))
    && (formFilter === 'all' || pokemon.kind === formFilter),
  ), [formFilter, generation, query, statLabel])

  const serialize = (pokemon: ChampionsPokemonStat[]) => pokemon
    .map((entry) => `${entry.name} | ${entry.stats[statLabel]} | ${entry.image}`)
    .join('\n')

  const toggle = (pokemon: ChampionsPokemonStat) => {
    const nextSelection = selectedNames.includes(pokemon.name)
      ? selectedPokemon.filter((item) => item.name !== pokemon.name)
      : selectedPokemon.length < 5 ? [...selectedPokemon, pokemon] : selectedPokemon

    onChange(serialize(nextSelection))
  }

  const handleImageError = (event: SyntheticEvent<HTMLImageElement>, pokemon: ChampionsPokemonStat) => {
    event.currentTarget.onerror = null
    event.currentTarget.src = preferImageCdn(`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.nationalId}.png`)
  }

  return (
    <section className="pokemon-stat-picker">
      <header>
        <div>
          <strong>Catalogue Pokémon Champions</strong>
          <small>{selectedNames.length} / 5 sélectionnés · {visible.length} résultats</small>
        </div>
        <input type="search" placeholder="Rechercher…" value={query} onChange={(event) => setQuery(event.target.value)} />
      </header>

      <div className="pokemon-stat-filters">
        <select aria-label="Filtrer par génération" value={generation} onChange={(event) => setGeneration(event.target.value)}>
          <option value="all">Toutes les générations</option>
          {Array.from({ length: 9 }, (_, index) => <option value={index + 1} key={index + 1}>Génération {index + 1}</option>)}
        </select>
        <select aria-label="Filtrer par forme" value={formFilter} onChange={(event) => setFormFilter(event.target.value as FormFilter)}>
          {Object.entries(formLabels).map(([key, label]) => <option value={key} key={key}>{label}</option>)}
        </select>
      </div>

      {selectedPokemon.length > 0 && (
        <div className="pokemon-stat-selection">
          <small>Aperçu automatique · {orderDirection === 'ascending' ? 'du plus faible au plus élevé' : 'du plus élevé au plus faible'}</small>
          <div>
            {sortedSelection.map((pokemon, index) => (
              <button type="button" key={pokemon.name} onClick={() => toggle(pokemon)} title="Retirer ce Pokémon">
                <span>{index + 1}</span>
                <img src={pokemon.image} alt="" onError={(event) => handleImageError(event, pokemon)} />
                <strong>{pokemon.name}</strong>
                <b>{pokemon.stats[statLabel]}</b>
              </button>
            ))}
          </div>
          {hasDuplicateValue && <p>Deux Pokémon ont la même valeur : remplace-en un pour garantir un classement sans ambiguïté.</p>}
        </div>
      )}

      <div className="pokemon-stat-results">
        {visible.map((pokemon) => {
          const selected = selectedNames.includes(pokemon.name)
          const sameValueAlreadySelected = !selected && selectedValues.has(pokemon.stats[statLabel])
          const selectionFull = !selected && selectedNames.length >= 5
          const disabled = sameValueAlreadySelected || selectionFull
          return (
            <button
              type="button"
              className={selected ? 'selected' : ''}
              disabled={disabled}
              title={sameValueAlreadySelected ? `${statLabel} ${pokemon.stats[statLabel]} est déjà sélectionnée` : undefined}
              key={pokemon.name}
              onClick={() => toggle(pokemon)}
            >
              <img loading="lazy" src={pokemon.image} alt="" onError={(event) => handleImageError(event, pokemon)} />
              <strong>{pokemon.name}</strong>
              <small>{statLabel} {pokemon.stats[statLabel]}</small>
              {selected && <i>{sortedSelection.findIndex((entry) => entry.name === pokemon.name) + 1}</i>}
            </button>
          )
        })}
      </div>
    </section>
  )
}
