export interface User {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  bio: string;
  createdAt: string;
}

export interface UserWithStats extends User {
  followingCount: number;
  followerCount: number;
  isFollowing: boolean;
  isCurrentUser: boolean;
}

export interface Post {
  id: string;
  authorId: string;
  content: string;
  createdAt: string;
}

export interface PostWithAuthor extends Post {
  author: User;
}

export interface UserProfile extends UserWithStats {
  posts: PostWithAuthor[];
}

export type PageView =
  | { page: 'home' }
  | { page: 'explore' }
  | { page: 'notifications' }
  | { page: 'messages' }
  | { page: 'profile'; userId: string }
  | { page: 'skills' };

export type TabId = 'home' | 'explore' | 'notifications' | 'messages' | 'skills';
