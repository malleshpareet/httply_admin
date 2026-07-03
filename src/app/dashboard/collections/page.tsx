import { CollectionsTable } from "@/components/collections-table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = {
  title: "Collections Management | Httply Admin",
};

export default function CollectionsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Collections</h1>
        <p className="text-muted-foreground">
          View and manage API collections across all workspaces.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Collections</CardTitle>
          <CardDescription>
            A comprehensive list of API collections, displaying request counts, environment configurations, and parent workspaces.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CollectionsTable />
        </CardContent>
      </Card>
    </div>
  );
}
