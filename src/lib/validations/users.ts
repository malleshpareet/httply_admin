import { z } from "zod";

export const getUsersSchema = z.object({
  limit: z.number().min(1).max(100).default(50),
  offset: z.number().min(0).default(0),
  search: z.string().optional(),
});

export const toggleUserBlockSchema = z.object({
  userId: z.string(),
  isBanned: z.boolean(),
  banReason: z.string().optional(),
});
