import { useState } from 'react';
import type { PostWithAuthor } from '../types';

interface PostCardProps {
  post: PostWithAuthor;
  onUserClick?: (userId: string) => void;
}

function formatTime(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return '방금';
  if (mins < 60) return `${mins}분`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}시간`;
  return `${Math.floor(hours / 24)}일`;
}

function formatCount(n: number): string {
  if (n >= 10000) return `${(n / 10000).toFixed(1)}만`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}천`;
  return n.toString();
}

export function PostCard({ post, onUserClick }: PostCardProps) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [retweeted, setRetweeted] = useState(false);
  const [retweetCount, setRetweetCount] = useState(0);
  const [bookmarked, setBookmarked] = useState(false);

  const handleLike = () => {
    setLiked((prev) => !prev);
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
  };

  const handleRetweet = () => {
    setRetweeted((prev) => !prev);
    setRetweetCount((prev) => (retweeted ? prev - 1 : prev + 1));
  };

  return (
    <article className="post-card">
      <button
        className="post-avatar-btn"
        onClick={() => onUserClick?.(post.author.id)}
      >
        <span className="avatar">{post.author.avatar}</span>
      </button>

      <div className="post-body">
        <div className="post-header">
          <button
            className="post-author-btn"
            onClick={() => onUserClick?.(post.author.id)}
          >
            <span className="post-author-name">{post.author.name}</span>
            <span className="post-author-handle">@{post.author.handle}</span>
          </button>
          <span className="post-dot">·</span>
          <span className="post-time">{formatTime(post.createdAt)}</span>
        </div>

        <p className="post-content">{post.content}</p>

        <div className="post-actions">
          <button className="action-btn reply-btn">
            <span>💬</span>
            <span className="action-count">{formatCount(0)}</span>
          </button>

          <button
            className={`action-btn retweet-btn ${retweeted ? 'active' : ''}`}
            onClick={handleRetweet}
          >
            <span>🔁</span>
            <span className="action-count">{formatCount(retweetCount)}</span>
          </button>

          <button
            className={`action-btn like-btn ${liked ? 'active' : ''}`}
            onClick={handleLike}
          >
            <span>{liked ? '❤️' : '🤍'}</span>
            <span className="action-count">{formatCount(likeCount)}</span>
          </button>

          <button
            className={`action-btn bookmark-btn ${bookmarked ? 'active' : ''}`}
            onClick={() => setBookmarked((prev) => !prev)}
          >
            <span>{bookmarked ? '🔖' : '🏷️'}</span>
          </button>
        </div>
      </div>
    </article>
  );
}
