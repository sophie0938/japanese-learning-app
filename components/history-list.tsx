import Link from 'next/link'
import {
  Check,
  Loader2,
  MessageCircle,
  PenLine,
  SquarePen,
  Trash2,
} from 'lucide-react'

import type { HistoryRecord } from '@/types/history'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

function formatDate(iso: string) {
  const d = new Date(iso)

  return `${d.getFullYear()}/${String(
    d.getMonth() + 1,
  ).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}`
}

interface HistoryListProps {
  records: HistoryRecord[]
  deletingId: string | null
  onDelete: (record: HistoryRecord) => Promise<void>
}

export function HistoryList({
  records,
  deletingId,
  onDelete,
}: HistoryListProps) {
  if (records.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-card/50 px-6 py-12 text-center">
        <p className="text-sm text-muted-foreground">
          まだ学習履歴がありません。
        </p>

        <Link
          href="/"
          className="mt-3 inline-block text-sm font-medium text-primary hover:underline"
        >
          単語一覧から始める
        </Link>
      </div>
    )
  }

  return (
    <ul className="flex flex-col gap-4">
      {records.map((record) => {
        const isDeleting = deletingId === record.id

        return (
          <li
            key={record.id}
            className="flex flex-col gap-3 rounded-xl border border-border bg-card p-5"
          >
            {/* タイトル */}
            <div className="flex items-start justify-between gap-3">
              <Link
                href={`/words/${record.wordId}`}
                className="text-lg font-bold text-card-foreground hover:text-primary"
              >
                {record.word}
              </Link>

              <div className="flex items-center gap-2">
                <Badge
                  variant="secondary"
                  className="font-mono text-xs text-muted-foreground"
                >
                  {formatDate(record.createdAt)}
                </Badge>

                {/* 編集 */}
                <Link
                  href={`/mypage/history/${record.id}/edit`}
                  aria-label={`${record.word}を編集`}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-primary"
>
                  <SquarePen className="h-4 w-4" />
                </Link>

                {/* 削除 */}
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  disabled={isDeleting}
                  onClick={() => void onDelete(record)}
                  className="text-muted-foreground hover:text-destructive"
                  aria-label={`${record.word}を削除`}
                >
                  {isDeleting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* 元文章 */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-start gap-2 text-sm leading-relaxed text-muted-foreground">
                <PenLine className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                <span>{record.originalText}</span>
              </div>

              {/* 添削後 */}
              <div className="flex items-start gap-2 text-sm leading-relaxed text-foreground">
                <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" />
                <span>{record.correctedText}</span>
              </div>
              
              {/* AIフィードバック */}
              <div className="flex items-start gap-2 text-sm leading-relaxed text-muted-foreground">
                <MessageCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                <span>{record.reason}</span>
              </div>
            </div>
          </li>
        )
      })}
    </ul>
  )
}