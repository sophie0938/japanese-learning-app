'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { LogOut, Mail } from 'lucide-react'
import { useAuth } from '@/components/auth-provider'
import { HistoryList } from '@/components/history-list'
import {
  deleteFeedbackHistory,
  getSavedFeedbackHistory,
} from '@/lib/feedbacks'
import type { HistoryRecord } from '@/types/history'
import { Button } from '@/components/ui/button'

export function MyPageView() {
  const { user, loading, logout } = useAuth()
  const router = useRouter()

  const [records, setRecords] = useState<HistoryRecord[]>([])
  const [historyLoading, setHistoryLoading] = useState(true)
  const [historyError, setHistoryError] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/auth/login')
    }
  }, [loading, user, router])

  useEffect(() => {
    if (!user) return

    const userId = user.id

    async function loadHistory() {
      try {
        setHistoryLoading(true)
        setHistoryError(null)

        const history = await getSavedFeedbackHistory(userId)
        setRecords(history)
      } catch (error) {
        setHistoryError(
          error instanceof Error
            ? error.message
            : '学習履歴の取得に失敗しました。',
        )
      } finally {
        setHistoryLoading(false)
      }
    }

    void loadHistory()
  }, [user])

  async function handleDeleteHistory(
    record: HistoryRecord,
  ): Promise<void> {
    const confirmed = window.confirm(
      `「${record.word}」の学習履歴を削除しますか？`,
    )

    if (!confirmed) {
      return
    }

    try {
      setDeletingId(record.id)
      setHistoryError(null)

      await deleteFeedbackHistory({
        feedbackId: record.id,
        sentenceId: record.sentenceId,
      })

      setRecords((currentRecords) =>
        currentRecords.filter(
          (currentRecord) => currentRecord.id !== record.id,
        ),
      )
    } catch (error) {
      setHistoryError(
        error instanceof Error
          ? error.message
          : '学習履歴の削除に失敗しました。',
      )
    } finally {
      setDeletingId(null)
    }
  }

  async function handleLogout() {
    await logout()
    router.push('/')
  }

  if (loading || !user) {
    return <div className="h-64 animate-pulse rounded-xl bg-muted/50" />
  }

  return (
    <div className="flex flex-col gap-8">
      {/* ユーザー情報 */}
      <section className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Mail className="h-5 w-5" />
          </span>

          <div>
            <p className="text-xs text-muted-foreground">ログイン中</p>
            <p className="font-medium text-card-foreground">
              {user.email}
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          onClick={handleLogout}
          className="gap-2 sm:w-auto"
        >
          <LogOut className="h-4 w-4" />
          ログアウト
        </Button>
      </section>

      {/* 学習履歴 */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">
            学習履歴
          </h2>

          <span className="text-xs text-muted-foreground">
            {records.length} 件
          </span>
        </div>

        {historyLoading ? (
          <div className="h-40 animate-pulse rounded-xl bg-muted/50" />
        ) : historyError ? (
          <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {historyError}
          </p>
        ) : (
          <HistoryList
            records={records}
            deletingId={deletingId}
            onDelete={handleDeleteHistory}
          />
        )}
      </section>

      <Link
        href="/"
        className="text-center text-sm font-medium text-primary hover:underline"
      >
        単語一覧から新しく学習する
      </Link>
    </div>
  )
}