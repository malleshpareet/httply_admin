import { InvitesTable } from "@/components/invites-table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = {
  title: "Invites Management | Httply Admin",
};

export default function InvitesPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Invites</h1>
        <p className="text-muted-foreground">
          View and manage pending workspace invitations.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Invites</CardTitle>
          <CardDescription>
            A comprehensive list of all pending and expired invitations across workspaces.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <InvitesTable />
        </CardContent>
      </Card>
    </div>
  );
}
