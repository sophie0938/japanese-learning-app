"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const { login, signup } = useAuth()
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isSignup = mode === "signup"

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim() || !password) {
      setError("メールアドレスとパスワードを入力してください。")
      return
    }
    setError(null)
    setLoading(true)
    try {
      if (isSignup) await signup(email.trim(), password)
      else await login(email.trim(), password)
      // 成功後は単語一覧へ（書きかけがある場合はそこから戻れる）
      router.push("/")
    } catch {
      setError("処理に失敗しました。もう一度お試しください。")
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="email">メールアドレス</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="bg-card"
          disabled={loading}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="password">パスワード</Label>
        <Input
          id="password"
          type="password"
          autoComplete={isSignup ? "new-password" : "current-password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          className="bg-card"
          disabled={loading}
        />
      </div>

      {error && (
        <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}

      <Button type="submit" size="lg" disabled={loading} className="gap-2">
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {isSignup ? "登録する" : "ログイン"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        {isSignup ? (
          <>
            すでにアカウントをお持ちですか？{" "}
            <Link
              href="/auth/login"
              className="font-medium text-primary hover:underline"
            >
              ログイン
            </Link>
          </>
        ) : (
          <>
            アカウントをお持ちでないですか？{" "}
            <Link
              href="/auth/signup"
              className="font-medium text-primary hover:underline"
            >
              新規登録
            </Link>
          </>
        )}
      </p>
    </form>
  )
}
