import { Link } from 'react-router-dom'

/** ユーザー情報の型定義 */
interface User {
  id: number
  username: string
  displayName: string
}

interface UserCardProps {
  user: User
  /** ログインユーザーがこのユーザーをフォロー中かどうか */
  isFollowing: boolean
  /** ログインユーザー自身のカードかどうか（フォローボタン非表示） */
  isSelf: boolean
  /** フォロー/アンフォローのトグル処理 */
  onToggleFollow: () => void
}

/**
 * ユーザー一覧に表示される1件のユーザーカード
 * displayName クリックでプロフィールページへ遷移、フォロートグルボタン付き
 */
export default function UserCard({ user, isFollowing, isSelf, onToggleFollow }: UserCardProps) {
  return (
    <div className="flex items-center gap-3 bg-bg-card border-b border-border-subtle px-4 py-4 hover:bg-bg-hover transition-colors">
      {/* アバター */}
      <div className="w-12 h-12 rounded-full bg-accent-blue-light flex items-center justify-center text-accent-blue font-semibold text-base shrink-0">
        {user.displayName.charAt(0)}
      </div>

      {/* ユーザー情報 */}
      <div className="flex-1 min-w-0">
        <Link
          to={`/users/${user.id}`}
          className="text-text-primary font-semibold text-[15px] hover:underline block truncate"
        >
          {user.displayName}
        </Link>
        <p className="text-text-tertiary text-[14px] truncate">@{user.username}</p>
      </div>

      {/* フォローボタン: 自分自身のカードには表示しない */}
      {!isSelf && (
        <button
          onClick={onToggleFollow}
          className={`shrink-0 px-6 py-2.5 rounded-full text-[14px] font-semibold transition-colors ${
            isFollowing
              ? 'bg-bg-card border border-border-strong text-text-primary hover:bg-accent-red/10 hover:border-accent-red hover:text-accent-red'
              : 'bg-accent-blue text-white hover:bg-accent-blue/90'
          }`}
        >
          {isFollowing ? 'フォロー中' : 'フォロー'}
        </button>
      )}
    </div>
  )
}
