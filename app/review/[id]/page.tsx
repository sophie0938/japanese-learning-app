import { use } from "react"
import { Header } from "@/components/header"
import { ReviewView } from "./review-view"

export default function ReviewPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)

  return (
    <div className="min-h-dvh">
      <Header />
      <main className="mx-auto max-w-2xl px-4 py-8">
        <h1 className="mb-6 text-xl font-bold tracking-tight text-foreground">
          添削結果
        </h1>
        <ReviewView reviewId={id} />
      </main>
    </div>
  )
}
