import { RequestsTable } from "@/components/requests-table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = {
  title: "API Requests Management | Httply Admin",
};

export default function RequestsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Requests</h1>
        <p className="text-muted-foreground">
          View and manage API requests configured within collections.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All API Requests</CardTitle>
          <CardDescription>
            A comprehensive list of all saved API requests, showing methods, URLs, and execution history counts.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RequestsTable />
        </CardContent>
      </Card>
    </div>
  );
}
