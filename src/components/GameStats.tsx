import type { GameState } from '../domain/quiz'

export function GameStats({ game }: { game: GameState }) {
  const questionById = new Map(game.questions.map((question) => [question.id, question]))
  return (
    <section className="game-stats">
      <h2>Statistiques de la partie</h2>
      <div className="stats-grid">
        {game.players.map((player) => {
          const answers = game.history.map((result) => result.answers[player.id]).filter(Boolean)
          const correct = answers.filter((answer) => answer.isCorrect).length
          const average = answers.length
            ? Math.round(answers.reduce((sum, answer) => sum + (answer.responseSeconds ?? 0), 0) / answers.length)
            : 0
          let streak = 0
          let bestStreak = 0
          answers.forEach((answer) => {
            streak = answer.isCorrect ? streak + 1 : 0
            bestStreak = Math.max(bestStreak, streak)
          })
          const categoryPoints = new Map<string, number>()
          game.history.forEach((result) => {
            const category = questionById.get(result.questionId)?.category ?? 'Autre'
            categoryPoints.set(category, (categoryPoints.get(category) ?? 0) + (result.answers[player.id]?.pointsAwarded ?? 0))
          })
          const favorite = [...categoryPoints.entries()].sort((left, right) => right[1] - left[1])[0]
          return (
            <article key={player.id}>
              <header><i>{player.avatar}</i><strong>{player.name}</strong></header>
              <div><b>{answers.length ? Math.round((correct / answers.length) * 100) : 0}%</b><span>Précision</span></div>
              <div><b>{average}s</b><span>Temps moyen</span></div>
              <div><b>{bestStreak}</b><span>Meilleure série</span></div>
              <div><b>{favorite ? favorite[0] : '—'}</b><span>Meilleure catégorie</span></div>
              <p className="category-breakdown">
                {[...categoryPoints.entries()].map(([category, points]) => (
                  <span key={category}>{category} : <b>{points} pts</b></span>
                ))}
              </p>
            </article>
          )
        })}
      </div>
      <details className="answer-details">
        <summary>Détail des réponses</summary>
        <div>
          {game.history.map((result, index) => {
            const question = questionById.get(result.questionId)
            return (
              <article key={result.questionId}>
                <strong>{index + 1}. {question?.prompt}</strong>
                {game.players.map((player) => {
                  const answer = result.answers[player.id]
                  return <span key={player.id}>{player.name} : {answer?.isCorrect ? '✓' : '✗'} {answer?.pointsAwarded ?? 0} pt{(answer?.pointsAwarded ?? 0) > 1 ? 's' : ''}</span>
                })}
              </article>
            )
          })}
        </div>
      </details>
    </section>
  )
}
