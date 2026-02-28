import { useState, useEffect, useCallback } from 'react';
import { api } from '../api/client';
import type { UserWithStats } from '../types';

export function useUsers() {
  const [users, setUsers] = useState<UserWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getUsers();
      setUsers(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : '유저 목록을 불러오지 못했습니다');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const follow = useCallback(async (userId: string) => {
    await api.follow(userId);
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId
          ? { ...u, isFollowing: true, followerCount: u.followerCount + 1 }
          : u,
      ),
    );
  }, []);

  const unfollow = useCallback(async (userId: string) => {
    await api.unfollow(userId);
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId
          ? { ...u, isFollowing: false, followerCount: u.followerCount - 1 }
          : u,
      ),
    );
  }, []);

  return { users, loading, error, follow, unfollow };
}
