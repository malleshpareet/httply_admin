import { SessionsTable } from "@/components/sessions-table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = {
  title: "Sessions Management | Httply Admin",
};

export default function SessionsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Sessions</h1>
        <p className="text-muted-foreground">
          View and manage active and historical user sessions.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Sessions</CardTitle>
          <CardDescription>
            A comprehensive list of user sessions across the platform, displaying connection details and expiration.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SessionsTable />
        </CardContent>
      </Card>
    </div>
  );
}
