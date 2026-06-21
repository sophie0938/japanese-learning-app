import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { Word } from '@/types/word'
import { Badge } from '@/components/ui/badge'

export function WordCard({ word }: { word: Word }) {
  return (
    <Link
      href={`/words/${word.id}`}
      className="group flex flex-col gap-3 rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/40 hover:bg-accent/40"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-xl font-bold text-card-foreground">{word.word}</h3>
        <Badge
          variant="secondary"
          className="shrink-0 font-mono text-xs text-muted-foreground"
        >
          {word.level}
        </Badge>
      </div>
      <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
        {word.meaning}
      </p>
      <span className="mt-1 inline-flex items-center gap-1 text-sm font-medium text-primary">
        詳細を見る
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </span>
    </Link>
  )
}
