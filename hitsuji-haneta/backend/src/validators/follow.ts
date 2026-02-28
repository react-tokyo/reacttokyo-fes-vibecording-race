import { z } from "zod";

export const followSchema = z
  .object({
    followerId: z.number().int().positive(),
    followingId: z.number().int().positive(),
  })
  .refine((data) => data.followerId !== data.followingId, {
    message: "Cannot follow yourself",
  });
