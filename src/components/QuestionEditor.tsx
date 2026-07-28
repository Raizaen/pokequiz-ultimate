import { useEffect, useMemo, useState, type FormEvent } from 'react'
import type { User } from '@supabase/supabase-js'
import { categories } from '../domain/gameConfig'
import type { Question, QuestionType } from '../domain/quiz'
import { questions as bundledQuestions } from '../data/questions'
import { questionFingerprint } from '../engine/questionIdentity'
import { championStatLabels } from '../data/championsStatCatalog'
import { MapTargetPicker } from './MapTargetPicker'
import { PokemonStatPicker } from './PokemonStatPicker'
import { QualityDashboard } from './QualityDashboard'
import { GameAnalyticsDashboard } from './GameAnalyticsDashboard'
import {
  importQuestions,
  loadAdminQuestions,
  loadQuestionRevisions,
  restoreQuestionRevision,
  saveAdminQuestion,
  type EditorialStatus,
  type PublicationStatus,
  type QuestionRevision,
  type StoredQuestion,
} from '../services/questionRepository'

interface Props {
  user: User
  onQuestionsChanged: () => void
}

interface FormState {
  id: string
  type: QuestionType
  category: string
  difficulty: Question['difficulty']
  prompt: string
  choices: string
  answers: string
  explanation: string
  points: number
  durationSeconds: number
  status: PublicationStatus
  validationStatus: EditorialStatus
  sources: string
  mediaSrc: string
  shinySrc: string
  mediaAlt: string
  spriteVariant: NonNullable<Question['media']>['spriteVariant']
  mapRegion: string
  mapX: number
  mapY: number
  statLabel: string
  orderDirection: NonNullable<Question['orderDirection']>
  orderEntries: string
  base?: Question
}

const emptyForm = (): FormState => ({
  id: `custom-${crypto.randomUUID()}`,
  type: 'multiple-choice',
  category: 'Labo',
  difficulty: 2,
  prompt: '',
  choices: '',
  answers: '',
  explanation: '',
  points: 10,
  durationSeconds: 20,
  status: 'draft',
  validationStatus: 'review',
  sources: '',
  mediaSrc: '',
  shinySrc: '',
  mediaAlt: '',
  spriteVariant: 'normal',
  mapRegion: 'Paldea',
  mapX: 50,
  mapY: 50,
  statLabel: 'Vitesse',
  orderDirection: 'ascending',
  orderEntries: '',
})

const splitLines = (value: string) => value.split('\n').map((item) => item.trim()).filter(Boolean)

function toForm(row: StoredQuestion): FormState {
  return {
    id: row.id,
    type: row.payload.type === 'open' || row.payload.type === 'multiple-select'
      ? row.payload.type
      : 'multiple-choice',
    category: row.payload.category,
    difficulty: row.payload.difficulty,
    prompt: row.payload.prompt,
    choices: row.payload.choices?.join('\n') ?? '',
    answers: (row.payload.correctChoices ?? row.payload.acceptedAnswers).join('\n'),
    explanation: row.payload.explanation,
    points: row.payload.points,
    durationSeconds: row.payload.durationSeconds,
    status: row.publicationStatus,
    validationStatus: row.validationStatus,
    sources: row.payload.validation?.sources.map((source) => `${source.label} | ${source.url}`).join('\n') ?? '',
    mediaSrc: row.payload.media?.src ?? '',
    shinySrc: row.payload.media?.shinySrc ?? '',
    mediaAlt: row.payload.media?.alt ?? '',
    spriteVariant: row.payload.media?.spriteVariant ?? 'normal',
    mapRegion: row.payload.mapRegion ?? 'Paldea',
    mapX: row.payload.mapTarget?.x ?? 50,
    mapY: row.payload.mapTarget?.y ?? 50,
    statLabel: row.payload.statLabel ?? 'Vitesse',
    orderDirection: row.payload.orderDirection ?? 'ascending',
    orderEntries: row.payload.orderEntries?.map((entry) => `${entry.name} | ${entry.value} | ${entry.image}`).join('\n') ?? '',
    base: row.payload,
  }
}

