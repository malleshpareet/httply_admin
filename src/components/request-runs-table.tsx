"use client";

import { useRequestRuns, useDeleteRequestRun } from "@/hooks/use-request-runs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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

const getMethodColor = (method: string) => {
  switch (method) {
    case "GET":
      return "text-green-600 font-bold";
    case "POST":
      return "text-amber-600 font-bold";
    case "PUT":
      return "text-blue-600 font-bold";
    case "PATCH":
      return "text-purple-600 font-bold";
    case "DELETE":
      return "text-red-600 font-bold";
    default:
      return "text-gray-600 font-bold";
  }
};

const getStatusBadge = (status: number) => {
  if (status >= 200 && status < 300) {
    return <Badge variant="outline" className="text-green-600 bg-green-50 border-green-200">{status}</Badge>;
  }
  if (status >= 300 && status < 400) {
    return <Badge variant="outline" className="text-blue-600 bg-blue-50 border-blue-200">{status}</Badge>;
  }
  if (status >= 400 && status < 500) {
    return <Badge variant="outline" className="text-amber-600 bg-amber-50 border-amber-200">{status}</Badge>;
  }
  if (status >= 500) {
    return <Badge variant="outline" className="text-red-600 bg-red-50 border-red-200">{status}</Badge>;
  }
  return <Badge variant="outline" className="text-gray-600 bg-gray-50">{status}</Badge>;
};

export function RequestRunsTable() {
  const { data, isLoading, isError } = useRequestRuns(100);
  const deleteRunMutation = useDeleteRequestRun();

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
        Failed to load request runs.
      </div>
    );
  }

  return (
    <div className="rounded-md border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Request</TableHead>
            <TableHead>Executed URL</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead className="text-center">Time</TableHead>
            <TableHead className="text-right">Executed At</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.runs.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                No request run history found.
              </TableCell>
            </TableRow>
          ) : (
            data.runs.map((run) => (
              <TableRow key={run.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs w-12 ${getMethodColor(run.request.method)}`}>
                      {run.request.method}
                    </span>
                    <span className="font-medium text-sm">{run.request.name}</span>
                  </div>
                </TableCell>
                <TableCell className="max-w-[300px] truncate">
                  <span className="text-sm text-muted-foreground truncate block font-mono" title={run.resolvedUrl || ""}>
                    {run.resolvedUrl || <span className="italic">Unknown URL</span>}
                  </span>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex flex-col items-center gap-1">
                    {getStatusBadge(run.status)}
                    {run.statusText && (
                      <span className="text-[10px] text-muted-foreground uppercase">{run.statusText}</span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-center font-mono text-sm">
                  {run.durationMs ? `${run.durationMs}ms` : "-"}
                </TableCell>
                <TableCell className="text-right text-muted-foreground">
                  {format(new Date(run.createdAt), "MMM d, yyyy HH:mm:ss")}
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
                          onClick={() => navigator.clipboard.writeText(run.id)}
                        >
                          Copy run ID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="text-destructive focus:text-destructive"
                          disabled={deleteRunMutation.isPending}
                          onClick={() => {
                            if (window.confirm("Are you sure you want to delete this execution record?")) {
                              deleteRunMutation.mutate(run.id);
                            }
                          }}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Record
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
