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
  sentence_id: string
  corrected_text: string
  reason: string
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
      sentence_id,
      corrected_text,
      reason,
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
      sentenceId: row.sentence_id,
      wordId: row.user_sentences!.word_id,
      word: row.user_sentences!.words!.word,
      originalText: row.user_sentences!.original_text,
      correctedText: row.corrected_text,
      reason: row.reason,
      createdAt: row.created_at,
    }))
}
export async function deleteFeedbackHistory(input: {
  feedbackId: string
  sentenceId: string
}): Promise<void> {
  const {
    data: deletedFeedbacks,
    error: feedbackError,
  } = await supabase
    .from('ai_feedbacks')
    .delete()
    .eq('id', input.feedbackId)
    .select('id')

  if (feedbackError) {
    console.error('Failed to delete feedback:', feedbackError)
    throw new Error('添削結果の削除に失敗しました。')
  }

  if (!deletedFeedbacks || deletedFeedbacks.length === 0) {
    console.error('Feedback was not deleted:', input.feedbackId)
    throw new Error(
      '添削結果を削除できませんでした。削除権限を確認してください。',
    )
  }

  const {
    data: deletedSentences,
    error: sentenceError,
  } = await supabase
    .from('user_sentences')
    .delete()
    .eq('id', input.sentenceId)
    .select('id')

  if (sentenceError) {
    console.error('Failed to delete sentence:', sentenceError)
    throw new Error('元の文章の削除に失敗しました。')
  }

  if (!deletedSentences || deletedSentences.length === 0) {
    console.error('Sentence was not deleted:', input.sentenceId)
    throw new Error(
      '元の文章を削除できませんでした。削除権限を確認してください。',
    )
  }
}

export async function getFeedbackHistoryById(
  feedbackId: string,
  userId: string,
): Promise<HistoryRecord | undefined> {
  const { data, error } = await supabase
    .from('ai_feedbacks')
    .select(`
      id,
      sentence_id,
      corrected_text,
      reason,
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
    .eq('id', feedbackId)
    .eq('user_sentences.user_id', userId)
    .maybeSingle()

  if (error) {
    console.error('Failed to fetch feedback history:', error)
    throw new Error('編集する学習履歴の取得に失敗しました。')
  }

  if (!data) {
    return undefined
  }

  const row = data as unknown as HistoryRow

  if (!row.user_sentences?.words) {
    return undefined
  }

  return {
    id: row.id,
    sentenceId: row.sentence_id,
    wordId: row.user_sentences.word_id,
    word: row.user_sentences.words.word,
    originalText: row.user_sentences.original_text,
    correctedText: row.corrected_text,
    reason: row.reason,
    createdAt: row.created_at,
  }
}

export async function updateFeedback(input: {
  feedbackId: string
  correctedText: string
  reason: string
}): Promise<void> {
  const { data, error } = await supabase
    .from('ai_feedbacks')
    .update({
      corrected_text: input.correctedText,
      reason: input.reason,
    })
    .eq('id', input.feedbackId)
    .select('id')
    .single()

  if (error) {
    console.error('Failed to update feedback:', error)
    throw new Error('添削結果の更新に失敗しました。')
  }

  if (!data) {
    throw new Error('更新する添削結果が見つかりませんでした。')
  }
}