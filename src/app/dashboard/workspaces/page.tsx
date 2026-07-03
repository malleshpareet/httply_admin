import { WorkspacesTable } from "@/components/workspaces-table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = {
  title: "Workspaces Management | Httply Admin",
};

export default function WorkspacesPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Workspaces</h1>
        <p className="text-muted-foreground">
          View and manage all workspaces across the platform.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Workspaces</CardTitle>
          <CardDescription>
            A comprehensive list of user workspaces, showing ownership, membership counts, and resource usage.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <WorkspacesTable />
        </CardContent>
      </Card>
    </div>
  );
}
