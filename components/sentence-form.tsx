"use client"

import { createFeedback } from "@/lib/feedbacks"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Sparkles, Loader2 } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { createSentence } from "@/lib/sentences"
import type { FeedbackResult } from "@/types/feedback"
import type { Word } from "@/types/word"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

export function SentenceForm({ word }: { word: Word }) {
  const { user } = useAuth()
  const router = useRouter()
  const [text, setText] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit() {
    if (!user) {
      router.push("/auth/login")
      return
    }

    if (!text.trim()) {
      setError("文章を入力してください。")
      return
    }

    setError(null)
    setLoading(true)

    try {
      const originalText = text.trim()

      const sentence = await createSentence({
        userId: user.id,
        wordId: word.id,
        originalText,
      })

      const res = await fetch("/api/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: originalText }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => null)
        throw new Error(data?.error ?? "添削に失敗しました。")
      }

      const feedback = (await res.json()) as FeedbackResult

      const createdFeedback = await createFeedback({
        sentenceId: sentence.id,
        correctedText: feedback.correctedText,
        reason: feedback.reason,
})

router.push(`/review/${createdFeedback.id}`)
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "文章の保存または添削に失敗しました。",
      )
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label
          htmlFor="sentence"
          className="text-sm font-medium text-foreground"
        >
          「{word.word}」を使って文章を書いてみましょう
        </label>

        <Textarea
          id="sentence"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={`例：${word.example}`}
          rows={5}
          className="resize-none bg-card text-base leading-relaxed"
          disabled={loading}
        />

        <p className="text-xs text-muted-foreground">
          {text.length} 文字
        </p>
      </div>

      {error && (
        <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}

      <Button
        onClick={handleSubmit}
        disabled={loading}
        size="lg"
        className="gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            添削中...
          </>
        ) : (
          <>
            <Sparkles className="h-4 w-4" />
            AI添削してもらう
          </>
        )}
      </Button>
    </div>
  )
}