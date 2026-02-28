import { useUsers } from '../hooks/useUsers';
import type { PageView } from '../types';

interface UsersPageProps {
  onNavigate: (view: PageView) => void;
}

export function UsersPage({ onNavigate }: UsersPageProps) {
  const { users, loading, error, follow, unfollow } = useUsers();

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
    <main className="feed">
      <div className="feed-header">
        <h2>탐색하기</h2>
      </div>

      {loading && <div className="loading-state">불러오는 중...</div>}
      {error && <div className="error-state">⚠️ {error}</div>}

      <div className="users-list">
        {users.map((user) => (
          <div key={user.id} className="user-row">
            <button
              className="user-row-info"
              onClick={() => onNavigate({ page: 'profile', userId: user.id })}
            >
              <span className="avatar">{user.avatar}</span>
              <div className="user-row-text">
                <span className="user-row-name">{user.name}</span>
                <span className="user-row-handle">@{user.handle}</span>
                <span className="user-row-bio">{user.bio}</span>
                <div className="user-row-stats">
                  <span>팔로잉 {user.followingCount}</span>
                  <span>팔로워 {user.followerCount}</span>
                </div>
              </div>
            </button>

            {!user.isCurrentUser && (
              <button
                className={`follow-btn ${user.isFollowing ? 'following' : ''}`}
                onClick={() => handleFollowToggle(user.id, user.isFollowing)}
              >
                {user.isFollowing ? '팔로잉' : '팔로우'}
              </button>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}
