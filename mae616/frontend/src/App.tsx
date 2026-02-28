import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Timeline from './pages/Timeline'
import Users from './pages/Users'
import Profile from './pages/Profile'

/**
 * アプリケーションのルートコンポーネント
 * サイドバー共通レイアウト + ページルーティングを管理する
 */
function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen bg-bg-page">
        {/* 左サイドバー: 全ページ共通 */}
        <Sidebar />
        {/* メインコンテンツ: ルートに応じて切り替わる */}
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Timeline />} />
            <Route path="/users" element={<Users />} />
            <Route path="/users/:id" element={<Profile />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
