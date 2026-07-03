import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getInvitesAction, deleteInviteAction } from "@/actions/invites";
import { toast } from "sonner";

export function useInvites(limit: number = 100) {
  return useQuery({
    queryKey: ["invites-list", limit],
    queryFn: () => getInvitesAction({ limit }),
  });
}

export function useDeleteInvite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (inviteId: string) => deleteInviteAction(inviteId),
    onSuccess: () => {
      toast.success("Invite revoked successfully");
      queryClient.invalidateQueries({ queryKey: ["invites-list"] });
    },
    onError: () => {
      toast.error("Failed to revoke invite");
    }
  });
}
