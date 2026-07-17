export interface HistoryRecord {
  id: string
  sentenceId: string
  wordId: string
  word: string
  originalText: string
  correctedText: string
  reason: string
  createdAt: string
}