import { Header } from '@/components/header'
import { WordGrid } from '@/components/word-grid'
import { WORDS } from '@/lib/words'

export default function HomePage() {
  return (
    <div className="min-h-dvh">
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-10">
        <section className="mb-10">
          <h1 className="text-balance text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            単語を、使える言葉に。
          </h1>
          <p className="mt-3 max-w-xl text-pretty leading-relaxed text-muted-foreground">
            単語を見て、例文を確認し、自分で文章を書く。AIの添削で、覚えた言葉を実際に使える日本語へ。静かに続けられる学習ノートです。
          </p>
        </section>

        <section>
          <h2 className="mb-4 text-sm font-semibold text-muted-foreground">
            単語一覧
          </h2>
          <WordGrid words={WORDS} />
        </section>
      </main>
    </div>
  )
}
