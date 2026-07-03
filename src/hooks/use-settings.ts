import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getSettingsAction, updateSettingsAction } from "@/actions/settings";
import { toast } from "sonner";

export function useSettings() {
  return useQuery({
    queryKey: ["system-settings"],
    queryFn: () => getSettingsAction(),
  });
}

export function useUpdateSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateSettingsAction,
    onSuccess: () => {
      toast.success("System settings updated successfully.");
      queryClient.invalidateQueries({ queryKey: ["system-settings"] });
    },
    onError: () => {
      toast.error("Failed to update system settings.");
    }
  });
}
