import type { User, Post } from "../types";

const API_BASE = "http://localhost:3001/api";

export async function fetchUsers(currentUserId: number): Promise<User[]> {
  const res = await fetch(`${API_BASE}/users?currentUserId=${currentUserId}`);
  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json();
}

export async function fetchUser(
  userId: number,
  currentUserId: number
): Promise<User> {
  const res = await fetch(
    `${API_BASE}/users/${userId}?currentUserId=${currentUserId}`
  );
  if (!res.ok) throw new Error("Failed to fetch user");
  return res.json();
}

export async function fetchUserPosts(userId: number): Promise<Post[]> {
  const res = await fetch(`${API_BASE}/users/${userId}/posts`);
  if (!res.ok) throw new Error("Failed to fetch posts");
  return res.json();
}

export async function fetchTimeline(userId: number): Promise<Post[]> {
  const res = await fetch(`${API_BASE}/posts/timeline/${userId}`);
  if (!res.ok) throw new Error("Failed to fetch timeline");
  return res.json();
}

export async function createPost(
  userId: number,
  content: string
): Promise<Post> {
  const res = await fetch(`${API_BASE}/posts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, content }),
  });
  if (!res.ok) throw new Error("Failed to create post");
  return res.json();
}

export async function followUser(
  followerId: number,
  followingId: number
): Promise<void> {
  const res = await fetch(`${API_BASE}/follows`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ followerId, followingId }),
  });
  if (!res.ok) throw new Error("Failed to follow user");
}

export async function unfollowUser(
  followerId: number,
  followingId: number
): Promise<void> {
  const res = await fetch(
    `${API_BASE}/follows?followerId=${followerId}&followingId=${followingId}`,
    { method: "DELETE" }
  );
  if (!res.ok) throw new Error("Failed to unfollow user");
}
