import { useQuery } from "@tanstack/react-query";
import type { PostWithAuthor, ApiResponse } from "shared";

export function useTimeline(userId: number) {
  return useQuery<PostWithAuthor[]>({
    queryKey: ["timeline", userId],
    queryFn: async () => {
      const res = await fetch(`/api/timeline/${userId}`);
      const json: ApiResponse<PostWithAuthor[]> = await res.json();
      if (!json.success) throw new Error(json.error.message);
      return json.data;
    },
  });
}
