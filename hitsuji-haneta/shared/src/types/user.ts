export interface User {
  id: number;
  username: string;
  displayName: string;
  bio: string;
  avatarUrl: string;
  createdAt: string;
}

export interface UserWithStats extends User {
  followingCount: number;
  followerCount: number;
  isFollowing?: boolean;
}
