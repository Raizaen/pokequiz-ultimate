import { useEffect, useMemo, useState } from 'react'
import { loadGameSessions, setGameSessionExcluded, type StoredGameSession } from '../services/gameAnalytics'
import { loadQuestionReports, setQuestionReportResolved, type QuestionReport } from '../services/questionReports'

const percentage = (value: number, total: number) => total ? Math.round(value / total * 100) : 0
const duration = (seconds: number) => `${Math.floor(seconds / 60)} min ${seconds % 60}s`
const reportReasons = {
  incorrect: 'Réponse incorrecte',
  ambiguous: 'Question ambiguë',
  media: 'Image ou média',
  translation: 'Traduction',
  other: 'Autre',
}

interface Props {
  onOpenQuestion?: (questionId: string) => void
}

export function GameAnalyticsDashboard({ onOpenQuestion }: Props) {
  const [sessions, setSessions] = useState<StoredGameSession[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [message, setMessage] = useState('')
  const [busySession, setBusySession] = useState<string | null>(null)
  const [selectedSession, setSelectedSession] = useState<StoredGameSession | null>(null)
  const [reports, setReports] = useState<QuestionReport[]>([])
  const [busyReport, setBusyReport] = useState<number | null>(null)

  const refresh = async () => {
    setLoading(true)
    setError(false)
    try {
      setSessions(await loadGameSessions())
      try {
        setReports(await loadQuestionReports())
      } catch {
        setReports([])
      }
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
    const includedSessions = sessions.filter((session) => !session.excludedAt)
    const categories = new Map<string, { answers: number; correct: number; points: number }>()
    const questions = new Map<string, {
      category: string
      answers: number
      correct: number
      attempts: number
      responseSeconds: number
    }>()
    let answers = 0
    let correct = 0

    includedSessions.forEach((session) => session.questionResults.forEach((result) => {
      const category = categories.get(result.category) ?? { answers: 0, correct: 0, points: 0 }
      const question = questions.get(result.questionId) ?? {
        category: result.category,
        answers: 0,
        correct: 0,
        attempts: 0,
        responseSeconds: 0,
      }
      result.answers.forEach((answer) => {
        answers += 1
        category.answers += 1
        question.answers += 1
        question.attempts += answer.attempts
        question.responseSeconds += answer.responseSeconds
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
      .map(([id, item]) => ({
        id,
        ...item,
        accuracy: percentage(item.correct, item.answers),
        averageAttempts: item.attempts / item.answers,
        averageSeconds: item.responseSeconds / item.answers,
      }))

    return {
      answers,
      correct,
      sessions: includedSessions.length,
      players: includedSessions.reduce((total, session) => total + session.playerCount, 0),
      questions: includedSessions.reduce((total, session) => total + session.questionCount, 0),
      failures: includedSessions.reduce((total, session) => total + session.imageFailures.length, 0),
      categories: [...categories.entries()]
        .map(([name, item]) => ({ name, ...item, accuracy: percentage(item.correct, item.answers) }))
        .sort((left, right) => right.answers - left.answers),
      easiest: [...rankedQuestions].sort((left, right) => right.accuracy - left.accuracy).slice(0, 5),
      hardest: [...rankedQuestions].sort((left, right) => left.accuracy - right.accuracy).slice(0, 5),
      watchlist: rankedQuestions
        .filter((item) => item.accuracy <= 50 || item.averageAttempts >= 2 || item.averageSeconds >= 20)
        .sort((left, right) =>
          (left.accuracy - right.accuracy)
          || (right.averageAttempts - left.averageAttempts)
          || (right.averageSeconds - left.averageSeconds))
        .slice(0, 8),
    }
  }, [sessions])
  const includedSessions = sessions.filter((session) => !session.excludedAt)
  const excludedSessions = sessions.filter((session) => Boolean(session.excludedAt))
  const openReports = reports.filter((report) => report.status === 'open')

  const toggleExcluded = async (session: StoredGameSession, excluded: boolean) => {
    if (excluded && !window.confirm('Exclure cette partie de toutes les statistiques ? Tu pourras la restaurer ensuite.')) return
    setBusySession(session.sessionId)
    setMessage('')
    try {
      await setGameSessionExcluded(session.sessionId, excluded)
      setSessions((current) => current.map((item) =>
        item.sessionId === session.sessionId
          ? { ...item, excludedAt: excluded ? new Date().toISOString() : null }
          : item))
      setMessage(excluded ? 'Partie exclue des statistiques.' : 'Partie restaurée dans les statistiques.')
    } catch {
      setMessage('Impossible de modifier cette partie. Vérifie que la migration 004 a bien été exécutée.')
    } finally {
      setBusySession(null)
    }
  }

  const toggleReport = async (report: QuestionReport, resolved: boolean) => {
    setBusyReport(report.reportId)
    try {
      await setQuestionReportResolved(report.reportId, resolved)
      setReports((current) => current.map((item) =>
        item.reportId === report.reportId ? { ...item, status: resolved ? 'resolved' : 'open' } : item))
      setMessage(resolved ? 'Signalement marqué comme traité.' : 'Signalement rouvert.')
    } catch {
      setMessage('Impossible de modifier le signalement. Vérifie que la migration 005 a bien été exécutée.')
    } finally {
      setBusyReport(null)
    }
  }

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
        <article><strong>{metrics.sessions}</strong><span>Parties comptabilisées</span></article>
        <article><strong>{metrics.players}</strong><span>Participations</span></article>
        <article><strong>{metrics.questions}</strong><span>Questions jouées</span></article>
        <article><strong>{percentage(metrics.correct, metrics.answers)}%</strong><span>Bonnes réponses</span></article>
        <article className={metrics.failures ? 'alert' : 'good'}><strong>{metrics.failures}</strong><span>Erreurs d’image</span></article>
      </div>

      {message && <p className="analytics-message">{message}</p>}
      {includedSessions.length === 0 ? (
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
              <h4>Alertes automatiques</h4>
              {metrics.watchlist.map((item) => (
                <p key={`watch-${item.id}`}>
                  <code>{item.id}</code>
                  <span>{item.accuracy}% · {item.averageAttempts.toFixed(1)} essais · {Math.round(item.averageSeconds)}s</span>
                </p>
              ))}
              {!metrics.watchlist.length && <small>Aucune alerte après application des seuils de qualité.</small>}
              <h4>Les plus difficiles</h4>
              {metrics.hardest.map((item) => <p key={`hard-${item.id}`}><code>{item.id}</code><span>{item.accuracy}% · {item.answers} réponses</span></p>)}
              <h4>Les plus faciles</h4>
              {metrics.easiest.map((item) => <p key={`easy-${item.id}`}><code>{item.id}</code><span>{item.accuracy}% · {item.answers} réponses</span></p>)}
              {!metrics.hardest.length && <small>Il faut au moins trois réponses par question pour établir ce classement.</small>}
            </section>
          </div>

          <section className="recent-games">
            <h3>Parties récentes</h3>
            {includedSessions.slice(0, 20).map((session) => (
              <article key={session.sessionId}>
                <div>
                  <strong>{session.players.filter((player) => player.rank === 1).map((player) => player.name).join(' & ')}</strong>
                  <small>{new Date(session.finishedAt).toLocaleString('fr-FR')}</small>
                </div>
                <span>{session.category ?? 'Questions en vrac'}</span>
                <span>{session.playerCount} joueur{session.playerCount > 1 ? 's' : ''}</span>
                <span>{session.questionCount} questions</span>
                <span>{duration(session.durationSeconds)}</span>
                <button className="game-details-button" onClick={() => setSelectedSession(session)}>Détails</button>
                <button
                  className="exclude-game"
                  disabled={busySession === session.sessionId}
                  onClick={() => void toggleExcluded(session, true)}
                  title="Ne plus compter cette partie"
                >
                  {busySession === session.sessionId ? '…' : 'Exclure'}
                </button>
              </article>
            ))}
          </section>
        </>
      )}
      <section className="question-watchlist">
        <header>
          <div><h3>Signalements reçus</h3><small>{openReports.length} à traiter</small></div>
        </header>
        {openReports.length === 0 && <p>Aucun signalement ouvert. Les retours des joueurs apparaîtront ici.</p>}
        {openReports.slice(0, 20).map((report) => (
          <article key={report.reportId}>
            <div>
              <span>{reportReasons[report.reason]}</span>
              <strong>{report.questionPrompt}</strong>
              <small>{report.category} · {report.reporterNames || 'Joueur anonyme'} · {new Date(report.createdAt).toLocaleString('fr-FR')}</small>
              {report.details && <p>{report.details}</p>}
            </div>
            <div className="report-actions">
              {onOpenQuestion && <button onClick={() => onOpenQuestion(report.questionId)}>Ouvrir la question</button>}
              <button disabled={busyReport === report.reportId} onClick={() => void toggleReport(report, true)}>
                {busyReport === report.reportId ? '…' : 'Marquer traité'}
              </button>
            </div>
          </article>
        ))}
      </section>
      {excludedSessions.length > 0 && (
        <details className="excluded-games">
          <summary>Parties exclues ({excludedSessions.length})</summary>
          {excludedSessions.map((session) => (
            <article key={session.sessionId}>
              <span>
                <strong>{session.players.map((player) => player.name).join(' · ')}</strong>
                {' — '}
                {new Date(session.finishedAt).toLocaleString('fr-FR')}
                {' · '}
                {session.category ?? 'Questions en vrac'}
                {' · '}
                {session.questionCount} questions
              </span>
              <button disabled={busySession === session.sessionId} onClick={() => void toggleExcluded(session, false)}>
                {busySession === session.sessionId ? '…' : 'Restaurer'}
              </button>
            </article>
          ))}
        </details>
      )}
      {selectedSession && (
        <div className="history-overlay" role="dialog" aria-modal="true" aria-label="Détail de la partie">
          <section className="history-panel game-session-detail">
            <header>
              <div>
                <span className="eyebrow">DÉTAIL DE LA PARTIE</span>
                <h3>{selectedSession.players.map((player) => player.name).join(' · ')}</h3>
                <small>{new Date(selectedSession.finishedAt).toLocaleString('fr-FR')} · {duration(selectedSession.durationSeconds)}</small>
              </div>
              <button onClick={() => setSelectedSession(null)}>Fermer</button>
            </header>
            <div className="session-ranking">
              {selectedSession.players
                .slice()
                .sort((left, right) => left.rank - right.rank)
                .map((player) => (
                  <article key={`${player.name}-${player.rank}`}>
                    <span>#{player.rank}</span><strong>{player.avatar} {player.name}</strong><b>{player.score} pts</b>
                  </article>
                ))}
            </div>
            <div className="session-question-list">
              {selectedSession.questionResults.map((result, index) => {
                const correct = result.answers.filter((answer) => answer.isCorrect).length
                const averageTime = result.answers.length
                  ? Math.round(result.answers.reduce((total, answer) => total + answer.responseSeconds, 0) / result.answers.length)
                  : 0
                const warning = correct === 0 || result.answers.some((answer) => answer.attempts >= 3)
                return (
                  <details key={`${result.questionId}-${index}`} className={warning ? 'needs-attention' : ''}>
                    <summary>
                      <span>{index + 1}</span>
                      <strong>{result.prompt ?? result.questionId}</strong>
                      <small>{correct}/{result.answers.length} juste{correct > 1 ? 's' : ''} · {averageTime}s moy.</small>
                    </summary>
                    {result.acceptedAnswer && <p><b>Réponse :</b> {result.acceptedAnswer}</p>}
                    {result.answers.map((answer, answerIndex) => (
                      <article key={`${answer.playerName}-${answerIndex}`}>
                        <strong>{answer.playerName}</strong>
                        <span className={answer.isCorrect ? 'answer-correct' : 'answer-wrong'}>{answer.isCorrect ? 'Juste' : 'Faux'}</span>
                        <span>{answer.attempts} essai{answer.attempts > 1 ? 's' : ''}</span>
                        <span>{answer.responseSeconds}s</span>
                        <span>{answer.points} pts</span>
                      </article>
                    ))}
                  </details>
                )
              })}
            </div>
          </section>
        </div>
      )}
    </section>
  )
}
