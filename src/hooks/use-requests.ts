import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getRequestsAction, deleteRequestAction } from "@/actions/requests";
import { toast } from "sonner";

export function useRequests(limit: number = 100) {
  return useQuery({
    queryKey: ["requests-list", limit],
    queryFn: () => getRequestsAction({ limit }),
  });
}

export function useDeleteRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (requestId: string) => deleteRequestAction(requestId),
    onSuccess: () => {
      toast.success("Request deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["requests-list"] });
    },
    onError: () => {
      toast.error("Failed to delete request");
    }
  });
}
