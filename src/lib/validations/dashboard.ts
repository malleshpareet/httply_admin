import { z } from "zod";

export const getDashboardMetricsSchema = z.object({
  // Adding a dummy parameter so we can validate it, e.g. for future date filtering
  timeRange: z.enum(["all", "today", "week", "month"]).default("all").optional(),
});

export const getDashboardRunsSchema = z.object({
  limit: z.number().min(1).max(100).default(5),
});
