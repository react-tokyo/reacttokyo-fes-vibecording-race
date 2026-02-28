import { NavLink } from 'react-router-dom'

/**
 * 全ページ共通のサイドバーコンポーネント
 * ナビゲーションリンクとログインユーザー情報を表示する
 */
export default function Sidebar() {
  return (
    <aside className="w-[280px] h-screen sticky top-0 flex flex-col bg-bg-card border-r border-border-subtle">
      {/* 上部: ロゴとナビゲーション */}
      <div className="flex-1 px-4 py-6">
        {/* ロゴ */}
        <div className="mb-6 px-2">
          <span className="text-accent-blue text-2xl font-bold tracking-tight">
            つぶやき
          </span>
        </div>

        {/* ナビゲーションリンク */}
        <nav className="flex flex-col gap-1">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `flex items-center gap-4 px-4 py-3 rounded-xl text-[18px] font-medium transition-colors ${
                isActive
                  ? 'text-accent-blue font-semibold'
                  : 'text-text-primary hover:bg-bg-hover'
              }`
            }
          >
            🏠 ホーム
          </NavLink>
          <NavLink
            to="/users"
            className={({ isActive }) =>
              `flex items-center gap-4 px-4 py-3 rounded-xl text-[18px] font-medium transition-colors ${
                isActive
                  ? 'text-accent-blue font-semibold'
                  : 'text-text-primary hover:bg-bg-hover'
              }`
            }
          >
            👥 ユーザー
          </NavLink>
          <NavLink
            to="/users/1"
            className={({ isActive }) =>
              `flex items-center gap-4 px-4 py-3 rounded-xl text-[18px] font-medium transition-colors ${
                isActive
                  ? 'text-accent-blue font-semibold'
                  : 'text-text-primary hover:bg-bg-hover'
              }`
            }
          >
            👤 プロフィール
          </NavLink>
        </nav>
      </div>

      {/* 下部: ログインユーザー情報 */}
      <div className="px-4 py-4 border-t border-border-subtle">
        <div className="flex items-center gap-3 px-2">
          {/* アバター */}
          <div className="w-10 h-10 rounded-full bg-accent-blue-light flex items-center justify-center text-accent-blue font-semibold text-sm shrink-0">
            田
          </div>
          {/* ユーザー情報 */}
          <div className="min-w-0">
            <p className="text-text-primary text-sm font-semibold truncate">田中太郎</p>
            <p className="text-text-tertiary text-sm truncate">@tanaka</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
