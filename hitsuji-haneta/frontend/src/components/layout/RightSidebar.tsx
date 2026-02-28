import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import type { User, ApiResponse } from "shared";
import FollowButton from "../user/FollowButton";

export default function RightSidebar() {
  const { currentUserId } = useCurrentUser();
  const { data: users } = useQuery<(User & { isFollowing?: boolean })[]>({
    queryKey: ["users", currentUserId],
    queryFn: async () => {
      const res = await fetch(`/api/users?currentUserId=${currentUserId}`);
      const json: ApiResponse<(User & { isFollowing?: boolean })[]> = await res.json();
      if (!json.success) throw new Error(json.error.message);
      return json.data;
    },
  });

  const otherUsers = users?.filter((u) => u.id !== currentUserId) ?? [];

  return (
    <div className="p-4">
      <div className="rounded-2xl bg-x-card p-4">
        <h2 className="mb-4 text-xl font-bold">Who to follow</h2>
        <ul className="space-y-4">
          {otherUsers.map((user) => (
            <li key={user.id} className="flex items-center justify-between">
              <Link
                to={`/profile/${user.id}`}
                className="flex items-center gap-3 hover:underline"
              >
                <img
                  src={user.avatarUrl}
                  alt={user.displayName}
                  className="h-10 w-10 rounded-full bg-x-secondary"
                />
                <div>
                  <p className="font-bold leading-tight">{user.displayName}</p>
                  <p className="text-sm text-x-secondary">@{user.username}</p>
                </div>
              </Link>
              <FollowButton
                targetUserId={user.id}
                isFollowing={user.isFollowing ?? false}
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
