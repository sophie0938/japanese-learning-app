import { Header } from '@/components/header'
import { MyPageView } from './mypage-view'

export default function MyPage() {
  return (
    <div className="min-h-dvh">
      <Header />
      <main className="mx-auto max-w-2xl px-4 py-8">
        <MyPageView />
      </main>
    </div>
  )
}
