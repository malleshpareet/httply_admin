"use server";

import db from "@/lib/db";
import { z } from "zod";

const getEnvironmentsSchema = z.object({
  limit: z.number().optional().default(100),
  offset: z.number().optional().default(0),
});

export async function getEnvironmentsAction(input?: { limit?: number; offset?: number; }) {
  const parsed = getEnvironmentsSchema.parse(input || {});
  
  const [environments, totalCount] = await Promise.all([
    db.environment.findMany({
      take: parsed.limit,
      skip: parsed.offset,
      include: {
        workspace: {
          select: {
            id: true,
            name: true,
          }
        },
        collection: {
          select: {
            id: true,
            name: true,
          }
        }
      }
    }),
    db.environment.count()
  ]);

  return {
    environments,
    totalCount,
    hasMore: parsed.offset + environments.length < totalCount
  };
}

export async function deleteEnvironmentAction(environmentId: string) {
  await db.environment.delete({
    where: { id: environmentId },
  });
  return { success: true };
}
