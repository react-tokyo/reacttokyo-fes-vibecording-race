import { useQuery } from "@tanstack/react-query";
import type { UserWithStats, ApiResponse } from "shared";

export function useUser(userId: string, currentUserId: number) {
  return useQuery<UserWithStats>({
    queryKey: ["user", userId, currentUserId],
    queryFn: async () => {
      const res = await fetch(`/api/users/${userId}?currentUserId=${currentUserId}`);
      const json: ApiResponse<UserWithStats> = await res.json();
      if (!json.success) throw new Error(json.error.message);
      return json.data;
    },
  });
}
