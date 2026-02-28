import type { TabId, PageView } from '../types';
import { useApp } from '../context/AppContext';

const HomeIcon = () => (
  <svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor">
    <path d="M12 1.696L.622 8.807l1.06 1.696L3 9.679V19.5C3 20.881 4.119 22 5.5 22h4a1 1 0 001-1v-6h3v6a1 1 0 001 1h4c1.381 0 2.5-1.119 2.5-2.5V9.679l1.318.824 1.06-1.696L12 1.696zM19 19.5c0 .276-.224.5-.5.5H16v-6a1 1 0 00-1-1h-5a1 1 0 00-1 1v6H5.5c-.276 0-.5-.224-.5-.5V8.429l7-4.375 7 4.375V19.5z"/>
  </svg>
);

const ExploreIcon = () => (
  <svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor">
    <path d="M10.25 3.75c-3.59 0-6.5 2.91-6.5 6.5s2.91 6.5 6.5 6.5c1.795 0 3.419-.726 4.596-1.904 1.178-1.177 1.904-2.801 1.904-4.596 0-3.59-2.91-6.5-6.5-6.5zm-8.5 6.5c0-4.694 3.806-8.5 8.5-8.5s8.5 3.806 8.5 8.5c0 1.986-.682 3.815-1.814 5.272l4.521 4.521-1.414 1.414-4.521-4.521A8.462 8.462 0 0110.25 18.75c-4.694 0-8.5-3.806-8.5-8.5z"/>
  </svg>
);

const BellIcon = () => (
  <svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor">
    <path d="M19.9 17.3c-.9-1-1.4-2-1.4-5.8 0-3.3-2.1-5.9-5-6.6V4c0-.6-.4-1-1-1s-1 .4-1 1v.9c-2.9.7-5 3.3-5 6.6 0 3.8-.5 4.8-1.4 5.8-.3.3-.4.7-.2 1.1.2.4.5.6.9.6H8c.5 1.2 1.6 2 2.8 2s2.3-.8 2.8-2h2.2c.4 0 .8-.2.9-.6.3-.4.2-.8-.1-1.1zM6.1 17c.7-1.1 1-2.5 1-5.5 0-2.8 2.2-5 5-5s5 2.2 5 5c0 3 .3 4.4 1 5.5H6.1z"/>
  </svg>
);

const MailIcon = () => (
  <svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor">
    <path d="M1.998 5.5c0-1.381 1.119-2.5 2.5-2.5h15c1.381 0 2.5 1.119 2.5 2.5v13c0 1.381-1.119 2.5-2.5 2.5h-15c-1.381 0-2.5-1.119-2.5-2.5v-13zm2.5-.5c-.276 0-.5.224-.5.5v2.764l8 3.638 8-3.638V5.5c0-.276-.224-.5-.5-.5h-15zm15.5 5.463l-7.5 3.41-7.5-3.41V18.5c0 .276.224.5.5.5h15c.276 0 .5-.224.5-.5v-8.037z"/>
  </svg>
);

const ZapIcon = () => (
  <svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor">
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
  </svg>
);

const ICONS: Record<TabId, () => JSX.Element> = {
  home: HomeIcon,
  explore: ExploreIcon,
  notifications: BellIcon,
  messages: MailIcon,
  skills: ZapIcon,
};

const NAV_ITEMS: { id: TabId; label: string }[] = [
  { id: 'home', label: '홈' },
  { id: 'explore', label: '탐색하기' },
  { id: 'notifications', label: '알림' },
  { id: 'messages', label: '메시지' },
  { id: 'skills', label: '사용 기술' },
];

interface SidebarProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  onNavigate: (view: PageView) => void;
}

export function Sidebar({ activeTab, onTabChange, onNavigate }: SidebarProps) {
  const { currentUser, currentUserId } = useApp();

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">𝕏</div>

      <nav className="sidebar-nav">
        {NAV_ITEMS.map((item) => {
          const Icon = ICONS[item.id];
          return (
            <button
              key={item.id}
              className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => onTabChange(item.id)}
            >
              <span className="nav-icon"><Icon /></span>
              <span className="nav-label">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <button className="post-button" onClick={() => onTabChange('home')}>
        포스트
      </button>

      <button
        className="profile-mini"
        onClick={() => onNavigate({ page: 'profile', userId: currentUserId })}
      >
        <span className="avatar">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
            <path d="M12 11.796c2.618 0 4.745-2.127 4.745-4.745S14.618 2.306 12 2.306 7.255 4.433 7.255 7.051 9.382 11.796 12 11.796zm0-7.49c1.516 0 2.745 1.23 2.745 2.745S13.516 9.796 12 9.796 9.255 10.566 9.255 7.051 10.484 4.306 12 4.306zM12 13.306c-4.418 0-8 2.239-8 5v1h16v-1c0-2.761-3.582-5-8-5z"/>
          </svg>
        </span>
        <div className="profile-mini-info">
          <span className="profile-name">{currentUser?.name ?? '로딩 중...'}</span>
          <span className="profile-handle">@{currentUser?.handle ?? ''}</span>
        </div>
      </button>
    </aside>
  );
}
