"use server";

import db from "@/lib/db";
import { z } from "zod";

const getMembersSchema = z.object({
  limit: z.number().optional().default(100),
  offset: z.number().optional().default(0),
});

export async function getMembersAction(input?: { limit?: number; offset?: number; }) {
  const parsed = getMembersSchema.parse(input || {});
  
  const [members, totalCount] = await Promise.all([
    db.workspaceMember.findMany({
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
        },
        workspace: {
          select: {
            id: true,
            name: true,
          }
        }
      }
    }),
    db.workspaceMember.count()
  ]);

  return {
    members,
    totalCount,
    hasMore: parsed.offset + members.length < totalCount
  };
}

export async function deleteMemberAction(memberId: string) {
  await db.workspaceMember.delete({
    where: { id: memberId },
  });
  return { success: true };
}
