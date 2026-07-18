"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { BookOpen, LogOut, User } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"

export function Header() {
  const { user, logout } = useAuth()
  const router = useRouter()

  function handleLogout() {
    logout()
    router.push("/")
  }

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-3xl items-center justify-between gap-4 px-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <BookOpen className="h-4 w-4" />
          </span>
          <span className="text-base font-bold tracking-tight text-foreground">
            ことのは
          </span>
        </Link>

        <nav className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            nativeButton={false}
            render={<Link href="/">単語一覧</Link>}
          />

          {user ? (
            <>
              <Button
                variant="ghost"
                size="sm"
                nativeButton={false}
                render={
                  <Link href="/mypage" className="flex items-center gap-1.5">
                    <User className="h-4 w-4" />
                    マイページ
                  </Link>
                }
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                aria-label="ログアウト"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <Button
              size="sm"
              nativeButton={false}
              render={<Link href="/auth/login">ログイン</Link>}
            />
          )}
        </nav>
      </div>
    </header>
  )
}
