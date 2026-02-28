import { z } from "zod";

export const createPostSchema = z.object({
  authorId: z.number().int().positive(),
  content: z
    .string()
    .min(1, "Content must be at least 1 character")
    .max(140, "Content must be at most 140 characters"),
});
