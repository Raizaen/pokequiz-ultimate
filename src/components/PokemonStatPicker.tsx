import { useMemo, useState } from 'react'
import { championsStatCatalog } from '../data/championsStatCatalog'

interface Props {
  statLabel: string
  value: string
  onChange: (value: string) => void
}

const namesFromValue = (value: string) => value
  .split('\n')
  .map((line) => line.split('|')[0]?.trim())
  .filter(Boolean)

export function PokemonStatPicker({ statLabel, value, onChange }: Props) {
  const [query, setQuery] = useState('')
  const selectedNames = namesFromValue(value)
  const visible = useMemo(() => championsStatCatalog.filter((pokemon) =>
    pokemon.stats[statLabel] !== undefined
    && pokemon.name.toLocaleLowerCase('fr').includes(query.toLocaleLowerCase('fr')),
  ), [query, statLabel])

  const toggle = (name: string) => {
    const nextNames = selectedNames.includes(name)
      ? selectedNames.filter((item) => item !== name)
      : selectedNames.length < 5 ? [...selectedNames, name] : selectedNames

    onChange(nextNames.map((selectedName) => {
      const pokemon = championsStatCatalog.find((candidate) => candidate.name === selectedName)!
      return `${pokemon.name} | ${pokemon.stats[statLabel]} | ${pokemon.image}`
    }).join('\n'))
  }

  return (
    <section className="pokemon-stat-picker">
      <header>
        <div><strong>Catalogue Pokémon Champions</strong><small>{selectedNames.length} / 5 sélectionnés</small></div>
        <input type="search" placeholder="Rechercher…" value={query} onChange={(event) => setQuery(event.target.value)} />
      </header>
      <div>
        {visible.map((pokemon) => {
          const selected = selectedNames.includes(pokemon.name)
          return (
            <button type="button" className={selected ? 'selected' : ''} key={pokemon.name} onClick={() => toggle(pokemon.name)}>
              <img src={pokemon.image} alt="" />
              <strong>{pokemon.name}</strong>
              <small>{statLabel} {pokemon.stats[statLabel]}</small>
              {selected && <i>{selectedNames.indexOf(pokemon.name) + 1}</i>}
            </button>
          )
        })}
      </div>
    </section>
  )
}
