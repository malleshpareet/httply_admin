import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getSessionsAction, deleteSessionAction } from "@/actions/sessions";
import { toast } from "sonner";

export function useSessions(limit: number = 100) {
  return useQuery({
    queryKey: ["sessions-list", limit],
    queryFn: () => getSessionsAction({ limit }),
  });
}

export function useDeleteSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sessionId: string) => deleteSessionAction(sessionId),
    onSuccess: () => {
      toast.success("Session terminated successfully");
      queryClient.invalidateQueries({ queryKey: ["sessions-list"] });
    },
    onError: () => {
      toast.error("Failed to terminate session");
    }
  });
}
