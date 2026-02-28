import { supabase } from './db.js';

export interface User {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  bio: string;
  createdAt: string;
}

export interface Post {
  id: string;
  authorId: string;
  content: string;
  createdAt: string;
}

// DB row types (snake_case from Supabase)
interface UserRow {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  bio: string;
  created_at: string;
}

interface PostRow {
  id: string;
  author_id: string;
  content: string;
  created_at: string;
}

interface FollowRow {
  follower_id: string;
  following_id: string;
}

function toUser(row: UserRow): User {
  return {
    id: row.id,
    name: row.name,
    handle: row.handle,
    avatar: row.avatar,
    bio: row.bio,
    createdAt: row.created_at,
  };
}

function toPost(row: PostRow): Post {
  return {
    id: row.id,
    authorId: row.author_id,
    content: row.content,
    createdAt: row.created_at,
  };
}

// --- User ---

export async function getUsers(): Promise<User[]> {
  const { data, error } = await supabase.from('users').select('*').order('created_at');
  if (error) throw error;
  return (data as UserRow[]).map(toUser);
}

export async function getUserById(id: string): Promise<User | undefined> {
  const { data, error } = await supabase.from('users').select('*').eq('id', id).maybeSingle();
  if (error || !data) return undefined;
  return toUser(data as UserRow);
}

// --- Post ---

export async function getPostsByAuthor(authorId: string): Promise<Post[]> {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('author_id', authorId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data as PostRow[]).map(toPost);
}

export async function getPostsByAuthorIds(authorIds: string[]): Promise<Post[]> {
  if (authorIds.length === 0) return [];
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .in('author_id', authorIds)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data as PostRow[]).map(toPost);
}

export async function createPost(authorId: string, content: string): Promise<Post> {
  const { data, error } = await supabase
    .from('posts')
    .insert({ author_id: authorId, content })
    .select()
    .single();
  if (error) throw error;
  return toPost(data as PostRow);
}

// --- Follow ---

export async function isFollowing(followerId: string, followingId: string): Promise<boolean> {
  const { data } = await supabase
    .from('follows')
    .select('follower_id')
    .eq('follower_id', followerId)
    .eq('following_id', followingId)
    .maybeSingle();
  return data !== null;
}

export async function follow(followerId: string, followingId: string): Promise<void> {
  await supabase
    .from('follows')
    .upsert({ follower_id: followerId, following_id: followingId });
}

export async function unfollow(followerId: string, followingId: string): Promise<void> {
  await supabase
    .from('follows')
    .delete()
    .eq('follower_id', followerId)
    .eq('following_id', followingId);
}

export async function getFollowingIds(userId: string): Promise<string[]> {
  const { data, error } = await supabase
    .from('follows')
    .select('following_id')
    .eq('follower_id', userId);
  if (error) return [];
  return (data as Pick<FollowRow, 'following_id'>[]).map((f) => f.following_id);
}

export async function getFollowerIds(userId: string): Promise<string[]> {
  const { data, error } = await supabase
    .from('follows')
    .select('follower_id')
    .eq('following_id', userId);
  if (error) return [];
  return (data as Pick<FollowRow, 'follower_id'>[]).map((f) => f.follower_id);
}

// 팔로우 통계를 한 번에 fetch (users 목록용 N+1 방지)
export async function getAllFollows(): Promise<FollowRow[]> {
  const { data, error } = await supabase.from('follows').select('follower_id, following_id');
  if (error) return [];
  return data as FollowRow[];
}
