import type { User } from "./user";

export interface Post {
  id: number;
  authorId: number;
  content: string;
  createdAt: string;
}

export interface PostWithAuthor extends Post {
  author: User;
}
