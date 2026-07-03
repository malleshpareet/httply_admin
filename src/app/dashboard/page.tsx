"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardMetrics } from "@/components/dashboard-metrics";
import { RequestChart } from "@/components/request-chart";
import { formatDistanceToNow } from "date-fns";
import { 
  getDashboardMetricsAction, 
  getDashboardRunsAction,
  getMostUsedCollectionsAction,
  getTopWorkspacesAction
} from "@/actions/dashboard";
import { useDashboardStore } from "@/store/dashboard-store";
import { Loader2, FolderOpen, Users, LayoutGrid } from "lucide-react";

export default function DashboardPage() {
  const { autoRefreshEnabled, refreshIntervalMs } = useDashboardStore();

  const { data: metricsData, isLoading: isMetricsLoading } = useQuery({
    queryKey: ["dashboard-metrics"],
    queryFn: () => getDashboardMetricsAction(),
    refetchInterval: autoRefreshEnabled ? refreshIntervalMs : false,
  });

  const { data: runsData, isLoading: isRunsLoading } = useQuery({
    queryKey: ["dashboard-runs"],
    queryFn: () => getDashboardRunsAction({ limit: 100 }),
    refetchInterval: autoRefreshEnabled ? refreshIntervalMs : false,
  });

  const { data: topCollections } = useQuery({
    queryKey: ["dashboard-top-collections"],
    queryFn: () => getMostUsedCollectionsAction(),
    refetchInterval: autoRefreshEnabled ? refreshIntervalMs : false,
  });

  const { data: topWorkspaces } = useQuery({
    queryKey: ["dashboard-top-workspaces"],
    queryFn: () => getTopWorkspacesAction(),
    refetchInterval: autoRefreshEnabled ? refreshIntervalMs : false,
  });

  if (isMetricsLoading || isRunsLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // Calculate chart data from the fetched runs
  const methodCounts = runsData?.reduce((acc, run) => {
    const method = run.request.method;
    acc[method] = (acc[method] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  const chartData = Object.entries(methodCounts).map(([name, total]) => ({
    name,
    total,
  }));

  // Recent 5 runs for the table
  const recentRuns = runsData?.slice(0, 5) || [];

  return (
    <div className="flex flex-1 flex-col gap-4">
      {metricsData && <DashboardMetrics data={metricsData} />}
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 lg:col-span-3">
          <CardHeader>
            <CardTitle>Top HTTP Methods</CardTitle>
            <CardDescription>
              A breakdown of the most popular request methods executed recently.
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <RequestChart data={chartData} />
          </CardContent>
        </Card>
        
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Request Runs</CardTitle>
            <CardDescription>
              The most recent API calls executed across all workspaces.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {recentRuns.map((run) => (
                <div key={run.id} className="flex items-center">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none truncate max-w-[200px]" title={run.request.name}>
                      {run.request.name}
                    </p>
                    <p className="text-xs text-muted-foreground truncate max-w-[200px]" title={run.resolvedUrl || run.request.url}>
                      {run.resolvedUrl || run.request.url}
                    </p>
                  </div>
                  <div className="ml-auto flex flex-col items-end gap-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold ${
                        run.status >= 200 && run.status < 300 ? "text-green-500" :
                        run.status >= 400 && run.status < 500 ? "text-orange-500" :
                        run.status >= 500 ? "text-red-500" : "text-muted-foreground"
                      }`}>
                        {run.status}
                      </span>
                      <span className="text-xs font-mono bg-muted px-1 rounded">
                        {run.durationMs}ms
                      </span>
                    </div>
                    <span className="text-[10px] text-muted-foreground">
                      {formatDistanceToNow(run.createdAt, { addSuffix: true })}
                    </span>
                  </div>
                </div>
              ))}
              
              {recentRuns.length === 0 && (
                <div className="text-sm text-muted-foreground text-center py-4">
                  No request runs yet.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* New Analytics Row */}
        <Card className="col-span-4 lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FolderOpen className="h-5 w-5 text-indigo-500" />
              Most Used Collections
            </CardTitle>
            <CardDescription>Collections with the highest number of saved requests.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topCollections?.map((col) => (
                <div key={col.id} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                  <div>
                    <p className="font-medium text-sm">{col.name}</p>
                    <p className="text-xs text-muted-foreground">{col.workspace.name}</p>
                  </div>
                  <div className="text-xs font-bold bg-indigo-500/10 text-indigo-500 px-2 py-1 rounded">
                    {col._count.requests} Requests
                  </div>
                </div>
              ))}
              {(!topCollections || topCollections.length === 0) && (
                <p className="text-xs text-muted-foreground text-center">No collections found.</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LayoutGrid className="h-5 w-5 text-emerald-500" />
              Top Workspaces
            </CardTitle>
            <CardDescription>Workspaces ranked by number of members and activity.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topWorkspaces?.map((ws) => (
                <div key={ws.id} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                  <div>
                    <p className="font-medium text-sm">{ws.name}</p>
                    <p className="text-xs text-muted-foreground">Owner: {ws.owner.name || ws.owner.email}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 text-xs font-medium text-muted-foreground" title="Members">
                      <Users className="h-3 w-3" />
                      {ws._count.members}
                    </div>
                    <div className="flex items-center gap-1 text-xs font-medium text-muted-foreground" title="Collections">
                      <FolderOpen className="h-3 w-3" />
                      {ws._count.collections}
                    </div>
                  </div>
                </div>
              ))}
              {(!topWorkspaces || topWorkspaces.length === 0) && (
                <p className="text-xs text-muted-foreground text-center">No workspaces found.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
