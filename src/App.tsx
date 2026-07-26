import { useEffect, useState } from 'react'
import { Logo } from './components/Logo'
import { PlayerPanel } from './components/PlayerPanel'
import { LostPlaceRound } from './components/LostPlaceRound'
import { LostPlaceSummary } from './components/LostPlaceSummary'
import { GameStats } from './components/GameStats'
import { SpriteImage } from './components/SpriteImage'
import { questions } from './data/questions'
import {
  categories,
  difficultyPresets,
  type DifficultyPreset,
  type GameConfig,
  type RegionFilter,
  type SpriteGenerationFilter,
  type SpriteVariant,
  type TimerSetting,
} from './domain/gameConfig'
import type { GameState, Player } from './domain/quiz'
import {
  availablePoints,
  createGame,
  nextQuestion,
  progressiveRevealStage,
  revealAnswer,
  submitAnswer,
  tick,
} from './engine/quizEngine'
import { questionsForConfig, selectQuestions } from './engine/questionSelection'
import { rankPlayers } from './engine/ranking'
import {
  clearSavedGame,
  loadGame,
  loadQuestionHistory,
  rememberQuestions,
  saveGame,
} from './storage/gameStorage'

type Screen = 'menu' | 'setup' | 'game'
const avatars = ['⚡', '🔥', '💧', '🌿', '🌙', '⭐', '🐉', '🌀']
const colors = ['#f2c94c', '#ff5b5b', '#4aa8ff', '#62d68b', '#a777e3', '#ff8f4c', '#35d0ba', '#ef6bad']
const preferredQuestionCounts = [5, 10, 15, 20, 30, 50, 75, 100]
const mapRegions: Array<{ id: RegionFilter; label: string; icon: string; description: string }> = [
  { id: 'all', label: 'Toutes les régions', icon: '🌍', description: 'Paldea et Sinnoh mélangées' },
  { id: 'Paldea', label: 'Paldea', icon: '☀️', description: '50 lieux disponibles' },
  { id: 'Sinnoh', label: 'Sinnoh', icon: '🏔️', description: '30 lieux disponibles' },
]
const timerSettings: Array<{ value: TimerSetting; label: string; description: string }> = [
  { value: 10, label: '10 secondes', description: 'Réflexes éclair' },
  { value: 15, label: '15 secondes', description: 'Partie rapide' },
  { value: 20, label: '20 secondes', description: 'Équilibré' },
  { value: 30, label: '30 secondes', description: 'Temps de réflexion' },
  { value: null, label: 'Sans timer', description: 'Aucune limite de temps' },
]
const spriteGenerations = Array.from({ length: 9 }, (_, index) => index + 1)
const spriteVariantOptions: Array<{ id: SpriteVariant; label: string; icon: string; description: string }> = [
  { id: 'normal', label: 'Normal', icon: '👾', description: 'Sprite classique' },
  { id: 'silhouette', label: 'Silhouette', icon: '❓', description: 'Entièrement noir' },
  { id: 'progressive', label: 'Révélation', icon: '✨', description: 'De plus en plus net' },
  { id: 'shiny', label: 'Chromatique', icon: '🌟', description: 'Couleurs shiny' },
  { id: 'zoom', label: 'Fragment', icon: '🔍', description: 'Vue fortement zoomée' },
  { id: 'flipped', label: 'Retourné', icon: '↔️', description: 'Sprite inversé' },
]

function newPlayer(index: number): Player {
  return { id: crypto.randomUUID(), name: `Joueur ${index + 1}`, avatar: avatars[index], color: colors[index], score: 0 }
}

