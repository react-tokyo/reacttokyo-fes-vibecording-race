import { useState, useEffect, useCallback, useTransition } from 'react';
import { api } from '../api/client';
import type { PostWithAuthor } from '../types';

export function useTimeline() {
  const [posts, setPosts] = useState<PostWithAuthor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const fetchTimeline = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getTimeline();
      setPosts(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : '타임라인을 불러오지 못했습니다');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTimeline();
  }, [fetchTimeline]);

  // useTransition으로 UI 블로킹 없이 새 포스트 추가 (React 18)
  const createPost = useCallback(async (content: string) => {
    if (!content.trim()) return;
    const newPost = await api.createPost(content);
    startTransition(() => {
      setPosts((prev) => [newPost, ...prev]);
    });
  }, []);

  return { posts, loading, error, isPending, createPost };
}
