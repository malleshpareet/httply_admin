import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCollectionsAction, deleteCollectionAction } from "@/actions/collections";
import { toast } from "sonner";

export function useCollections(limit: number = 100) {
  return useQuery({
    queryKey: ["collections-list", limit],
    queryFn: () => getCollectionsAction({ limit }),
  });
}

export function useDeleteCollection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (collectionId: string) => deleteCollectionAction(collectionId),
    onSuccess: () => {
      toast.success("Collection deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["collections-list"] });
    },
    onError: () => {
      toast.error("Failed to delete collection");
    }
  });
}
