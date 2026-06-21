import type { FeedbackResult } from '@/types/feedback'

/**
 * プロトタイプ用のクライアントデータストア。
 * 後で Supabase（user_sentences / ai_feedbacks）と Route Handler に差し替えます。
 * 現状は localStorage に保存するだけのモックです。
 */

export interface ReviewRecord {
  id: string
  userId: string
  wordId: string
  word: string
  originalText: string
  correctedText: string
  reason: string
  createdAt: string
  /** 保存済み（マイページに残す）かどうか */
  saved: boolean
}

const STORAGE_KEY = 'kotonoha.reviews'

function readAll(): ReviewRecord[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as ReviewRecord[]) : []
  } catch {
    return []
  }
}

function writeAll(records: ReviewRecord[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records))
}

/** 文章投稿 + 添削結果を一時レコードとして作成し、review 画面で参照する */
export function createReview(input: {
  userId: string
  wordId: string
  word: string
  originalText: string
  feedback: FeedbackResult
}): ReviewRecord {
  const record: ReviewRecord = {
    id: `rev-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    userId: input.userId,
    wordId: input.wordId,
    word: input.word,
    originalText: input.originalText,
    correctedText: input.feedback.correctedText,
    reason: input.feedback.reason,
    createdAt: new Date().toISOString(),
    saved: false,
  }
  const all = readAll()
  all.push(record)
  writeAll(all)
  return record
}

export function getReview(id: string): ReviewRecord | undefined {
  return readAll().find((r) => r.id === id)
}

/** 添削結果を保存（マイページの履歴に残す） */
export function saveReview(id: string) {
  const all = readAll()
  const next = all.map((r) => (r.id === id ? { ...r, saved: true } : r))
  writeAll(next)
}

/** ログインユーザーの保存済み履歴を新しい順で取得 */
export function getHistory(userId: string): ReviewRecord[] {
  return readAll()
    .filter((r) => r.userId === userId && r.saved)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}
