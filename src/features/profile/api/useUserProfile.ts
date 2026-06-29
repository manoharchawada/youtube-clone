import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/axios";
import { User, Video } from "@/types";

export const getUserProfile = async (username: string): Promise<{ profile: User; videos: Video[] }> => {
  const { data: profileData } = await api.get(`/users/c/${username}`);
  const { data: videosData } = await api.get(`/media/video-feed`, { params: { userId: profileData.data._id } }); // Assuming the API accepts userId to filter
  return { profile: profileData.data, videos: videosData.data?.docs || videosData.data || [] };
};

export const useUserProfile = (username: string) => {
  return useQuery({
    queryKey: ["profile", username],
    queryFn: () => getUserProfile(username),
    enabled: !!username,
  });
};
