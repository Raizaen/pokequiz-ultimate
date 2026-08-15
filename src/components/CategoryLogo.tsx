import type { ReactNode } from 'react'

interface LogoStyle {
  top?: string
  main: string
  bottom?: string
  accent: string
  secondary: string
  motif: ReactNode
}

const motifStyle = { fill: 'none', stroke: 'currentColor', strokeWidth: 5, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }

const styles: Record<string, LogoStyle> = {
  Labo: { top: 'LE', main: 'LABO', bottom: 'DES ÉVOLUTIONS', accent: '#4fd7ff', secondary: '#ff5d6c', motif: <><path d="M38 89c22-15 22-42 0-57m48 57c-22-15-22-42 0-57M43 42h38M43 61h38M43 80h38" {...motifStyle} /></> },
  Sprites: { top: 'PIXEL', main: 'SPRITES', bottom: 'MYSTÈRES', accent: '#a783ff', secondary: '#48ddff', motif: <><path d="M42 38h13v13H42zm26 0h13v13H68zM55 51h13v13H55zM42 64h13v13H42zm26 0h13v13H68z" fill="currentColor" /></> },
  'Fouille dans les Mines': { top: 'FOUILLE DANS', main: 'LES MINES', bottom: 'TRÉSOR ENFOUI', accent: '#e8a84f', secondary: '#61d8e8', motif: <><path d="m34 79 45-45m-15-5 20 20M29 84l12-2-10-10-2 12Zm47-5-31-31m17-14L42 54" {...motifStyle} /><circle cx="86" cy="81" r="8" fill="currentColor" /></> },
  Cris: { top: 'À QUI EST', main: 'CE CRI ?', accent: '#ff6d74', secondary: '#ffd84d', motif: <><path d="M42 70h-9V51h9l18-14v47L42 70zm27-21c8 7 8 17 0 24m10-34c15 14 15 30 0 44" {...motifStyle} /></> },
  Musique: { top: 'LA', main: 'MIXTAPE', bottom: 'POKÉQUIZ', accent: '#ff77d9', secondary: '#58dfff', motif: <><path d="M48 75V35l37-8v39M48 75c0 8-16 11-19 3-3-9 12-14 19-8m37-4c0 8-16 11-19 3-3-9 12-14 19-8" {...motifStyle} /></> },
  'Pokédex': { top: 'FICHES DU', main: 'POKÉDEX', accent: '#ff5d66', secondary: '#5de2ff', motif: <><rect x="31" y="29" width="58" height="56" rx="8" {...motifStyle} /><circle cx="48" cy="47" r="8" {...motifStyle} /><path d="M65 43h14M65 55h14M42 70h37" {...motifStyle} /></> },
  'Capacités': { top: 'MAÎTRE DES', main: 'CAPACITÉS', accent: '#ff7b3e', secondary: '#ffd94b', motif: <><path d="m61 26-11 26H30l18 13-8 27 21-18 22 18-8-27 18-13H72L61 26Z" fill="currentColor" /></> },
  Objets: { top: 'LE SAC À', main: 'OBJETS', accent: '#ffb84c', secondary: '#f05d8d', motif: <><path d="M39 45h44l-4 42H43l-4-42Zm11 0v-8c0-13 22-13 22 0v8" {...motifStyle} /><path d="M55 57h13v16H55z" fill="currentColor" /></> },
  'Stratégie': { top: 'PLAN DE', main: 'BATAILLE', accent: '#8f75ff', secondary: '#ffcf4a', motif: <><path d="M38 84h49M47 79c1-18 8-29 22-37l-8-14c20 3 29 19 24 35-3 10-10 13-13 16H47Z" {...motifStyle} /></> },
  'Stats en Ordre': { top: 'STATS', main: 'EN ORDRE', bottom: '1  ·  2  ·  3', accent: '#ffd447', secondary: '#ff744f', motif: <><path d="M35 82V65h12v17m8 0V49h12v33m8 0V31h12v51" {...motifStyle} /></> },
  'Lieu Perdu': { top: "L'ÉPREUVE DU", main: 'LIEU PERDU', accent: '#4de5b0', secondary: '#ffd34d', motif: <><path d="m31 38 20-9 20 9 20-9v53l-20 9-20-9-20 9V38Zm20-9v53m20-44v53" {...motifStyle} /><path d="M70 49c0 10-11 20-11 20S48 59 48 49a11 11 0 1 1 22 0Z" fill="currentColor" /></> },
  Lore: { top: 'CHRONIQUES', main: 'LÉGENDAIRES', accent: '#e8bf75', secondary: '#8d75ff', motif: <><path d="M29 37c16-8 26-4 32 4 6-8 16-12 32-4v45c-15-7-25-4-32 5-7-9-17-12-32-5V37Zm32 4v46" {...motifStyle} /><path d="m61 25 3 8 8 3-8 3-3 8-3-8-8-3 8-3 3-8Z" fill="currentColor" /></> },
  'Spin-off': { top: 'MONDES', main: 'SPIN-OFF', accent: '#54e1c1', secondary: '#a27cff', motif: <><path d="M37 57c3-17 44-17 48 0l6 23c2 10-10 15-16 7l-8-10H55l-8 10c-6 8-18 3-16-7l6-23Z" {...motifStyle} /><path d="M46 56v14m-7-7h14m19-5h.1m9 8h.1" {...motifStyle} /></> },
  Pokopia: { top: 'BIENVENUE À', main: 'POKOPIA', accent: '#77dc6c', secondary: '#ffcf55', motif: <><path d="m30 57 31-26 31 26v31H30V57Zm20 31V67h22v21" {...motifStyle} /><path d="M78 38c2-12 12-15 19-14-1 9-7 17-19 14Z" fill="currentColor" /></> },
  'Jeux principaux': { top: "SUR LA ROUTE", main: 'AVENTURE', accent: '#ff704f', secondary: '#55d9ff', motif: <><path d="M28 85c18-26 25-30 36-52 8 15 15 20 28 52H28Z" {...motifStyle} /><path d="M60 85c-5-16 8-22 2-35m9-12h20l-8 8 8 8H71V38Z" {...motifStyle} /></> },
  Anime: { top: 'LE GRAND', main: 'ANIME', bottom: 'CHALLENGE', accent: '#65dfff', secondary: '#ff5f78', motif: <><rect x="28" y="32" width="66" height="49" rx="8" {...motifStyle} /><path d="m54 45 24 12-24 12V45Zm-12 45h38" {...motifStyle} /></> },
}

export function CategoryLogo({ category }: { category: string }) {
  const style = styles[category] ?? styles.Labo
  const gradientId = `category-logo-${category.replace(/\W/g, '')}`

  return (
    <svg className="category-logo" viewBox="0 0 240 128" aria-hidden="true">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor={style.accent} />
          <stop offset="1" stopColor={style.secondary} />
        </linearGradient>
      </defs>
      <path className="category-logo-flare" d="M25 98 7 85l23-7-9-22 27 8 6-28 25 17 18-29 18 29 26-17 6 28 27-8-9 22 23 7-18 13Z" fill={`url(#${gradientId})`} />
      <g className="category-logo-motif" style={{ color: style.accent }}>{style.motif}</g>
      <g className="category-logo-copy">
        {style.top && <text x="120" y="38" className="category-logo-top">{style.top}</text>}
        <text x="120" y={style.top ? 70 : 61} className="category-logo-main" stroke={`url(#${gradientId})`}>{style.main}</text>
        {style.bottom && <text x="120" y="91" className="category-logo-bottom" fill={style.secondary}>{style.bottom}</text>}
      </g>
    </svg>
  )
}
