"use server";

import db from "@/lib/db";
import { z } from "zod";

const getSessionsSchema = z.object({
  limit: z.number().optional().default(100),
  offset: z.number().optional().default(0),
});

export async function getSessionsAction(input?: { limit?: number; offset?: number; }) {
  const parsed = getSessionsSchema.parse(input || {});
  
  const [sessions, totalCount] = await Promise.all([
    db.session.findMany({
      take: parsed.limit,
      skip: parsed.offset,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          }
        }
      }
    }),
    db.session.count()
  ]);

  return {
    sessions,
    totalCount,
    hasMore: parsed.offset + sessions.length < totalCount
  };
}

export async function deleteSessionAction(sessionId: string) {
  await db.session.delete({
    where: { id: sessionId },
  });
  return { success: true };
}
