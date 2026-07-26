import { useMemo } from 'react'
import { questionFingerprint } from '../engine/questionIdentity'
import type { EditorialStatus, PublicationStatus, StoredQuestion } from '../services/questionRepository'

interface Props {
  rows: StoredQuestion[]
  onOpenBank: (filters?: {
    category?: string
    publicationStatus?: PublicationStatus
    editorialStatus?: EditorialStatus
    query?: string
    quality?: 'unsourced' | 'duplicates'
  }) => void
}

export function QualityDashboard({ rows, onOpenBank }: Props) {
  const metrics = useMemo(() => {
    const categoryMap = new Map<string, StoredQuestion[]>()
    const fingerprints = new Map<string, StoredQuestion[]>()
    rows.forEach((row) => {
      categoryMap.set(row.payload.category, [...(categoryMap.get(row.payload.category) ?? []), row])
      if (row.publicationStatus !== 'archived') {
        const fingerprint = questionFingerprint(row.payload)
        fingerprints.set(fingerprint, [...(fingerprints.get(fingerprint) ?? []), row])
      }
    })
    return {
      published: rows.filter((row) => row.publicationStatus === 'published').length,
      review: rows.filter((row) => row.validationStatus === 'review').length,
      contested: rows.filter((row) => row.validationStatus === 'contested').length,
      unsourced: rows.filter((row) => (row.payload.validation?.sources.length ?? 0) === 0).length,
      duplicates: [...fingerprints.values()].filter((group) => group.length > 1),
      categories: [...categoryMap.entries()]
        .map(([category, questions]) => ({
          category,
          total: questions.length,
          published: questions.filter((row) => row.publicationStatus === 'published').length,
          validated: questions.filter((row) => row.validationStatus === 'validated').length,
          difficulties: [1, 2, 3, 4, 5].map((difficulty) =>
            questions.filter((row) => row.payload.difficulty === difficulty).length),
          templates: new Set(questions.map((row) => row.payload.template).filter(Boolean)).size,
        }))
        .sort((left, right) => right.total - left.total),
    }
  }, [rows])

  return (
    <section className="quality-dashboard">
      <header><span className="eyebrow">QUALITÉ ÉDITORIALE</span><h2>État de la banque</h2><p>Des indicateurs cliquables pour aller directement aux questions concernées.</p></header>
      <div className="quality-kpis">
        <button onClick={() => onOpenBank()}><strong>{rows.length}</strong><span>Total</span></button>
        <button onClick={() => onOpenBank({ publicationStatus: 'published' })}><strong>{metrics.published}</strong><span>Publiées</span></button>
        <button onClick={() => onOpenBank({ editorialStatus: 'review' })}><strong>{metrics.review}</strong><span>À vérifier</span></button>
        <button onClick={() => onOpenBank({ editorialStatus: 'contested' })}><strong>{metrics.contested}</strong><span>Contestées</span></button>
        <button onClick={() => onOpenBank({ quality: 'unsourced' })}><strong>{metrics.unsourced}</strong><span>Sans source</span></button>
        <button onClick={() => onOpenBank({ quality: 'duplicates' })} className={metrics.duplicates.length ? 'alert' : 'good'}><strong>{metrics.duplicates.length}</strong><span>Doublons</span></button>
      </div>
      <div className="quality-category-list">
        <div className="quality-category-head"><span>Catégorie</span><span>Questions</span><span>Validées</span><span>Difficulté ★1 → ★5</span><span>Modèles</span></div>
        {metrics.categories.map((item) => (
          <button key={item.category} onClick={() => onOpenBank({ category: item.category })}>
            <strong>{item.category}</strong>
            <span>{item.total} <small>({item.published} publiées)</small></span>
            <span>{item.validated}</span>
            <span className="difficulty-bars">{item.difficulties.map((count, index) => <i key={index} title={`★${index + 1} : ${count}`} style={{ height: `${Math.max(4, count / Math.max(...item.difficulties) * 28)}px` }} />)}</span>
            <span className={item.templates < 3 ? 'quality-warning' : ''}>{item.templates || '—'}</span>
          </button>
        ))}
      </div>
    </section>
  )
}
