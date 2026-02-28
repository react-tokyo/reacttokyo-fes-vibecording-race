import { Link } from "react-router-dom";
import type { Post } from "../types";

interface Props {
  post: Post;
}

export default function PostItem({ post }: Props) {
  return (
    <div className="post-item">
      <div className="post-header">
        <Link to={`/users/${post.user_id}`} className="post-author">
          <strong>{post.display_name}</strong>
          <span className="username">@{post.username}</span>
        </Link>
        <span className="post-time">
          {new Date(post.created_at).toLocaleString("ja-JP")}
        </span>
      </div>
      <p className="post-content">{post.content}</p>
    </div>
  );
}
