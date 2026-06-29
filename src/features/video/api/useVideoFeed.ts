import { useInfiniteQuery } from "@tanstack/react-query";
import { api } from "@/services/axios";
import { Video } from "@/types";

export const getVideos = async (
  offset = 0,
  limit = 10,
  search = "",
): Promise<Video[]> => {
  const { data } = await api.get("/media/video-feed", {
    params: {
      limit,
      offset,
      search,
    },
  });
  return data.data?.docs || data.data || [];
};

export const useVideoFeed = (search = "") => {
  const limit = 12;
  return useInfiniteQuery({
    queryKey: ["videos", search],
    queryFn: ({ pageParam = 0 }) => getVideos(pageParam as number, limit, search),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      if (lastPage.length === limit) {
        return (lastPageParam as number) + limit;
      }
      return undefined;
    },
  });
};
