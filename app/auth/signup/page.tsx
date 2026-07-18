import { Header } from "@/components/header"
import { AuthForm } from "@/components/auth-form"

export default function SignupPage() {
  return (
    <div className="min-h-dvh">
      <Header />
      <main className="mx-auto flex max-w-md flex-col px-4 py-12">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            はじめましょう
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            アカウントを作成して、文章を書いて添削を受けましょう。
          </p>
        </div>
        <AuthForm mode="signup" />
      </main>
    </div>
  )
}
