import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMembersAction, deleteMemberAction } from "@/actions/members";
import { toast } from "sonner";

export function useMembers(limit: number = 100) {
  return useQuery({
    queryKey: ["members-list", limit],
    queryFn: () => getMembersAction({ limit }),
  });
}

export function useDeleteMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (memberId: string) => deleteMemberAction(memberId),
    onSuccess: () => {
      toast.success("Member removed successfully");
      queryClient.invalidateQueries({ queryKey: ["members-list"] });
    },
    onError: () => {
      toast.error("Failed to remove member");
    }
  });
}
