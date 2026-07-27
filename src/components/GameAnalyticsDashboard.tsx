import { useEffect, useMemo, useState } from 'react'
import { loadGameSessions, type StoredGameSession } from '../services/gameAnalytics'

const percentage = (value: number, total: number) => total ? Math.round(value / total * 100) : 0
const duration = (seconds: number) => `${Math.floor(seconds / 60)} min ${seconds % 60}s`

export function GameAnalyticsDashboard() {
  const [sessions, setSessions] = useState<StoredGameSession[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const refresh = async () => {
    setLoading(true)
    setError(false)
    try {
      setSessions(await loadGameSessions())
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void refresh()
  }, [])

  const metrics = useMemo(() => {
    const categories = new Map<string, { answers: number; correct: number; points: number }>()
    const questions = new Map<string, { category: string; answers: number; correct: number }>()
    let answers = 0
    let correct = 0

    sessions.forEach((session) => session.questionResults.forEach((result) => {
      const category = categories.get(result.category) ?? { answers: 0, correct: 0, points: 0 }
      const question = questions.get(result.questionId) ?? { category: result.category, answers: 0, correct: 0 }
      result.answers.forEach((answer) => {
        answers += 1
        category.answers += 1
        question.answers += 1
        category.points += answer.points
        if (answer.isCorrect) {
          correct += 1
          category.correct += 1
          question.correct += 1
        }
      })
      categories.set(result.category, category)
      questions.set(result.questionId, question)
    }))

    const rankedQuestions = [...questions.entries()]
      .filter(([, item]) => item.answers >= 3)
      .map(([id, item]) => ({ id, ...item, accuracy: percentage(item.correct, item.answers) }))

    return {
      answers,
      correct,
      players: sessions.reduce((total, session) => total + session.playerCount, 0),
      questions: sessions.reduce((total, session) => total + session.questionCount, 0),
      failures: sessions.reduce((total, session) => total + session.imageFailures.length, 0),
      categories: [...categories.entries()]
        .map(([name, item]) => ({ name, ...item, accuracy: percentage(item.correct, item.answers) }))
        .sort((left, right) => right.answers - left.answers),
      easiest: [...rankedQuestions].sort((left, right) => right.accuracy - left.accuracy).slice(0, 5),
      hardest: [...rankedQuestions].sort((left, right) => left.accuracy - right.accuracy).slice(0, 5),
    }
  }, [sessions])

  if (loading) return <p className="analytics-state">Chargement des parties…</p>
  if (error) {
    return (
      <section className="analytics-state">
        <strong>Le journal des parties n’est pas encore disponible.</strong>
        <span>Exécute la migration 003 dans Supabase, puis recharge cette page.</span>
        <button onClick={() => void refresh()}>Réessayer</button>
      </section>
    )
  }

  return (
    <section className="game-analytics">
      <header>
        <div><span className="eyebrow">JOURNAL DES PARTIES</span><h2>Ce que révèlent les tests</h2></div>
        <button onClick={() => void refresh()}>Actualiser</button>
      </header>
      <div className="analytics-kpis">
        <article><strong>{sessions.length}</strong><span>Parties</span></article>
        <article><strong>{metrics.players}</strong><span>Participations</span></article>
        <article><strong>{metrics.questions}</strong><span>Questions jouées</span></article>
        <article><strong>{percentage(metrics.correct, metrics.answers)}%</strong><span>Bonnes réponses</span></article>
        <article className={metrics.failures ? 'alert' : 'good'}><strong>{metrics.failures}</strong><span>Erreurs d’image</span></article>
      </div>

      {sessions.length === 0 ? (
        <p className="analytics-empty">Les prochaines parties terminées apparaîtront automatiquement ici.</p>
      ) : (
        <>
          <div className="analytics-grid">
            <section>
              <h3>Réussite par catégorie</h3>
              {metrics.categories.map((item) => (
                <div className="analytics-bar" key={item.name}>
                  <span><strong>{item.name}</strong><small>{item.correct}/{item.answers}</small></span>
                  <i><b style={{ width: `${item.accuracy}%` }} /></i>
                  <em>{item.accuracy}%</em>
                </div>
              ))}
            </section>
            <section>
              <h3>Questions à surveiller</h3>
              <h4>Les plus difficiles</h4>
              {metrics.hardest.map((item) => <p key={`hard-${item.id}`}><code>{item.id}</code><span>{item.accuracy}% · {item.answers} réponses</span></p>)}
              <h4>Les plus faciles</h4>
              {metrics.easiest.map((item) => <p key={`easy-${item.id}`}><code>{item.id}</code><span>{item.accuracy}% · {item.answers} réponses</span></p>)}
              {!metrics.hardest.length && <small>Il faut au moins trois réponses par question pour établir ce classement.</small>}
            </section>
          </div>

          <section className="recent-games">
            <h3>Parties récentes</h3>
            {sessions.slice(0, 20).map((session) => (
              <article key={session.sessionId}>
                <div>
                  <strong>{session.players.filter((player) => player.rank === 1).map((player) => player.name).join(' & ')}</strong>
                  <small>{new Date(session.finishedAt).toLocaleString('fr-FR')}</small>
                </div>
                <span>{session.category ?? 'Questions en vrac'}</span>
                <span>{session.playerCount} joueur{session.playerCount > 1 ? 's' : ''}</span>
                <span>{session.questionCount} questions</span>
                <span>{duration(session.durationSeconds)}</span>
              </article>
            ))}
          </section>
        </>
      )}
    </section>
  )
}
