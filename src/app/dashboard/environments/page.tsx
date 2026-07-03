import { EnvironmentsTable } from "@/components/environments-table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = {
  title: "Environments Management | Httply Admin",
};

export default function EnvironmentsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Environments</h1>
        <p className="text-muted-foreground">
          View and manage global and collection-level variable environments.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Environments</CardTitle>
          <CardDescription>
            A comprehensive list of all variable environments, displaying their scope (global vs collection) and variable counts.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EnvironmentsTable />
        </CardContent>
      </Card>
    </div>
  );
}
