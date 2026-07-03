"use server";

import db from "@/lib/db";
import { z } from "zod";

const getCollectionsSchema = z.object({
  limit: z.number().optional().default(100),
  offset: z.number().optional().default(0),
});

export async function getCollectionsAction(input?: { limit?: number; offset?: number; }) {
  const parsed = getCollectionsSchema.parse(input || {});
  
  const [collections, totalCount] = await Promise.all([
    db.collection.findMany({
      take: parsed.limit,
      skip: parsed.offset,
      orderBy: { createdAt: "desc" },
      include: {
        workspace: {
          select: {
            id: true,
            name: true,
          }
        },
        _count: {
          select: {
            requests: true,
            environments: true,
          }
        }
      }
    }),
    db.collection.count()
  ]);

  return {
    collections,
    totalCount,
    hasMore: parsed.offset + collections.length < totalCount
  };
}

export async function deleteCollectionAction(collectionId: string) {
  await db.collection.delete({
    where: { id: collectionId },
  });
  return { success: true };
}
