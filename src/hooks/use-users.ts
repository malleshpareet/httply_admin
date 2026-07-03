import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUsersAction, toggleUserBlockAction } from "@/actions/users";
import { toast } from "sonner";

export function useUsers(limit: number = 100) {
  return useQuery({
    queryKey: ["users-list", limit],
    queryFn: () => getUsersAction({ limit }), // Default to limit for now
  });
}

export function useToggleUserBlock() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (args: { userId: string; isBanned: boolean; name: string }) => 
      toggleUserBlockAction({ userId: args.userId, isBanned: args.isBanned, banReason: "Blocked by Admin" }),
    onSuccess: (updatedUser, variables) => {
      toast.success(`${variables.name} has been ${variables.isBanned ? 'blocked' : 'unblocked'}`);
      queryClient.invalidateQueries({ queryKey: ["users-list"] });
    },
    onError: () => {
      toast.error("Failed to update user status");
    }
  });
}
