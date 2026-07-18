"use client"

import { useMemo, useState } from "react"
import { Search } from "lucide-react"
import type { Word } from "@/types/word"
import { WordCard } from "@/components/word-card"
import { Input } from "@/components/ui/input"

export function WordGrid({ words }: { words: Word[] }) {
  const [query, setQuery] = useState("")

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return words
    return words.filter(
      (w) =>
        w.word.toLowerCase().includes(q) ||
        w.meaning.toLowerCase().includes(q) ||
        w.level.toLowerCase().includes(q),
    )
  }, [words, query])

  return (
    <div className="flex flex-col gap-6">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="単語・意味・レベルで検索"
          className="bg-card pl-9"
          aria-label="単語を検索"
        />
      </div>

      {filtered.length === 0 ? (
        <p className="py-12 text-center text-sm text-muted-foreground">
          「{query}」に一致する単語が見つかりませんでした。
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {filtered.map((word) => (
            <WordCard key={word.id} word={word} />
          ))}
        </div>
      )}
    </div>
  )
}
