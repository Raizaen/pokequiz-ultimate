import { useEffect, useMemo, useState, type FormEvent } from 'react'
import type { User } from '@supabase/supabase-js'
import { categories } from '../domain/gameConfig'
import type { Question, QuestionType } from '../domain/quiz'
import {
  deleteAdminQuestion,
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
  type: Extract<QuestionType, 'multiple-choice' | 'multiple-select' | 'open'>
  category: string
  difficulty: Question['difficulty']
  prompt: string
  choices: string
  answers: string
  explanation: string
  points: number
  durationSeconds: number
  status: PublicationStatus
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
  }
}

function buildQuestion(form: FormState): Question {
  const choices = splitLines(form.choices)
  const answers = splitLines(form.answers)
  return {
    id: form.id,
    type: form.type,
    category: form.category,
    difficulty: form.difficulty,
    prompt: form.prompt.trim(),
    choices: form.type === 'open' ? undefined : choices,
    acceptedAnswers: answers,
    correctChoices: form.type === 'multiple-select' ? answers : undefined,
    explanation: form.explanation.trim(),
    points: form.points,
    durationSeconds: form.durationSeconds,
    validation: {
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
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)

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

  const filtered = useMemo(() => rows.filter((row) => {
    const text = `${row.payload.prompt} ${row.payload.category}`.toLocaleLowerCase('fr')
    return (status === 'all' || row.publicationStatus === status)
      && text.includes(query.toLocaleLowerCase('fr'))
  }), [query, rows, status])

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    if (!form) return
    const question = buildQuestion(form)
    const answers = question.acceptedAnswers
    if (!question.prompt || !question.explanation || answers.length === 0) {
      setMessage('La question, la réponse et l’explication sont obligatoires.')
      return
    }
    if (question.type !== 'open' && (question.choices?.length ?? 0) < 2) {
      setMessage('Un QCM doit contenir au moins deux propositions.')
      return
    }
    if (question.type !== 'open' && answers.some((answer) => !question.choices?.includes(answer))) {
      setMessage('Chaque bonne réponse doit être présente exactement dans les propositions.')
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
            </select>
          </label>
          <label>Catégorie
            <select value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })}>
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
          {form.type !== 'open' && (
            <label className="wide">Propositions — une par ligne
              <textarea value={form.choices} onChange={(event) => setForm({ ...form, choices: event.target.value })} rows={5} />
            </label>
          )}
          <label className="wide">{form.type === 'multiple-select' ? 'Bonnes réponses — une par ligne' : 'Réponses acceptées — une par ligne'}
            <textarea value={form.answers} onChange={(event) => setForm({ ...form, answers: event.target.value })} rows={3} />
          </label>
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
            {preview.choices?.length ? <div>{preview.choices.map((choice) => <i key={choice}>{choice}</i>)}</div> : null}
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
        <div><span className="eyebrow">BANQUE PARTAGÉE</span><h2>Questions personnalisées</h2><p>{rows.length} question{rows.length > 1 ? 's' : ''} dans Supabase</p></div>
        <button className="primary" onClick={() => { setMessage(''); setForm(emptyForm()) }}>+ Nouvelle question</button>
      </header>
      <div className="question-bank-tools">
        <input type="search" placeholder="Rechercher une question…" value={query} onChange={(event) => setQuery(event.target.value)} />
        <select value={status} onChange={(event) => setStatus(event.target.value as PublicationStatus | 'all')}>
          <option value="all">Tous les états</option>
          <option value="draft">Brouillons</option>
          <option value="published">Publiées</option>
          <option value="archived">Archivées</option>
        </select>
      </div>
      {message && <p className="admin-message">{message}</p>}
      <div className="question-bank-list">
        {filtered.length === 0 && <p>Aucune question ne correspond à cette sélection.</p>}
        {filtered.map((row) => (
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
