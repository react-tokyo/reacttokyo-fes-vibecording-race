import type { UserWithStats } from "shared";
import FollowButton from "./FollowButton";

interface ProfileHeaderProps {
  user: UserWithStats | undefined;
  currentUserId: number;
}

export default function ProfileHeader({ user, currentUserId }: ProfileHeaderProps) {
  if (!user) return null;

  const isOwnProfile = user.id === currentUserId;

  return (
    <div className="border-b border-x-border p-4">
      <div className="flex items-start justify-between">
        <img
          src={user.avatarUrl}
          alt={user.displayName}
          className="h-20 w-20 rounded-full bg-x-secondary"
        />
        {!isOwnProfile && (
          <FollowButton
            targetUserId={user.id}
            isFollowing={user.isFollowing ?? false}
          />
        )}
      </div>

      <div className="mt-3">
        <h2 className="text-xl font-bold">{user.displayName}</h2>
        <p className="text-x-secondary">@{user.username}</p>
      </div>

      {user.bio && <p className="mt-3">{user.bio}</p>}

      <div className="mt-3 flex gap-4">
        <span>
          <span className="font-bold">{user.followingCount}</span>{" "}
          <span className="text-x-secondary">Following</span>
        </span>
        <span>
          <span className="font-bold">{user.followerCount}</span>{" "}
          <span className="text-x-secondary">Followers</span>
        </span>
      </div>
    </div>
  );
}
