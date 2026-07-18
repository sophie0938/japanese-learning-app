import { Header } from "@/components/header"
import { AuthForm } from "@/components/auth-form"

export default function LoginPage() {
  return (
    <div className="min-h-dvh">
      <Header />
      <main className="mx-auto flex max-w-md flex-col px-4 py-12">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            おかえりなさい
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            ログインして、学習の続きを始めましょう。
          </p>
        </div>
        <AuthForm mode="login" />
      </main>
    </div>
  )
}
