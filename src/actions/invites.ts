"use server";

import db from "@/lib/db";
import { z } from "zod";

const getInvitesSchema = z.object({
  limit: z.number().optional().default(100),
  offset: z.number().optional().default(0),
});

export async function getInvitesAction(input?: { limit?: number; offset?: number; }) {
  const parsed = getInvitesSchema.parse(input || {});
  
  const [invites, totalCount] = await Promise.all([
    db.workspaceInvite.findMany({
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
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          }
        }
      }
    }),
    db.workspaceInvite.count()
  ]);

  return {
    invites,
    totalCount,
    hasMore: parsed.offset + invites.length < totalCount
  };
}

export async function deleteInviteAction(inviteId: string) {
  await db.workspaceInvite.delete({
    where: { id: inviteId },
  });
  return { success: true };
}
