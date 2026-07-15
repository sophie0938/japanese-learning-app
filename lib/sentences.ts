import { supabase } from '@/lib/supabase'
import type { UserSentence } from '@/types/sentence'

interface UserSentenceRow {
  id: string
  user_id: string
  word_id: string
  original_text: string
  created_at: string
}

function mapUserSentence(row: UserSentenceRow): UserSentence {
  return {
    id: row.id,
    userId: row.user_id,
    wordId: row.word_id,
    originalText: row.original_text,
    createdAt: row.created_at,
  }
}

export async function createSentence(input: {
  userId: string
  wordId: string
  originalText: string
}): Promise<UserSentence> {
  const { data, error } = await supabase
    .from('user_sentences')
    .insert({
      user_id: input.userId,
      word_id: input.wordId,
      original_text: input.originalText,
    })
    .select()
    .single()

  if (error) {
    console.error('Failed to create sentence:', error)
    throw new Error('文章の保存に失敗しました。')
  }

  return mapUserSentence(data as UserSentenceRow)
}

export async function getSentence(
  id: string,
): Promise<UserSentence | undefined> {
  const { data, error } = await supabase
    .from('user_sentences')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  if (error) {
    console.error('Failed to fetch sentence:', error)
    throw new Error('文章の取得に失敗しました。')
  }

  return data ? mapUserSentence(data as UserSentenceRow) : undefined
}