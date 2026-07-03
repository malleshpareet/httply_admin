import { MembersTable } from "@/components/members-table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = {
  title: "Members Management | Httply Admin",
};

export default function MembersPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Members</h1>
        <p className="text-muted-foreground">
          View and manage user memberships across all workspaces.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Workspace Members</CardTitle>
          <CardDescription>
            A comprehensive list of users and their respective workspace memberships and roles.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <MembersTable />
        </CardContent>
      </Card>
    </div>
  );
}
