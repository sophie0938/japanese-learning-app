import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, PenLine, Quote } from 'lucide-react'
import { Header } from '@/components/header'
import { getWordById } from '@/lib/words'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export default async function WordDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const word = getWordById(id)
  if (!word) notFound()

  return (
    <div className="min-h-dvh">
      <Header />
      <main className="mx-auto max-w-2xl px-4 py-8">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          単語一覧へ戻る
        </Link>

        <article className="flex flex-col gap-6 rounded-2xl border border-border bg-card p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <h1 className="text-3xl font-bold tracking-tight text-card-foreground">
              {word.word}
            </h1>
            <Badge
              variant="secondary"
              className="font-mono text-xs text-muted-foreground"
            >
              {word.level}
            </Badge>
          </div>

          <div className="flex flex-col gap-1.5">
            <h2 className="text-xs font-semibold text-muted-foreground">意味</h2>
            <p className="text-base leading-relaxed text-foreground">
              {word.meaning}
            </p>
          </div>

          <div className="flex flex-col gap-1.5">
            <h2 className="text-xs font-semibold text-muted-foreground">例文</h2>
            <div className="flex gap-2.5 rounded-xl bg-muted/50 p-4">
              <Quote className="h-4 w-4 shrink-0 text-primary/60" />
              <p className="text-base leading-relaxed text-foreground">
                {word.example}
              </p>
            </div>
          </div>
        </article>

        <Button
          size="lg"
          className="mt-6 w-full gap-2"
          nativeButton={false}
          render={
            <Link href={`/words/${word.id}/write`}>
              <PenLine className="h-4 w-4" />
              この単語を使って文章を書く
            </Link>
          }
        />
      </main>
    </div>
  )
}
