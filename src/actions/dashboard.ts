"use server";

import db from "@/lib/db";
import { getDashboardMetricsSchema, getDashboardRunsSchema } from "@/lib/validations/dashboard";

export async function getDashboardMetricsAction(input?: { timeRange?: "all" | "today" | "week" | "month" }) {
  // Validate input with Zod
  const parsed = getDashboardMetricsSchema.parse(input || {});
  
  const [
    totalUsers,
    totalWorkspaces,
    totalCollections,
    totalRequests,
    activeSessions,
  ] = await Promise.all([
    db.user.count(),
    db.workspace.count(),
    db.collection.count(),
    db.request.count(),
    db.session.count({
      where: {
        expiresAt: {
          gt: new Date(),
        },
      },
    }),
  ]);

  return {
    totalUsers,
    totalWorkspaces,
    totalCollections,
    totalRequests,
    activeSessions,
  };
}

export async function getDashboardRunsAction(input?: { limit?: number }) {
  const parsed = getDashboardRunsSchema.parse(input || { limit: 100 });
  
  const runs = await db.requestRun.findMany({
    take: parsed.limit,
    orderBy: { createdAt: "desc" },
    include: { request: { select: { method: true, name: true, url: true } } },
  });

  return runs;
}

export async function getMostUsedCollectionsAction() {
  const collections = await db.collection.findMany({
    include: {
      _count: {
        select: { requests: true }
      },
      workspace: {
        select: { name: true }
      }
    },
    orderBy: {
      requests: {
        _count: 'desc'
      }
    },
    take: 5
  });
  return collections;
}

export async function getTopWorkspacesAction() {
  const workspaces = await db.workspace.findMany({
    include: {
      _count: {
        select: { members: true, collections: true }
      },
      owner: {
        select: { name: true, email: true }
      }
    },
    orderBy: {
      members: {
        _count: 'desc'
      }
    },
    take: 5
  });
  return workspaces;
}
