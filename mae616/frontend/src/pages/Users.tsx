import { useState, useEffect } from 'react'
import UserCard from '../components/UserCard'

/** ログイン中のユーザーID（認証なし・固定値） */
const VIEWER_ID = 1

/** APIから取得するユーザー情報の型 */
interface User {
  id: number
  username: string
  displayName: string
}

/** ユーザーIDをキーにしたフォロー状態マップ */
type FollowMap = Map<number, boolean>

/**
 * ユーザー一覧ページ
 * 全ユーザーを表示し、フォロー状態を管理する
 */
export default function Users() {
  const [users, setUsers] = useState<User[]>([])
  const [followMap, setFollowMap] = useState<FollowMap>(new Map())
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        // 全ユーザーを取得
        const usersRes = await fetch('/api/users')
        if (!usersRes.ok) throw new Error('ユーザー一覧の取得に失敗')
        const allUsers: User[] = await usersRes.json()
        setUsers(allUsers)

        // ビューアー以外の全ユーザーについて isFollowing をパラレルfetch
        // ユーザー数が少ない（6人程度）ので N+1 でも問題ない
        const followChecks = allUsers
          .filter((u) => u.id !== VIEWER_ID)
          .map(async (u) => {
            const res = await fetch(`/api/users/${u.id}?viewerId=${VIEWER_ID}`)
            if (!res.ok) return { id: u.id, isFollowing: false }
            const data = await res.json()
            return { id: u.id, isFollowing: data.isFollowing ?? false }
          })

        const results = await Promise.all(followChecks)
        const map: FollowMap = new Map(results.map((r) => [r.id, r.isFollowing]))
        setFollowMap(map)
      } catch (err) {
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  /**
   * フォロー/アンフォローをトグルする
   * APIレスポンス成功後にローカルstateを即時反転して楽観的更新を実現
   */
  async function handleToggleFollow(targetId: number) {
    const currentlyFollowing = followMap.get(targetId) ?? false
    try {
      const res = await fetch('/api/follow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          followerId: VIEWER_ID,
          followeeId: targetId,
        }),
      })
      if (!res.ok) throw new Error('フォロー操作に失敗')
      // 即時ローカル反映
      setFollowMap((prev) => new Map(prev).set(targetId, !currentlyFollowing))
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="max-w-[600px] border-x border-border-subtle min-h-screen bg-bg-card">
      {/* ページヘッダー */}
      <header className="sticky top-0 z-10 bg-bg-card/90 backdrop-blur-sm border-b border-border-subtle px-4 py-3">
        <h1 className="text-text-primary font-bold text-[20px]">ユーザー</h1>
      </header>

      {/* ユーザーリスト */}
      {isLoading ? (
        <div className="flex justify-center py-12 text-text-tertiary">読み込み中...</div>
      ) : users.length === 0 ? (
        <div className="flex justify-center py-12 text-text-tertiary">ユーザーが見つかりません</div>
      ) : (
        <div>
          {users.map((user) => (
            <UserCard
              key={user.id}
              user={user}
              isFollowing={followMap.get(user.id) ?? false}
              isSelf={user.id === VIEWER_ID}
              onToggleFollow={() => handleToggleFollow(user.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
