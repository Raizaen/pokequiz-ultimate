import type { User } from '@supabase/supabase-js'
import type { Question } from '../domain/quiz'
import { supabase } from '../lib/supabase'

export type PublicationStatus = 'draft' | 'published' | 'archived'

export interface StoredQuestion {
  id: string
  payload: Question
  publicationStatus: PublicationStatus
  updatedAt: string
}

interface QuestionRow {
  id: string
  payload: Question
  publication_status: PublicationStatus
  updated_at: string
}

function mapRow(row: QuestionRow): StoredQuestion {
  return {
    id: row.id,
    payload: row.payload,
    publicationStatus: row.publication_status,
    updatedAt: row.updated_at,
  }
}

export async function loadPublishedQuestions(): Promise<Question[]> {
  if (!supabase) return []
  const { data, error } = await supabase
    .from('questions')
    .select('id,payload,publication_status,updated_at')
    .eq('publication_status', 'published')

  if (error) throw error
  return (data as QuestionRow[]).map((row) => row.payload)
}

export async function loadAdminQuestions(): Promise<StoredQuestion[]> {
  if (!supabase) return []
  const { data, error } = await supabase
    .from('questions')
    .select('id,payload,publication_status,updated_at')
    .order('updated_at', { ascending: false })

  if (error) throw error
  return (data as QuestionRow[]).map(mapRow)
}

export async function saveAdminQuestion(
  question: Question,
  publicationStatus: PublicationStatus,
  user: User,
): Promise<void> {
  if (!supabase) throw new Error('Supabase n’est pas configuré.')
  const now = new Date().toISOString()
  const { error } = await supabase.from('questions').upsert({
    id: question.id,
    payload: question,
    publication_status: publicationStatus,
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
