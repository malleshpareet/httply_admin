"use client";

import { useEnvironments, useDeleteEnvironment } from "@/hooks/use-environments";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2, MoreHorizontal, Trash2, Globe } from "lucide-react";
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

export function EnvironmentsTable() {
  const { data, isLoading, isError } = useEnvironments(100);
  const deleteEnvironmentMutation = useDeleteEnvironment();

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
        Failed to load environments.
      </div>
    );
  }

  return (
    <div className="rounded-md border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Environment Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Workspace</TableHead>
            <TableHead>Collection</TableHead>
            <TableHead className="text-center">Variables</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.environments.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                No environments found.
              </TableCell>
            </TableRow>
          ) : (
            data.environments.map((env) => {
              // Safely count variables in the JSON
              let varsCount = 0;
              if (env.values && typeof env.values === 'object') {
                varsCount = Object.keys(env.values).length;
              }

              return (
                <TableRow key={env.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-md border bg-muted">
                        <Globe className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <span className="font-medium text-sm">{env.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={env.type === "GLOBAL" ? "default" : "secondary"} className="text-xs">
                      {env.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium text-sm text-muted-foreground">{env.workspace.name}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {env.collection?.name || <span className="italic">N/A</span>}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline" className="font-mono">{varsCount}</Badge>
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
                            onClick={() => navigator.clipboard.writeText(env.id)}
                          >
                            Copy environment ID
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-destructive focus:text-destructive"
                            disabled={deleteEnvironmentMutation.isPending}
                            onClick={() => {
                              if (window.confirm("Are you sure you want to delete this environment? Any requests relying on these variables might fail.")) {
                                deleteEnvironmentMutation.mutate(env.id);
                              }
                            }}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Environment
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}
