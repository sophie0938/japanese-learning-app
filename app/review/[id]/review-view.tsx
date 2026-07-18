"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Check, Loader2, Save } from "lucide-react"
import { FeedbackCard } from "@/components/feedback-card"
import { getFeedbackById, saveFeedback } from "@/lib/feedbacks"
import { getSentence } from "@/lib/sentences"
import { getWordById } from "@/lib/words"
import type { AiFeedback } from "@/types/feedback"
import type { UserSentence } from "@/types/sentence"
import type { Word } from "@/types/word"
import { Button } from "@/components/ui/button"

export function ReviewView({ reviewId }: { reviewId: string }) {
  const router = useRouter()

  const [feedback, setFeedback] = useState<AiFeedback | null>(null)
  const [sentence, setSentence] = useState<UserSentence | null>(null)
  const [word, setWord] = useState<Word | null>(null)

  const [ready, setReady] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadReview() {
      try {
        const feedbackData = await getFeedbackById(reviewId)

        if (!feedbackData) {
          setReady(true)
          return
        }

        const sentenceData = await getSentence(feedbackData.sentenceId)

        if (!sentenceData) {
          setReady(true)
          return
        }

        const wordData = await getWordById(sentenceData.wordId)

        if (!wordData) {
          setReady(true)
          return
        }

        setFeedback(feedbackData)
        setSentence(sentenceData)
        setWord(wordData)
      } catch (e) {
        setError(
          e instanceof Error
            ? e.message
            : "添削結果の取得に失敗しました。",
        )
      } finally {
        setReady(true)
      }
    }

    void loadReview()
  }, [reviewId])

  async function handleSave() {
    if (!feedback) return

    setSaving(true)
    setError(null)

    try {
      await saveFeedback(feedback.id)

      setFeedback({
        ...feedback,
        saved: true,
      })

      router.push("/mypage")
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "添削結果の保存に失敗しました。",
      )
      setSaving(false)
    }
  }

  if (!ready) {
    return <div className="h-64 animate-pulse rounded-xl bg-muted/50" />
  }

  if (error) {
    return (
      <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-6 py-8 text-center">
        <p className="text-sm text-destructive">{error}</p>

        <Link
          href="/"
          className="mt-3 inline-block text-sm font-medium text-primary hover:underline"
        >
          単語一覧へ戻る
        </Link>
      </div>
    )
  }

  if (!feedback || !sentence || !word) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-card/50 px-6 py-12 text-center">
        <p className="text-sm text-muted-foreground">
          添削結果が見つかりませんでした。
        </p>

        <Link
          href="/"
          className="mt-3 inline-block text-sm font-medium text-primary hover:underline"
        >
          単語一覧へ戻る
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <p className="text-sm text-muted-foreground">
        単語{" "}
        <Link
          href={`/words/${word.id}`}
          className="font-semibold text-foreground hover:text-primary"
        >
          {word.word}
        </Link>{" "}
        を使った文章の添削です。
      </p>

      <FeedbackCard
        originalText={sentence.originalText}
        correctedText={feedback.correctedText}
        reason={feedback.reason}
      />

      {error && (
        <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}

      {feedback.saved ? (
        <div className="flex items-center justify-center gap-2 rounded-lg bg-success/10 px-4 py-3 text-sm font-medium text-success">
          <Check className="h-4 w-4" />
          保存済みです
        </div>
      ) : (
        <Button
          onClick={handleSave}
          disabled={saving}
          size="lg"
          className="gap-2"
        >
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          保存する
        </Button>
      )}
    </div>
  )
}