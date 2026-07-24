import { useEffect, useState } from 'react'
import { Logo } from './components/Logo'
import { PlayerPanel } from './components/PlayerPanel'
import { questions } from './data/questions'
import { categories, difficultyPresets, type DifficultyPreset, type GameConfig } from './domain/gameConfig'
import type { GameState, Player } from './domain/quiz'
import { createGame, nextQuestion, revealAnswer, submitAnswer, tick } from './engine/quizEngine'
import { questionsForConfig, selectQuestions } from './engine/questionSelection'
import { rankPlayers } from './engine/ranking'
import { clearSavedGame, loadGame, saveGame } from './storage/gameStorage'

type Screen = 'menu' | 'setup' | 'game'
const avatars = ['⚡', '🔥', '💧', '🌿', '🌙', '⭐', '🐉', '🌀']
const colors = ['#f2c94c', '#ff5b5b', '#4aa8ff', '#62d68b', '#a777e3', '#ff8f4c', '#35d0ba', '#ef6bad']
const preferredQuestionCounts = [5, 10, 15, 20, 30, 50, 75, 100]

function newPlayer(index: number): Player {
  return { id: crypto.randomUUID(), name: `Joueur ${index + 1}`, avatar: avatars[index], color: colors[index], score: 0 }
}

export function App() {
  const [screen, setScreen] = useState<Screen>('menu')
  const [players, setPlayers] = useState<Player[]>([newPlayer(0)])
  const [game, setGame] = useState<GameState | null>(null)
  const [config, setConfig] = useState<GameConfig>({ mode: 'mixed', difficulty: 'all' })
  const [questionCount, setQuestionCount] = useState(10)
  const savedGame = loadGame()
  const eligibleQuestions = questionsForConfig(questions, config)
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
    const timer = window.setInterval(() => setGame((current) => current ? tick(current) : current), 1000)
    return () => window.clearInterval(timer)
  }, [game])

  const startGame = () => {
    setGame(createGame(players, selectQuestions(questions, config, effectiveQuestionCount)))
    setScreen('game')
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
                      onClick={() => setConfig({ ...config, category: category.id })}
                    >
                      <i>{category.icon}</i><strong>{category.label}</strong><small>{unavailable ? 'Bientôt disponible' : `${count} question${count > 1 ? 's' : ''}`}</small>
                    </button>
                  )
                })}
              </div>
            </section>
          )}

          <section className="setup-section">
            <div className="section-heading"><span>{config.mode === 'category' ? '3' : '2'}</span><div><h2>Difficulté</h2><p>Adapte le tirage au niveau des joueurs.</p></div></div>
            <div className="difficulty-grid">
              {difficultyPresets.map((preset) => (
                <button key={preset.id} className={config.difficulty === preset.id ? 'selected' : ''} onClick={() => setConfig({ ...config, difficulty: preset.id as DifficultyPreset })}>
                  <strong>{preset.label}</strong><small>{preset.description}</small>
                </button>
              ))}
            </div>
          </section>

          <section className="setup-section">
            <div className="section-heading"><span>{config.mode === 'category' ? '4' : '3'}</span><div><h2>Nombre de questions</h2><p>La sélection s’adapte au contenu disponible.</p></div></div>
            <div className="count-grid">
              {availableQuestionCounts.map((count) => (
                <button key={count} className={effectiveQuestionCount === count ? 'selected' : ''} onClick={() => setQuestionCount(count)}>
                  <strong>{count}</strong><small>question{count > 1 ? 's' : ''}</small>
                </button>
              ))}
            </div>
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
        <button className="primary" onClick={() => { clearSavedGame(); setPlayers([newPlayer(0)]); setGame(null); setScreen('menu') }}>Retour au menu</button>
      </main>
    )
  }

  const question = game.questions[game.questionIndex]
  return (
    <main className="app-shell game">
      <nav><Logo /><div className="progress">Question {game.questionIndex + 1} / {game.questions.length}</div><div className={`timer ${game.remainingSeconds <= 5 ? 'danger' : ''}`}>⏱ {game.remainingSeconds}s</div></nav>
      <div className="progress-bar"><i style={{ width: `${((game.questionIndex + 1) / game.questions.length) * 100}%` }} /></div>
      <section className="question-card">
        <div><span className="category">{question.category}</span><span className="difficulty">{'★'.repeat(question.difficulty)}{'☆'.repeat(5 - question.difficulty)}</span></div>
        <h1>{question.prompt}</h1>
        {question.media?.kind === 'image' && (
          <div className={`question-media ${question.media.pixelated ? 'pixelated' : ''}`}>
            <img src={question.media.src} alt={question.media.alt} />
          </div>
        )}
        <p>{question.points} points</p>
      </section>
      <section className="player-grid">
        {game.players.map((player) => (
          <PlayerPanel key={player.id} player={player} question={question} answer={game.answers[player.id]} disabled={game.revealed} onAnswer={(value) => setGame(submitAnswer(game, player.id, value))} />
        ))}
      </section>
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
