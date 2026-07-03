import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getEnvironmentsAction, deleteEnvironmentAction } from "@/actions/environments";
import { toast } from "sonner";

export function useEnvironments(limit: number = 100) {
  return useQuery({
    queryKey: ["environments-list", limit],
    queryFn: () => getEnvironmentsAction({ limit }),
  });
}

export function useDeleteEnvironment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (environmentId: string) => deleteEnvironmentAction(environmentId),
    onSuccess: () => {
      toast.success("Environment deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["environments-list"] });
    },
    onError: () => {
      toast.error("Failed to delete environment");
    }
  });
}
