import { Check, PenLine, Lightbulb } from "lucide-react"

interface FeedbackCardProps {
  originalText: string
  correctedText: string
  reason: string
}

export function FeedbackCard({
  originalText,
  correctedText,
  reason,
}: FeedbackCardProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* 修正後文章 */}
      <section className="rounded-xl border border-success/30 bg-success/5 p-5">
        <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-success">
          <Check className="h-4 w-4" />
          修正後の文章
        </div>
        <p className="text-base leading-relaxed text-foreground">
          {correctedText}
        </p>
      </section>

      {/* 元文章 */}
      <section className="rounded-xl border border-border bg-muted/40 p-5">
        <div className="mb-2 flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <PenLine className="h-4 w-4" />
          あなたの文章
        </div>
        <p className="text-base leading-relaxed text-muted-foreground">
          {originalText}
        </p>
      </section>

      {/* 修正ポイント */}
      <section className="rounded-xl border border-border bg-card p-5">
        <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
          <Lightbulb className="h-4 w-4 text-primary" />
          修正ポイント
        </div>
        <ul className="flex flex-col gap-2">
          {reason
            .split("\n")
            .filter(Boolean)
            .map((line, i) => (
              <li
                key={i}
                className="flex gap-2 text-sm leading-relaxed text-muted-foreground"
              >
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/60" />
                {line}
              </li>
            ))}
        </ul>
      </section>
    </div>
  )
}
