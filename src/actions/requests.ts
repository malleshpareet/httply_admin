"use server";

import db from "@/lib/db";
import { z } from "zod";

const getRequestsSchema = z.object({
  limit: z.number().optional().default(100),
  offset: z.number().optional().default(0),
});

export async function getRequestsAction(input?: { limit?: number; offset?: number; }) {
  const parsed = getRequestsSchema.parse(input || {});
  
  const [requests, totalCount] = await Promise.all([
    db.request.findMany({
      take: parsed.limit,
      skip: parsed.offset,
      orderBy: { createdAt: "desc" },
      include: {
        collection: {
          select: {
            id: true,
            name: true,
            workspace: {
              select: {
                id: true,
                name: true,
              }
            }
          }
        },
        _count: {
          select: {
            runs: true,
          }
        }
      }
    }),
    db.request.count()
  ]);

  return {
    requests,
    totalCount,
    hasMore: parsed.offset + requests.length < totalCount
  };
}

export async function deleteRequestAction(requestId: string) {
  await db.request.delete({
    where: { id: requestId },
  });
  return { success: true };
}
