'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Check, Loader2, Save } from 'lucide-react'
import { FeedbackCard } from '@/components/feedback-card'
import { getReview, saveReview, type ReviewRecord } from '@/lib/store'
import { Button } from '@/components/ui/button'

export function ReviewView({ reviewId }: { reviewId: string }) {
  const router = useRouter()
  const [record, setRecord] = useState<ReviewRecord | null>(null)
  const [ready, setReady] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setRecord(getReview(reviewId) ?? null)
    setReady(true)
  }, [reviewId])

  function handleSave() {
    if (!record) return
    setSaving(true)
    saveReview(record.id)
    // 保存後はマイページへ
    router.push('/mypage')
  }

  if (!ready) {
    return <div className="h-64 animate-pulse rounded-xl bg-muted/50" />
  }

  if (!record) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-card/50 px-6 py-12 text-center">
        <p className="text-sm text-muted-foreground">
          添削結果が見つかりませんでした。
        </p>
        <Link
          href="/"
          className="mt-3 inline-block text-sm font-medium text-primary hover:underline"
        >
          単語一覧へ戻る
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <p className="text-sm text-muted-foreground">
        単語{' '}
        <Link
          href={`/words/${record.wordId}`}
          className="font-semibold text-foreground hover:text-primary"
        >
          {record.word}
        </Link>{' '}
        を使った文章の添削です。
      </p>

      <FeedbackCard
        originalText={record.originalText}
        correctedText={record.correctedText}
        reason={record.reason}
      />

      {record.saved ? (
        <div className="flex items-center justify-center gap-2 rounded-lg bg-success/10 px-4 py-3 text-sm font-medium text-success">
          <Check className="h-4 w-4" />
          保存済みです
        </div>
      ) : (
        <Button onClick={handleSave} disabled={saving} size="lg" className="gap-2">
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          保存する
        </Button>
      )}
    </div>
  )
}
