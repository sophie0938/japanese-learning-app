'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'

/**
 * プロトタイプ用の認証コンテキスト。
 * 後で Supabase Auth に差し替えます（signup / login / logout / session）。
 * 現状は localStorage にユーザー情報を保持するだけのモックです。
 */

export interface AuthUser {
  id: string
  email: string
}

interface AuthContextValue {
  user: AuthUser | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string) => Promise<void>
  logout: () => void
}

const STORAGE_KEY = 'kotonoha.auth.user'

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) setUser(JSON.parse(raw))
    } catch {
      // ignore
    }
    setLoading(false)
  }, [])

  const persist = useCallback((next: AuthUser | null) => {
    setUser(next)
    if (next) localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    else localStorage.removeItem(STORAGE_KEY)
  }, [])

  const login = useCallback(
    async (email: string, _password: string) => {
      // 後で Supabase Auth の signInWithPassword に差し替え
      persist({ id: `user-${email}`, email })
    },
    [persist],
  )

  const signup = useCallback(
    async (email: string, _password: string) => {
      // 後で Supabase Auth の signUp に差し替え
      persist({ id: `user-${email}`, email })
    },
    [persist],
  )

  const logout = useCallback(() => {
    persist(null)
  }, [persist])

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
