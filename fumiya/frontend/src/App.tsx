import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { useState } from "react";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";

function App() {
  const [currentUserId, setCurrentUserId] = useState(1);

  return (
    <BrowserRouter>
      <div className="app">
        <header className="header">
          <Link to="/" className="logo">
            𝕏 Clone
          </Link>
          <div className="user-switcher">
            <label>ログインユーザー: </label>
            <select
              value={currentUserId}
              onChange={(e) => setCurrentUserId(Number(e.target.value))}
            >
              <option value={1}>fumiya</option>
              <option value={2}>tanaka</option>
              <option value={3}>suzuki</option>
              <option value={4}>yamada</option>
              <option value={5}>sato</option>
              <option value={6}>watanabe</option>
            </select>
          </div>
        </header>
        <main className="main">
          <Routes>
            <Route
              path="/"
              element={<HomePage currentUserId={currentUserId} />}
            />
            <Route
              path="/users/:id"
              element={<ProfilePage currentUserId={currentUserId} />}
            />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
