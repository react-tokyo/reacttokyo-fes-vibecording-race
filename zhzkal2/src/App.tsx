import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { TimelinePage } from './components/TimelinePage';
import { UsersPage } from './components/UsersPage';
import { ProfilePage } from './components/ProfilePage';
import { TrendingSidebar } from './components/TrendingSidebar';
import { SkillsPage } from './components/SkillsPage';
import type { PageView, TabId } from './types';
import './App.css';

function getActiveTab(view: PageView): TabId {
  if (view.page === 'profile') return 'explore';
  if (view.page === 'notifications' || view.page === 'messages') return view.page;
  return view.page as TabId;
}

function App() {
  const [view, setView] = useState<PageView>({ page: 'home' });

  const handleNavigate = (newView: PageView) => setView(newView);
  const handleTabChange = (tab: TabId) => setView({ page: tab });

  return (
    <div className="app">
      <Sidebar activeTab={getActiveTab(view)} onTabChange={handleTabChange} onNavigate={handleNavigate} />

      <div className="main-content">
        {view.page === 'home' && <TimelinePage onNavigate={handleNavigate} />}

        {view.page === 'explore' && <UsersPage onNavigate={handleNavigate} />}

        {view.page === 'profile' && (
          <ProfilePage
            userId={view.userId}
            onNavigate={handleNavigate}
            onBack={() => setView({ page: 'explore' })}
          />
        )}

        {view.page === 'skills' && <SkillsPage />}

        {(view.page === 'notifications' || view.page === 'messages') && (
          <main className="feed">
            <div className="feed-header">
              <h2>{view.page === 'notifications' ? '알림' : '메시지'}</h2>
            </div>
            <div className="empty-state">
              <span className="empty-icon">🔜</span>
              <p>준비 중입니다</p>
            </div>
          </main>
        )}

        <TrendingSidebar onNavigate={handleNavigate} />
      </div>
    </div>
  );
}

export default App;
