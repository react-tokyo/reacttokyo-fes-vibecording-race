import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCurrentUser } from "../../contexts/CurrentUserContext";

interface FollowButtonProps {
  targetUserId: number;
  isFollowing: boolean;
}

export default function FollowButton({ targetUserId, isFollowing }: FollowButtonProps) {
  const { currentUserId } = useCurrentUser();
  const qc = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/follows", {
        method: isFollowing ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ followerId: currentUserId, followingId: targetUserId }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error.message);
      return json.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["users"] });
      qc.invalidateQueries({ queryKey: ["user"] });
      qc.invalidateQueries({ queryKey: ["timeline"] });
    },
  });

  return (
    <button
      onClick={() => mutation.mutate()}
      disabled={mutation.isPending}
      className={`rounded-full px-4 py-1.5 text-sm font-bold transition-colors ${
        isFollowing
          ? "border border-x-border text-x-text hover:border-red-500 hover:text-red-500"
          : "bg-x-text text-x-bg hover:opacity-90"
      }`}
    >
      {isFollowing ? "Following" : "Follow"}
    </button>
  );
}
