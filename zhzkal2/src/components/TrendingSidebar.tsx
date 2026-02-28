import { useUsers } from '../hooks/useUsers';
import type { PageView } from '../types';

const TRENDS = [
  { id: '1', category: '기술 · 트렌드', title: '#React18', postCount: 24800 },
  { id: '2', category: '일본 · 트렌드', title: '#ReactTokyo', postCount: 8420 },
  { id: '3', category: '기술 · 트렌드', title: '#TypeScript', postCount: 18300 },
  { id: '4', category: '기술 · 트렌드', title: '#VibecordingRace', postCount: 1240 },
  { id: '5', category: '기술 · 트렌드', title: '#Hono', postCount: 9600 },
];

interface TrendingSidebarProps {
  onNavigate?: (view: PageView) => void;
}

export function TrendingSidebar({ onNavigate }: TrendingSidebarProps) {
  const { users, follow, unfollow } = useUsers();
  const suggested = users.filter((u) => !u.isCurrentUser && !u.isFollowing).slice(0, 3);

  const handleFollowToggle = async (userId: string, isFollowing: boolean) => {
    try {
      if (isFollowing) {
        await unfollow(userId);
      } else {
        await follow(userId);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <aside className="trending-sidebar">
      <div className="search-box">
        <span className="search-icon">🔍</span>
        <input type="text" placeholder="검색" className="search-input" />
      </div>

      <div className="trending-card">
        <h3>지금 일어나고 있는 일</h3>
        {TRENDS.map((trend) => (
          <div key={trend.id} className="trend-item">
            <div className="trend-category">{trend.category}</div>
            <div className="trend-title">{trend.title}</div>
            <div className="trend-count">{trend.postCount.toLocaleString()}개의 포스트</div>
          </div>
        ))}
      </div>

      {suggested.length > 0 && (
        <div className="trending-card">
          <h3>팔로우할 만한 사람</h3>
          {suggested.map((user) => (
            <div key={user.id} className="suggested-user">
              <button
                className="post-avatar-btn"
                onClick={() => onNavigate?.({ page: 'profile', userId: user.id })}
              >
                <span className="avatar">{user.avatar}</span>
              </button>
              <button
                className="suggested-user-info"
                style={{ background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', color: 'inherit', padding: 0 }}
                onClick={() => onNavigate?.({ page: 'profile', userId: user.id })}
              >
                <span className="suggested-name">{user.name}</span>
                <span className="suggested-handle">@{user.handle}</span>
              </button>
              <button
                className={`follow-btn ${user.isFollowing ? 'following' : ''}`}
                onClick={() => handleFollowToggle(user.id, user.isFollowing)}
              >
                {user.isFollowing ? '팔로잉' : '팔로우'}
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="footer-links">
        <a href="#">서비스 약관</a>
        <a href="#">개인정보처리방침</a>
        <span>© 2026 X Corp.</span>
      </div>
    </aside>
  );
}
