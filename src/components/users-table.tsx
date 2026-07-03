"use client";

import { useUsers, useToggleUserBlock } from "@/hooks/use-users";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Loader2, MoreHorizontal, ShieldBan, ShieldCheck } from "lucide-react";
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

export function UsersTable() {
  const { data, isLoading, isError } = useUsers(100);
  const toggleBlockMutation = useToggleUserBlock();

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
        Failed to load users.
      </div>
    );
  }

  return (
    <div className="rounded-md border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Workspaces</TableHead>
            <TableHead className="text-right">Joined</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                No users found.
              </TableCell>
            </TableRow>
          ) : (
            data.users.map((user) => (
              <TableRow key={user.id} className={user.banned ? "opacity-75 bg-muted/50" : ""}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={user.image || ""} alt={user.name} />
                      <AvatarFallback>
                        {user.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="font-medium">{user.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {user.email}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1 items-start">
                    {user.banned ? (
                      <Badge variant="destructive" className="bg-red-100 text-red-800 hover:bg-red-100/80">Blocked</Badge>
                    ) : user.emailVerified ? (
                      <Badge variant="outline" className="text-green-600 bg-green-50">Verified</Badge>
                    ) : (
                      <Badge variant="outline" className="text-amber-600 bg-amber-50">Unverified</Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex flex-col items-end">
                    <span>{user._count.workspaces} Owned</span>
                    <span className="text-xs text-muted-foreground">
                      {user._count.memberships} Member
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-right text-muted-foreground">
                  {format(new Date(user.createdAt), "MMM d, yyyy")}
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
                          onClick={() => navigator.clipboard.writeText(user.id)}
                        >
                          Copy user ID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {user.banned ? (
                          <DropdownMenuItem 
                            className="text-green-600 focus:text-green-600"
                            disabled={toggleBlockMutation.isPending}
                            onClick={() => toggleBlockMutation.mutate({ userId: user.id, isBanned: false, name: user.name })}
                          >
                            <ShieldCheck className="mr-2 h-4 w-4" />
                            Unblock User
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem 
                            className="text-destructive focus:text-destructive"
                            disabled={toggleBlockMutation.isPending}
                            onClick={() => toggleBlockMutation.mutate({ userId: user.id, isBanned: true, name: user.name })}
                          >
                            <ShieldBan className="mr-2 h-4 w-4" />
                            Block User
                          </DropdownMenuItem>
                        )}
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
