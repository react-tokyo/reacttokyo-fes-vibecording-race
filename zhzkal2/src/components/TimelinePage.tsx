import { useTimeline } from '../hooks/useTimeline';
import { PostComposer } from './PostComposer';
import { PostCard } from './PostCard';
import type { PageView } from '../types';

interface TimelinePageProps {
  onNavigate: (view: PageView) => void;
}

export function TimelinePage({ onNavigate }: TimelinePageProps) {
  const { posts, loading, error, isPending, createPost } = useTimeline();

  return (
    <main className="feed">
      <div className="feed-header">
        <h2>홈</h2>
      </div>

      <PostComposer onPost={createPost} />

      {loading && <div className="loading-state">불러오는 중...</div>}
      {error && <div className="error-state">⚠️ {error}</div>}

      {!loading && !error && posts.length === 0 && (
        <div className="empty-state">
          <span className="empty-icon">📭</span>
          <p>팔로우한 유저의 포스트가 없습니다</p>
          <p className="empty-sub">탐색하기에서 유저를 팔로우해보세요</p>
        </div>
      )}

      <div className={`posts-list ${isPending ? 'pending' : ''}`}>
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onUserClick={(userId) => onNavigate({ page: 'profile', userId })}
          />
        ))}
      </div>
    </main>
  );
}
