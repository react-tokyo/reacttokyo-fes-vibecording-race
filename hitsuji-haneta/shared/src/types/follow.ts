export interface Follow {
  id: number;
  followerId: number;
  followingId: number;
  createdAt: string;
}

export interface FollowRequest {
  followerId: number;
  followingId: number;
}
