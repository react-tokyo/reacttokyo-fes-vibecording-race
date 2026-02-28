import { useState, useEffect, useCallback } from "react";
import {
  fetchUsers,
  fetchTimeline,
  followUser,
  unfollowUser,
} from "../api/client";
import type { User, Post } from "../types";
import PostForm from "../components/PostForm";
import UserCard from "../components/UserCard";
import PostItem from "../components/PostItem";

interface Props {
  currentUserId: number;
}

export default function HomePage({ currentUserId }: Props) {
  const [users, setUsers] = useState<User[]>([]);
  const [timeline, setTimeline] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      const [usersData, timelineData] = await Promise.all([
        fetchUsers(currentUserId),
        fetchTimeline(currentUserId),
      ]);
      setUsers(usersData);
      setTimeline(timelineData);
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setLoading(false);
    }
  }, [currentUserId]);

  useEffect(() => {
    setLoading(true);
    loadData();
  }, [loadData]);

  const handleFollow = async (userId: number, isFollowing: boolean) => {
    try {
      if (isFollowing) {
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

  return (
    <div className="home">
      <div className="timeline-section">
        <h2>タイムライン</h2>
        <PostForm currentUserId={currentUserId} onPostCreated={loadData} />
        <div className="posts">
          {timeline.length === 0 ? (
            <p className="empty">
              投稿がありません。ユーザーをフォローしてみましょう！
            </p>
          ) : (
            timeline.map((post) => <PostItem key={post.id} post={post} />)
          )}
        </div>
      </div>
      <aside className="sidebar">
        <h2>ユーザー一覧</h2>
        <div className="user-list">
          {users
            .filter((u) => u.id !== currentUserId)
            .map((user) => (
              <UserCard
                key={user.id}
                user={user}
                onFollow={() => handleFollow(user.id, user.is_following)}
              />
            ))}
        </div>
      </aside>
    </div>
  );
}
