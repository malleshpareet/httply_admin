"use server";

import db from "@/lib/db";
import { z } from "zod";

const getWorkspacesSchema = z.object({
  limit: z.number().optional().default(100),
  offset: z.number().optional().default(0),
});

export async function getWorkspacesAction(input?: { limit?: number; offset?: number; }) {
  const parsed = getWorkspacesSchema.parse(input || {});
  
  const [workspaces, totalCount] = await Promise.all([
    db.workspace.findMany({
      take: parsed.limit,
      skip: parsed.offset,
      orderBy: { createdAt: "desc" },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          }
        },
        _count: {
          select: {
            members: true,
            collections: true,
            environments: true,
          }
        }
      }
    }),
    db.workspace.count()
  ]);

  return {
    workspaces,
    totalCount,
    hasMore: parsed.offset + workspaces.length < totalCount
  };
}

export async function deleteWorkspaceAction(workspaceId: string) {
  await db.workspace.delete({
    where: { id: workspaceId },
  });
  return { success: true };
}
