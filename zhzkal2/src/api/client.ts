import type { User, UserWithStats, UserProfile, PostWithAuthor } from '../types';

export const CURRENT_USER_ID = 'user1';

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    headers: {
      'Content-Type': 'application/json',
      'X-User-Id': CURRENT_USER_ID,
      ...options?.headers,
    },
    ...options,
  });

  const json = (await res.json()) as { data?: T; error?: string };

  if (!res.ok) {
    throw new Error(json.error ?? `HTTP ${res.status}`);
  }

  return json.data as T;
}

export const api = {
  getMe: () => apiFetch<User>('/api/users/me'),

  getUsers: () => apiFetch<UserWithStats[]>('/api/users'),

  getUser: (id: string) => apiFetch<UserProfile>(`/api/users/${id}`),

  follow: (id: string) =>
    apiFetch<{ following: boolean }>(`/api/users/${id}/follow`, { method: 'POST' }),

  unfollow: (id: string) =>
    apiFetch<{ following: boolean }>(`/api/users/${id}/follow`, { method: 'DELETE' }),

  getTimeline: () => apiFetch<PostWithAuthor[]>('/api/timeline'),

  createPost: (content: string) =>
    apiFetch<PostWithAuthor>('/api/posts', {
      method: 'POST',
      body: JSON.stringify({ content }),
    }),
};
