import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getRequestRunsAction, deleteRequestRunAction } from "@/actions/request-runs";
import { toast } from "sonner";

export function useRequestRuns(limit: number = 100) {
  return useQuery({
    queryKey: ["request-runs-list", limit],
    queryFn: () => getRequestRunsAction({ limit }),
  });
}

export function useDeleteRequestRun() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (runId: string) => deleteRequestRunAction(runId),
    onSuccess: () => {
      toast.success("Request run record deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["request-runs-list"] });
    },
    onError: () => {
      toast.error("Failed to delete request run record");
    }
  });
}