export function App() {
  const [screen, setScreen] = useState<Screen>('menu')
  const [players, setPlayers] = useState<Player[]>([newPlayer(0)])
  const [game, setGame] = useState<GameState | null>(null)
  const [config, setConfig] = useState<GameConfig>({
    mode: 'mixed',
    difficulty: 'all',
    spriteGenerations: 'all',
    spriteVariants: 'all',
    timerSeconds: 20,
  })
  const [questionCount, setQuestionCount] = useState(10)
  const savedGame = loadGame()
  const gameQuestions = game?.questions
  const gameQuestionIndex = game?.questionIndex
  const gameFinished = game?.finished
  const eligibleQuestions = questionsForConfig(questions, config)
  const hasRegionSelection = config.mode === 'category' && config.category === 'Lieu Perdu'
  const hasSpriteGenerationSelection = config.mode === 'category' && config.category === 'Sprites'
  const hasPokopiaSelection = config.mode === 'category' && config.category === 'Pokopia'
  const categoryOptionSteps = hasSpriteGenerationSelection ? 2 : hasRegionSelection || hasPokopiaSelection ? 1 : 0
  const difficultyStep = config.mode === 'category' ? 3 + categoryOptionSteps : 2
  const timerStep = difficultyStep + 1
  const questionCountStep = timerStep + 1
  const effectiveQuestionCount = Math.min(questionCount, eligibleQuestions.length)
  const availableQuestionCounts = [...new Set([
    ...preferredQuestionCounts.filter((count) => count <= eligibleQuestions.length),
    effectiveQuestionCount,
    eligibleQuestions.length,
  ])].filter((count) => count > 0).sort((left, right) => left - right)

  useEffect(() => {
    if (game) saveGame(game)
  }, [game])

  useEffect(() => {
    if (!game || game.finished || game.revealed) return
    const question = game.questions[game.questionIndex]
    if (game.remainingSeconds === null && question.media?.spriteVariant !== 'progressive') return
    const timer = window.setInterval(() => setGame((current) => current ? tick(current) : current), 1000)
    return () => window.clearInterval(timer)
  }, [game])

  useEffect(() => {
    if (!gameQuestions || gameFinished || gameQuestionIndex === undefined) return
    gameQuestions
      .slice(gameQuestionIndex, gameQuestionIndex + 3)
      .forEach((question) => {
        const sources = [
          ...(question.media?.src ? [question.media.src] : []),
          ...Object.values(question.choiceMedia ?? {}),
        ]
        sources.forEach((src) => {
          const image = new Image()
          image.src = src
        })
      })
  }, [gameFinished, gameQuestionIndex, gameQuestions])

  const startGame = () => {
    const history = new Set(loadQuestionHistory())
    const fresh = questions.filter(({ id }) => !history.has(id))
    const freshSelection = selectQuestions(fresh, config, effectiveQuestionCount)
    const selectedIds = new Set(freshSelection.map(({ id }) => id))
    const fallback = freshSelection.length < effectiveQuestionCount
      ? selectQuestions(
        questions.filter(({ id }) => !selectedIds.has(id)),
        config,
        effectiveQuestionCount - freshSelection.length,
      )
      : []
    const selection = [...freshSelection, ...fallback]
    rememberQuestions(selection.map(({ id }) => id))
    setGame(createGame(players, selection, config.timerSeconds))
    setScreen('game')
  }

  const toggleSpriteGeneration = (generation: number) => {
    const current = config.spriteGenerations
    if (!current || current === 'all') {
      setConfig({ ...config, spriteGenerations: [generation] })
      return
    }

    const next = current.includes(generation)
      ? current.filter((item) => item !== generation)
      : [...current, generation].sort((left, right) => left - right)

    if (next.length > 0) setConfig({ ...config, spriteGenerations: next as SpriteGenerationFilter })
  }

  const toggleSpriteVariant = (variant: SpriteVariant) => {
    const current = config.spriteVariants
    if (!current || current === 'all') {
      setConfig({ ...config, spriteVariants: [variant] })
      return
    }

    const next = current.includes(variant)
      ? current.filter((item) => item !== variant)
      : [...current, variant]

    if (next.length > 0) setConfig({ ...config, spriteVariants: next })
  }

  if (screen === 'menu') {
    return (
      <main className="app-shell hero">
        <Logo />
        <section className="hero-card">
          <span className="eyebrow">V3 · ALPHA</span>
          <h1>Le quiz qui rassemble<br />tous les Dresseurs.</h1>
          <p>Crée ton équipe, teste tes connaissances et décroche la première place.</p>
          <div className="menu-actions">
            <button className="primary" onClick={() => setScreen('setup')}>Nouvelle partie <span>→</span></button>
            <button disabled={!savedGame} onClick={() => { if (savedGame) { setGame(savedGame); setScreen('game') } }}>Continuer</button>
          </div>
          <div className="feature-strip"><span>👥 1–8 joueurs</span><span>⚡ QCM & questions ouvertes</span><span>💾 Sauvegarde automatique</span></div>
        </section>
        <div className="orb orb-one" /><div className="orb orb-two" />
      </main>
    )
  }

  if (screen === 'setup') {
    return (
      <main className="app-shell">
        <nav><button className="ghost" onClick={() => setScreen('menu')}>← Retour</button><Logo /></nav>
        <section className="setup-card">
          <div><span className="eyebrow">PRÉPARATION</span><h1>Qui entre dans l’arène ?</h1><p>De 1 à 8 joueurs, chacun avec sa couleur et son emblème.</p></div>
          <div className="player-list">
            {players.map((player, index) => (
              <div className="player-row" key={player.id}>
                <span className="avatar large" style={{ background: player.color }}>{player.avatar}</span>
                <input value={player.name} maxLength={18} aria-label={`Nom du joueur ${index + 1}`} onChange={(event) => setPlayers(players.map((item) => item.id === player.id ? { ...item, name: event.target.value } : item))} />
                {players.length > 1 && <button className="remove" aria-label={`Retirer ${player.name}`} onClick={() => setPlayers(players.filter((item) => item.id !== player.id))}>×</button>}
              </div>
            ))}
          </div>
          <section className="setup-section">
            <div className="section-heading"><span>1</span><div><h2>Mode de jeu</h2><p>Change la façon dont les questions sont sélectionnées.</p></div></div>
            <div className="mode-grid">
              <button className={config.mode === 'mixed' ? 'selected' : ''} onClick={() => setConfig({ ...config, mode: 'mixed', category: undefined })}>
                <i>🎲</i><strong>Questions en vrac</strong><small>Un mélange de toutes les catégories</small>
              </button>
              <button className={config.mode === 'category' ? 'selected' : ''} onClick={() => setConfig({ ...config, mode: 'category', category: config.category ?? 'Labo' })}>
                <i>🎯</i><strong>Une catégorie</strong><small>Une manche entièrement thématique</small>
              </button>
            </div>
          </section>

          {config.mode === 'category' && (
            <section className="setup-section">
              <div className="section-heading"><span>2</span><div><h2>Catégorie</h2><p>Les catégories multimédias arriveront avec leur lecteur dédié.</p></div></div>
              <div className="category-grid">
                {categories.map((category) => {
                  const count = questionsForConfig(questions, { ...config, category: category.id }).length
                  const unavailable = count === 0
                  return (
                    <button
                      key={category.id}
                      className={config.category === category.id ? 'selected' : ''}
                      disabled={unavailable}
                      onClick={() => setConfig({
                        ...config,
                        category: category.id,
                        region: category.id === 'Lieu Perdu' ? config.region ?? 'all' : undefined,
                        spriteGenerations: category.id === 'Sprites' ? config.spriteGenerations ?? 'all' : config.spriteGenerations,
                        spriteVariants: category.id === 'Sprites' ? config.spriteVariants ?? 'all' : config.spriteVariants,
                        pokopiaSpoilers: category.id === 'Pokopia' ? config.pokopiaSpoilers ?? 'safe' : config.pokopiaSpoilers,
                      })}
                    >
                      <i>{category.icon}</i><strong>{category.label}</strong><small>{unavailable ? 'Bientôt disponible' : `${count} question${count > 1 ? 's' : ''}`}</small>
                    </button>
                  )
                })}
              </div>
            </section>
          )}

          {hasRegionSelection && (
            <section className="setup-section">
              <div className="section-heading"><span>3</span><div><h2>Région</h2><p>Choisis une carte ou mélange les destinations.</p></div></div>
              <div className="region-grid">
                {mapRegions.map((region) => (
                  <button
                    key={region.id}
                    className={(config.region ?? 'all') === region.id ? 'selected' : ''}
                    onClick={() => setConfig({ ...config, region: region.id })}
                  >
                    <i>{region.icon}</i><strong>{region.label}</strong><small>{region.description}</small>
                  </button>
                ))}
              </div>
            </section>
          )}

          {hasSpriteGenerationSelection && (
            <section className="setup-section">
              <div className="section-heading"><span>3</span><div><h2>Générations</h2><p>Sélectionne une, plusieurs ou toutes les générations.</p></div></div>
              <div className="generation-grid">
                <button
                  className={(config.spriteGenerations ?? 'all') === 'all' ? 'selected' : ''}
                  onClick={() => setConfig({ ...config, spriteGenerations: 'all' })}
                >
                  <strong>Toutes</strong><small>Générations 1 à 9</small>
                </button>
                {spriteGenerations.map((generation) => {
                  const selected = config.spriteGenerations !== 'all'
                    && config.spriteGenerations?.includes(generation)
                  const count = questionsForConfig(questions, {
                    ...config,
                    spriteGenerations: [generation],
                  }).length
                  return (
                    <button
                      key={generation}
                      className={selected ? 'selected' : ''}
                      onClick={() => toggleSpriteGeneration(generation)}
                    >
                      <strong>Génération {generation}</strong><small>{count} sprite{count > 1 ? 's' : ''}</small>
                    </button>
                  )
                })}
              </div>
            </section>
          )}

          {hasPokopiaSelection && (
            <section className="setup-section">
              <div className="section-heading"><span>3</span><div><h2>Niveau de spoilers</h2><p>Protège les joueurs qui commencent leur aventure.</p></div></div>
              <div className="mode-grid">
                <button
                  className={(config.pokopiaSpoilers ?? 'safe') === 'safe' ? 'selected' : ''}
                  onClick={() => setConfig({ ...config, pokopiaSpoilers: 'safe' })}
                >
                  <i>🌱</i><strong>Sans spoilers</strong><small>Gameplay et informations de présentation</small>
                </button>
                <button
                  className={config.pokopiaSpoilers === 'all' ? 'selected' : ''}
                  onClick={() => setConfig({ ...config, pokopiaSpoilers: 'all' })}
                >
                  <i>🏡</i><strong>Partie complète</strong><small>Inclut histoire, zones et rencontres</small>
                </button>
              </div>
            </section>
          )}

          {hasSpriteGenerationSelection && (
            <section className="setup-section">
              <div className="section-heading"><span>4</span><div><h2>Variantes visuelles</h2><p>Choisis un ou plusieurs défis visuels pour les sprites.</p></div></div>
              <div className="sprite-variant-grid">
                <button
                  className={(config.spriteVariants ?? 'all') === 'all' ? 'selected' : ''}
                  onClick={() => setConfig({ ...config, spriteVariants: 'all' })}
                >
                  <i>🎲</i><strong>Tout mélanger</strong><small>Les six variantes au hasard</small>
                </button>
                {spriteVariantOptions.map((variant) => {
                  const selected = config.spriteVariants !== 'all'
                    && config.spriteVariants?.includes(variant.id)
                  return (
                    <button
                      key={variant.id}
                      className={selected ? 'selected' : ''}
                      onClick={() => toggleSpriteVariant(variant.id)}
                    >
                      <i>{variant.icon}</i><strong>{variant.label}</strong><small>{variant.description}</small>
                    </button>
                  )
                })}
              </div>
            </section>
          )}

          <section className="setup-section">
            <div className="section-heading"><span>{difficultyStep}</span><div><h2>Difficulté</h2><p>Adapte le tirage au niveau des joueurs.</p></div></div>
            <div className="difficulty-grid">
              {difficultyPresets.map((preset) => (
                <button key={preset.id} className={config.difficulty === preset.id ? 'selected' : ''} onClick={() => setConfig({ ...config, difficulty: preset.id as DifficultyPreset })}>
                  <strong>{preset.label}</strong><small>{preset.description}</small>
                </button>
              ))}
            </div>
          </section>

          <section className="setup-section">
            <div className="section-heading"><span>{timerStep}</span><div><h2>Temps par question</h2><p>Choisis le rythme de la partie.</p></div></div>
            <div className="timer-grid">
              {timerSettings.map((setting) => (
                <button
                  key={setting.value ?? 'none'}
                  className={config.timerSeconds === setting.value ? 'selected' : ''}
                  onClick={() => setConfig({ ...config, timerSeconds: setting.value })}
                >
                  <strong>{setting.label}</strong><small>{setting.description}</small>
                </button>
              ))}
            </div>
          </section>

          <section className="setup-section">
            <div className="section-heading"><span>{questionCountStep}</span><div><h2>Nombre de questions</h2><p>La sélection s’adapte au contenu disponible.</p></div></div>
            <div className="count-grid">
              {availableQuestionCounts.map((count) => (
                <button key={count} className={effectiveQuestionCount === count ? 'selected' : ''} onClick={() => setQuestionCount(count)}>
                  <strong>{count}</strong><small>question{count > 1 ? 's' : ''}</small>
                </button>
              ))}
            </div>
          </section>

          <section className="setup-summary">
            <div><span>Joueurs</span><strong>{players.map(({ name }) => name || 'Sans nom').join(', ')}</strong></div>
            <div><span>Mode</span><strong>{config.mode === 'mixed' ? 'Questions en vrac' : config.category}</strong></div>
            {hasSpriteGenerationSelection && (
              <div><span>Générations</span><strong>{config.spriteGenerations === 'all' ? 'Toutes' : config.spriteGenerations?.join(', ')}</strong></div>
            )}
            {hasSpriteGenerationSelection && (
              <div><span>Variantes</span><strong>{config.spriteVariants === 'all' ? 'Tout mélanger' : config.spriteVariants?.length}</strong></div>
            )}
            {hasPokopiaSelection && (
              <div><span>Spoilers</span><strong>{config.pokopiaSpoilers === 'all' ? 'Partie complète' : 'Sans spoilers'}</strong></div>
            )}
            <div><span>Difficulté</span><strong>{difficultyPresets.find(({ id }) => id === config.difficulty)?.label}</strong></div>
            <div><span>Timer</span><strong>{config.timerSeconds === null ? 'Sans limite' : `${config.timerSeconds}s`}</strong></div>
            <div><span>Questions</span><strong>{effectiveQuestionCount}</strong></div>
          </section>

          <div className="setup-actions">
            <button disabled={players.length >= 8} onClick={() => setPlayers([...players, newPlayer(players.length)])}>+ Ajouter un joueur</button>
            <div className="launch-area">
              <small>{eligibleQuestions.length === 0 ? 'Aucune question pour cette combinaison' : `${effectiveQuestionCount} question${effectiveQuestionCount > 1 ? 's' : ''} dans cette partie`}</small>
              <button className="primary" disabled={players.some((player) => !player.name.trim()) || eligibleQuestions.length === 0} onClick={startGame}>Lancer la partie <span>→</span></button>
            </div>
          </div>
        </section>
      </main>
    )
  }

  if (!game) return null
  if (game.finished) {
    const ranking = rankPlayers(game.players)
    const winners = ranking.filter(({ rank }) => rank === 1)
    return (
      <main className="app-shell results">
        <Logo /><span className="eyebrow">HALL OF FAME</span>
        <h1>{winners.length > 1 ? `Égalité entre ${winners.length} Dresseurs !` : `Victoire de ${winners[0].player.name} !`}</h1>
        <div className="podium">
          {ranking.map(({ player, rank }) => <div className={rank === 1 ? 'winner' : ''} key={player.id}><span>{rank}{ranking.filter((entry) => entry.rank === rank).length > 1 ? ' ex æquo' : ''}</span><i>{player.avatar}</i><strong>{player.name}</strong><b>{player.score} pts</b></div>)}
        </div>
        <LostPlaceSummary game={game} />
        <GameStats game={game} />
        <button className="primary" onClick={() => { clearSavedGame(); setPlayers([newPlayer(0)]); setGame(null); setScreen('menu') }}>Retour au menu</button>
      </main>
    )
  }

  const question = game.questions[game.questionIndex]
  const revealStage = progressiveRevealStage(question, game.questionElapsedSeconds, game.timerSeconds)
  const currentPoints = availablePoints(question, game.questionElapsedSeconds, game.timerSeconds)
  return (
    <main className="app-shell game">
      <nav><Logo /><div className="progress">Question {game.questionIndex + 1} / {game.questions.length}</div><div className={`timer ${game.remainingSeconds !== null && game.remainingSeconds <= 5 ? 'danger' : ''}`}>{game.remainingSeconds === null ? '∞ Sans limite' : `⏱ ${game.remainingSeconds}s`}</div></nav>
      <div className="progress-bar"><i style={{ width: `${((game.questionIndex + 1) / game.questions.length) * 100}%` }} /></div>
      <section className="question-card" key={question.id}>
        <div>
          <span className="category">{question.category}</span>
          {question.validation?.status === 'validated' && <span className="validated-badge">✓ Validée</span>}
          <span className="difficulty">{'★'.repeat(question.difficulty)}{'☆'.repeat(5 - question.difficulty)}</span>
        </div>
        <h1>{question.prompt}</h1>
        {question.media?.kind === 'image' && (
          <div
            key={question.id}
            className={`question-media ${question.media.pixelated ? 'pixelated' : ''} sprite-${question.media.spriteVariant ?? 'normal'} reveal-stage-${revealStage} ${game.revealed ? 'revealed' : ''} ${question.type === 'map-location' ? 'location-clue' : ''}`}
          >
            <SpriteImage media={question.media} revealed={game.revealed} />
          </div>
        )}
        <p>{question.media?.spriteVariant === 'progressive' ? `${currentPoints} points disponibles` : `${question.points} points`}</p>
      </section>
      {question.type === 'map-location' ? (
        <LostPlaceRound
          key={question.id}
          players={game.players}
          answers={game.answers}
          question={question}
          revealed={game.revealed}
          onAnswer={(playerId, value) => setGame(submitAnswer(game, playerId, value))}
        />
      ) : (
        <section className="player-grid">
          {game.players.map((player) => (
            <PlayerPanel key={`${question.id}-${player.id}`} player={player} question={question} answer={game.answers[player.id]} disabled={game.revealed} onAnswer={(value) => setGame(submitAnswer(game, player.id, value))} />
          ))}
        </section>
      )}
      {game.revealed ? (
        <section className="reveal">
          <span>Réponse</span><h2>{question.acceptedAnswers[0]}</h2><p>{question.explanation}</p>
          <button className="primary" onClick={() => setGame(nextQuestion(game))}>{game.questionIndex === game.questions.length - 1 ? 'Voir le podium' : 'Question suivante'} →</button>
        </section>
      ) : (
        <button className="reveal-button" onClick={() => setGame(revealAnswer(game))}>Révéler la réponse</button>
      )}
    </main>
  )
}
