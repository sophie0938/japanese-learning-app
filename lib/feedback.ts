import type { FeedbackResult } from '@/types/feedback'

/**
 * プロトタイプ用のダミー添削ロジック。
 * 後で OpenAI API 呼び出し（lib/openai.ts）に差し替えます。
 * 簡単な整形を行い、それらしい修正後文章と理由を返します。
 */
export function generateMockFeedback(text: string): FeedbackResult {
  const trimmed = text.trim()

  let corrected = trimmed
    // 連続する空白の整理
    .replace(/[ 　]+/g, '')
    // 半角句読点を全角へ
    .replace(/,/g, '、')
    .replace(/\.(?!\d)/g, '。')

  // 文末に句点がなければ補う
  if (corrected && !/[。！？」）]$/.test(corrected)) {
    corrected += '。'
  }

  const reasons: string[] = []
  if (corrected !== trimmed) {
    reasons.push('句読点や表記をより自然な形に整えました。')
  }
  reasons.push(
    '全体として意味は伝わりますが、語と語のつながりをなめらかにすると、より自然な日本語になります。',
  )
  reasons.push(
    'この単語の使い方は適切です。文脈に合った例文になっています。',
  )

  return {
    correctedText: corrected || trimmed,
    reason: reasons.join('\n'),
  }
}
