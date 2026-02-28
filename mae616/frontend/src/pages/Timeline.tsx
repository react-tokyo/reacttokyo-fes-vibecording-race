import { useState, useEffect } from 'react'
import PostCard from '../components/PostCard'
import ComposeForm from '../components/ComposeForm'

/** ログイン中のユーザーID（認証なし・固定値） */
const VIEWER_ID = 1

/** APIから取得する投稿データの型 */
interface Post {
  id: number
  userId: number
  content: string
  createdAt: string
  user: {
    id: number
    username: string
    displayName: string
  }
}

/**
 * タイムラインページ
 * フォロー中ユーザー＋自分の投稿をフィードとして表示する
 */
export default function Timeline() {
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)

  /** タイムラインを取得してstateに反映 */
  async function fetchTimeline() {
    try {
      const res = await fetch(`/api/timeline?viewerId=${VIEWER_ID}`)
      if (!res.ok) throw new Error('タイムラインの取得に失敗')
      const data = await res.json()
      setPosts(data)
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchTimeline()
  }, [])

  /** 新規投稿してタイムラインを再取得 */
  async function handlePost(content: string) {
    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: VIEWER_ID, content }),
      })
      if (!res.ok) throw new Error('投稿に失敗')
      // 投稿成功後にタイムラインを再フェッチして最新状態を表示
      await fetchTimeline()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="max-w-[600px] border-x border-border-subtle min-h-screen bg-bg-card">
      {/* ページヘッダー */}
      <header className="sticky top-0 z-10 bg-bg-card/90 backdrop-blur-sm border-b border-border-subtle px-4 py-3">
        <h1 className="text-text-primary font-bold text-[20px]">ホーム</h1>
      </header>

      {/* 投稿フォーム */}
      <ComposeForm onPost={handlePost} />

      {/* フィード */}
      {isLoading ? (
        <div className="flex justify-center py-12 text-text-tertiary">読み込み中...</div>
      ) : posts.length === 0 ? (
        <div className="flex justify-center py-12 text-text-tertiary">投稿がありません</div>
      ) : (
        <div>
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  )
}
