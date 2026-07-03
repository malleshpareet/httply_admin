"use client";

import { useInvites, useDeleteInvite } from "@/hooks/use-invites";
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

export function InvitesTable() {
  const { data, isLoading, isError } = useInvites(100);
  const deleteInviteMutation = useDeleteInvite();

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
        Failed to load invites.
      </div>
    );
  }

  return (
    <div className="rounded-md border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Invited Email</TableHead>
            <TableHead>Workspace</TableHead>
            <TableHead>Invited By</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Sent At</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.invites.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                No pending invites found.
              </TableCell>
            </TableRow>
          ) : (
            data.invites.map((invite) => {
              const isExpired = invite.expiresAt ? new Date(invite.expiresAt) < new Date() : false;
              
              return (
                <TableRow key={invite.id} className={isExpired ? "opacity-75 bg-muted/50" : ""}>
                  <TableCell>
                    <span className="font-medium text-sm">
                      {invite.email || <span className="text-muted-foreground italic">Anyone with link</span>}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium text-sm">{invite.workspace.name}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-7 w-7">
                        <AvatarImage src={invite.createdBy.image || ""} alt={invite.createdBy.name || ""} />
                        <AvatarFallback className="text-xs">
                          {invite.createdBy.name?.substring(0, 2).toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-muted-foreground">{invite.createdBy.email}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {isExpired ? (
                      <Badge variant="outline" className="text-muted-foreground">Expired</Badge>
                    ) : (
                      <Badge variant="outline" className="text-amber-600 bg-amber-50">Pending</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {format(new Date(invite.createdAt), "MMM d, yyyy")}
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
                            onClick={() => navigator.clipboard.writeText(invite.token)}
                          >
                            Copy invite token
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-destructive focus:text-destructive"
                            disabled={deleteInviteMutation.isPending}
                            onClick={() => {
                              if (window.confirm("Are you sure you want to revoke this invite?")) {
                                deleteInviteMutation.mutate(invite.id);
                              }
                            }}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Revoke Invite
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
