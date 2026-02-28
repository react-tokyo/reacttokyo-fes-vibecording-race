import { useState } from "react";
import { createPost } from "../api/client";

interface Props {
  currentUserId: number;
  onPostCreated: () => void;
}

export default function PostForm({ currentUserId, onPostCreated }: Props) {
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || submitting) return;

    setSubmitting(true);
    setError("");
    try {
      await createPost(currentUserId, content);
      setContent("");
      onPostCreated();
    } catch {
      setError("投稿に失敗しました");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="post-form" onSubmit={handleSubmit}>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="いまどうしてる？"
        rows={3}
        maxLength={280}
      />
      {error && <p className="error-text">{error}</p>}
      <div className="post-form-footer">
        <span className="char-count">{content.length}/280</span>
        <button type="submit" disabled={!content.trim() || submitting}>
          {submitting ? "投稿中..." : "投稿する"}
        </button>
      </div>
    </form>
  );
}
