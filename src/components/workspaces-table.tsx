"use client";

import { useWorkspaces, useDeleteWorkspace } from "@/hooks/use-workspaces";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { Loader2, MoreHorizontal, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuGroup,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

export function WorkspacesTable() {
  const { data, isLoading, isError } = useWorkspaces(100);
  const deleteWorkspaceMutation = useDeleteWorkspace();

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center border rounded-md">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex h-64 items-center justify-center border rounded-md text-destructive">
        Failed to load workspaces.
      </div>
    );
  }

  return (
    <div className="rounded-md border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Workspace Name</TableHead>
            <TableHead>Owner</TableHead>
            <TableHead className="text-center">Members</TableHead>
            <TableHead className="text-center">Collections</TableHead>
            <TableHead className="text-center">Environments</TableHead>
            <TableHead className="text-right">Created At</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.workspaces.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                No workspaces found.
              </TableCell>
            </TableRow>
          ) : (
            data.workspaces.map((workspace) => (
              <TableRow key={workspace.id}>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">{workspace.name}</span>
                    <span className="text-xs text-muted-foreground max-w-[200px] truncate" title={workspace.description || ""}>
                      {workspace.description || "No description"}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={workspace.owner.image || ""} alt={workspace.owner.name || ""} />
                      <AvatarFallback>
                        {workspace.owner.name?.substring(0, 2).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{workspace.owner.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {workspace.owner.email}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <Badge variant="secondary">{workspace._count.members}</Badge>
                </TableCell>
                <TableCell className="text-center">
                  <Badge variant="secondary">{workspace._count.collections}</Badge>
                </TableCell>
                <TableCell className="text-center">
                  <Badge variant="secondary">{workspace._count.environments}</Badge>
                </TableCell>
                <TableCell className="text-right text-muted-foreground">
                  {format(new Date(workspace.createdAt), "MMM d, yyyy")}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      }
                    />
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuGroup>
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={() => navigator.clipboard.writeText(workspace.id)}
                        >
                          Copy workspace ID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="text-destructive focus:text-destructive"
                          disabled={deleteWorkspaceMutation.isPending}
                          onClick={() => {
                            if (window.confirm("Are you sure you want to delete this workspace? This will delete all collections and environments within it.")) {
                              deleteWorkspaceMutation.mutate(workspace.id);
                            }
                          }}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Workspace
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
