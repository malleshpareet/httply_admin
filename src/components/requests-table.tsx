"use client";

import { useRequests, useDeleteRequest } from "@/hooks/use-requests";
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
      return "text-green-600 bg-green-50 border-green-200";
    case "POST":
      return "text-amber-600 bg-amber-50 border-amber-200";
    case "PUT":
      return "text-blue-600 bg-blue-50 border-blue-200";
    case "PATCH":
      return "text-purple-600 bg-purple-50 border-purple-200";
    case "DELETE":
      return "text-red-600 bg-red-50 border-red-200";
    default:
      return "text-gray-600 bg-gray-50 border-gray-200";
  }
};

export function RequestsTable() {
  const { data, isLoading, isError } = useRequests(100);
  const deleteRequestMutation = useDeleteRequest();

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
        Failed to load requests.
      </div>
    );
  }

  return (
    <div className="rounded-md border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Method</TableHead>
            <TableHead>Request Name</TableHead>
            <TableHead>URL</TableHead>
            <TableHead>Location</TableHead>
            <TableHead className="text-center">Runs</TableHead>
            <TableHead className="text-right">Created At</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.requests.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                No API requests found.
              </TableCell>
            </TableRow>
          ) : (
            data.requests.map((request) => (
              <TableRow key={request.id}>
                <TableCell>
                  <Badge variant="outline" className={`font-mono text-xs w-16 justify-center ${getMethodColor(request.method)}`}>
                    {request.method}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className="font-medium text-sm">{request.name}</span>
                </TableCell>
                <TableCell className="max-w-[250px] truncate">
                  <span className="text-sm text-muted-foreground truncate block font-mono" title={request.url}>
                    {request.url || <span className="italic">No URL</span>}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="text-sm">{request.collection.name}</span>
                    <span className="text-xs text-muted-foreground">{request.collection.workspace.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <Badge variant="secondary">{request._count.runs}</Badge>
                </TableCell>
                <TableCell className="text-right text-muted-foreground">
                  {format(new Date(request.createdAt), "MMM d, yyyy")}
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
                          onClick={() => navigator.clipboard.writeText(request.id)}
                        >
                          Copy request ID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="text-destructive focus:text-destructive"
                          disabled={deleteRequestMutation.isPending}
                          onClick={() => {
                            if (window.confirm("Are you sure you want to delete this request? All associated runs will also be deleted.")) {
                              deleteRequestMutation.mutate(request.id);
                            }
                          }}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Request
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
