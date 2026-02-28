import type { PostWithAuthor } from "shared";
import PostCard from "./PostCard";
import LoadingSpinner from "../ui/LoadingSpinner";
import ErrorMessage from "../ui/ErrorMessage";

interface TimelineProps {
  posts: PostWithAuthor[] | undefined;
  isLoading: boolean;
  error: Error | null;
}

export default function Timeline({ posts, isLoading, error }: TimelineProps) {
  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message="Failed to load timeline." />;
  if (!posts || posts.length === 0) {
    return (
      <p className="p-8 text-center text-x-secondary">
        No posts yet. Follow someone to see their posts here.
      </p>
    );
  }

  return (
    <div>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
