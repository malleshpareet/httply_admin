"use client";

import { useSessions, useDeleteSession } from "@/hooks/use-sessions";
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
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

export function SessionsTable() {
  const { data, isLoading, isError } = useSessions(100);
  const deleteSessionMutation = useDeleteSession();

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
        Failed to load sessions.
      </div>
    );
  }

  return (
    <div className="rounded-md border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>IP Address</TableHead>
            <TableHead>Device/Browser</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Created At</TableHead>
            <TableHead className="text-right">Expires At</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.sessions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                No active sessions found.
              </TableCell>
            </TableRow>
          ) : (
            data.sessions.map((session) => {
              const isExpired = new Date(session.expiresAt) < new Date();
              return (
                <TableRow key={session.id} className={isExpired ? "opacity-75 bg-muted/50" : ""}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={session.user.image || ""} alt={session.user.name || ""} />
                        <AvatarFallback>
                          {session.user.name?.substring(0, 2).toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-medium">{session.user.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {session.user.email}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {session.ipAddress ? (
                      <span className="font-mono text-sm">{session.ipAddress}</span>
                    ) : (
                      <span className="text-muted-foreground italic">Unknown</span>
                    )}
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate" title={session.userAgent || "Unknown"}>
                    <span className="text-sm text-muted-foreground truncate block">
                      {session.userAgent || "Unknown"}
                    </span>
                  </TableCell>
                  <TableCell>
                    {isExpired ? (
                      <Badge variant="outline" className="text-muted-foreground">Expired</Badge>
                    ) : (
                      <Badge variant="outline" className="text-green-600 bg-green-50">Active</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {format(new Date(session.createdAt), "MMM d, yyyy HH:mm")}
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {format(new Date(session.expiresAt), "MMM d, yyyy HH:mm")}
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
                            onClick={() => navigator.clipboard.writeText(session.id)}
                          >
                            Copy session ID
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => navigator.clipboard.writeText(session.token)}
                          >
                            Copy token
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-destructive focus:text-destructive"
                            disabled={deleteSessionMutation.isPending}
                            onClick={() => deleteSessionMutation.mutate(session.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Terminate Session
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
