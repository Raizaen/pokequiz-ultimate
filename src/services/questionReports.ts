import { supabase } from '../lib/supabase'

export type ReportReason = 'incorrect' | 'ambiguous' | 'media' | 'translation' | 'other'

export interface QuestionReport {
  reportId: number
  sessionId: string | null
  questionId: string
  questionPrompt: string
  category: string
  reason: ReportReason
  details: string
  reporterNames: string
  status: 'open' | 'resolved'
  createdAt: string
}

export async function reportQuestion(input: {
  sessionId?: string
  questionId: string
  questionPrompt: string
  category: string
  reason: ReportReason
  details: string
  reporterNames: string
}): Promise<void> {
  if (!supabase) throw new Error('Supabase n’est pas configuré.')
  const { error } = await supabase.from('question_reports').insert({
    session_id: input.sessionId ?? null,
    question_id: input.questionId,
    question_prompt: input.questionPrompt,
    category: input.category,
    reason: input.reason,
    details: input.details.trim(),
    reporter_names: input.reporterNames,
  })
  if (error) throw error
}

export async function loadQuestionReports(): Promise<QuestionReport[]> {
  if (!supabase) return []
  const { data, error } = await supabase
    .from('question_reports')
    .select('report_id,session_id,question_id,question_prompt,category,reason,details,reporter_names,status,created_at')
    .order('created_at', { ascending: false })
    .limit(300)
  if (error) throw error
  return data.map((row) => ({
    reportId: row.report_id,
    sessionId: row.session_id,
    questionId: row.question_id,
    questionPrompt: row.question_prompt,
    category: row.category,
    reason: row.reason as ReportReason,
    details: row.details,
    reporterNames: row.reporter_names,
    status: row.status as QuestionReport['status'],
    createdAt: row.created_at,
  }))
}

export async function setQuestionReportResolved(reportId: number, resolved: boolean): Promise<void> {
  if (!supabase) throw new Error('Supabase n’est pas configuré.')
  const { error } = await supabase.rpc('resolve_question_report', {
    target_report_id: reportId,
    should_resolve: resolved,
  })
  if (error) throw error
}
