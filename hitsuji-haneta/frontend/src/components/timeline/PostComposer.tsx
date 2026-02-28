import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ApiResponse, PostWithAuthor } from "shared";

interface PostComposerProps {
  authorId: number;
}

export default function PostComposer({ authorId }: PostComposerProps) {
  const [content, setContent] = useState("");
  const qc = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (text: string) => {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ authorId, content: text }),
      });
      const json: ApiResponse<PostWithAuthor> = await res.json();
      if (!json.success) throw new Error(json.error.message);
      return json.data;
    },
    onSuccess: () => {
      setContent("");
      qc.invalidateQueries({ queryKey: ["timeline"] });
      qc.invalidateQueries({ queryKey: ["userPosts"] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = content.trim();
    if (!trimmed) return;
    mutation.mutate(trimmed);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 p-4">
      <div className="h-10 w-10 shrink-0 rounded-full bg-x-secondary" />
      <div className="flex-1">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What is happening?!"
          className="w-full resize-none bg-transparent p-2 text-lg text-x-text placeholder-x-secondary outline-none"
          rows={3}
          maxLength={280}
        />
        <div className="flex items-center justify-between border-t border-x-border pt-3">
          <span className="text-sm text-x-secondary">{content.length}/280</span>
          <button
            type="submit"
            disabled={!content.trim() || mutation.isPending}
            className="rounded-full bg-x-blue px-5 py-2 font-bold text-white transition-colors hover:bg-x-blue-hover disabled:opacity-50"
          >
            {mutation.isPending ? "Posting..." : "Post"}
          </button>
        </div>
      </div>
    </form>
  );
}
