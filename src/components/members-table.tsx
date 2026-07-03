"use client";

import { useMembers, useDeleteMember } from "@/hooks/use-members";
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
import { Loader2, MoreHorizontal, UserMinus } from "lucide-react";
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

export function MembersTable() {
  const { data, isLoading, isError } = useMembers(100);
  const deleteMemberMutation = useDeleteMember();

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
        Failed to load members.
      </div>
    );
  }

  return (
    <div className="rounded-md border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Workspace</TableHead>
            <TableHead>Role</TableHead>
            <TableHead className="text-right">Joined At</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.members.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                No workspace members found.
              </TableCell>
            </TableRow>
          ) : (
            data.members.map((member) => (
              <TableRow key={member.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={member.user.image || ""} alt={member.user.name || ""} />
                      <AvatarFallback>
                        {member.user.name?.substring(0, 2).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="font-medium">{member.user.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {member.user.email}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="font-medium text-sm">{member.workspace.name}</span>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="capitalize">
                    {member.role.toLowerCase()}
                  </Badge>
                </TableCell>
                <TableCell className="text-right text-muted-foreground">
                  {format(new Date(member.createdAt), "MMM d, yyyy")}
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
                          onClick={() => navigator.clipboard.writeText(member.userId)}
                        >
                          Copy user ID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="text-destructive focus:text-destructive"
                          disabled={deleteMemberMutation.isPending}
                          onClick={() => {
                            if (window.confirm("Are you sure you want to remove this member from the workspace?")) {
                              deleteMemberMutation.mutate(member.id);
                            }
                          }}
                        >
                          <UserMinus className="mr-2 h-4 w-4" />
                          Remove Member
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
