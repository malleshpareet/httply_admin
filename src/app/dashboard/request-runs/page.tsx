import { RequestRunsTable } from "@/components/request-runs-table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = {
  title: "Request Runs | Httply Admin",
};

export default function RequestRunsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Request Runs</h1>
        <p className="text-muted-foreground">
          View execution history and performance metrics of all API requests.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Execution History</CardTitle>
          <CardDescription>
            A log of all API requests executed through the platform, displaying HTTP status codes, durations, and resolved URLs.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RequestRunsTable />
        </CardContent>
      </Card>
    </div>
  );
}
