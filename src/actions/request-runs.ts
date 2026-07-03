"use server";

import db from "@/lib/db";
import { z } from "zod";

const getRequestRunsSchema = z.object({
  limit: z.number().optional().default(100),
  offset: z.number().optional().default(0),
});

export async function getRequestRunsAction(input?: { limit?: number; offset?: number; }) {
  const parsed = getRequestRunsSchema.parse(input || {});
  
  const [runs, totalCount] = await Promise.all([
    db.requestRun.findMany({
      take: parsed.limit,
      skip: parsed.offset,
      orderBy: { createdAt: "desc" },
      include: {
        request: {
          select: {
            id: true,
            name: true,
            method: true,
          }
        }
      }
    }),
    db.requestRun.count()
  ]);

  return {
    runs,
    totalCount,
    hasMore: parsed.offset + runs.length < totalCount
  };
}

export async function deleteRequestRunAction(runId: string) {
  await db.requestRun.delete({
    where: { id: runId },
  });
  return { success: true };
}
