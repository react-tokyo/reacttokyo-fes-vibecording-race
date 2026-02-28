import { useQuery } from "@tanstack/react-query";
import type { PostWithAuthor, ApiResponse } from "shared";

export function useUserPosts(userId: string) {
  return useQuery<PostWithAuthor[]>({
    queryKey: ["userPosts", userId],
    queryFn: async () => {
      const res = await fetch(`/api/users/${userId}/posts`);
      const json: ApiResponse<PostWithAuthor[]> = await res.json();
      if (!json.success) throw new Error(json.error.message);
      return json.data;
    },
  });
}
