import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/axios";
import { Video } from "@/types";

export const getVideoById = async (id: string): Promise<Video> => {
  const { data } = await api.get(`/media/video-detail/${id}`);
  return data.data;
};

export const useVideoDetail = (id: string) => {
  return useQuery({
    queryKey: ["video", id],
    queryFn: () => getVideoById(id),
    enabled: !!id,
  });
};
