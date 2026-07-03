"use server";

import db from "@/lib/db";
import { getUsersSchema } from "@/lib/validations/users";

export async function getUsersAction(input?: { limit?: number; offset?: number; search?: string }) {
  // Validate input with Zod
  const parsed = getUsersSchema.parse(input || {});
  
  // Prepare where clause for optional search
  const where = parsed.search ? {
    OR: [
      { name: { contains: parsed.search, mode: "insensitive" as const } },
      { email: { contains: parsed.search, mode: "insensitive" as const } },
    ]
  } : {};

  // Fetch users with Prisma
  const [users, totalCount] = await Promise.all([
    db.user.findMany({
      where,
      take: parsed.limit,
      skip: parsed.offset,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
        image: true,
        banned: true,
        createdAt: true,
        _count: {
          select: {
            workspaces: true,
            memberships: true,
          }
        }
      }
    }),
    db.user.count({ where })
  ]);

  return {
    users,
    totalCount,
    hasMore: parsed.offset + users.length < totalCount
  };
}

export async function toggleUserBlockAction(input: { userId: string; isBanned: boolean; banReason?: string }) {
  // We can import the schema directly or use it here.
  const { toggleUserBlockSchema } = await import("@/lib/validations/users");
  const parsed = toggleUserBlockSchema.parse(input);

  const updatedUser = await db.user.update({
    where: { id: parsed.userId },
    data: {
      banned: parsed.isBanned,
      banReason: parsed.isBanned ? parsed.banReason : null,
    },
  });

  return updatedUser;
}
