import { NextResponse } from 'next/server'
import { generateMockFeedback } from '@/lib/feedback'
import type { FeedbackResult } from '@/types/feedback'

/**
 * 文章添削 API。
 * プロトタイプではダミーロジックを使用します。
 * 後で OpenAI API へ送信し、{ correctedText, reason } を返すよう差し替えます。
 */
export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    text?: string
  } | null

  const text = body?.text?.trim()
  if (!text) {
    return NextResponse.json(
      { error: '文章を入力してください。' },
      { status: 400 },
    )
  }

  // 添削処理にかかる時間を擬似的に再現
  await new Promise((resolve) => setTimeout(resolve, 700))

  const feedback: FeedbackResult = generateMockFeedback(text)
  return NextResponse.json(feedback)
}
