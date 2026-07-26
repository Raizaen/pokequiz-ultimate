import { mapAssetFor } from '../data/mapAssets'
import type { GameState } from '../domain/quiz'
import { buildLostPlaceStats } from '../engine/lostPlaceStats'
import { MapPin } from './MapPin'

interface Props {
  game: GameState
}

const formatDistance = (distance: number | null) => distance === null ? '—' : distance.toFixed(1)

export function LostPlaceSummary({ game }: Props) {
  const stats = buildLostPlaceStats(game)
  const attempts = stats.flatMap(({ attempts, player }) =>
    attempts.map((attempt) => ({ ...attempt, player })),
  )
  if (attempts.length === 0) return null

  const ranked = [...stats].sort((left, right) =>
    right.totalPoints - left.totalPoints
    || (left.averageDistance ?? Infinity) - (right.averageDistance ?? Infinity),
  )
  const regions = [...new Set(attempts.map(({ question }) => question.mapRegion ?? 'Paldea'))]

  return (
    <section className="lost-place-summary">
      <header>
        <span className="eyebrow">RÉCAPITULATIF CARTOGRAPHIQUE</span>
        <h2>Les explorateurs de la manche</h2>
        <p>Le classement départage les égalités avec la distance moyenne.</p>
      </header>

      <div className="map-ranking">
        {ranked.map((entry, index) => {
          const rank = ranked.findIndex((candidate) =>
            candidate.totalPoints === entry.totalPoints
            && candidate.averageDistance === entry.averageDistance,
          ) + 1
          const best = entry.attempts.reduce((current, attempt) =>
            !current || attempt.distance < current.distance ? attempt : current, entry.attempts[0])
          const worst = entry.attempts.reduce((current, attempt) =>
            !current || attempt.distance > current.distance ? attempt : current, entry.attempts[0])

          return (
            <article className={rank === 1 ? 'map-ranking-winner' : ''} key={entry.player.id}>
              <div className="map-rank-head">
                <b>#{rank}</b>
                <span style={{ background: entry.player.color }}>{entry.player.avatar}</span>
                <strong>{entry.player.name}</strong>
                <em>{entry.totalPoints} pts</em>
              </div>
              <dl>
                <div><dt>Distance moyenne</dt><dd>{formatDistance(entry.averageDistance)}</dd></div>
                <div><dt>Dans le mille</dt><dd>{entry.bullseyes}</dd></div>
                <div><dt>Meilleur clic</dt><dd>{best ? `${best.question.acceptedAnswers[0]} · ${formatDistance(best.distance)}` : '—'}</dd></div>
                <div><dt>Clic le plus éloigné</dt><dd>{worst ? `${worst.question.acceptedAnswers[0]} · ${formatDistance(worst.distance)}` : '—'}</dd></div>
              </dl>
              <small>{entry.clickCount} réponse{entry.clickCount > 1 ? 's' : ''} cartographique{entry.clickCount > 1 ? 's' : ''}</small>
              {index === 0 && <i>Meilleur explorateur</i>}
            </article>
          )
        })}
      </div>

      <div className="summary-maps">
        {regions.map((region) => {
          const asset = mapAssetFor(region)
          const regionAttempts = attempts.filter(({ question }) => question.mapRegion === region)
          const targets = [...new Map(regionAttempts.map(({ question }) => [question.id, question])).values()]

          return (
            <article key={region}>
              <h3>Carte de {region}</h3>
              <div className="summary-map-frame">
                <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ aspectRatio: asset.aspectRatio }} aria-label={`Récapitulatif des réponses sur la carte de ${region}`}>
                  <image href={asset.src} x="0" y="0" width="100" height="100" preserveAspectRatio="none" />
                  {targets.map((question) => question.mapTarget && (
                    <g key={question.id} className="summary-target">
                      <circle cx={question.mapTarget.x} cy={question.mapTarget.y} r="1.2" fill="#62d68b" stroke="#fff" strokeWidth=".3" />
                    </g>
                  ))}
                  {regionAttempts.map(({ player, point, question }) => (
                    <MapPin key={`${question.id}-${player.id}`} {...point} color={player.color} />
                  ))}
                </svg>
              </div>
              <div className="summary-map-legend">
                <span><i className="correct-location" /> Bonnes positions</span>
                {stats.map(({ player }) => <span key={player.id}><i style={{ background: player.color }} /> {player.name}</span>)}
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
