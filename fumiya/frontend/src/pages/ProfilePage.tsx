import { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import {
  fetchUser,
  fetchUserPosts,
  followUser,
  unfollowUser,
} from "../api/client";
import type { User, Post } from "../types";
import PostItem from "../components/PostItem";

interface Props {
  currentUserId: number;
}

export default function ProfilePage({ currentUserId }: Props) {
  const { id } = useParams<{ id: string }>();
  const userId = Number(id);
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      const [userData, postsData] = await Promise.all([
        fetchUser(userId, currentUserId),
        fetchUserPosts(userId),
      ]);
      setUser(userData);
      setPosts(postsData);
    } catch (error) {
      console.error("Failed to load profile:", error);
    } finally {
      setLoading(false);
    }
  }, [userId, currentUserId]);

  useEffect(() => {
    setLoading(true);
    loadData();
  }, [loadData]);

  const handleFollow = async () => {
    if (!user) return;
    try {
      if (user.is_following) {
        await unfollowUser(currentUserId, userId);
      } else {
        await followUser(currentUserId, userId);
      }
      await loadData();
    } catch (error) {
      console.error("Failed to toggle follow:", error);
    }
  };

  if (loading) return <div className="loading">読み込み中...</div>;
  if (!user) return <div className="error">ユーザーが見つかりません</div>;

  const isOwnProfile = currentUserId === userId;

  return (
    <div className="profile">
      <Link to="/" className="back-link">
        ← ホームに戻る
      </Link>
      <div className="profile-header">
        <div className="profile-info">
          <h1>{user.display_name}</h1>
          <span className="username">@{user.username}</span>
          <p className="bio">{user.bio}</p>
        </div>
        <div className="profile-stats">
          <span>
            <strong>{user.following_count}</strong> フォロー中
          </span>
          <span>
            <strong>{user.follower_count}</strong> フォロワー
          </span>
        </div>
        {!isOwnProfile && (
          <button
            className={`follow-btn ${user.is_following ? "following" : ""}`}
            onClick={handleFollow}
          >
            {user.is_following ? "フォロー中" : "フォローする"}
          </button>
        )}
      </div>
      <div className="profile-posts">
        <h2>投稿一覧</h2>
        {posts.length === 0 ? (
          <p className="empty">まだ投稿がありません</p>
        ) : (
          posts.map((post) => <PostItem key={post.id} post={post} />)
        )}
      </div>
    </div>
  );
}
