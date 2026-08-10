import type { User } from '@supabase/supabase-js'
import type { Question } from '../domain/quiz'
import { supabase } from '../lib/supabase'
import { localizePokemonNamesInQuestion } from '../utils/pokemonNameLocalization'

export type PublicationStatus = 'draft' | 'published' | 'archived'
export type EditorialStatus = 'review' | 'validated' | 'contested'

export interface StoredQuestion {
  id: string
  payload: Question
  publicationStatus: PublicationStatus
  validationStatus: EditorialStatus
  updatedAt: string
}

interface QuestionRow {
  id: string
  payload: Question
  publication_status: PublicationStatus
  validation_status: EditorialStatus
  updated_at: string
}

export interface QuestionRevision {
  revisionId: number
  questionId: string
  payload: Question
  publicationStatus: PublicationStatus
  validationStatus: EditorialStatus
  operation: 'update' | 'delete'
  changedAt: string
}

function mapRow(row: QuestionRow): StoredQuestion {
  return {
    id: row.id,
    payload: localizePokemonNamesInQuestion(row.payload),
    publicationStatus: row.publication_status,
    validationStatus: row.validation_status,
    updatedAt: row.updated_at,
  }
}

export async function loadPublishedQuestions(): Promise<Question[]> {
  if (!supabase) return []
  const rows: QuestionRow[] = []
  const pageSize = 1000
  for (let from = 0; ; from += pageSize) {
    const { data, error } = await supabase
      .from('questions')
      .select('id,payload,publication_status,validation_status,updated_at')
      .eq('publication_status', 'published')
      .range(from, from + pageSize - 1)
    if (error) throw error
    const page = data as QuestionRow[]
    rows.push(...page)
    if (page.length < pageSize) break
  }
  const { withContextualPokemonMedia } = await import('../utils/questionPokemonMedia')
  return rows.map((row) => withContextualPokemonMedia(localizePokemonNamesInQuestion(row.payload)))
}

export async function loadAdminQuestions(): Promise<StoredQuestion[]> {
  if (!supabase) return []
  const rows: QuestionRow[] = []
  const pageSize = 1000
  for (let from = 0; ; from += pageSize) {
    const { data, error } = await supabase
      .from('questions')
      .select('id,payload,publication_status,validation_status,updated_at')
      .order('updated_at', { ascending: false })
      .range(from, from + pageSize - 1)
    if (error) throw error
    const page = data as QuestionRow[]
    rows.push(...page)
    if (page.length < pageSize) break
  }
  return rows.map(mapRow)
}

export async function saveAdminQuestion(
  question: Question,
  publicationStatus: PublicationStatus,
  validationStatus: EditorialStatus,
  user: User,
): Promise<void> {
  if (!supabase) throw new Error('Supabase n’est pas configuré.')
  const now = new Date().toISOString()
  const { error } = await supabase.from('questions').upsert({
    id: question.id,
    payload: question,
    publication_status: publicationStatus,
    validation_status: validationStatus,
    updated_at: now,
    updated_by: user.id,
    created_by: user.id,
  }, { onConflict: 'id' })
  if (error) throw error
}

export async function deleteAdminQuestion(id: string): Promise<void> {
  if (!supabase) throw new Error('Supabase n’est pas configuré.')
  const { error } = await supabase.from('questions').delete().eq('id', id)
  if (error) throw error
}

export async function loadQuestionRevisions(questionId: string): Promise<QuestionRevision[]> {
  if (!supabase) return []
  const { data, error } = await supabase
    .from('question_revisions')
    .select('revision_id,question_id,payload,publication_status,validation_status,operation,changed_at')
    .eq('question_id', questionId)
    .order('changed_at', { ascending: false })
  if (error) throw error
  return data.map((row) => ({
    revisionId: row.revision_id,
    questionId: row.question_id,
    payload: row.payload as Question,
    publicationStatus: row.publication_status as PublicationStatus,
    validationStatus: row.validation_status as EditorialStatus,
    operation: row.operation as QuestionRevision['operation'],
    changedAt: row.changed_at,
  }))
}

export async function restoreQuestionRevision(revisionId: number): Promise<void> {
  if (!supabase) throw new Error('Supabase n’est pas configuré.')
  const { error } = await supabase.rpc('restore_question_revision', {
    target_revision_id: revisionId,
  })
  if (error) throw error
}

export async function importQuestions(
  questions: Question[],
  user: User,
  onProgress?: (completed: number, total: number) => void,
): Promise<void> {
  if (!supabase) throw new Error('Supabase n’est pas configuré.')
  const batchSize = 100
  const now = new Date().toISOString()

  for (let index = 0; index < questions.length; index += batchSize) {
    const batch = questions.slice(index, index + batchSize).map((question) => {
      const hasSources = (question.validation?.sources.length ?? 0) > 0
      const isValidated = question.validation?.status === 'validated' && hasSources
      return {
        id: question.id,
        payload: question,
        publication_status: isValidated ? 'published' as const : 'draft' as const,
        validation_status: isValidated ? 'validated' as const : 'review' as const,
        updated_at: now,
        updated_by: user.id,
        created_by: user.id,
      }
    })
    const { error } = await supabase.from('questions').upsert(batch, {
      onConflict: 'id',
      ignoreDuplicates: true,
    })
    if (error) throw error
    onProgress?.(Math.min(index + batchSize, questions.length), questions.length)
  }
}
