import { Users, FolderOpen, Send, Shield } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DashboardMetricsProps {
  data: {
    totalUsers: number;
    totalWorkspaces: number;
    totalCollections: number;
    totalRequests: number;
    activeSessions: number;
  };
}

export function DashboardMetrics({ data }: DashboardMetricsProps) {
  const metrics = [
    {
      title: "Total Users",
      value: data.totalUsers,
      icon: Users,
      description: "Registered accounts",
    },
    {
      title: "Active Sessions",
      value: data.activeSessions,
      icon: Shield,
      description: "Currently logged in",
    },
    {
      title: "Total Workspaces",
      value: data.totalWorkspaces,
      icon: FolderOpen,
      description: "Across all users",
    },
    {
      title: "Saved Requests",
      value: data.totalRequests,
      icon: Send,
      description: `In ${data.totalCollections} collections`,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric) => (
        <Card key={metric.title}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              {metric.title}
            </CardTitle>
            <metric.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metric.value}</div>
            <p className="text-xs text-muted-foreground">
              {metric.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
