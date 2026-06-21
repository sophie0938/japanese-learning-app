import Link from 'next/link'
import { Check, PenLine } from 'lucide-react'
import type { ReviewRecord } from '@/lib/store'
import { Badge } from '@/components/ui/badge'

function formatDate(iso: string) {
  const d = new Date(iso)
  return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}/${String(
    d.getDate(),
  ).padStart(2, '0')}`
}

export function HistoryList({ records }: { records: ReviewRecord[] }) {
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
      {records.map((r) => (
        <li
          key={r.id}
          className="flex flex-col gap-3 rounded-xl border border-border bg-card p-5"
        >
          <div className="flex items-center justify-between gap-3">
            <Link
              href={`/words/${r.wordId}`}
              className="text-lg font-bold text-card-foreground hover:text-primary"
            >
              {r.word}
            </Link>
            <Badge
              variant="secondary"
              className="font-mono text-xs text-muted-foreground"
            >
              {formatDate(r.createdAt)}
            </Badge>
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-start gap-2 text-sm leading-relaxed text-muted-foreground">
              <PenLine className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              <span>{r.originalText}</span>
            </div>
            <div className="flex items-start gap-2 text-sm leading-relaxed text-foreground">
              <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" />
              <span>{r.correctedText}</span>
            </div>
          </div>
        </li>
      ))}
    </ul>
  )
}
