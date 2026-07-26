import { useEffect, useMemo, useState, type FormEvent } from 'react'
import type { User } from '@supabase/supabase-js'
import { categories } from '../domain/gameConfig'
import type { Question, QuestionType } from '../domain/quiz'
import { questions as bundledQuestions } from '../data/questions'
import {
  deleteAdminQuestion,
  importQuestions,
  loadAdminQuestions,
  saveAdminQuestion,
  type PublicationStatus,
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
    validation: form.base?.validation ?? {
      status: 'draft',
      sources: [],
    },
  }
}

export function QuestionEditor({ user, onQuestionsChanged }: Props) {
  const [rows, setRows] = useState<StoredQuestion[]>([])
  const [form, setForm] = useState<FormState | null>(null)
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<PublicationStatus | 'all'>('all')
  const [category, setCategory] = useState('all')
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)
  const [migrationProgress, setMigrationProgress] = useState<number | null>(null)

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

  const filtered = useMemo(() => rows.filter((row) => {
    const text = `${row.payload.prompt} ${row.payload.category}`.toLocaleLowerCase('fr')
    return (status === 'all' || row.publicationStatus === status)
      && (category === 'all' || row.payload.category === category)
      && text.includes(query.toLocaleLowerCase('fr'))
  }), [category, query, rows, status])
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

    setBusy(true)
    setMessage('')
    try {
      await saveAdminQuestion(question, form.status, user)
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

  const remove = async (row: StoredQuestion) => {
    if (!window.confirm(`Supprimer définitivement « ${row.payload.prompt} » ?`)) return
    try {
      await deleteAdminQuestion(row.id)
      await refresh()
      onQuestionsChanged()
    } catch {
      setMessage('Suppression impossible.')
    }
  }

  const migrateBundledBank = async () => {
    if (!window.confirm(`Importer ou actualiser ${bundledQuestions.length} questions dans la banque partagée ?`)) return
    setBusy(true)
    setMigrationProgress(0)
    setMessage('Import en cours… garde cette page ouverte.')
    try {
      await importQuestions(bundledQuestions, user, (completed, total) => {
        setMigrationProgress(Math.round((completed / total) * 100))
      })
      await refresh()
      onQuestionsChanged()
      setMessage(`${bundledQuestions.length} questions ont été synchronisées avec Supabase.`)
    } catch {
      setMessage('L’import a été interrompu. Tu peux le relancer sans créer de doublons.')
    } finally {
      setBusy(false)
      setMigrationProgress(null)
    }
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
              <div className="map-coordinate-preview">
                <span style={{ left: `${form.mapX}%`, top: `${form.mapY}%` }} />
                <small>Aperçu de la position</small>
              </div>
            </>
          )}
          {form.type === 'stat-order' && (
            <>
              <label>Statistique
                <input value={form.statLabel} onChange={(event) => setForm({ ...form, statLabel: event.target.value })} />
              </label>
              <label>Ordre
                <select value={form.orderDirection} onChange={(event) => setForm({ ...form, orderDirection: event.target.value as FormState['orderDirection'] })}>
                  <option value="ascending">Croissant</option>
                  <option value="descending">Décroissant</option>
                </select>
              </label>
              <label className="wide">Cinq Pokémon — Nom | Valeur | URL de l’image
                <textarea value={form.orderEntries} onChange={(event) => setForm({ ...form, orderEntries: event.target.value })} rows={7} placeholder={'Pikachu | 90 | https://…\nRaichu | 110 | https://…'} />
              </label>
            </>
          )}
          <label className="wide">Explication
            <textarea value={form.explanation} onChange={(event) => setForm({ ...form, explanation: event.target.value })} rows={4} />
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

  return (
    <section className="question-bank">
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
      </div>
      {message && <p className="admin-message">{message}</p>}
      {migrationProgress !== null && <div className="migration-progress"><i style={{ width: `${migrationProgress}%` }} /><span>{migrationProgress}%</span></div>}
      <div className="question-bank-list">
        {filtered.length === 0 && <p>Aucune question ne correspond à cette sélection.</p>}
        {filtered.length > visibleRows.length && <p className="bank-result-limit">Les 100 premiers résultats sont affichés. Utilise la recherche pour affiner la liste.</p>}
        {visibleRows.map((row) => (
          <article key={row.id}>
            <div>
              <span className={`publication-status ${row.publicationStatus}`}>{row.publicationStatus === 'draft' ? 'Brouillon' : row.publicationStatus === 'published' ? 'Publiée' : 'Archivée'}</span>
              <small>{row.payload.category} · {'★'.repeat(row.payload.difficulty)}</small>
              <strong>{row.payload.prompt}</strong>
            </div>
            <div className="bank-actions">
              <button onClick={() => setForm(toForm(row))}>Modifier</button>
              <button className="danger-action" onClick={() => void remove(row)}>Supprimer</button>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
