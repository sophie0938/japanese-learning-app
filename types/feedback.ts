export interface AiFeedback {
  id: string
  sentenceId: string
  correctedText: string
  reason: string
  createdAt: string
  saved: boolean
}

/** OpenAI から返却される添削結果の生データ */
export interface FeedbackResult {
  correctedText: string
  reason: string
}
