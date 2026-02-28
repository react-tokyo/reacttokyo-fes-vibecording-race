import { Link } from "react-router-dom";
import type { PostWithAuthor } from "shared";

export default function PostCard({ post }: { post: PostWithAuthor }) {
  const date = new Date(post.createdAt);
  const timeStr = date.toLocaleString("ja-JP", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <article className="flex gap-3 border-b border-x-border p-4 transition-colors hover:bg-x-card/50">
      <Link to={`/profile/${post.authorId}`} className="shrink-0">
        <img
          src={post.author.avatarUrl}
          alt={post.author.displayName}
          className="h-10 w-10 rounded-full bg-x-secondary"
        />
      </Link>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1">
          <Link
            to={`/profile/${post.authorId}`}
            className="truncate font-bold hover:underline"
          >
            {post.author.displayName}
          </Link>
          <span className="text-x-secondary">@{post.author.username}</span>
          <span className="text-x-secondary">·</span>
          <time className="text-x-secondary">{timeStr}</time>
        </div>
        <p className="mt-1 whitespace-pre-wrap break-words">{post.content}</p>
      </div>
    </article>
  );
}
