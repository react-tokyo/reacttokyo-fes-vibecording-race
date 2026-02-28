import { useProfile } from '../hooks/useProfile';
import { PostCard } from './PostCard';
import type { PageView } from '../types';

interface ProfilePageProps {
  userId: string;
  onNavigate: (view: PageView) => void;
  onBack: () => void;
}

export function ProfilePage({ userId, onNavigate, onBack }: ProfilePageProps) {
  const { profile, loading, error, follow, unfollow } = useProfile(userId);

  const handleFollowToggle = async () => {
    try {
      if (profile?.isFollowing) {
        await unfollow();
      } else {
        await follow();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <main className="feed">
      <div className="feed-header profile-feed-header">
        <button className="back-btn" onClick={onBack}>←</button>
        {profile && (
          <div>
            <h2 className="profile-header-name">{profile.name}</h2>
            <p className="profile-header-count">{profile.posts.length}개의 포스트</p>
          </div>
        )}
      </div>

      {loading && <div className="loading-state">불러오는 중...</div>}
      {error && <div className="error-state">⚠️ {error}</div>}

      {profile && (
        <>
          {/* 배너 */}
          <div className="profile-banner" />

          {/* 아바타 + 팔로우 버튼 행 */}
          <div className="profile-avatar-row">
            <div className="profile-avatar-xl">{profile.avatar}</div>
            {!profile.isCurrentUser && (
              <button
                className={`follow-btn ${profile.isFollowing ? 'following' : ''}`}
                onClick={handleFollowToggle}
              >
                {profile.isFollowing ? '팔로잉' : '팔로우'}
              </button>
            )}
          </div>

          {/* 이름 / 핸들 / 바이오 / 통계 */}
          <div className="profile-info">
            <h3 className="profile-display-name">{profile.name}</h3>
            <p className="profile-handle-text">@{profile.handle}</p>
            {profile.bio && <p className="profile-bio-text">{profile.bio}</p>}
            <div className="profile-stats">
              <span><strong>{profile.followingCount}</strong> 팔로잉</span>
              <span><strong>{profile.followerCount}</strong> 팔로워</span>
            </div>
          </div>

          {/* 포스트 탭 */}
          <div className="profile-tabs">
            <div className="profile-tab active">포스트</div>
          </div>

          {profile.posts.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">📝</span>
              <p>아직 포스트가 없습니다</p>
            </div>
          ) : (
            <div className="posts-list">
              {profile.posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onUserClick={(uid) => onNavigate({ page: 'profile', userId: uid })}
                />
              ))}
            </div>
          )}
        </>
      )}
    </main>
  );
}
