import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/services/axios";
import { Playlist } from "@/types";
import { toast } from "sonner";
import { useAuthStore } from "@/store/useAuthStore";

export const useUserPlaylists = (userId?: string) => {
  const { user } = useAuthStore();
  const id = userId || user?._id;
  
  return useQuery({
    queryKey: ["playlists", id],
    queryFn: async (): Promise<Playlist[]> => {
      const { data } = await api.get("/media/user-playlist");
      return data.data;
    },
    enabled: !!id,
  });
};

export const usePlaylistDetail = (playlistId: string) => {
  return useQuery({
    queryKey: ["playlist", playlistId],
    queryFn: async (): Promise<Playlist> => {
      const { data } = await api.get(`/media/playlist-detail/${playlistId}`);
      return data.data;
    },
    enabled: !!playlistId,
  });
};

export const useCreatePlaylist = () => {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  
  return useMutation({
    mutationFn: async (playlistData: { title: string; description: string }) => {
      const { data } = await api.post("/media/create-playlist", playlistData);
      return data.data;
    },
    onSuccess: () => {
      toast.success("Playlist created successfully");
      queryClient.invalidateQueries({ queryKey: ["playlists", user?._id] });
    },
  });
};

export const useAddVideoToPlaylist = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ playlistId, videoId }: { playlistId: string; videoId: string }) => {
      const { data } = await api.post(`/media/add-video-playlist/${playlistId}`, { videoId });
      return data.data;
    },
    onSuccess: (_, variables) => {
      toast.success("Video added to playlist");
      queryClient.invalidateQueries({ queryKey: ["playlist", variables.playlistId] });
    },
  });
};

export const useRemoveVideoFromPlaylist = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ playlistId, videoId }: { playlistId: string; videoId: string }) => {
      const { data } = await api.patch(`/playlist/remove/${videoId}/${playlistId}`);
      return data.data;
    },
    onSuccess: (_, variables) => {
      toast.success("Video removed from playlist");
      queryClient.invalidateQueries({ queryKey: ["playlist", variables.playlistId] });
    },
  });
};
