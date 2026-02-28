import { z } from "zod";

export const idParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const currentUserQuerySchema = z.object({
  currentUserId: z.coerce.number().int().positive().optional(),
});
