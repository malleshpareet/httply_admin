import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getWorkspacesAction, deleteWorkspaceAction } from "@/actions/workspaces";
import { toast } from "sonner";

export function useWorkspaces(limit: number = 100) {
  return useQuery({
    queryKey: ["workspaces-list", limit],
    queryFn: () => getWorkspacesAction({ limit }),
  });
}

export function useDeleteWorkspace() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (workspaceId: string) => deleteWorkspaceAction(workspaceId),
    onSuccess: () => {
      toast.success("Workspace deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["workspaces-list"] });
    },
    onError: () => {
      toast.error("Failed to delete workspace");
    }
  });
}
