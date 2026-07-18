"use client"

import Link from "next/link"
import { Lock, Quote } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { SentenceForm } from "@/components/sentence-form"
import { Button } from "@/components/ui/button"
import type { Word } from "@/types/word"

export function WriteView({ word }: { word: Word }) {
  const { user, loading } = useAuth()

  return (
    <div className="flex flex-col gap-6">
      {/* 使用単語 */}
      <section className="flex flex-col gap-2 rounded-xl border border-border bg-card p-5">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-muted-foreground">
            使用する単語
          </span>
        </div>
        <p className="text-2xl font-bold text-card-foreground">{word.word}</p>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {word.meaning}
        </p>
        <div className="mt-1 flex gap-2 rounded-lg bg-muted/50 p-3 text-sm text-muted-foreground">
          <Quote className="h-3.5 w-3.5 shrink-0 text-primary/60" />
          {word.example}
        </div>
      </section>

      {loading ? (
        <div className="h-40 animate-pulse rounded-xl bg-muted/50" />
      ) : user ? (
        <SentenceForm word={word} />
      ) : (
        <section className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border bg-card/50 px-6 py-10 text-center">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <Lock className="h-5 w-5" />
          </span>
          <p className="text-sm leading-relaxed text-muted-foreground">
            文章の作成とAI添削には、ログインが必要です。
          </p>
          <div className="mt-1 flex gap-2">
            <Button
              nativeButton={false}
              render={<Link href="/auth/login">ログイン</Link>}
            />
            <Button
              variant="outline"
              nativeButton={false}
              render={<Link href="/auth/signup">新規登録</Link>}
            />
          </div>
        </section>
      )}
    </div>
  )
}
