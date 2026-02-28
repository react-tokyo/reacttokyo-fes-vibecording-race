import { useState, useEffect, useCallback } from 'react';
import { api } from '../api/client';
import type { UserProfile } from '../types';

export function useProfile(userId: string) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    api
      .getUser(userId)
      .then(setProfile)
      .catch((e) => setError(e instanceof Error ? e.message : '프로필을 불러오지 못했습니다'))
      .finally(() => setLoading(false));
  }, [userId]);

  const follow = useCallback(async () => {
    await api.follow(userId);
    setProfile((prev) =>
      prev ? { ...prev, isFollowing: true, followerCount: prev.followerCount + 1 } : prev,
    );
  }, [userId]);

  const unfollow = useCallback(async () => {
    await api.unfollow(userId);
    setProfile((prev) =>
      prev ? { ...prev, isFollowing: false, followerCount: prev.followerCount - 1 } : prev,
    );
  }, [userId]);

  return { profile, loading, error, follow, unfollow };
}
