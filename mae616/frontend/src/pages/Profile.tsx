import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import PostCard from '../components/PostCard'

/** ログイン中のユーザーID（認証なし・固定値） */
const VIEWER_ID = 1

/** プロフィールAPIから取得するユーザー情報の型 */
interface ProfileUser {
  id: number
  username: string
  displayName: string
  followingCount: number
  followersCount: number
  isFollowing: boolean
}

/** 投稿データの型 */
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
 * プロフィールページ
 * URLパラメータの :id に対応するユーザー情報と投稿一覧を表示する
 */
export default function Profile() {
  const { id } = useParams<{ id: string }>()
  const userId = Number(id)

  const [user, setUser] = useState<ProfileUser | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [isFollowing, setIsFollowing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!userId) return

    async function loadProfile() {
      setIsLoading(true)
      try {
        // ユーザー情報とフォロー状態を同時取得
        const [userRes, postsRes] = await Promise.all([
          fetch(`/api/users/${userId}?viewerId=${VIEWER_ID}`),
          fetch(`/api/users/${userId}/posts`),
        ])

        if (!userRes.ok) throw new Error('ユーザー情報の取得に失敗')
        if (!postsRes.ok) throw new Error('投稿一覧の取得に失敗')

        const userData: ProfileUser = await userRes.json()
        const postsData: Post[] = await postsRes.json()

        setUser(userData)
        setIsFollowing(userData.isFollowing ?? false)
        setPosts(postsData)
      } catch (err) {
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    loadProfile()
  }, [userId])

  /**
   * フォロー/アンフォローをトグルする
   * 楽観的更新でUIを即時反映し、APIエラー時は元に戻す
   */
  async function handleToggleFollow() {
    if (!user) return
    const prev = isFollowing
    setIsFollowing(!prev)

    try {
      const res = await fetch('/api/follow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          followerId: VIEWER_ID,
          followingId: user.id,
          action: prev ? 'unfollow' : 'follow',
        }),
      })
      if (!res.ok) throw new Error('フォロー操作に失敗')
    } catch (err) {
      console.error(err)
      // エラー時はUIを元の状態に戻す
      setIsFollowing(prev)
    }
  }

  if (isLoading) {
    return (
      <div className="max-w-[600px] border-x border-border-subtle min-h-screen bg-bg-card">
        <div className="flex justify-center py-12 text-text-tertiary">読み込み中...</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="max-w-[600px] border-x border-border-subtle min-h-screen bg-bg-card">
        <div className="flex justify-center py-12 text-text-tertiary">ユーザーが見つかりません</div>
      </div>
    )
  }

  const isSelf = user.id === VIEWER_ID

  return (
    <div className="max-w-[600px] border-x border-border-subtle min-h-screen bg-bg-card">
      {/* ページヘッダー */}
      <header className="sticky top-0 z-10 bg-bg-card/90 backdrop-blur-sm border-b border-border-subtle px-4 py-3">
        <h1 className="text-text-primary font-bold text-[20px]">プロフィール</h1>
      </header>

      {/* プロフィールセクション */}
      <section className="px-4 py-6 border-b border-border-subtle">
        {/* アバター + フォローボタン */}
        <div className="flex items-start justify-between mb-4">
          <div className="w-[72px] h-[72px] rounded-full bg-accent-blue-light flex items-center justify-center text-accent-blue font-bold text-2xl">
            {user.displayName.charAt(0)}
          </div>

          {/* 自分自身でなければフォローボタンを表示 */}
          {!isSelf && (
            <button
              onClick={handleToggleFollow}
              className={`px-6 py-2.5 rounded-full text-[14px] font-semibold transition-colors ${
                isFollowing
                  ? 'bg-bg-card border border-border-strong text-text-primary hover:bg-accent-red/10 hover:border-accent-red hover:text-accent-red'
                  : 'bg-accent-blue text-white hover:bg-accent-blue/90'
              }`}
            >
              {isFollowing ? 'フォロー中' : 'フォロー'}
            </button>
          )}
        </div>

        {/* 名前 / ハンドル */}
        <h2 className="text-text-primary font-bold text-[22px] leading-tight">{user.displayName}</h2>
        <p className="text-text-tertiary text-[15px] mt-0.5">@{user.username}</p>

        {/* フォロー数 / フォロワー数 */}
        <div className="flex gap-5 mt-4">
          <span className="text-text-primary text-sm">
            <strong className="font-semibold">{user.followingCount}</strong>
            <span className="text-text-tertiary ml-1">フォロー中</span>
          </span>
          <span className="text-text-primary text-sm">
            <strong className="font-semibold">{user.followersCount}</strong>
            <span className="text-text-tertiary ml-1">フォロワー</span>
          </span>
        </div>
      </section>

      {/* タブ: 現時点は「投稿」のみ */}
      <div className="flex border-b border-border-subtle">
        <button className="flex-1 py-4 text-[15px] font-semibold text-accent-blue border-b-[3px] border-accent-blue">
          投稿
        </button>
      </div>

      {/* 投稿一覧 */}
      {posts.length === 0 ? (
        <div className="flex justify-center py-12 text-text-tertiary">まだ投稿がありません</div>
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
