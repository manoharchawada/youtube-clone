import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/services/axios";
import { User } from "@/types";
import { toast } from "sonner";
import { useAuthStore } from "@/store/useAuthStore";

export const getProfile = async (): Promise<User> => {
  const { data } = await api.get("/users/profile");
  return data.data;
};

export const useProfile = () => {
  return useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const { setUser } = useAuthStore();
  
  return useMutation({
    mutationFn: async (userData: { fullName?: string; email?: string }) => {
      const { data } = await api.patch("/users/update-profile", userData);
      return data.data;
    },
    onSuccess: (data) => {
      setUser(data);
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast.success("Profile updated successfully");
    },
  });
};

export const useUpdateAvatar = () => {
  const queryClient = useQueryClient();
  const { setUser } = useAuthStore();
  
  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("avatar", file);
      const { data } = await api.put("/users/update-avatar", formData);
      return data.data;
    },
    onSuccess: (data) => {
      setUser(data);
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast.success("Avatar updated successfully");
    },
  });
};

export const useUpdateCoverImage = () => {
  const queryClient = useQueryClient();
  const { setUser } = useAuthStore();
  
  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("coverImage", file);
      const { data } = await api.put("/users/update-cover-image", formData);
      return data.data;
    },
    onSuccess: (data) => {
      setUser(data);
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast.success("Cover image updated successfully");
    },
  });
};
