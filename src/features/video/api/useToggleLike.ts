import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/services/axios";
import { toast } from "sonner";

export const useToggleLike = (videoId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      const { data } = await api.post(`/media/video-like-unlike`, { videoId });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["video", videoId] });
    },
    onError: () => {
      toast.error("Failed to toggle like. Are you logged in?");
    }
  });
};
