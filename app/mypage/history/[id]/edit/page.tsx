'use client'

import { FormEvent, useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Loader2, Sparkles } from 'lucide-react'
import { useAuth } from '@/components/auth-provider'
import {
  getFeedbackHistoryById,
  updateFeedback,
} from '@/lib/feedbacks'
import { updateSentence } from '@/lib/sentences'
import type { FeedbackResult } from '@/types/feedback'
import type { HistoryRecord } from '@/types/history'
import { Button } from '@/components/ui/button'

export default function EditHistoryPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()

  const feedbackId = params.id

  const [record, setRecord] = useState<HistoryRecord | null>(null)
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/auth/login')
    }
  }, [authLoading, user, router])

  useEffect(() => {
    if (!user || !feedbackId) {
      return
    }

    const userId = user.id

    async function loadRecord() {
      try {
        setLoading(true)
        setError(null)

        const historyRecord = await getFeedbackHistoryById(
          feedbackId,
          userId,
        )

        if (!historyRecord) {
          setError('編集する学習履歴が見つかりませんでした。')
          return
        }

        setRecord(historyRecord)
        setText(historyRecord.originalText)
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : '学習履歴の取得に失敗しました。',
        )
      } finally {
        setLoading(false)
      }
    }

    void loadRecord()
  }, [user, feedbackId])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!record) {
      return
    }

    const trimmedText = text.trim()

    if (!trimmedText) {
      setError('文章を入力してください。')
      return
    }

    try {
      setUpdating(true)
      setError(null)

      const response = await fetch('/api/review', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: trimmedText,
        }),
      })

      const reviewResult = (await response.json()) as
        | FeedbackResult
        | { error?: string }

      if (!response.ok) {
        throw new Error(
          'error' in reviewResult && reviewResult.error
            ? reviewResult.error
            : 'AI添削に失敗しました。',
        )
      }

      if (
        !('correctedText' in reviewResult) ||
        !('reason' in reviewResult)
      ) {
        throw new Error('AIの添削結果が正しくありません。')
      }

      await updateSentence({
        sentenceId: record.sentenceId,
        originalText: trimmedText,
      })

      await updateFeedback({
        feedbackId: record.id,
        correctedText: reviewResult.correctedText,
        reason: reviewResult.reason,
      })

      router.push('/mypage')
      router.refresh()
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : '学習履歴の更新に失敗しました。',
      )
    } finally {
      setUpdating(false)
    }
  }

  if (authLoading || loading) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-8">
        <div className="h-64 animate-pulse rounded-xl bg-muted/50" />
      </main>
    )
  }

  if (!record) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-8">
        <div className="rounded-xl border border-border bg-card p-6">
          <p className="text-sm text-destructive">
            {error ?? '学習履歴が見つかりませんでした。'}
          </p>

          <Link
            href="/mypage"
            className="mt-4 inline-block text-sm font-medium text-primary hover:underline"
          >
            マイページへ戻る
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-8">
      <div className="mb-6">
        <Link
          href="/mypage"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          マイページへ戻る
        </Link>
      </div>

      <section className="rounded-2xl border border-border bg-card p-6">
        <div className="mb-6">
          <p className="text-xs text-muted-foreground">学習単語</p>
          <h1 className="mt-1 text-2xl font-bold text-card-foreground">
            {record.word}
          </h1>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-5"
        >
          <div>
            <label
              htmlFor="sentence"
              className="mb-2 block text-sm font-medium text-foreground"
            >
              文章を編集
            </label>

            <textarea
              id="sentence"
              value={text}
              onChange={(event) => setText(event.target.value)}
              disabled={updating}
              maxLength={500}
              rows={6}
              className="w-full resize-none rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
            />

            <div className="mt-1 text-right text-xs text-muted-foreground">
              {text.length} / 500
            </div>
          </div>

          {error && (
            <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          )}

          <Button
            type="submit"
            disabled={updating || !text.trim()}
            className="gap-2"
          >
            {updating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                再添削しています
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                再添削して更新
              </>
            )}
          </Button>
        </form>
      </section>
    </main>
  )
}