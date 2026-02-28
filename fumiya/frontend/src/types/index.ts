export interface User {
  id: number;
  username: string;
  display_name: string;
  bio: string;
  following_count: number;
  follower_count: number;
  is_following: boolean;
  created_at: string;
}

export interface Post {
  id: number;
  user_id: number;
  content: string;
  username: string;
  display_name: string;
  created_at: string;
}
