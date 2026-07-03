"use client";

import { useCollections, useDeleteCollection } from "@/hooks/use-collections";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { Loader2, MoreHorizontal, Trash2, FolderOpen } from "lucide-react";
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

export function CollectionsTable() {
  const { data, isLoading, isError } = useCollections(100);
  const deleteCollectionMutation = useDeleteCollection();

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
        Failed to load collections.
      </div>
    );
  }

  return (
    <div className="rounded-md border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Collection Name</TableHead>
            <TableHead>Workspace</TableHead>
            <TableHead className="text-center">Requests</TableHead>
            <TableHead className="text-center">Environments</TableHead>
            <TableHead className="text-right">Created At</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.collections.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                No collections found.
              </TableCell>
            </TableRow>
          ) : (
            data.collections.map((collection) => (
              <TableRow key={collection.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-md border bg-muted">
                      <FolderOpen className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <span className="font-medium text-sm">{collection.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="font-medium text-sm text-muted-foreground">{collection.workspace.name}</span>
                </TableCell>
                <TableCell className="text-center">
                  <Badge variant="secondary">{collection._count.requests}</Badge>
                </TableCell>
                <TableCell className="text-center">
                  <Badge variant="secondary">{collection._count.environments}</Badge>
                </TableCell>
                <TableCell className="text-right text-muted-foreground">
                  {format(new Date(collection.createdAt), "MMM d, yyyy")}
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
                          onClick={() => navigator.clipboard.writeText(collection.id)}
                        >
                          Copy collection ID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="text-destructive focus:text-destructive"
                          disabled={deleteCollectionMutation.isPending}
                          onClick={() => {
                            if (window.confirm("Are you sure you want to delete this collection? This will permanently delete all requests and data within it.")) {
                              deleteCollectionMutation.mutate(collection.id);
                            }
                          }}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Collection
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