function buildQuestion(form: FormState): Question {
  const choices = splitLines(form.choices)
  const answers = splitLines(form.answers)
  const orderEntries = splitLines(form.orderEntries).map((line, index) => {
    const [name = '', rawValue = '', image = ''] = line.split('|').map((item) => item.trim())
    return { id: index + 1, name, value: Number(rawValue), image }
  }).filter((entry) => entry.name && Number.isFinite(entry.value) && entry.image)
  const sources = splitLines(form.sources).map((line) => {
    const [label = '', url = ''] = line.split('|').map((item) => item.trim())
    return { label, url }
  }).filter((source) => source.label && /^https?:\/\//.test(source.url))
  return {
    ...form.base,
    id: form.id,
    type: form.type,
    category: form.category,
    difficulty: form.difficulty,
    prompt: form.prompt.trim(),
    choices: form.type === 'multiple-choice' || form.type === 'multiple-select' ? choices : undefined,
    acceptedAnswers: answers,
    correctChoices: form.type === 'multiple-select' ? answers : undefined,
    explanation: form.explanation.trim(),
    points: form.points,
    durationSeconds: form.durationSeconds,
    media: form.mediaSrc ? {
      kind: 'image',
      src: form.mediaSrc.trim(),
      shinySrc: form.shinySrc.trim() || undefined,
      alt: form.mediaAlt.trim() || 'Illustration de la question',
      pixelated: form.category === 'Sprites',
      spriteVariant: form.spriteVariant,
    } : undefined,
    mapTarget: form.type === 'map-location' ? { x: form.mapX, y: form.mapY } : undefined,
    mapRegion: form.type === 'map-location' ? form.mapRegion : undefined,
    orderEntries: form.type === 'stat-order' ? orderEntries : undefined,
    orderDirection: form.type === 'stat-order' ? form.orderDirection : undefined,
    statLabel: form.type === 'stat-order' ? form.statLabel.trim() : undefined,
    validation: {
      ...form.base?.validation,
      status: form.validationStatus === 'validated' ? 'validated' : 'review',
      sources,
    },
  }
}

export function QuestionEditor({ user, onQuestionsChanged }: Props) {
  const [rows, setRows] = useState<StoredQuestion[]>([])
  const [form, setForm] = useState<FormState | null>(null)
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<PublicationStatus | 'all'>('all')
  const [category, setCategory] = useState('all')
  const [editorialStatus, setEditorialStatus] = useState<EditorialStatus | 'all'>('all')
  const [qualityFilter, setQualityFilter] = useState<'unsourced' | 'duplicates' | null>(null)
  const [view, setView] = useState<'dashboard' | 'analytics' | 'bank'>('dashboard')
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)
  const [migrationProgress, setMigrationProgress] = useState<number | null>(null)
  const [historyRow, setHistoryRow] = useState<StoredQuestion | null>(null)
  const [revisions, setRevisions] = useState<QuestionRevision[]>([])

  const refresh = async () => {
    try {
      setRows(await loadAdminQuestions())
    } catch {
      setMessage('Impossible de charger la banque partagée.')
    }
  }

  useEffect(() => {
    void refresh()
  }, [])

  const availableCategories = useMemo(
    () => [...new Set(rows.map((row) => row.payload.category))].sort((left, right) => left.localeCompare(right, 'fr')),
    [rows],
  )
  const duplicateFingerprints = useMemo(() => {
    const counts = new Map<string, number>()
    rows.filter((row) => row.publicationStatus !== 'archived').forEach((row) => {
      const fingerprint = questionFingerprint(row.payload)
      counts.set(fingerprint, (counts.get(fingerprint) ?? 0) + 1)
    })
    return new Set([...counts].filter(([, count]) => count > 1).map(([fingerprint]) => fingerprint))
  }, [rows])

  const filtered = useMemo(() => rows.filter((row) => {
    const text = `${row.id} ${row.payload.prompt} ${row.payload.category}`.toLocaleLowerCase('fr')
    return (status === 'all' || row.publicationStatus === status)
      && (category === 'all' || row.payload.category === category)
      && (editorialStatus === 'all' || row.validationStatus === editorialStatus)
      && (qualityFilter !== 'unsourced' || (row.payload.validation?.sources.length ?? 0) === 0)
      && (qualityFilter !== 'duplicates' || duplicateFingerprints.has(questionFingerprint(row.payload)))
      && text.includes(query.toLocaleLowerCase('fr'))
  }), [category, duplicateFingerprints, editorialStatus, qualityFilter, query, rows, status])
  const visibleRows = filtered.slice(0, 100)

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    if (!form) return
    const question = buildQuestion(form)
    const answers = question.acceptedAnswers
    if (!question.prompt || !question.explanation || answers.length === 0) {
      setMessage('La question, la réponse et l’explication sont obligatoires.')
      return
    }
    const fingerprint = questionFingerprint(question)
    const duplicate = [
      ...bundledQuestions,
      ...rows.map((row) => row.payload),
    ].find((candidate) => candidate.id !== question.id && questionFingerprint(candidate) === fingerprint)
    if (duplicate) {
      setMessage(`Doublon détecté : cette question existe déjà sous l’identifiant ${duplicate.id}.`)
      return
    }
    const isChoiceQuestion = question.type === 'multiple-choice' || question.type === 'multiple-select'
    if (isChoiceQuestion && (question.choices?.length ?? 0) < 2) {
      setMessage('Un QCM doit contenir au moins deux propositions.')
      return
    }
    if (isChoiceQuestion && answers.some((answer) => !question.choices?.includes(answer))) {
      setMessage('Chaque bonne réponse doit être présente exactement dans les propositions.')
      return
    }
    if (question.type === 'stat-order' && question.orderEntries?.length !== 5) {
      setMessage('Stats en ordre nécessite exactement cinq Pokémon valides.')
      return
    }
    if (form.validationStatus === 'validated' && (question.validation?.sources.length ?? 0) === 0) {
      setMessage('Une question validée doit contenir au moins une source au format Nom | https://adresse.')
      return
    }
    if (form.status === 'published' && form.validationStatus !== 'validated') {
      setMessage('Une question doit être validée avant de pouvoir être publiée.')
      return
    }

    setBusy(true)
    setMessage('')
    try {
      await saveAdminQuestion(question, form.status, form.validationStatus, user)
      setMessage('Question enregistrée.')
      setForm(null)
      await refresh()
      onQuestionsChanged()
    } catch {
      setMessage('Enregistrement refusé par la base.')
    } finally {
      setBusy(false)
    }
  }

  const archive = async (row: StoredQuestion) => {
    const nextStatus: PublicationStatus = row.publicationStatus === 'archived' ? 'draft' : 'archived'
    try {
      await saveAdminQuestion(row.payload, nextStatus, row.validationStatus, user)
      await refresh()
      onQuestionsChanged()
    } catch {
      setMessage('Changement d’état impossible.')
    }
  }

  const openHistory = async (row: StoredQuestion) => {
    setHistoryRow(row)
    setRevisions([])
    try {
      setRevisions(await loadQuestionRevisions(row.id))
    } catch {
      setMessage('Historique indisponible.')
    }
  }

  const restoreRevision = async (revision: QuestionRevision) => {
    if (!window.confirm('Restaurer cette ancienne version ? La version actuelle restera dans l’historique.')) return
    try {
      await restoreQuestionRevision(revision.revisionId)
      setHistoryRow(null)
      await refresh()
      onQuestionsChanged()
      setMessage('Ancienne version restaurée.')
    } catch {
      setMessage('La restauration a été refusée.')
    }
  }

  const migrateBundledBank = async () => {
    if (!window.confirm(`Importer les questions absentes parmi les ${bundledQuestions.length} questions de la banque locale ?`)) return
    setBusy(true)
    setMigrationProgress(0)
    setMessage('Import en cours… garde cette page ouverte.')
    try {
      await importQuestions(bundledQuestions, user, (completed, total) => {
        setMigrationProgress(Math.round((completed / total) * 100))
      })
      await refresh()
      onQuestionsChanged()
      setMessage('Import terminé. Les questions déjà présentes et leurs modifications ont été préservées.')
    } catch {
      setMessage('L’import a été interrompu. Tu peux le relancer sans créer de doublons.')
    } finally {
      setBusy(false)
      setMigrationProgress(null)
    }
  }

  const openBank = (filters: {
    category?: string
    publicationStatus?: PublicationStatus
    editorialStatus?: EditorialStatus
    query?: string
    quality?: 'unsourced' | 'duplicates'
  } = {}) => {
    setCategory(filters.category ?? 'all')
    setStatus(filters.publicationStatus ?? 'all')
    setEditorialStatus(filters.editorialStatus ?? 'all')
    setQuery(filters.query ?? '')
    setQualityFilter(filters.quality ?? null)
    setView('bank')
  }

  if (form) {
    const preview = buildQuestion(form)
    return (
      <section className="question-editor">
        <header>
          <div><span className="eyebrow">ÉDITEUR</span><h2>{rows.some(({ id }) => id === form.id) ? 'Modifier la question' : 'Nouvelle question'}</h2></div>
          <button onClick={() => setForm(null)}>Annuler</button>
        </header>
        <form className="question-form" onSubmit={submit}>
          <label>Type
            <select value={form.type} onChange={(event) => setForm({ ...form, type: event.target.value as FormState['type'] })}>
              <option value="multiple-choice">QCM — une réponse</option>
              <option value="multiple-select">QCM — plusieurs réponses</option>
              <option value="open">Question ouverte</option>
              <option value="stat-order">Stats en ordre</option>
              <option value="map-location">Lieu Perdu</option>
            </select>
          </label>
          <label>Catégorie
            <select value={form.category} onChange={(event) => {
              const category = event.target.value
              const type = category === 'Stats en Ordre'
                ? 'stat-order'
                : category === 'Lieu Perdu'
                  ? 'map-location'
                  : form.type
              setForm({ ...form, category, type })
            }}>
              {categories.map((category) => <option key={category.id}>{category.id}</option>)}
            </select>
          </label>
          <label>Difficulté
            <select value={form.difficulty} onChange={(event) => setForm({ ...form, difficulty: Number(event.target.value) as Question['difficulty'] })}>
              {[1, 2, 3, 4, 5].map((value) => <option key={value} value={value}>{'★'.repeat(value)}</option>)}
            </select>
          </label>
          <label>État
            <select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value as PublicationStatus })}>
              <option value="draft">Brouillon</option>
              <option value="published">Publiée</option>
              <option value="archived">Archivée</option>
            </select>
          </label>
          <label>Validation éditoriale
            <select value={form.validationStatus} onChange={(event) => setForm({ ...form, validationStatus: event.target.value as EditorialStatus })}>
              <option value="review">À vérifier</option>
              <option value="validated">Validée</option>
              <option value="contested">Contestée</option>
            </select>
          </label>
          <label className="wide">Question
            <textarea value={form.prompt} onChange={(event) => setForm({ ...form, prompt: event.target.value })} rows={3} />
          </label>
          {(form.type === 'multiple-choice' || form.type === 'multiple-select') && (
            <label className="wide">Propositions — une par ligne
              <textarea value={form.choices} onChange={(event) => setForm({ ...form, choices: event.target.value })} rows={5} />
            </label>
          )}
          <label className="wide">{form.type === 'multiple-select' ? 'Bonnes réponses — une par ligne' : 'Réponses acceptées — une par ligne'}
            <textarea value={form.answers} onChange={(event) => setForm({ ...form, answers: event.target.value })} rows={3} />
          </label>
          {(form.category === 'Sprites' || form.type === 'map-location') && (
            <>
              <label className="wide">Adresse de l’image ou du sprite
                <input value={form.mediaSrc} onChange={(event) => setForm({ ...form, mediaSrc: event.target.value })} placeholder="https://… ou /assets/…" />
              </label>
              <label className="wide">Description accessible de l’image
                <input value={form.mediaAlt} onChange={(event) => setForm({ ...form, mediaAlt: event.target.value })} />
              </label>
            </>
          )}
          {form.category === 'Sprites' && (
            <>
              <label>Variante visuelle
                <select value={form.spriteVariant} onChange={(event) => setForm({ ...form, spriteVariant: event.target.value as FormState['spriteVariant'] })}>
                  <option value="normal">Normal</option>
                  <option value="silhouette">Silhouette</option>
                  <option value="progressive">Révélation progressive</option>
                  <option value="shiny">Chromatique</option>
                  <option value="zoom">Fragment</option>
                  <option value="flipped">Retourné</option>
                </select>
              </label>
              <label>Sprite chromatique facultatif
                <input value={form.shinySrc} onChange={(event) => setForm({ ...form, shinySrc: event.target.value })} placeholder="https://…" />
              </label>
            </>
          )}
          {form.type === 'map-location' && (
            <>
              <label>Région
                <select value={form.mapRegion} onChange={(event) => setForm({ ...form, mapRegion: event.target.value })}>
                  <option>Paldea</option>
                  <option>Sinnoh</option>
                </select>
              </label>
              <label>Position horizontale X (%)
                <input type="number" min="0" max="100" step=".1" value={form.mapX} onChange={(event) => setForm({ ...form, mapX: Number(event.target.value) })} />
              </label>
              <label>Position verticale Y (%)
                <input type="number" min="0" max="100" step=".1" value={form.mapY} onChange={(event) => setForm({ ...form, mapY: Number(event.target.value) })} />
              </label>
              <div className="wide">
                <MapTargetPicker
                  region={form.mapRegion}
                  x={form.mapX}
                  y={form.mapY}
                  onChange={(point) => setForm({ ...form, mapX: point.x, mapY: point.y })}
                />
              </div>
            </>
          )}
          {form.type === 'stat-order' && (
            <>
              <label>Statistique
                <select value={form.statLabel} onChange={(event) => setForm({ ...form, statLabel: event.target.value, orderEntries: '' })}>
                  {championStatLabels.map((label) => <option key={label}>{label}</option>)}
                </select>
              </label>
              <label>Ordre
                <select value={form.orderDirection} onChange={(event) => setForm({ ...form, orderDirection: event.target.value as FormState['orderDirection'] })}>
                  <option value="ascending">Croissant</option>
                  <option value="descending">Décroissant</option>
                </select>
              </label>
              <div className="wide">
                <PokemonStatPicker
                  statLabel={form.statLabel}
                  orderDirection={form.orderDirection}
                  value={form.orderEntries}
                  onChange={(orderEntries) => setForm({ ...form, orderEntries })}
                />
              </div>
              <label className="wide">Cinq Pokémon — Nom | Valeur | URL de l’image
                <textarea value={form.orderEntries} onChange={(event) => setForm({ ...form, orderEntries: event.target.value })} rows={7} placeholder={'Pikachu | 90 | https://…\nRaichu | 110 | https://…'} />
              </label>
            </>
          )}
          <label className="wide">Explication
            <textarea value={form.explanation} onChange={(event) => setForm({ ...form, explanation: event.target.value })} rows={4} />
          </label>
          <label className="wide">Sources — Nom | URL, une par ligne
            <textarea value={form.sources} onChange={(event) => setForm({ ...form, sources: event.target.value })} rows={4} placeholder={'Pokédex officiel | https://www.pokemon.com/…'} />
          </label>
          <label>Points
            <input type="number" min="1" max="100" value={form.points} onChange={(event) => setForm({ ...form, points: Number(event.target.value) })} />
          </label>
          <label>Durée conseillée
            <input type="number" min="5" max="180" value={form.durationSeconds} onChange={(event) => setForm({ ...form, durationSeconds: Number(event.target.value) })} />
          </label>
          <div className="question-preview wide">
            <small>Aperçu</small>
            <span>{preview.category} · {'★'.repeat(preview.difficulty)}</span>
            <strong>{preview.prompt || 'Ta question apparaîtra ici'}</strong>
            {preview.media?.src && <img src={preview.media.src} alt={preview.media.alt} />}
            {preview.choices?.length ? <div>{preview.choices.map((choice) => <i key={choice}>{choice}</i>)}</div> : null}
            {preview.orderEntries?.length ? <div>{preview.orderEntries.map((entry) => <i key={`${entry.name}-${entry.value}`}>{entry.name} · {entry.value}</i>)}</div> : null}
          </div>
          <button className="primary wide" disabled={busy}>{busy ? 'Enregistrement…' : 'Enregistrer la question'}</button>
        </form>
        {message && <p className="admin-message">{message}</p>}
      </section>
    )
  }

  if (view === 'dashboard') {
    return (
      <section className="question-bank">
        <div className="admin-view-tabs">
          <button className="selected">Tableau de bord</button>
          <button onClick={() => setView('analytics')}>Parties & statistiques</button>
          <button onClick={() => openBank()}>Banque de questions</button>
        </div>
        {message && <p className="admin-message">{message}</p>}
        <QualityDashboard rows={rows} onOpenBank={openBank} />
      </section>
    )
  }

  if (view === 'analytics') {
    return (
      <section className="question-bank">
        <div className="admin-view-tabs">
          <button onClick={() => setView('dashboard')}>Tableau de bord</button>
          <button className="selected">Parties & statistiques</button>
          <button onClick={() => openBank()}>Banque de questions</button>
        </div>
        <GameAnalyticsDashboard onOpenQuestion={(questionId) => openBank({ query: questionId })} />
      </section>
    )
  }

  return (
    <section className="question-bank">
      <div className="admin-view-tabs">
        <button onClick={() => setView('dashboard')}>Tableau de bord</button>
        <button onClick={() => setView('analytics')}>Parties & statistiques</button>
        <button className="selected">Banque de questions</button>
      </div>
      <header>
        <div><span className="eyebrow">BANQUE PARTAGÉE</span><h2>Banque de questions</h2><p>{rows.length} question{rows.length > 1 ? 's' : ''} dans Supabase</p></div>
        <div className="bank-header-actions">
          <button disabled={busy} onClick={() => void migrateBundledBank()}>Synchroniser la banque actuelle</button>
          <button className="primary" onClick={() => { setMessage(''); setForm(emptyForm()) }}>+ Nouvelle question</button>
        </div>
      </header>
      <div className="question-bank-tools">
        <input type="search" placeholder="Rechercher une question…" value={query} onChange={(event) => setQuery(event.target.value)} />
        <select value={category} onChange={(event) => setCategory(event.target.value)}>
          <option value="all">Toutes les catégories</option>
          {availableCategories.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
        <select value={status} onChange={(event) => setStatus(event.target.value as PublicationStatus | 'all')}>
          <option value="all">Tous les états</option>
          <option value="draft">Brouillons</option>
          <option value="published">Publiées</option>
          <option value="archived">Archivées</option>
        </select>
        <select value={editorialStatus} onChange={(event) => setEditorialStatus(event.target.value as EditorialStatus | 'all')}>
          <option value="all">Toutes les validations</option>
          <option value="review">À vérifier</option>
          <option value="validated">Validées</option>
          <option value="contested">Contestées</option>
        </select>
      </div>
      {qualityFilter && (
        <button className="active-quality-filter" onClick={() => setQualityFilter(null)}>
          Filtre qualité : {qualityFilter === 'unsourced' ? 'sans source' : 'doublons'} ×
        </button>
      )}
      {message && <p className="admin-message">{message}</p>}
      {migrationProgress !== null && <div className="migration-progress"><i style={{ width: `${migrationProgress}%` }} /><span>{migrationProgress}%</span></div>}
      <div className="question-bank-list">
        {filtered.length === 0 && <p>Aucune question ne correspond à cette sélection.</p>}
        {filtered.length > visibleRows.length && <p className="bank-result-limit">Les 100 premiers résultats sont affichés. Utilise la recherche pour affiner la liste.</p>}
        {visibleRows.map((row) => (
          <article key={row.id}>
            <div>
              <span className={`publication-status ${row.publicationStatus}`}>{row.publicationStatus === 'draft' ? 'Brouillon' : row.publicationStatus === 'published' ? 'Publiée' : 'Archivée'}</span>
              <span className={`editorial-status ${row.validationStatus}`}>{row.validationStatus === 'review' ? 'À vérifier' : row.validationStatus === 'validated' ? 'Validée' : 'Contestée'}</span>
              <small>{row.payload.category} · {'★'.repeat(row.payload.difficulty)}</small>
              <strong>{row.payload.prompt}</strong>
            </div>
            <div className="bank-actions">
              <button onClick={() => setForm(toForm(row))}>Modifier</button>
              <button onClick={() => void openHistory(row)}>Historique</button>
              <button className={row.publicationStatus === 'archived' ? '' : 'danger-action'} onClick={() => void archive(row)}>
                {row.publicationStatus === 'archived' ? 'Remettre en brouillon' : 'Archiver'}
              </button>
            </div>
          </article>
        ))}
      </div>
      {historyRow && (
        <div className="history-overlay" role="dialog" aria-modal="true" aria-label="Historique de la question">
          <section className="history-panel">
            <header><div><span className="eyebrow">HISTORIQUE</span><h3>{historyRow.payload.prompt}</h3></div><button onClick={() => setHistoryRow(null)}>Fermer</button></header>
            {revisions.length === 0 && <p>Aucune ancienne version pour cette question.</p>}
            <div className="revision-list">
              {revisions.map((revision) => (
                <article key={revision.revisionId}>
                  <div>
                    <strong>{new Intl.DateTimeFormat('fr-FR', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(revision.changedAt))}</strong>
                    <small>{revision.operation === 'delete' ? 'Avant suppression' : 'Avant modification'} · {revision.publicationStatus} · {revision.validationStatus}</small>
                    <p>{revision.payload.prompt}</p>
                  </div>
                  <button onClick={() => void restoreRevision(revision)}>Restaurer</button>
                </article>
              ))}
            </div>
          </section>
        </div>
      )}
    </section>
  )
}
