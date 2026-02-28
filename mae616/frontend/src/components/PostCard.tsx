import { Link } from 'react-router-dom'

/** 投稿に紐づくユーザー情報 */
interface PostUser {
  id: number
  username: string
  displayName: string
}

/** 投稿データの型定義 */
interface Post {
  id: number
  userId: number
  content: string
  createdAt: string
  user: PostUser
}

interface PostCardProps {
  post: Post
}

/**
 * createdAt から現在時刻との相対時間文字列を返す
 * 例: 「3分前」「2時間前」「5日前」
 */
function relativeTime(createdAt: string): string {
  const diff = Date.now() - new Date(createdAt).getTime()
  const minutes = Math.floor(diff / 60_000)
  if (minutes < 1) return 'たった今'
  if (minutes < 60) return `${minutes}分前`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}時間前`
  const days = Math.floor(hours / 24)
  return `${days}日前`
}

/**
 * タイムライン上に表示される1件の投稿カード
 * displayName クリックでユーザープロフィールへ遷移する
 */
export default function PostCard({ post }: PostCardProps) {
  return (
    <article className="flex gap-3 bg-bg-card border-b border-border-subtle px-4 py-4 hover:bg-bg-hover transition-colors">
      {/* アバター */}
      <div className="w-10 h-10 rounded-full bg-accent-blue-light flex items-center justify-center text-accent-blue font-semibold text-sm shrink-0">
        {post.user.displayName.charAt(0)}
      </div>

      {/* 投稿本体 */}
      <div className="flex-1 min-w-0">
        {/* ヘッダー: 名前 / ハンドル / 時間 */}
        <div className="flex items-center gap-2 flex-wrap mb-1">
          <Link
            to={`/users/${post.user.id}`}
            className="text-text-primary font-semibold text-[15px] hover:underline"
          >
            {post.user.displayName}
          </Link>
          <span className="text-text-tertiary text-[14px]">@{post.user.username}</span>
          <span className="text-text-tertiary text-[14px]">·</span>
          <span className="text-text-tertiary text-[14px]">{relativeTime(post.createdAt)}</span>
        </div>

        {/* 本文 */}
        <p className="text-text-primary text-[15px] leading-[1.5] whitespace-pre-wrap break-words">
          {post.content}
        </p>
      </div>
    </article>
  )
}
