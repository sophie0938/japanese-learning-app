'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { LogOut, Mail } from 'lucide-react'
import { useAuth } from '@/components/auth-provider'
import { HistoryList } from '@/components/history-list'
import { getHistory, type ReviewRecord } from '@/lib/store'
import { Button } from '@/components/ui/button'

export function MyPageView() {
  const { user, loading, logout } = useAuth()
  const router = useRouter()
  const [records, setRecords] = useState<ReviewRecord[]>([])

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/auth/login')
    }
  }, [loading, user, router])

  useEffect(() => {
    if (user) setRecords(getHistory(user.id))
  }, [user])

  function handleLogout() {
    logout()
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
            <p className="font-medium text-card-foreground">{user.email}</p>
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
          <h2 className="text-sm font-semibold text-foreground">学習履歴</h2>
          <span className="text-xs text-muted-foreground">
            {records.length} 件
          </span>
        </div>
        <HistoryList records={records} />
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
