import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/services/axios";
import { Comment } from "@/types";
import { toast } from "sonner";

export const getComments = async (videoId: string, offset = 0): Promise<Comment[]> => {
  const limit = 10;
  const { data } = await api.get(`/videoComments/parent-comment/${videoId}`, {
    params: { offset, limit },
  });
  if (Array.isArray(data.data)) return data.data;
  return data.data?.comments || data.data?.docs || [];
};

export const useComments = (videoId: string) => {
  const limit = 10;
  return useInfiniteQuery({
    queryKey: ["comments", videoId],
    queryFn: ({ pageParam = 0 }) => getComments(videoId, pageParam as number),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      if (lastPage.length === limit) {
        return (lastPageParam as number) + limit;
      }
      return undefined;
    },
    enabled: !!videoId,
  });
};

export const useCreateComment = (videoId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (content: string) => {
      const { data } = await api.post(`/videoComments/comment/${videoId}`, { content });
      return data.data;
    },
    onSuccess: () => {
      toast.success("Comment added");
      queryClient.invalidateQueries({ queryKey: ["comments", videoId] });
    },
  });
};

export const useDeleteComment = (videoId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (commentId: string) => {
      await api.post(`/videoComments/delete-comment/${commentId}`);
    },
    onSuccess: () => {
      toast.success("Comment deleted");
      queryClient.invalidateQueries({ queryKey: ["comments", videoId] });
    },
  });
};
