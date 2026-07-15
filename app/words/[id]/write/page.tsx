import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { Header } from '@/components/header'
import { getWordById } from '@/lib/words'
import { WriteView } from './write-view'

export default async function WritePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const word = await getWordById(id)
  if (!word) notFound()

  return (
    <div className="min-h-dvh">
      <Header />
      <main className="mx-auto max-w-2xl px-4 py-8">
        <Link
          href={`/words/${word.id}`}
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          単語詳細へ戻る
        </Link>

        <h1 className="mb-6 text-xl font-bold tracking-tight text-foreground">
          文章を書く
        </h1>

        <WriteView word={word} />
      </main>
    </div>
  )
}
