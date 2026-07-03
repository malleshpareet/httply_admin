import { NextResponse } from "next/server";
import db from "@/lib/db";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    // 1. Fetch OS/Process metrics from the user application (endpoint)
    let appMetrics = { memoryMB: "0", health: "Unreachable", uptimeSeconds: 0 };
    try {
      const res = await fetch(process.env.NEXT_PUBLIC_ENDPOINT_URL || "https://app.httply.qzz.io/api/metrics", { 
        cache: 'no-store' 
      });
      if (res.ok) {
        appMetrics = await res.json();
      }
    } catch (proxyError) {
      // User application is offline, fallback values will be used.
    }

    // 2. Fetch Database Metrics
    let dbSize = "Unknown";
    try {
      const result: any = await db.$queryRaw`SELECT pg_size_pretty(pg_database_size(current_database())) as size`;
      if (result && result.length > 0) {
        dbSize = result[0].size;
      }
    } catch (dbError) {
      console.error("Failed to fetch database size:", dbError);
    }

    // 3. Fetch Advanced Analytics
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const [
      activeSessions,
      newUsersToday,
      totalRequests,
      settings
    ] = await Promise.all([
      db.session.count({
        where: { expiresAt: { gt: new Date() } },
      }),
      db.user.count({
        where: { createdAt: { gte: startOfDay } },
      }),
      db.request.count(),
      db.systemSettings.findUnique({ where: { id: "global" } })
    ]);
    
    return NextResponse.json({
      memoryMB: appMetrics.memoryMB,
      health: appMetrics.health,
      uptimeSeconds: appMetrics.uptimeSeconds,
      dbSize,
      activeSessions,
      newUsersToday,
      totalRequests,
      settings: settings || { maintenanceMode: false, allowSignups: true }
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch metrics", health: "Unhealthy" }, { status: 500 });
  }
}
