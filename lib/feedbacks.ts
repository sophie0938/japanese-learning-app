import { supabase } from '@/lib/supabase'
import type { AiFeedback } from '@/types/feedback'
import type { HistoryRecord } from '@/types/history'

interface AiFeedbackRow {
  id: string
  sentence_id: string
  corrected_text: string
  reason: string
  created_at: string
  saved: boolean
}

function mapAiFeedback(row: AiFeedbackRow): AiFeedback {
  return {
    id: row.id,
    sentenceId: row.sentence_id,
    correctedText: row.corrected_text,
    reason: row.reason,
    createdAt: row.created_at,
    saved: row.saved
  }
}

export async function createFeedback(input: {
  sentenceId: string
  correctedText: string
  reason: string
}): Promise<AiFeedback> {
  const { data, error } = await supabase
    .from('ai_feedbacks')
    .insert({
      sentence_id: input.sentenceId,
      corrected_text: input.correctedText,
      reason: input.reason,
    })
    .select()
    .single()

  if (error) {
    console.error('Failed to create feedback:', error)
    throw new Error('添削結果の保存に失敗しました。')
  }

  return mapAiFeedback(data as AiFeedbackRow)
}

export async function getFeedbackBySentenceId(
  sentenceId: string,
): Promise<AiFeedback | undefined> {
  const { data, error } = await supabase
    .from('ai_feedbacks')
    .select('*')
    .eq('sentence_id', sentenceId)
    .maybeSingle()

  if (error) {
    console.error('Failed to fetch feedback:', error)
    throw new Error('添削結果の取得に失敗しました。')
  }

  return data ? mapAiFeedback(data as AiFeedbackRow) : undefined
}

export async function getFeedbackById(
  id: string,
): Promise<AiFeedback | undefined> {
  const { data, error } = await supabase
    .from('ai_feedbacks')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  if (error) {
    console.error('Failed to fetch feedback:', error)
    throw new Error('添削結果の取得に失敗しました。')
  }

  return data ? mapAiFeedback(data as AiFeedbackRow) : undefined
}

export async function saveFeedback(id: string): Promise<void> {
  const { error } = await supabase
    .from('ai_feedbacks')
    .update({ saved: true })
    .eq('id', id)

  if (error) {
    console.error('Failed to save feedback:', error)
    throw new Error('添削結果の保存に失敗しました。')
  }
}

interface HistoryRow {
  id: string
  corrected_text: string
  created_at: string
  user_sentences: {
    word_id: string
    original_text: string
    words: {
      word: string
    } | null
  } | null
}

export async function getSavedFeedbackHistory(
  userId: string,
): Promise<HistoryRecord[]> {
  const { data, error } = await supabase
    .from('ai_feedbacks')
    .select(`
      id,
      corrected_text,
      created_at,
      user_sentences!inner (
        word_id,
        original_text,
        user_id,
        words (
          word
        )
      )
    `)
    .eq('saved', true)
    .eq('user_sentences.user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Failed to fetch feedback history:', error)
    throw new Error('学習履歴の取得に失敗しました。')
  }

  return ((data ?? []) as unknown as HistoryRow[])
    .filter((row) => row.user_sentences?.words)
    .map((row) => ({
      id: row.id,
      wordId: row.user_sentences!.word_id,
      word: row.user_sentences!.words!.word,
      originalText: row.user_sentences!.original_text,
      correctedText: row.corrected_text,
      createdAt: row.created_at,
    }))
}